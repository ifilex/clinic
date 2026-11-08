/* ============================================================
   WineBOX.Clinic · Servidor WebSocket para Chat
   Ejecutar: node server-chat.js
   ============================================================ */
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;

// Conexiones activas: userId -> WebSocket
const users = new Map();

const server = http.createServer((req, res) => {
  // Servir archivos estáticos desde la carpeta actual
  let filePath = '.' + req.url;
  if (filePath === './') filePath = './index.html';
  if (filePath === '/chat') filePath = './index.html'; // SPA fallback
  
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  switch (extname) {
    case '.js': contentType = 'application/javascript'; break;
    case '.css': contentType = 'text/css'; break;
    case '.json': contentType = 'application/json'; break;
    case '.png': contentType = 'image/png'; break;
    case '.jpg': contentType = 'image/jpeg'; break;
    case '.svg': contentType = 'image/svg+xml'; break;
  }
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // SPA: servir index.html para todas las rutas
        fs.readFile('./index.html', (err, html) => {
          if (err) {
            res.writeHead(500);
            res.end('Error interno');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end('Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  console.log('[WS] Nueva conexión desde', req.socket.remoteAddress);
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleMessage(ws, data);
    } catch (e) {
      console.error('[WS] Error procesando mensaje:', e.message);
    }
  });
  
  ws.on('close', () => {
    // Remover usuario al desconectarse
    for (const [userId, clientWs] of users.entries()) {
      if (clientWs === ws) {
        users.delete(userId);
        broadcast({
          type: 'user-disconnect',
          userId: userId,
          onlineUsers: Array.from(users.keys())
        });
        console.log('[WS] Usuario desconectado:', userId);
        break;
      }
    }
  });
});

function handleMessage(ws, data) {
  switch (data.type) {
    case 'login':
      handleLogin(ws, data);
      break;
      
    case 'message':
      handleSendMessage(ws, data);
      break;
      
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      break;
      
    default:
      console.log('[WS] Tipo desconocido:', data.type);
  }
}

function handleLogin(ws, data) {
  const userId = data.userId;
  const userName = data.userName || userId;
  
  // Registrar conexión
  users.set(userId, ws);
  
  console.log('[WS] Usuario conectado:', userId, '-', userName);
  
  // Notificar a todos los usuarios conectados
  broadcast({
    type: 'user-online',
    userId: userId,
    userName: userName,
    onlineUsers: Array.from(users.keys())
  });
  
  // Enviar confirmación al usuario
  ws.send(JSON.stringify({
    type: 'login-success',
    userId: userId,
    userName: userName
  }));
  
  // Enviar lista de usuarios online
  ws.send(JSON.stringify({
    type: 'online-users',
    users: Array.from(users.keys())
  }));
}

function handleSendMessage(ws, data) {
  const fromId = data.fromId;
  const toId = data.toId;
  const body = data.body;
  const messageId = data.messageId || 'msg_' + Date.now();
  
  console.log('[WS] Mensaje de', fromId, 'a', toId);
  
  // Buscar al destinatario
  const targetWs = users.get(toId);
  
  if (targetWs && targetWs.readyState === WebSocket.OPEN) {
    // Enviar al destinatario
    targetWs.send(JSON.stringify({
      type: 'new-message',
      messageId: messageId,
      fromId: fromId,
      body: body,
      timestamp: new Date().toISOString()
    }));
    
    // Confirmar al remitente
    ws.send(JSON.stringify({
      type: 'message-sent',
      messageId: messageId,
      timestamp: new Date().toISOString()
    }));
  } else {
    // Destinatario no conectado
    ws.send(JSON.stringify({
      type: 'user-offline',
      toId: toId,
      message: body
    }));
  }
}

function broadcast(message) {
  const data = JSON.stringify(message);
  users.forEach((ws, userId) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
}

// Ping cada 30 segundos para mantener conexión
setInterval(() => {
  users.forEach((ws, userId) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  });
}, 30000);

server.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║     WineBOX.Clinic - Servidor de Chat              ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log('║  HTTP: http://localhost:' + PORT + '                      ║');
  console.log('║  WebSocket: ws://localhost:' + PORT + '                   ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Abre la app en DOS pestañas y prueba el chat.');
  console.log('Cada pestaña debe iniciar sesión con cuentas diferentes.');
  console.log('');
});

process.on('SIGINT', () => {
  console.log('\n[Server] Cerrando servidor...');
  wss.close();
  server.close(() => {
    console.log('[Server] Servidor cerrado.');
    process.exit(0);
  });
});
