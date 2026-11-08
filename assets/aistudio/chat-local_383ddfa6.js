/* ============================================================
   WineBOX.Clinic · Chat en Tiempo Real (LocalStorage)
   Funciona entre pestañas del mismo navegador sin servidor
   ============================================================ */
(function () {
  'use strict';

  var DB_KEY = 'winebox_foro_db_v1';
  var LISTENER_TIMERS = {};

  // Escuchar cambios en localStorage (entre pestañas)
  window.addEventListener('storage', function(e) {
    if (e.key === DB_KEY && e.newValue) {
      try {
        var newDB = JSON.parse(e.newValue);
        if (newDB.messages) {
          console.log('[Chat] Nuevos mensajes detectados:', newDB.messages.length);
          // Notificar a los componentes de chat
          window.dispatchEvent(new CustomEvent('winebox:messages-updated', { 
            detail: { messages: newDB.messages } 
          }));
        }
      } catch(err) {
        console.error('[Chat] Error parseando mensajes:', err);
      }
    }
  });

  // Obtener mensajes entre dos usuarios
  function getMessages(userId, partnerId) {
    try {
      var raw = localStorage.getItem(DB_KEY);
      if (!raw) return [];
      var db = JSON.parse(raw);
      if (!db.messages) return [];
      
      return db.messages.filter(function(m) {
        return (m.fromId === userId && m.toId === partnerId) ||
               (m.fromId === partnerId && m.toId === userId);
      }).sort(function(a, b) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    } catch(err) {
      console.error('[Chat] Error obteniendo mensajes:', err);
      return [];
    }
  }

  // Enviar mensaje (guarda en localStorage y dispara evento)
  function sendMessage(toId, body, userId) {
    try {
      var raw = localStorage.getItem(DB_KEY);
      var db = raw ? JSON.parse(raw) : { messages: [], users: [] };
      
      if (!db.messages) db.messages = [];
      
      var msg = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        fromId: userId,
        toId: toId,
        body: body,
        createdAt: new Date().toISOString(),
        readAt: null
      };
      
      db.messages.push(msg);
      
      // Guardar
      localStorage.setItem(DB_KEY, JSON.stringify(db));
      
      // Disparar evento para otras pestañas
      window.dispatchEvent(new CustomEvent('winebox:message-sent', { 
        detail: { message: msg } 
      }));
      
      console.log('[Chat] Mensaje enviado:', msg.id);
      return msg;
    } catch(err) {
      console.error('[Chat] Error enviando mensaje:', err);
      throw err;
    }
  }

  // Iniciar polling para detectar nuevos mensajes
  function startPolling(userId, partnerId, callback, intervalMs) {
    intervalMs = intervalMs || 1000; // 1 segundo
    
    var key = userId + '_' + partnerId;
    
    // Limpiar polling anterior
    stopPolling(userId, partnerId);
    
    var lastMessageCount = getMessages(userId, partnerId).length;
    
    LISTENER_TIMERS[key] = setInterval(function() {
      var messages = getMessages(userId, partnerId);
      
      if (messages.length !== lastMessageCount) {
        console.log('[Chat] Nuevos mensajes:', messages.length - lastMessageCount);
        lastMessageCount = messages.length;
        if (callback) callback(messages);
      }
    }, intervalMs);
    
    console.log('[Chat] Polling iniciado para:', key);
  }

  // Detener polling
  function stopPolling(userId, partnerId) {
    var key = userId + '_' + partnerId;
    if (LISTENER_TIMERS[key]) {
      clearInterval(LISTENER_TIMERS[key]);
      delete LISTENER_TIMERS[key];
      console.log('[Chat] Polling detenido:', key);
    }
  }

  // Marcar mensaje como leído
  function markAsRead(messageId, userId) {
    try {
      var raw = localStorage.getItem(DB_KEY);
      if (!raw) return;
      var db = JSON.parse(raw);
      
      if (db.messages) {
        var msg = db.messages.find(function(m) { 
          return m.id === messageId && m.toId === userId; 
        });
        if (msg && !msg.readAt) {
          msg.readAt = new Date().toISOString();
          localStorage.setItem(DB_KEY, JSON.stringify(db));
        }
      }
    } catch(err) {
      console.error('[Chat] Error marcando como leído:', err);
    }
  }

  // Exponer funciones
  window.LocalStorageChat = {
    getMessages: getMessages,
    sendMessage: sendMessage,
    startPolling: startPolling,
    stopPolling: stopPolling,
    markAsRead: markAsRead
  };

  console.log('[Chat] LocalStorageChat inicializado');
})();
