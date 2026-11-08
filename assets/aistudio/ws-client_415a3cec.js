/* ============================================================
   WineBOX.Clinic · Cliente WebSocket para Chat
   Conecta con server-chat.js para mensajería en tiempo real
   ============================================================ */
(function () {
  'use strict';

  var WS_URL = 'ws://' + window.location.hostname + ':8080';
  var ws = null;
  var currentUserId = null;
  var currentUserName = null;
  var messageHandlers = {};
  var reconnectTimer = null;

  function connect() {
    if (ws && ws.readyState === WebSocket.OPEN) return;
    
    console.log('[Client] Conectando a', WS_URL);
    ws = new WebSocket(WS_URL);
    
    ws.onopen = function() {
      console.log('[Client] Conectado al servidor');
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };
    
    ws.onmessage = function(event) {
      try {
        var data = JSON.parse(event.data);
        handleServerMessage(data);
      } catch(e) {
        console.error('[Client] Error parseando mensaje:', e);
      }
    };
    
    ws.onclose = function() {
      console.log('[Client] Desconectado del servidor');
      scheduleReconnect();
    };
    
    ws.onerror = function(err) {
      console.error('[Client] Error de WebSocket:', err);
    };
  }

  function scheduleReconnect() {
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(function() {
      console.log('[Client] Reintentando conexión...');
      connect();
    }, 3000);
  }

  function handleServerMessage(data) {
    console.log('[Client] Mensaje recibido:', data.type);
    
    switch (data.type) {
      case 'user-online':
        if (window.onUserOnline) window.onUserOnline(data.userId, data.userName, data.onlineUsers);
        break;
        
      case 'user-disconnect':
        if (window.onUserOffline) window.onUserOffline(data.userId, data.onlineUsers);
        break;
        
      case 'new-message':
        if (window.onNewMessage) window.onNewMessage(data);
        break;
        
      case 'message-sent':
        if (window.onMessageSent) window.onMessageSent(data);
        break;
        
      case 'user-offline':
        if (window.onUserOfflineMessage) window.onUserOfflineMessage(data.toId, data.message);
        break;
        
      case 'online-users':
        if (window.onOnlineUsers) window.onOnlineUsers(data.users);
        break;
        
      case 'login-success':
        currentUserId = data.userId;
        currentUserName = data.userName;
        if (window.onLoginSuccess) window.onLoginSuccess(data.userId, data.userName);
        break;
        
      case 'pong':
        // Heartbeat respondido
        break;
    }
  }

  function sendLogin(userId, userName) {
    currentUserId = userId;
    currentUserName = userName;
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'login',
        userId: userId,
        userName: userName
      }));
      console.log('[Client] Login enviado:', userId);
    } else {
      console.warn('[Client] No conectado al servidor de chat');
    }
  }

  function sendMessage(toId, body) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('[Client] No conectado');
      return null;
    }
    
    var messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    
    ws.send(JSON.stringify({
      type: 'message',
      messageId: messageId,
      fromId: currentUserId,
      toId: toId,
      body: body
    }));
    
    console.log('[Client] Mensaje enviado:', messageId, 'para', toId);
    return messageId;
  }

  function ping() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }));
    }
  }

  // Ping cada 25 segundos para mantener conexión viva
  setInterval(ping, 25000);

  // Exponer funciones globales
  window.WSChat = {
    connect: connect,
    sendLogin: sendLogin,
    sendMessage: sendMessage,
    get connected() { return ws && ws.readyState === WebSocket.OPEN; },
    get userId() { return currentUserId; },
    get userName() { return currentUserName; }
  };

  // Auto-conectar al cargar
  connect();
})();
