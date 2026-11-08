/* ============================================================
   WineBOX.Clinic · Cliente Turso (Edge SQLite)
   Conecta el frontend con base de datos real en el edge
   ============================================================ */
(function () {
  'use strict';

  // ── Configuración (desde config.js) ──
  var CONFIG = window.WB_CONFIG || {};
  var DB_URL = CONFIG.turso?.url || '';
  var AUTH_TOKEN = CONFIG.turso?.authToken || '';
  var API_BASE = CONFIG.api?.url || '';
  var DB_KEY = 'winebox_foro_db_v1';
  var SESSION_KEY = 'winebox_foro_session_v1';

  // ── Estado local ──
  var _DB = null;
  var _SESSION = null;
  var _ready = false;
  var _syncing = false;

  // ── Utilidades HTTP ──
  function tursoFetch(endpoint, body) {
    if (!DB_URL || !AUTH_TOKEN) return Promise.reject({ error: 'turso_not_configured' });
    var headers = {
      'Authorization': 'Bearer ' + AUTH_TOKEN,
      'Content-Type': 'application/json'
    };
    var options = { method: 'POST', headers: headers, body: JSON.stringify(body) };
    return fetch(DB_URL + '/v2/persist/' + endpoint, options)
      .then(function (res) {
        if (!res.ok) throw { error: 'http_' + res.status, status: res.status };
        return res.json();
      });
  }

  function execSQL(sql, params) {
    params = params || [];
    return tursoFetch('exec', { sql: sql, params: params });
  }

  function querySQL(sql, params) {
    params = params || [];
    return tursoFetch('query', { sql: sql, params: params });
  }

  // ── Migraciones de tabla (crear si no existen) ──
  var SCHEMA = [
    'CREATE TABLE IF NOT EXISTS wb_users (id TEXT PRIMARY KEY, role TEXT, name TEXT, email TEXT UNIQUE, passHash TEXT, salt TEXT, city TEXT, headline TEXT, bio TEXT, website TEXT, whatsapp TEXT, avatarUrl TEXT, color TEXT, online INTEGER, lastSeen TEXT, blocked INTEGER, createdAt TEXT)',
    'CREATE TABLE IF NOT EXISTS wb_psychs (id TEXT PRIMARY KEY, userId TEXT, name TEXT, headline TEXT, bio TEXT, photoUrl TEXT, coverUrl TEXT, city TEXT, province TEXT, country TEXT, address TEXT, mapQuery TEXT, languages TEXT, license TEXT, years INTEGER, specialties TEXT, approaches TEXT, degrees TEXT, certifications TEXT, services TEXT, currency TEXT, paymentMethods TEXT, coverage TEXT, availability TEXT, modalities TEXT, acceptingNew INTEGER, verified INTEGER, responseTime TEXT, contact INTEGER, createdAt TEXT)',
    'CREATE TABLE IF NOT EXISTS wb_posts (id TEXT PRIMARY KEY, authorId TEXT, body TEXT, imageUrl TEXT, videoUrl TEXT, linkUrl TEXT, questionId TEXT, createdAt TEXT)',
    'CREATE TABLE IF NOT EXISTS wb_post_likes (postId TEXT, userId TEXT, PRIMARY KEY (postId, userId))',
    'CREATE TABLE IF NOT EXISTS wb_comments (id TEXT PRIMARY KEY, postId TEXT, authorId TEXT, body TEXT, createdAt TEXT)',
    'CREATE TABLE IF NOT EXISTS wb_questions (id TEXT PRIMARY KEY, authorId TEXT, title TEXT, body TEXT, category TEXT, tags TEXT, views INTEGER, createdAt TEXT)',
    'CREATE TABLE IF NOT EXISTS wb_answers (id TEXT PRIMARY KEY, questionId TEXT, authorId TEXT, psyId TEXT, body TEXT, upvotes TEXT, accepted INTEGER, createdAt TEXT)',
    'CREATE TABLE IF NOT EXISTS wb_messages (id TEXT PRIMARY KEY, fromId TEXT, toId TEXT, body TEXT, readAt TEXT, createdAt TEXT)',
    'CREATE TABLE IF NOT EXISTS wb_reviews (id TEXT PRIMARY KEY, psyId TEXT, patientId TEXT, rating INTEGER, comment TEXT, createdAt TEXT)',
    'CREATE TABLE IF NOT EXISTS wb_publications (id TEXT PRIMARY KEY, psyId TEXT, type TEXT, title TEXT, summary TEXT, body TEXT, category TEXT, url TEXT, likes TEXT, createdAt TEXT)',
    'CREATE TABLE IF NOT EXISTS wb_point_events (id TEXT PRIMARY KEY, psyId TEXT, type TEXT, delta INTEGER, label TEXT, refId TEXT, createdAt TEXT)',
    'CREATE TABLE IF NOT EXISTS wb_appointments (id TEXT PRIMARY KEY, psyId TEXT, patientId TEXT, date TEXT, time TEXT, status TEXT, notes TEXT, createdAt TEXT)',
    'CREATE TABLE IF NOT EXISTS wb_aurakit_projects (id TEXT PRIMARY KEY, psyId TEXT, name TEXT, template TEXT, headline TEXT, subheadline TEXT, about TEXT, cta TEXT, brand TEXT, accent TEXT, blocks TEXT, contact TEXT, services TEXT, books TEXT, testimonials TEXT, publishedUrl TEXT, createdAt TEXT, updatedAt TEXT)',
    'CREATE TABLE IF NOT EXISTS wb_reports (id TEXT PRIMARY KEY, targetType TEXT, targetId TEXT, reporterId TEXT, reason TEXT, status TEXT, createdAt TEXT)',
    'CREATE INDEX IF NOT EXISTS idx_posts_author ON wb_posts(authorId);',
    'CREATE INDEX IF NOT EXISTS idx_posts_created ON wb_posts(createdAt);',
    'CREATE INDEX IF NOT EXISTS idx_questions_author ON wb_questions(authorId);',
    'CREATE INDEX IF NOT EXISTS idx_messages_users ON wb_messages(fromId, toId);',
    'CREATE INDEX IF NOT EXISTS idx_reviews_psy ON wb_reviews(psyId);',
    'CREATE INDEX IF NOT EXISTS idx_point_events_psy ON wb_point_events(psyId);'
  ];

  function runMigrations() {
    if (!DB_URL || !AUTH_TOKEN) return Promise.resolve();
    var chain = Promise.resolve();
    SCHEMA.forEach(function (sql) {
      chain = chain.then(function () {
        return execSQL(sql);
      }).catch(function (e) {
        console.warn('[Turso] Migration warning:', e.error || e.message);
      });
    });
    return chain;
  }

  // ── Cargar datos desde Turso ──
  function fetchData() {
    if (!DB_URL || !AUTH_TOKEN) return Promise.reject({ error: 'turso_not_configured' });
    var queries = [
      { name: 'users', sql: 'SELECT * FROM wb_users ORDER BY createdAt' },
      { name: 'psychs', sql: 'SELECT * FROM wb_psychs ORDER BY years DESC' },
      { name: 'posts', sql: 'SELECT * FROM wb_posts ORDER BY createdAt DESC LIMIT 100' },
      { name: 'questions', sql: 'SELECT * FROM wb_questions ORDER BY createdAt DESC' },
      { name: 'answers', sql: 'SELECT * FROM wb_answers ORDER BY createdAt DESC' },
      { name: 'messages', sql: 'SELECT * FROM wb_messages ORDER BY createdAt DESC' },
      { name: 'reviews', sql: 'SELECT * FROM wb_reviews ORDER BY createdAt DESC' },
      { name: 'publications', sql: 'SELECT * FROM wb_publications ORDER BY createdAt DESC' },
      { name: 'pointEvents', sql: 'SELECT * FROM wb_point_events ORDER BY createdAt DESC' },
      { name: 'appointments', sql: 'SELECT * FROM wb_appointments ORDER BY createdAt DESC' },
      { name: 'aurakitProjects', sql: 'SELECT * FROM wb_aurakit_projects' },
      { name: 'reports', sql: 'SELECT * FROM wb_reports' }
    ];

    var results = {};
    var chain = Promise.resolve();
    queries.forEach(function (q) {
      chain = chain.then(function () {
        return querySQL(q.sql);
      }).then(function (resp) {
        if (resp.results && resp.results[0]) {
          results[q.name] = resp.results[0].rows.map(function (row) {
            return parseRow(row);
          });
        } else {
          results[q.name] = [];
        }
      }).catch(function (e) {
        console.warn('[Turso] Query failed for', q.name, ':', e.error || e.message);
        results[q.name] = [];
      });
    });

    return chain.then(function () {
      var seed = window.WINEBOX_SEED || {};
      var config = {
        specialties: (seed.config && seed.config.specialties) || [],
        categories: (seed.config && seed.config.categories) || [],
        provinces: (seed.config && seed.config.provinces) || [],
        tiers: (seed.config && seed.config.tiers) || []
      };
      var data = Object.assign({ config: config }, results);
      // Merge con seed para campos que faltan
      if (seed.users && seed.users.length > 0) {
        data.users = mergeArrays(data.users || [], seed.users, 'id');
      }
      if (seed.psychs && seed.psychs.length > 0) {
        data.psychs = mergeArrays(data.psychs || [], seed.psychs, 'id');
      }
      if (seed.posts && seed.posts.length > 0) {
        data.posts = mergeArrays(data.posts || [], seed.posts, 'id');
      }
      if (seed.questions && seed.questions.length > 0) {
        data.questions = mergeArrays(data.questions || [], seed.questions, 'id');
      }
      if (seed.publications && seed.publications.length > 0) {
        data.publications = mergeArrays(data.publications || [], seed.publications, 'id');
      }
      if (seed.pointEvents && seed.pointEvents.length > 0) {
        data.pointEvents = mergeArrays(data.pointEvents || [], seed.pointEvents, 'id');
      }
      if (seed.messages && seed.messages.length > 0) {
        data.messages = mergeArrays(data.messages || [], seed.messages, 'id');
      }
      _DB = data;
      saveLocal();
      return data;
    });
  }

  function mergeArrays(existing, seed, key) {
    var existingIds = {};
    (existing || []).forEach(function (item) { existingIds[item[key]] = item; });
    var result = existing || [];
    seed.forEach(function (item) {
      if (!existingIds[item[key]]) {
        result.push(item);
        existingIds[item[key]] = item;
      }
    });
    return result;
  }

  function parseRow(row) {
    var obj = {};
    for (var key in row) {
      var val = row[key];
      // Parse JSON fields
      if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
        try { val = JSON.parse(val); } catch (e) {}
      }
      // Convert integers
      if (typeof val === 'string' && !isNaN(val) && val !== '') {
        val = parseInt(val, 10);
      }
      obj[key] = val;
    }
    return obj;
  }

  // ── Guardar datos en Turso ──
  function saveData(data) {
    if (!DB_URL || !AUTH_TOKEN) return Promise.resolve();
    var chains = [];

    // Users
    if (data.users) {
      data.users.forEach(function (u) {
        chains.push(execSQL(buildUpsert('wb_users', u)));
      });
    }
    // Psychs
    if (data.psychs) {
      data.psychs.forEach(function (p) {
        chains.push(execSQL(buildUpsert('wb_psychs', p)));
      });
    }
    // Posts
    if (data.posts) {
      data.posts.forEach(function (post) {
        chains.push(execSQL(buildUpsert('wb_posts', post)));
      });
    }
    // Questions
    if (data.questions) {
      data.questions.forEach(function (q) {
        chains.push(execSQL(buildUpsert('wb_questions', q)));
      });
    }
    // Answers
    if (data.answers) {
      data.answers.forEach(function (a) {
        chains.push(execSQL(buildUpsert('wb_answers', a)));
      });
    }
    // Messages
    if (data.messages) {
      data.messages.forEach(function (m) {
        chains.push(execSQL(buildUpsert('wb_messages', m)));
      });
    }
    // Reviews
    if (data.reviews) {
      data.reviews.forEach(function (r) {
        chains.push(execSQL(buildUpsert('wb_reviews', r)));
      });
    }
    // Publications
    if (data.publications) {
      data.publications.forEach(function (pub) {
        chains.push(execSQL(buildUpsert('wb_publications', pub)));
      });
    }
    // Point events
    if (data.pointEvents) {
      data.pointEvents.forEach(function (pe) {
        chains.push(execSQL(buildUpsert('wb_point_events', pe)));
      });
    }

    return Promise.all(chains).then(function () {
      console.log('[Turso] Datos sincronizados');
      _syncing = false;
    }).catch(function (e) {
      console.error('[Turso] Error sync:', e);
      _syncing = false;
    });
  }

  function buildUpsert(table, data) {
    var keys = Object.keys(data);
    var cols = keys.filter(function (k) {
      return k !== 'passHash' && k !== 'salt' && k !== 'online'; // sensitive fields excluded from upsert
    });
    var values = cols.map(function (k) {
      var v = data[k];
      if (v === null || v === undefined) return 'NULL';
      if (typeof v === 'object') return "'" + JSON.stringify(v).replace(/'/g, "''") + "'";
      if (typeof v === 'string') return "'" + v.replace(/'/g, '""') + "'";
      return "'" + v + "'";
    });
    var setClause = cols.map(function (k) { return k + '=excluded.' + k; }).join(',');
    return "INSERT INTO " + table + " (" + cols.join(',') + ") VALUES (" + values.join(',') + ") ON CONFLICT(id) DO UPDATE SET " + setClause;
  }

  // ── Operaciones específicas ──
  function createPost(post) {
    return execSQL("INSERT INTO wb_posts (id, authorId, body, imageUrl, videoUrl, linkUrl, questionId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [post.id, post.authorId, post.body, post.imageUrl || '', post.videoUrl || '', post.linkUrl || '', post.questionId || '', post.createdAt]);
  }

  function likePost(postId, userId, remove) {
    if (remove) {
      return execSQL("DELETE FROM wb_post_likes WHERE postId=? AND userId=?", [postId, userId]);
    }
    return execSQL("INSERT OR IGNORE INTO wb_post_likes (postId, userId) VALUES (?, ?)", [postId, userId]);
  }

  function addComment(comment) {
    return execSQL("INSERT INTO wb_comments (id, postId, authorId, body, createdAt) VALUES (?, ?, ?, ?, ?)",
      [comment.id, comment.postId, comment.authorId, comment.body, comment.createdAt]);
  }

  function createQuestion(q) {
    return execSQL("INSERT INTO wb_questions (id, authorId, title, body, category, tags, views, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [q.id, q.authorId, q.title, q.body, q.category, JSON.stringify(q.tags || []), 0, q.createdAt]);
  }

  function createAnswer(a) {
    return execSQL("INSERT INTO wb_answers (id, questionId, authorId, psyId, body, upvotes, accepted, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [a.id, a.questionId, a.authorId, a.psyId || '', a.body, '[]', 0, a.createdAt]);
  }

  function sendMessage(msg) {
    return execSQL("INSERT INTO wb_messages (id, fromId, toId, body, readAt, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [msg.id, msg.fromId, msg.toId, msg.body, null, msg.createdAt]);
  }

  function createReview(r) {
    return execSQL("INSERT INTO wb_reviews (id, psyId, patientId, rating, comment, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [r.id, r.psyId, r.patientId, r.rating, r.comment || '', r.createdAt]);
  }

  function createPublication(pub) {
    return execSQL("INSERT INTO wb_publications (id, psyId, type, title, summary, body, category, url, likes, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [pub.id, pub.psyId, pub.type, pub.title, pub.summary || '', pub.body || '', pub.category, pub.url || '', '[]', pub.createdAt]);
  }

  function awardPoint(pe) {
    return execSQL("INSERT INTO wb_point_events (id, psyId, type, delta, label, refId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [pe.id, pe.psyId, pe.type, pe.delta, pe.label || '', pe.refId || '', pe.createdAt]);
  }

  // ── Sincronización automática ──
  var _syncTimer = null;
  function scheduleSync() {
    if (_syncTimer) clearTimeout(_syncTimer);
    _syncTimer = setTimeout(function () {
      if (_DB && !_syncing) {
        _syncing = true;
        saveData(_DB).catch(function() { _syncing = false; });
      }
    }, 10000); // Sync cada 10 segundos
  }

  // ── LocalStorage (fallback) ──
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

  // ── Inicialización ──
  function init() {
    loadLocal();

    if (DB_URL && AUTH_TOKEN) {
      // Modo Turso
      console.log('[Turso] Conectando a', DB_URL);
      runMigrations().then(function () {
        return fetchData();
      }).then(function () {
        _ready = true;
        console.log('[Turso] Datos cargados:', Object.keys(_DB || {}).length, 'tablas');
        saveLocal(); // Cachear en localStorage
        if (typeof initApp === 'function') initApp();
        // Sincronización periódica
        setInterval(scheduleSync, 30000);
      }).catch(function (e) {
        console.warn('[Turso] Error inicial, usando modo local:', e.error || e.message);
        _ready = true;
        if (typeof initApp === 'function') initApp();
      });
    } else {
      // Modo 100% local
      _ready = true;
      if (typeof initApp === 'function') initApp();
    }
  }

  // Exponer global
  window.TURSO = {
    get DB() { return _DB; },
    get SESSION() { return _SESSION; },
    get ready() { return _ready; },
    loadLocal: loadLocal,
    saveLocal: saveLocal,
    saveSession: saveSessionLocal,
    fetchData: fetchData,
    saveData: saveData,
    createPost: createPost,
    likePost: likePost,
    addComment: addComment,
    createQuestion: createQuestion,
    createAnswer: createAnswer,
    sendMessage: sendMessage,
    createReview: createReview,
    createPublication: createPublication,
    awardPoint: awardPoint,
    scheduleSync: scheduleSync,
    // Info para debug
    getConfig: function () { return { url: DB_URL ? '✓' : '✗', token: AUTH_TOKEN ? '✓' : '✗', ready: _ready }; }
  };

  // Iniciar
  init();
})();
