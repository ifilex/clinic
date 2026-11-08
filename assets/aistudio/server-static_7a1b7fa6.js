const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const FORO_DIR = path.join(__dirname, 'foro');

const server = http.createServer(function (req, res) {
  // API routes
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, server: 'fallback', port: PORT }));
    return;
  }

  // Static files
  let filePath = path.join(FORO_DIR, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  fs.readFile(filePath, function (err, content) {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Not found');
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(content);
    }
  });
});

server.listen(PORT, function () {
  console.log(`[WB] Modo fallback - Sirviendo static desde puerto ${PORT}`);
  console.log(`[WB] Abre http://localhost:${PORT}/foro/ en tu navegador`);
  console.log(`[WB] Para modo completo con API, ejecuta: node foro/server.js`);
});
