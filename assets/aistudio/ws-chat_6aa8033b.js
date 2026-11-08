/* ============================================================
   WineBOX.Clinic · Cliente WebSocket para Chat
   Conecta con server-chat.js para mensajería en tiempo real
   ============================================================ */
(function () {
  'use strict';

  var WS_URL = 'ws://' + window.location.hostname + ':8080';
  var ws = null;
  var currentUserId = null;
  var messageHandlers = {};

  function connect() {
    if (ws && ws.readyState === WebSocket.OPEN) return;
    
    console.log('[WS] Conectando a', WS_URL);
    ws = new WebSocket(WS_URL);
    
    ws.onopen = function() {
      console.log('[WS] Conectado');
    };
    
    ws.onmessage = function(event) {
      try {
        var data = JSON.parse(event.data);
        handleServerMessage(data);
      } catch(e) {
        console.error('[WS] Error parseando mensaje:', e);
      }
    };
    
    ws.onclose = function() {
      console.log('[WS] Desconectado, reintentando en 5s...');
      setTimeout(connect, 5000);
    };
    
    ws.onerror = function(err) {
      console.error('[WS] Error:', err);
    };
  }

  function handleServerMessage(data) {
    console.log('[WS] Mensaje recibido:', data.type);
    
    switch (data.type) {
      case 'user-online':
        updateUserOnline(data.userId, data.userName, true);
        break;
      case 'user-disconnect':
        updateUserOnline(data.userId, null, false);
        break;
      case 'new-message':
        handleNewMessage(data);
        break;
      case 'message-sent':
        console.log('[WS] Mensaje enviado confirmado');
        break;
      case 'user-offline':
        toast('El usuario no está conectado en este momento.', 'warn');
        break;
      case 'online-users':
        updateOnlineUsers(data.users);
        break;
    }
  }

  function handleNewMessage(data) {
    // Actualizar UI del chat
    if (window.updateChatMessages) {
      window.updateChatMessages(data.fromId, data.body, data.timestamp);
    }
    
    // Notificación
    if (Notification.permission === 'granted') {
      new Notification('Nuevo mensaje', { body: data.body });
    }
  }

  function sendLogin(userId, userName) {
    currentUserId = userId;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'login',
        userId: userId,
        userName: userName
      }));
    }
  }

  function sendMessage(toId, body) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('[WS] No conectado');
      return Promise.reject('No conectado');
    }
    
    var messageId = 'msg_' + Date.now();
    ws.send(JSON.stringify({
      type: 'message',
      messageId: messageId,
      fromId: currentUserId,
      toId: toId,
      body: body
    }));
    
    // Retornar promesa que se resuelve cuando llega confirmación
    return new Promise(function(resolve, reject) {
      var timeout = setTimeout(function() {
        reject('Timeout esperando confirmación');
      }, 5000);
      
      // Overwrite temporalmente para capturar confirmación
      var originalHandler = messageHandlers['message-sent'];
      messageHandlers['message-sent'] = function(data) {
        clearTimeout(timeout);
        if (data.messageId === messageId) {
          resolve(data);
        }
        messageHandlers['message-sent'] = originalHandler;
      };
    });
  }

  function updateUserOnline(userId, userName, online) {
    // Actualizar indicador en UI
    if (window.updateUserStatus) {
      window.updateUserStatus(userId, online);
    }
  }

  function updateOnlineUsers(userIds) {
    if (window.updateOnlineList) {
      window.updateOnlineList(userIds);
    }
  }

  function ping() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }));
    }
  }

  // Ping cada 30 segundos
  setInterval(ping, 30000);

  // Exponer funciones
  window.WSChat = {
    connect: connect,
    sendLogin: sendLogin,
    sendMessage: sendMessage,
    get connected() { return ws && ws.readyState === WebSocket.OPEN; },
    get userId() { return currentUserId; }
  };

  // Auto-conectar
  connect();
})();
