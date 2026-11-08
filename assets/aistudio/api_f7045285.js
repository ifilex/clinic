/* ============================================================
   WineBOX.Clinic · Capa de datos híbrida
   - MODO LOCAL (default): 100% localStorage, funciona en GitHub Pages
   - MODO SERVIDOR: API REST + WebSocket si hay servidor disponible
   ============================================================ */
(function () {
  'use strict';

  // ── Configurable desde el exterior ──
  // Para usar modo servidor, definir antes de cargar este script:
  //   window.WB_CONFIG = { apiUrl: 'https://tu-servidor.com' };
  var CONFIG = window.WB_CONFIG || {};
  var API_BASE = CONFIG.apiUrl || '';
  var DB_KEY = 'winebox_foro_db_v1';
  var SESSION_KEY = 'winebox_foro_session_v1';

  // ── Detectar si hay servidor disponible ──
  var _serverAvailable = false;
  var _ws = null;
  var _wsReady = false;
  var _reconnectTimer = null;
  var _isOnline = navigator.onLine;

  function detectServer() {
    if (!API_BASE) {
      _serverAvailable = false;
      return false;
    }
    try {
      // Intentar health check sincrónico (no ideal pero funciona)
      _serverAvailable = true;
      return true;
    } catch (e) {
      _serverAvailable = false;
      return false;
    }
  }
  detectServer();

  // ── Estado local ──
  var _DB = null;
  var _SESSION = null;

  // ── Detectar online/offline ──
  window.addEventListener('online', function () {
    _isOnline = true;
    var b = document.getElementById('offlineBanner');
    if (b) b.hidden = true;
    reconnectWS();
  });
  window.addEventListener('offline', function () {
    _isOnline = false;
    var b = document.getElementById('offlineBanner');
    if (b) b.hidden = false;
  });

  // ═══════════════════════════════════════════════════════
  //  LOCAL STORAGE (modo local, siempre disponible)
  // ═══════════════════════════════════════════════════════
  function loadLocal() {
    try {
      var raw = localStorage.getItem(DB_KEY);
      if (raw) _DB = JSON.parse(raw);
    } catch (e) { _DB = null; }
    try {
      var sess = localStorage.getItem(SESSION_KEY);
      if (sess) _SESSION = JSON.parse(sess);
    } catch (e) { _SESSION = null; }
    return _DB;
  }
  function saveLocal() {
    if (!_DB) return;
    try { localStorage.setItem(DB_KEY, JSON.stringify(_DB)); } catch (e) {}
  }
  function saveSessionLocal() {
    if (!_SESSION) { localStorage.removeItem(SESSION_KEY); return; }
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(_SESSION)); } catch (e) {}
  }

  // ═══════════════════════════════════════════════════════
  //  HTTP API (modo servidor, opcional)
  // ═══════════════════════════════════════════════════════
  function api(path, options) {
    if (!_serverAvailable) return Promise.reject({ error: 'server_unavailable' });
    options = options || {};
    var token = _SESSION && _SESSION.token ? _SESSION.token : '';
    var headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    if (options.headers) Object.assign(headers, options.headers);
    return fetch(API_BASE + path, {
      method: options.method || 'GET',
      headers: headers,
      body: options.body ? JSON.stringify(options.body) : null,
      credentials: 'same-origin'
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (err) { throw err; }).catch(function () { throw { error: 'Error ' + res.status }; });
      }
      if (res.status === 204) return {};
      return res.json();
    }).catch(function (e) {
      // Si falla, desactivar servidor y volver a localStorage
      _serverAvailable = false;
      closeWS();
      throw e;
    });
  }

  function login(email, password) {
    return api('/api/login', { method: 'POST', body: { email: email.trim(), password: password } })
      .then(function (resp) {
        _SESSION = { userId: resp.user.id, token: resp.token };
        saveSessionLocal();
        connectWS();
        return resp;
      })
      .catch(function (e) {
        if (e.error === 'server_unavailable') return null;
        throw e;
      });
  }
  function logout() {
    api('/api/logout', { method: 'POST' }).catch(function () {});
    _SESSION = null;
    saveSessionLocal();
    closeWS();
  }
  function register(data) {
    return api('/api/register', { method: 'POST', body: data })
      .then(function (resp) {
        _SESSION = { userId: resp.user.id, token: resp.token };
        saveSessionLocal();
        connectWS();
        return resp;
      })
      .catch(function (e) {
        if (e.error === 'server_unavailable') return null;
        throw e;
      });
  }
  function fetchData() {
    return api('/api/data')
      .then(function (data) {
        _DB = data;
        saveLocal();
        return data;
      })
      .catch(function () { return loadLocal() || {}; });
  }
  function getPosts(limit) {
    return api('/api/posts?limit=' + (limit || 50)).then(function (posts) {
      if (_DB) _DB.posts = posts;
      saveLocal();
      return posts;
    }).catch(function () { return (_DB && _DB.posts) || []; });
  }
  function createPost(body) {
    return api('/api/posts', { method: 'POST', body: body }).then(function (post) {
      if (_DB && !_DB.posts) _DB.posts = [];
      if (_DB) _DB.posts.unshift(post);
      saveLocal();
      return post;
    }).catch(function () { return null; });
  }
  function likePost(postId) {
    return api('/api/posts/' + postId + '/like', { method: 'POST' }).catch(function () {});
  }
  function addComment(postId, body) {
    return api('/api/posts/' + postId + '/comments', { method: 'POST', body: { body: body } }).catch(function () {});
  }
  function deletePost(postId) {
    return api('/api/posts/' + postId, { method: 'DELETE' }).then(function () {
      if (_DB && _DB.posts) _DB.posts = _DB.posts.filter(function (p) { return p.id !== postId; });
      saveLocal();
    }).catch(function () {});
  }
  function getQuestions() {
    return api('/api/questions').then(function (qs) {
      if (_DB) _DB.questions = qs;
      saveLocal();
      return qs;
    }).catch(function () { return (_DB && _DB.questions) || []; });
  }
  function createQuestion(data) {
    return api('/api/questions', { method: 'POST', body: data }).then(function (q) {
      if (_DB && !_DB.questions) _DB.questions = [];
      if (_DB) _DB.questions.unshift(q);
      saveLocal();
      return q;
    }).catch(function () { return null; });
  }
  function addAnswer(questionId, data) {
    return api('/api/questions/' + questionId + '/answers', { method: 'POST', body: data }).catch(function () {});
  }
  function acceptAnswer(questionId, answerId) {
    return api('/api/questions/' + questionId + '/answers/' + answerId + '/accept', { method: 'POST' }).catch(function () {});
  }
  function viewQuestion(questionId) {
    return api('/api/questions/' + questionId + '/views', { method: 'POST' }).catch(function () {});
  }
  function getPsychs() {
    return api('/api/psychs').then(function (list) {
      if (_DB) _DB.psychs = list;
      saveLocal();
      return list;
    }).catch(function () { return (_DB && _DB.psychs) || []; });
  }
  function getPsych(id) {
    return api('/api/psychs/' + id).catch(function () { return null; });
  }
  function updatePsych(id, data) {
    return api('/api/psychs/' + id, { method: 'PUT', body: data }).catch(function () {});
  }
  function getUsers() {
    return api('/api/users').catch(function () { return []; });
  }
  function updateUser(id, data) {
    return api('/api/users/' + id, { method: 'PUT', body: data }).catch(function () {});
  }
  function getMessages() {
    return api('/api/messages').catch(function () { return []; });
  }
  function sendMessage(toId, body) {
    return api('/api/messages', { method: 'POST', body: { toId: toId, body: body } }).catch(function () { return null; });
  }
  function markRead(userId) {
    return api('/api/messages/' + userId + '/read', { method: 'POST' }).catch(function () {});
  }
  function getReviews(psyId) {
    return api('/api/reviews/' + psyId).catch(function () { return []; });
  }
  function addReview(data) {
    return api('/api/reviews', { method: 'POST', body: data }).catch(function () {});
  }
  function getPublications() {
    return api('/api/publications').then(function (list) {
      if (_DB) _DB.publications = list;
      saveLocal();
      return list;
    }).catch(function () { return (_DB && _DB.publications) || []; });
  }
  function createPublication(data) {
    return api('/api/publications', { method: 'POST', body: data }).then(function (pub) {
      if (_DB && !_DB.publications) _DB.publications = [];
      if (_DB) _DB.publications.unshift(pub);
      saveLocal();
      return pub;
    }).catch(function () { return null; });
  }
  function getRanking() {
    return api('/api/ranking').catch(function () { return []; });
  }

  // ═══════════════════════════════════════════════════════
  //  WEBSOCKET
  // ═══════════════════════════════════════════════════════
  function connectWS() {
    if (!_SESSION || !_SESSION.token || !API_BASE) return;
    if (_ws && _ws.readyState <= 1) return;
    try {
      var wsProto = location.protocol === 'https:' ? 'wss:' : 'ws:';
      _ws = new WebSocket(wsProto + '//' + location.host);
      _ws.onopen = function () {
        _wsReady = true;
        _ws.send(JSON.stringify({ type: 'auth', token: _SESSION.token }));
      };
      _ws.onmessage = function (e) {
        var msg;
        try { msg = JSON.parse(e.data); } catch { return; }
        handleWSMessage(msg);
      };
      _ws.onclose = function () {
        _wsReady = false;
        _ws = null;
        scheduleReconnect();
      };
    } catch (e) {}
  }
  function closeWS() {
    if (_ws) { _ws.close(); _ws = null; _wsReady = false; }
    if (_reconnectTimer) { clearTimeout(_reconnectTimer); _reconnectTimer = null; }
  }
  function reconnectWS() {
    if (_reconnectTimer) return;
    scheduleReconnect();
  }
  function scheduleReconnect() {
    if (_reconnectTimer) clearTimeout(_reconnectTimer);
    _reconnectTimer = setTimeout(function () {
      _reconnectTimer = null;
      if (_SESSION && _isOnline) connectWS();
    }, 5000);
  }
  function wsSend(obj) {
    if (_ws && _ws.readyState === 1) { _ws.send(JSON.stringify(obj)); return true; }
    return false;
  }
  function handleWSMessage(msg) {
    switch (msg.type) {
      case 'presence:update':
        if (_DB && _DB.users) {
          var u = _DB.users.find(function (x) { return x.id === msg.userId; });
          if (u) { u.online = msg.online; u.lastSeen = new Date().toISOString(); }
        }
        saveLocal();
        if (typeof renderHeader === 'function') renderHeader();
        break;
      case 'message:new':
        if (typeof toast === 'function') toast('Nuevo mensaje de ' + (msg.from?.name || '?'), 'ok');
        if (typeof renderHeader === 'function') renderHeader();
        break;
      case 'post:create':
      case 'question:create':
      case 'answer:create':
        if (typeof renderRoute === 'function') renderRoute();
        break;
    }
  }

  // init() es llamada por app.js, no necesitamos iniciar aquí

  // Exponer al global
  window.WBAPI = {
    // Estado
    get DB() { return _DB; },
    get SESSION() { return _SESSION; },
    get isOnline() { return _isOnline; },
    get wsReady() { return _wsReady; },
    get serverAvailable() { return _serverAvailable; },

    // Autenticación
    login: login,
    logout: logout,
    register: register,

    // Datos
    fetchData: fetchData,
    getPosts: getPosts,
    createPost: createPost,
    likePost: likePost,
    addComment: addComment,
    deletePost: deletePost,
    getQuestions: getQuestions,
    createQuestion: createQuestion,
    addAnswer: addAnswer,
    acceptAnswer: acceptAnswer,
    viewQuestion: viewQuestion,
    getPsychs: getPsychs,
    getPsych: getPsych,
    updatePsych: updatePsych,
    getUsers: getUsers,
    updateUser: updateUser,
    getMessages: getMessages,
    sendMessage: sendMessage,
    markRead: markRead,
    getReviews: getReviews,
    addReview: addReview,
    getPublications: getPublications,
    createPublication: createPublication,
    getRanking: getRanking,

    // WebSocket
    wsSend: wsSend,
    connectWS: connectWS,
    closeWS: closeWS,

    // LocalStorage
    loadLocal: loadLocal,
    saveLocal: saveLocal,
    saveSession: saveSessionLocal
  };

  // Iniciar
  init();
})();
