const http = require('http');
const url = require('url');
const { exec } = require('child_process');

const PORT = 3000;

const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const word = parsedUrl.query.word;

    if (pathname === '/speak' && word) {
        const safeWord = word.replace(/[^a-zA-Z]/g,'');

        if (safeWord) {
            exec(`espeak "${safeWord}" -s 110 -p 40 -v en-us`, (error) => {
                if (error) {
                    res.writeHead(500);
                    res.end('espeak error');
                }
                else {
                    res.writeHead(200);
                    res.end('ok');
                }
            });
        } else {
            res.writeHead(400);
            res.end('invalid word');
        }
    } else if (pathname === '/') {
        res.writeHead(200);
        res.end('Spell Checker server is running');
    } else {
        res.writeHead(404);
        res.end('not found');
    }
});

server.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT);
    console.log('Test it: http://localhost:' + PORT + '/speak?word=hello');
    console.log('Press Ctrl+C to stop');
});