/* ============================================================
   WineBOX.Clinic · Lógica de la aplicación
   Plataforma social real con servidor Node.js + WebSocket.
   Persistencia: API REST + localStorage como fallback offline.
   ============================================================ */
'use strict';
(function () {
  var SEED = window.WINEBOX_SEED;
  var DB_KEY = 'winebox_foro_db_v1';
  var SESSION_KEY = 'winebox_foro_session_v1';
  var VIEW = document.getElementById('view');
  var DB = null;
  var SESSION = null;
  var dirState = { q: '', specialty: '', modality: '', province: '', maxPrice: '', sort: 'points', accepting: false };
  var forumState = { q: '', category: '', status: 'all', sort: 'recent' };
  var pubState = { q: '', type: 'all', category: 'all' };
  var feedFilter = 'all';
  var akState = { tab: 'diseno', projectId: null, blocks: null, loadedId: null, aiLog: '' };
  var dockState = { open: false, partner: null, max: false };
  var panelTab = 'resumen';
  var regRole = 'patient';
  var chatLog = null;
  var breathTimers = [];
  var viewed = {};
  var testing = false;
  var debounceTimer = null;

  var PALETTE = ['#002045', '#17a589', '#7c5aa6', '#c0392b', '#2e8b57', '#b7791f', '#1f4b7a', '#8e44ad', '#2e5266', '#a9714b'];

  /* ---------------- Utilidades ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function uid(prefix) { return prefix + '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function normalize(s) {
    return String(s == null ? '' : s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }
  function hashPass(pass, salt) {
    var s = String(salt) + '|' + String(pass), h1 = 0x811c9dc5, h2 = 0x1000193, i, c;
    for (i = 0; i < s.length; i++) {
      c = s.charCodeAt(i);
      h1 ^= c; h1 = Math.imul(h1, 16777619) >>> 0;
      h2 = Math.imul(h2 ^ c, 2654435761) >>> 0;
    }
    h1 ^= h1 >>> 13; h1 = Math.imul(h1, 0x5bd1e995) >>> 0; h1 ^= h1 >>> 15;
    h2 ^= h2 >>> 16; h2 = Math.imul(h2, 0x85ebca6b) >>> 0; h2 ^= h2 >>> 13;
    return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
  }
  function fmtDate(iso, withTime) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    var opts = { day: '2-digit', month: 'short', year: 'numeric' };
    if (withTime) { opts.hour = '2-digit'; opts.minute = '2-digit'; }
    return d.toLocaleDateString('es-AR', opts);
  }
  function timeAgo(iso) {
    var d = new Date(iso), diff = Date.now() - d.getTime();
    if (isNaN(d.getTime())) return '';
    var m = Math.floor(diff / 60000);
    if (m < 1) return 'recién';
    if (m < 60) return 'hace ' + m + ' min';
    var h = Math.floor(m / 60);
    if (h < 24) return 'hace ' + h + ' h';
    var days = Math.floor(h / 24);
    if (days < 30) return 'hace ' + days + ' d';
    return fmtDate(iso);
  }
  function fmtMoney(n, cur) {
    n = Number(n) || 0;
    try {
      return new Intl.NumberFormat('es-AR', { style: 'currency', currency: cur === 'USD' ? 'USD' : 'ARS', maximumFractionDigits: 0 }).format(n);
    } catch (e) { return '$' + n.toLocaleString('es-AR'); }
  }
  function initials(name) {
    var parts = String(name || '?').replace(/^(Lic\.|Dra\.|Dr\.|Mg\.|Ps\.)\s*/i, '').trim().split(/\s+/);
    return ((parts[0] || '?')[0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }
  function colorFor(name) {
    var s = 0, i;
    for (i = 0; i < String(name).length; i++) s = (s + String(name).charCodeAt(i) * 7) % 997;
    return PALETTE[s % PALETTE.length];
  }
  function avatar(name, cls, color, img, online) {
    var inner = img ? '<img src="' + esc(img) + '" alt="" loading="lazy">' : esc(initials(name));
    var html = '<span class="avatar ' + (cls || '') + '" style="background:' + (color || colorFor(name)) + '">' + inner + '</span>';
    if (online === true) return '<span class="avatar-wrap">' + html + '<span class="online-dot" title="En línea"></span></span>';
    return html;
  }
  function photoOfUser(u) { return u && u.avatarUrl ? u.avatarUrl : ''; }
  function photoOfPsy(p) {
    if (!p) return '';
    var u = userById(p.userId);
    return p.photoUrl || (u && u.avatarUrl) || '';
  }
  function avatarUser(u, cls) {
    if (!u) return avatar('?', cls, '#8494a5', '', false);
    return avatar(u.name, cls, u.color, photoOfUser(u), isOnline(u));
  }
  function avatarPsy(p, cls) {
    if (!p) return avatar('?', cls, '#17a589', '', false);
    return avatar(p.name, cls, colorFor(p.name), photoOfPsy(p), isOnline(userById(p.userId)));
  }
  function starsHtml(avg) {
    var out = '', i, full = Math.round(avg || 0);
    for (i = 1; i <= 5; i++) out += '<span class="' + (i <= full ? '' : 'off') + '">★</span>';
    return '<span class="stars" aria-label="' + (avg || 0) + ' de 5 estrellas">' + out + '</span>';
  }
  function toParagraphs(text) {
    return String(text || '').split(/\n{1,}/).filter(function (p) { return p.trim(); })
      .map(function (p) { return '<p>' + esc(p.trim()) + '</p>'; }).join('');
  }
  function safeUrl(u) {
    var s = String(u || '').trim();
    if (!s) return '';
    if (/^(https?:\/\/|\/|\.{1,2}\/|#)/i.test(s)) return s;
    if (/^data:image\/(png|jpe?g|gif|webp|svg\+xml);/i.test(s)) return s;
    return '';
  }
  function debounce(fn, ms) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fn, ms);
  }
  function userById(id) { return DB.users.filter(function (u) { return u.id === id; })[0] || null; }
  function psyById(id) { return DB.psychs.filter(function (p) { return p.id === id; })[0] || null; }
  function me() { return SESSION && SESSION.userId ? userById(SESSION.userId) : null; }
  function myPsych() {
    var u = me();
    if (!u || u.role !== 'psy') return null;
    return DB.psychs.filter(function (p) { return p.userId === u.id; })[0] || null;
  }
  function isOnline(u) {
    if (!u || u.blocked) return false;
    if (u.online === true) return true;
    var t = u.lastSeen ? new Date(u.lastSeen).getTime() : 0;
    return !!t && (Date.now() - t) < 5 * 60 * 1000;
  }
  function touchPresence() {
    var u = me();
    if (!u) return;
    u.lastSeen = new Date().toISOString();
    u.online = true;
    save();
    // Notificar al servidor vía WebSocket
    if (window.WBAPI && window.WBAPI.wsReady) {
      window.WBAPI.wsSend({ type: 'presence', online: true });
    }
  }
  function roleLabel(u) {
    if (!u) return '';
    return ({ root: 'Root', admin: 'Administración', psy: 'Psicólogo/a', patient: 'Paciente' }[u.role] || u.role);
  }
  function userLink(u, cls) {
    if (!u) return '<span class="' + (cls || '') + '">Usuario</span>';
    if (u.role === 'psy') {
      var p = DB.psychs.filter(function (x) { return x.userId === u.id; })[0];
      if (p) return '<a class="' + (cls || '') + '" href="#/psicologo/' + p.id + '">' + esc(u.name) + '</a>';
    }
    return '<a class="' + (cls || '') + '" href="#/usuario/' + u.id + '">' + esc(u.name) + '</a>';
  }
  function messagesWith(otherId) {
    var u = me();
    if (!u) return [];
    return DB.messages.filter(function (m) {
      return (m.fromId === u.id && m.toId === otherId) || (m.fromId === otherId && m.toId === u.id);
    }).sort(function (a, b) { return new Date(a.createdAt) - new Date(b.createdAt); });
  }
  function lastMessageWith(otherId) {
    var list = messagesWith(otherId);
    return list.length ? list[list.length - 1] : null;
  }
  function unreadFrom(otherId) {
    var u = me();
    if (!u) return 0;
    return DB.messages.filter(function (m) { return m.fromId === otherId && m.toId === u.id && !m.readAt; }).length;
  }
  function unreadTotal() {
    var u = me();
    if (!u) return 0;
    return DB.messages.filter(function (m) { return m.toId === u.id && !m.readAt; }).length;
  }
  function conversationPartners() {
    var u = me();
    if (!u) return [];
    var ids = {};
    DB.messages.forEach(function (m) {
      if (m.fromId === u.id && userById(m.toId)) ids[m.toId] = true;
      if (m.toId === u.id && userById(m.fromId)) ids[m.fromId] = true;
    });
    if (u.role === 'psy') {
      var p = myPsych();
      if (p) DB.contacts.forEach(function (c) { if (c.psyId === p.id) ids[c.patientId] = true; });
    } else {
      DB.contacts.forEach(function (c) {
        if (c.patientId === u.id) {
          var psy = psyById(c.psyId);
          if (psy && userById(psy.userId)) ids[psy.userId] = true;
        }
      });
    }
    delete ids[u.id];
    return Object.keys(ids).map(function (id) {
      var other = userById(id), last = lastMessageWith(id);
      return { user: other, last: last, unread: unreadFrom(id), ts: last ? new Date(last.createdAt).getTime() : 0 };
    }).filter(function (x) { return x.user; }).sort(function (a, b) { return b.ts - a.ts; });
  }
  function markConversationRead(otherId) {
    var u = me();
    if (!u) return;
    var changed = false, now = new Date().toISOString();
    DB.messages.forEach(function (m) {
      if (m.fromId === otherId && m.toId === u.id && !m.readAt) { m.readAt = now; changed = true; }
    });
    if (changed) { save(); renderHeader(); }
  }
  function readImageFile(input, form) {
    var file = input.files && input.files[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) return toast('La imagen es muy grande (máximo 8 MB).', 'warn');
    var target = input.dataset.target || 'avatarUrl';
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        try {
          var size = (target === 'imageUrl' || target === 'coverUrl') ? 900 : 256;
          var canvas = document.createElement('canvas');
          var ratio = Math.min(size / img.width, size / img.height, 1);
          canvas.width = Math.max(1, Math.round(img.width * ratio));
          canvas.height = Math.max(1, Math.round(img.height * ratio));
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          var url = canvas.toDataURL('image/jpeg', 0.82);
          var field = form.elements[target];
          if (field) {
            if (input.dataset.append) field.value = (field.value.trim() ? field.value.trim() + '\n' : '') + url;
            else field.value = url;
          }
          var prev = form.querySelector('[data-preview="' + target + '"]');
          if (prev) { prev.src = url; prev.hidden = false; }
          toast('Imagen cargada. Guardá los cambios para publicarla.', 'ok', 2600);
        } catch (e) { toast('No se pudo procesar la imagen.', 'err'); }
      };
      img.onerror = function () { toast('El archivo no es una imagen válida.', 'err'); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  function downloadBlob(blob, filename) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2500);
  }

  /* ---------------- Persistencia ---------------- */
  function load() {
    // Siempre cargar desde localStorage primero (rápido, funciona offline)
    _loadFromLocal();
    migrate();
    renderHeader();
    renderRoute();
    document.getElementById('year').textContent = new Date().getFullYear();
    // Si hay servidor, intentar sincronizar en segundo plano
    if (window.WBAPI) {
      window.WBAPI.fetchData().then(function(data) {
        if (data && data.users) {
          DB = data;
          migrate();
          renderHeader();
          renderRoute();
        }
      }).catch(function() {
        // Servidor no disponible, continuar con localStorage
      });
    }
  }
  function _loadFromLocal() {
    var raw = null;
    try { raw = localStorage.getItem(DB_KEY); } catch (e) { raw = null; }
    if (raw) {
      try { DB = JSON.parse(raw); } catch (e) { DB = null; }
    }
    if (!DB || !DB.users || !DB.psychs) DB = clone(SEED);
    if (!DB.config) DB.config = clone(SEED.config);
    if (!Array.isArray(DB.reports)) DB.reports = [];
    if (!Array.isArray(DB.posts)) DB.posts = clone(SEED.posts || []);
    if (!Array.isArray(DB.messages)) DB.messages = clone(SEED.messages || []);
    if (!Array.isArray(DB.appointments)) DB.appointments = clone(SEED.appointments || []);
    if (!Array.isArray(DB.aurakitProjects)) DB.aurakitProjects = clone(SEED.aurakitProjects || []);
    try { SESSION = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { SESSION = null; }
    if (SESSION && !userById(SESSION.userId)) SESSION = null;
  }
  function migrate() {
    DB.version = 2;
    var hasRoot = DB.users.some(function (u) { return u.role === 'root'; });
    if (!hasRoot) {
      var rootSeed = (SEED.users || []).filter(function (u) { return u.role === 'root'; })[0];
      if (rootSeed) DB.users.push(clone(rootSeed));
    }
    DB.users.forEach(function (u) {
      if (!u.salt) u.salt = 's_' + u.id;
      if (u.password) { u.passHash = hashPass(u.password, u.salt); delete u.password; }
      if (!u.passHash) u.passHash = hashPass('demo1234', u.salt);
      if (typeof u.avatarUrl !== 'string') u.avatarUrl = '';
      if (typeof u.website !== 'string') u.website = '';
      if (typeof u.whatsapp !== 'string') u.whatsapp = '';
      if (typeof u.bio !== 'string') u.bio = '';
      if (typeof u.headline !== 'string') u.headline = '';
      if (typeof u.blocked !== 'boolean') u.blocked = false;
      if (typeof u.online !== 'boolean') u.online = false;
    });
    DB.psychs.forEach(function (p) {
      if (typeof p.photoUrl !== 'string') p.photoUrl = '';
      if (typeof p.coverUrl !== 'string') p.coverUrl = '';
      if (!Array.isArray(p.gallery)) p.gallery = [];
      if (!Array.isArray(p.schedule)) p.schedule = null;
      if (!p.modalities) p.modalities = ['online'];
      if (!p.specialties) p.specialties = [];
      if (!p.approaches) p.approaches = [];
      if (!p.degrees) p.degrees = [];
      if (!p.certifications) p.certifications = [];
      if (!p.services) p.services = [];
      if (!p.availability) p.availability = [];
      if (!p.paymentMethods) p.paymentMethods = [];
      if (!p.coverage) p.coverage = [];
      if (!p.languages) p.languages = ['Español'];
      if (typeof p.acceptingNew !== 'boolean') p.acceptingNew = true;
      if (typeof p.verified !== 'boolean') p.verified = false;
      if (!p.currency) p.currency = 'ARS';
      if (typeof p.years !== 'number') p.years = Number(p.years) || 0;
    });
    DB.questions.forEach(function (q) {
      if (!Array.isArray(q.answers)) q.answers = [];
      if (!Array.isArray(q.tags)) q.tags = [];
      q.views = Number(q.views) || 0;
    });
    DB.publications.forEach(function (p) { if (!Array.isArray(p.likes)) p.likes = []; });
    DB.posts.forEach(function (p) {
      if (!Array.isArray(p.likes)) p.likes = [];
      if (!Array.isArray(p.comments)) p.comments = [];
    });
    DB.messages.forEach(function (m) { if (typeof m.body !== 'string') m.body = ''; });
    DB.appointments.forEach(function (a) { if (!a.status) a.status = 'pending'; });
    DB.aurakitProjects.forEach(function (a) {
      if (!Array.isArray(a.blocks)) a.blocks = akDefaultBlocks(a.template || 'sesiones');
      if (!a.contact) a.contact = { whatsapp: '', email: '', address: '', schedule: '' };
      if (!Array.isArray(a.services)) a.services = [];
      if (!Array.isArray(a.books)) a.books = [];
      if (!Array.isArray(a.testimonials)) a.testimonials = [];
    });
    save();
  }
  function save() {
    // Guardar en localStorage siempre (offline primero)
    try { localStorage.setItem(DB_KEY, JSON.stringify(DB)); }
    catch (e) {}

    // Sincronizar con Turso si está configurado
    if (window.TURSO && window.TURSO.saveData && DB) {
      try { window.TURSO.saveData(DB); } catch (e) {}
    }
    // También intentar con API si existe
    if (window.WBAPI && window.WBAPI.saveLocal) {
      try { window.WBAPI.saveLocal(); } catch (e) {}
    }
  }
  function saveSession() {
    if (window.WBAPI) window.WBAPI.saveSession();
    try {
      if (SESSION) localStorage.setItem(SESSION_KEY, JSON.stringify(SESSION));
      else localStorage.removeItem(SESSION_KEY);
    } catch (e) { /* modo privado */ }
  }

  /* ---------------- Puntos / mérito ---------------- */
  function pointsOf(psyId) {
    return DB.pointEvents.filter(function (e) { return e.psyId === psyId; })
      .reduce(function (s, e) { return s + (Number(e.delta) || 0); }, 0);
  }
  function award(psyId, type, delta, label, refId) {
    DB.pointEvents.push({
      id: uid('pe'), psyId: psyId, type: type, delta: delta,
      label: label, refId: refId || null, createdAt: new Date().toISOString()
    });
    save();
  }
  function tiers() { return DB.config.tiers.slice().sort(function (a, b) { return a.min - b.min; }); }
  function tierOf(points) {
    var t = tiers(), current = t[0];
    t.forEach(function (x) { if (points >= x.min) current = x; });
    return current;
  }
  function nextTierOf(points) {
    var t = tiers(), next = null;
    t.forEach(function (x) { if (x.min > points && (!next || x.min < next.min)) next = x; });
    return next;
  }
  function tierBadge(points) {
    var t = tierOf(points);
    return '<span class="tier" style="--tier-color:' + t.color + '">' + esc(t.name) + '</span>';
  }
  function reviewsOf(psyId) { return DB.reviews.filter(function (r) { return r.psyId === psyId; }); }
  function patientPoints(userId) {
    var base = 0;
    base += DB.questions.filter(function(q){ return q.authorId===userId; }).length * 5;
    base += DB.posts.filter(function(p){ return p.authorId===userId; }).length * 3;
    var pr = DB.patientReviews.filter(function(r){ return r.patientId===userId; });
    pr.forEach(function(r){ base += r.rating>=4?8:r.rating===3?0:r.rating===2?-10:-20; });
    return Math.max(0, base);
  }
  function patientTier(pts) {
    if (pts>=100) return 'Destacado';
    if (pts>=50)  return 'Confiable';
    if (pts>=20)  return 'Activo';
    return 'Nuevo';
  }
  function canReviewPatient(patientId) {
    var u = me();
    if (!u || u.role!=='psy') return false;
    var p = myPsych();
    if (!p) return false;
    var hasContact = DB.contacts.some(function(c){ return c.psyId===p.id && c.patientId===patientId && c.status==='accepted'; });
    if (!hasContact) return false;
    return !DB.patientReviews.some(function(r){ return r.psyId===p.id && r.patientId===patientId; });
  }
  function handlePatientReview(form, patientId) {
    var u = me();
    if (!u || u.role!=='psy') return formError(form,'Solo los psicólogos pueden reseñar pacientes.');
    if (!canReviewPatient(patientId)) return formError(form,'No podés reseñar este paciente.');
    var rating = Number(form.elements.rating.value);
    var comment = String(form.elements.comment.value||'').trim();
    if (!rating||rating<1||rating>5) return formError(form,'Elegí una calificación de 1 a 5.');
    if (comment.length<10) return formError(form,'Agregá un comentario de al menos 10 caracteres.');
    var p2 = myPsych();
    DB.patientReviews.push({
      id: uid('pr'), psyId: p2.id, patientId: patientId,
      rating: rating, comment: comment,
      createdAt: new Date().toISOString(), visible: false
    });
    save(); closeModal();
    toast('Reseña guardada. Solo es visible para profesionales.','ok');
  }
  function ratingOf(psyId) {
    var rs = reviewsOf(psyId);
    if (!rs.length) return { avg: 0, count: 0 };
    var avg = rs.reduce(function (s, r) { return s + Number(r.rating || 0); }, 0) / rs.length;
    return { avg: Math.round(avg * 10) / 10, count: rs.length };
  }
  function psyStats(psyId) {
    var answers = 0, accepted = 0, up = 0;
    DB.questions.forEach(function (q) {
      q.answers.forEach(function (a) {
        if (a.psyId === psyId) {
          answers++;
          if (a.accepted) accepted++;
          up += a.upvotes.length;
        }
      });
    });
    return {
      answers: answers, accepted: accepted, upvotes: up,
      pubs: DB.publications.filter(function (p) { return p.psyId === psyId; }).length,
      points: pointsOf(psyId)
    };
  }
  function ranking() {
    return DB.psychs.slice().sort(function (a, b) {
      return pointsOf(b.id) - pointsOf(a.id) || ratingOf(b.id).avg - ratingOf(a.id).avg;
    });
  }
  function rankOf(psyId) {
    return ranking().map(function (p) { return p.id; }).indexOf(psyId) + 1;
  }
  function priceFrom(p) {
    var nums = (p.services || []).map(function (s) { return Number(s.price); }).filter(function (n) { return n > 0; });
    return nums.length ? Math.min.apply(null, nums) : 0;
  }
  function profileCompletion(p) {
    var done = 0;
    if (p.bio && p.bio.length >= 80) done++;
    if (p.license) done++;
    if ((p.specialties || []).length >= 2) done++;
    if ((p.services || []).length >= 1) done++;
    if ((p.degrees || []).length >= 1) done++;
    return Math.round((done / 5) * 100);
  }

  /* ---------------- Toasts / modales ---------------- */
  function toast(msg, type, ms) {
    var root = $('#toastRoot');
    if (!root) return;
    var el = document.createElement('div');
    el.className = 'toast ' + (type || 'ok');
    el.innerHTML = '<span>' + esc(msg) + '</span><button class="close" aria-label="Cerrar">×</button>';
    el.querySelector('.close').addEventListener('click', function () { el.remove(); });
    root.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.remove(); }, ms || 4600);
  }
  function openModal(opts) {
    closeModal();
    var size = opts.size ? ' ' + opts.size : '';
    var root = $('#modalRoot');
    root.innerHTML =
      '<div class="modal-backdrop" data-modal-backdrop>' +
        '<div class="modal' + size + '" role="dialog" aria-modal="true" aria-label="' + esc(opts.title) + '">' +
          '<div class="modal-head"><div style="flex:1"><h2>' + esc(opts.title) + '</h2>' +
            (opts.sub ? '<p class="sub">' + esc(opts.sub) + '</p>' : '') +
          '</div><button class="modal-close" data-act="close-modal" aria-label="Cerrar">×</button></div>' +
          '<div class="modal-body">' + opts.body + '</div>' +
          (opts.foot ? '<div class="modal-foot">' + opts.foot + '</div>' : '') +
        '</div>' +
      '</div>';
    document.body.style.overflow = 'hidden';
    var backdrop = root.querySelector('[data-modal-backdrop]');
    backdrop.addEventListener('mousedown', function (e) { if (e.target === backdrop) closeModal(); });
    var first = root.querySelector('input:not([type=hidden]),select,textarea,button');
    if (first) setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (e) {} }, 60);
  }
  function closeModal() {
    var root = $('#modalRoot');
    if (root) root.innerHTML = '';
    document.body.style.overflow = '';
    clearBreath();
  }
  function formError(form, msg) {
    var box = form.querySelector('.form-error');
    if (!box) {
      box = document.createElement('div');
      box.className = 'form-error';
      form.insertBefore(box, form.firstChild);
    }
    box.textContent = msg;
    box.scrollIntoView({ block: 'nearest' });
  }
  function clearError(form) {
    var box = form.querySelector('.form-error');
    if (box) box.remove();
  }

  /* ---------------- Autenticación ---------------- */
  function doLogin(email, password) {
    // Primero intentar con API del servidor
    if (window.WBAPI) {
      return window.WBAPI.login(email, password).then(function (resp) {
        SESSION = { userId: resp.user.id, token: resp.token, ts: Date.now() };
        saveSession();
        touchPresence();
        renderHeader();
        initChats(resp.user.id, resp.user.name);
        return { ok: true, user: resp.user };
      }).catch(function (e) {
        // Fallback a localStorage si el servidor falla
        return _doLoginLocal(email, password);
      });
    }
    return _doLoginLocal(email, password);
  }
  function _doLoginLocal(email, password) {
    var u = DB.users.filter(function (x) { return normalize(x.email) === normalize(email); })[0];
    if (!u || u.passHash !== hashPass(password, u.salt)) return Promise.resolve({ ok: false, msg: 'Email o contraseña incorrectos.' });
    if (u.blocked) return Promise.resolve({ ok: false, msg: 'Esta cuenta está suspendida. Contactá a la administración.' });
    SESSION = { userId: u.id, ts: Date.now() };
    saveSession();
    touchPresence();
    renderHeader();
    initChats(u.id, u.name);
    return Promise.resolve({ ok: true, user: u });
  }

  // Inicializar chat ICQ
  function initChats(userId, userName) {
    if (window.ICQChat) {
      try { window.ICQChat.init(userId); } catch(e) { console.warn('[ICQ] Error:', e); }
    }
  }
  function logout() {
    var u = me();
    if (u) { u.online = false; u.lastSeen = new Date().toISOString(); save(); }
    SESSION = null;
    saveSession();
    if (window.WBAPI) window.WBAPI.logout();
    renderHeader();
    toast('Sesión cerrada.', 'ok');
    navigate('#/');
  }
  function openLogin(message) {
    openModal({
      title: 'Ingresar a WineBOX.Clinic',
      sub: message || 'Pacientes y psicólogos usan la misma puerta de entrada.',
      size: 'narrow',
      body:
        '<form data-form="login">' +
          '<div class="field" style="margin-bottom:12px"><label for="loginEmail">Email</label>' +
            '<input class="input" id="loginEmail" name="email" type="email" required autocomplete="email" placeholder="tu@email.com"></div>' +
          '<div class="field" style="margin-bottom:12px"><label for="loginPassword">Contraseña</label>' +
            '<input class="input" id="loginPassword" name="password" type="password" required autocomplete="current-password" placeholder="••••••••"></div>' +
          '<button class="btn btn-primary btn-block" type="submit">Ingresar</button>' +
        '</form>' +
        '<div class="inbox-note" style="margin-top:14px">' +
          '<strong>Cuentas de demostración</strong> (contraseña <code>demo1234</code>):<br>' +
          'Paciente: <code>paciente@demo.com</code> · Psicólogo: <code>psicologo@demo.com</code> · Admin: <code>admin@winebox.clinic</code>' +
        '</div>' +
        '<div class="btn-group" style="margin-top:12px">' +
          '<button class="btn btn-outline btn-sm" data-act="demo-login" data-email="paciente@demo.com" data-pass="demo1234">Entrar como paciente demo</button>' +
          '<button class="btn btn-outline btn-sm" data-act="demo-login" data-email="psicologo@demo.com" data-pass="demo1234">Entrar como psicólogo demo</button>' +
        '</div>' +
        '<p class="small muted" style="margin:14px 0 0">¿No tenés cuenta? <a href="#/registro">Registrate gratis</a>. Los pacientes deben registrarse para contactar psicólogos.</p>' +
        '<p class="small muted" style="margin:8px 0 0">¿Sos administración? <a href="#/root">Acceso root</a>.</p>'
    });
  }
  function openRegisterModal(role) {
    navigate('#/registro' + (role ? '/' + role : ''));
  }


  /* ---------------- Carousel helpers ---------------- */
  function carouselStep(rail, dir) {
    if (!rail) return;
    playTick();
    var cardW = rail.querySelector('[role="listitem"]');
    var step = cardW ? cardW.offsetWidth + 12 : 232;
    rail.scrollBy({ left: dir * step * 5, behavior: 'smooth' });
  }
  function updateCarouselDots(rail, dots, visible) {
    if (!dots) return;
    var page = Math.round(rail.scrollLeft / (rail.clientWidth || 1));
    dots.querySelectorAll('.wb-carousel-dot').forEach(function(d,i) {
      d.classList.toggle('wb-carousel-dot-active', i === page);
    });
  }
  function playTick() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880; o.type = 'sine';
      g.gain.setValueAtTime(0.08, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.13);
    } catch(e) {}
  }
  function playClick() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 660; o.type = 'sine';
      g.gain.setValueAtTime(0.06, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
      o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.1);
    } catch(e) {}
  }

  /* ---------------- Router ---------------- */
  function parseRoute() {
    var raw = location.hash.replace(/^#\/?/, '');
    var parts = raw.split('/').filter(Boolean);
    return { name: parts[0] || 'home', id: parts[1] || null };
  }
  function navigate(hash) {
    if (location.hash === hash) renderRoute();
    else location.hash = hash;
  }
  function renderRoute() {
    if (!DB) return;
    closeModal();
    var r = parseRoute();
    window.scrollTo(0, 0);
    closeMenu();
    $$('.main-nav a').forEach(function (a) {
      var map = { psicologo: 'directorio', pregunta: 'comunidad', publicacion: 'publicaciones', usuario: 'directorio', root: 'root', aurakit: 'oficina', 'acceso-lizar': 'panel', foro: 'comunidad', home: 'home', '': 'home' };
      var name = map[r.name] || r.name;
      a.classList.toggle('active', a.getAttribute('data-nav') === name);
    });
    try {
      switch (r.name) {
        case 'home': renderHome(); break;
        case 'directorio': renderDirectory(); break;
        case 'psicologo': renderPsychProfile(r.id); break;
        case 'foro':
        case 'comunidad': renderForum(); break;
        case 'pregunta': renderQuestion(r.id); break;
        case 'publicaciones': renderPublications(); break;
        case 'meritocracia': renderMerit(); break;
        case 'aura': renderAura(); break;
        case 'cuenta': renderAccount(); break;
        case 'panel': renderPanel(); break;
        case 'registro': renderRegister(r.id || 'patient'); break;
        case 'mensajes': renderMessages(r.id); break;
        case 'usuario': renderUserProfile(r.id); break;
        case 'post': renderPostPage(r.id); break;
        case 'root': renderRoot(); break;
        case 'oficina': renderOffice(); break;
        case 'aurakit': renderExternalTool('AuraKit', 'AuraKit es la utilidad externa del profesional para crear su web, tienda y app.', '../auraserver/'); break;
        case 'acceso-lizar': renderLizarGate(); break;
        default: renderNotFound();
      }
    } catch (err) {
      console.error(err);
      VIEW.innerHTML = '<div class="container page"><div class="empty"><span class="emoji">⚠️</span><h3>Algo salió mal</h3><p>Recargá la página. Si el problema sigue, restablecé los datos demo desde Mi cuenta.</p><button class="btn btn-primary" onclick="location.reload()">Recargar</button></div></div>';
    }
    renderHeader();
    renderAuraDock();
    if (!testing) document.title = titleFor(r) + ' · WineBOX.Clinic';
  }
  function titleFor(r) {
    switch (r.name) {
      case 'directorio':
      case 'home': return 'Inicio · WineBOX.Clinic';
      case 'foro':
      case 'comunidad': return 'Comunidad y consultas';
      case 'pregunta': return 'Consulta';
      case 'psicologo': return 'Perfil profesional';
      case 'publicaciones': return 'Artículos y ebooks';
      case 'meritocracia': return 'Meritocracia';
      case 'aura': return 'Aura · Acompañamiento';
      case 'cuenta': return 'Mi cuenta';
      case 'panel': return 'Panel profesional';
      case 'registro': return 'Crear cuenta';
      case 'mensajes': return 'Mensajes';
      case 'usuario': return 'Perfil';
      case 'post': return 'Publicación';
      case 'root': return 'Consola root';
      case 'oficina': return 'Oficina';
      case 'aurakit': return 'AuraKit';
      case 'acceso-lizar': return 'Administrador de Consultorio';
      default: return 'Directorio y comunidad';
    }
  }
  function renderNotFound() {
    VIEW.innerHTML = '<div class="container page"><div class="empty"><span class="emoji">🧭</span><h3>No encontramos esta página</h3>' +
      '<p>El enlace puede estar roto o el contenido fue dado de baja.</p><a class="btn btn-primary" href="#/">Volver al inicio</a></div></div>';
  }

  /* ---------------- Header / menú ---------------- */
  function renderHeader() {
    var el = $('#headerActions');
    var badge = $('#navMessagesBadge');
    if (badge) { var n=unreadTotal(); badge.hidden=!n; badge.textContent=n>99?'99+':String(n); }
    if (!el) return;
    var u = me();
    if (!u) {
      el.innerHTML =
        '<button class="fb-btn fb-btn-ghost fb-btn-sm" data-act="open-login">Ingresar</button>' +
        '<a class="fb-btn fb-btn-primary fb-btn-sm" href="#/registro">Registrarse</a>';
    } else {
      var dest = u.role==='psy'?'#/panel':u.role==='root'?'#/root':u.role==='admin'?'#/panel':'#/cuenta';
      var unread = unreadTotal();
      el.innerHTML =
        '<a class="wb-hdr-icon" href="#/mensajes" title="Mensajes">' +
          '✉️' + (unread?'<span class="wb-hdr-badge">'+unread+'</span>':'') +
        '</a>' +
        '<a class="wb-hdr-av" href="'+dest+'" title="'+esc(u.name||u.email)+'">' +
          (u.avatarUrl?'<img src="'+esc(u.avatarUrl)+'" alt="">':'<div style="background:'+(u.color||'#1877f2')+';width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;font-size:.85rem">'+esc((u.name||'?')[0].toUpperCase())+'</div>') +
        '</a>' +
        '<button class="fb-btn fb-btn-ghost fb-btn-sm" data-act="logout">Salir</button>';
    }
  }

  function toggleMenu() {
    var nav = $('#mainNav'), btn = $('#menuToggle');
    var open = nav.classList.toggle('open');
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeMenu() {
    var nav = $('#mainNav'), btn = $('#menuToggle');
    if (nav) nav.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  /* ---------------- Home ---------------- */
  function renderHome() {
    var u = me();
    var top = ranking().slice(0, u ? 9 : 3);
    var latest = DB.questions.slice()
      .sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);})
      .slice(0, u ? 8 : 0);
    var posts = u
      ? DB.posts.slice().sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);}).slice(0,6)
      : [];

    if (!u) {
      var top = ranking().slice(0, 5);
      VIEW.innerHTML =
        '<div class="wb-guest-page">' +
          '<div class="wb-guest-hero">' +
            '<h1 class="wb-guest-h1">La red de salud mental</h1>' +
            '<p class="wb-guest-sub">Psicólogos, terapeutas y médicos verificados. Consultá, seguí profesionales y participá en la comunidad.</p>' +
            '<form class="wb-guest-search-form" data-form="home-search">' +
              '<div class="wb-guest-search-box">' +
                '<svg class="wb-search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' +
                '<input class="wb-guest-input" name="q" placeholder="Especialidad, nombre o tema…" autocomplete="off">' +
                '<select class="wb-guest-sel" name="specialty">' +
                  '<option value="">Especialidad</option>' +
                  DB.config.specialties.map(function(s){return '<option value="'+esc(s)+'">'+esc(s)+'</option>';}).join('') +
                '</select>' +
                '<button class="wb-guest-search-btn" type="submit">Buscar</button>' +
              '</div>' +
            '</form>' +
          '</div>' +
          '<div class="wb-carousel-section">' +
            '<div class="wb-carousel-head">' +
              '<span class="wb-carousel-title">Profesionales destacados</span>' +
              '<div class="wb-carousel-nav" role="group" aria-label="Navegar profesionales">' +
                '<button class="wb-carousel-btn" data-act="carousel-prev" data-target="proCarousel" aria-label="Anteriores" tabindex="0">&#8249;</button>' +
                '<button class="wb-carousel-btn" data-act="carousel-next" data-target="proCarousel" aria-label="Siguientes" tabindex="0">&#8250;</button>' +
              '</div>' +
            '</div>' +
            '<div class="wb-carousel" id="proCarousel" tabindex="0" aria-label="Lista de profesionales" role="list">' +
              top.map(function(pp){ return '<div role="listitem">' + psyCard(pp, rankOf(pp.id)) + '</div>'; }).join('') +
            '</div>' +
            '<div class="wb-carousel-dots" id="carouselDots" aria-hidden="true"></div>' +
          '</div>' +
          '<div class="wb-guest-bottom">' +
            '<a class="fb-btn fb-btn-primary" href="#/registro">Crear cuenta gratis</a>' +
            '<button class="fb-btn fb-btn-ghost" data-act="open-login">Ya tengo cuenta</button>' +
          '</div>' +
        '</div>';
      // init carousel dots + keyboard after paint
      setTimeout(function() {
        var rail = document.getElementById('proCarousel');
        var dots = document.getElementById('carouselDots');
        if (!rail) return;
        // dots
        var cards = rail.querySelectorAll('[role="listitem"]');
        var visible = Math.round(rail.clientWidth / 232) || 5;
        var pages = Math.ceil(cards.length / visible);
        if (dots) {
          dots.innerHTML = '';
          for (var i=0;i<pages;i++) {
            var d = document.createElement('button');
            d.className = 'wb-carousel-dot'; d.setAttribute('aria-label','Página '+(i+1));
            d.dataset.page = i; d.dataset.visible = visible;
            dots.appendChild(d);
          }
          updateCarouselDots(rail, dots, visible);
        }
        // keyboard
        rail.addEventListener('keydown', function(e) {
          if (e.key==='ArrowRight'||e.key==='ArrowDown') { e.preventDefault(); carouselStep(rail, 1); }
          if (e.key==='ArrowLeft'||e.key==='ArrowUp')  { e.preventDefault(); carouselStep(rail, -1); }
        });
        rail.addEventListener('scroll', function() {
          if (dots) updateCarouselDots(rail, dots, visible);
        }, {passive:true});
        // touch swipe support
        var startX = 0, startY = 0, isDragging = false;
        rail.addEventListener('touchstart', function(e) {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          isDragging = true;
        }, {passive: true});
        rail.addEventListener('touchend', function(e) {
          if (!isDragging) return;
          isDragging = false;
          var endX = e.changedTouches[0].clientX;
          var endY = e.changedTouches[0].clientY;
          var diffX = startX - endX;
          var diffY = Math.abs(startY - endY);
          if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
            carouselStep(rail, diffX > 0 ? 1 : -1);
          }
        }, {passive: true});
      }, 80);
      return;
    }

    // ── LOGGED-IN: Facebook 3-col layout ──
    var allFeed = [];
    posts.forEach(function(pp){ allFeed.push({type:'post',ts:new Date(pp.createdAt).getTime(),data:pp}); });
    latest.forEach(function(q){ allFeed.push({type:'q',ts:new Date(q.createdAt).getTime(),data:q}); });
    allFeed.sort(function(a,b){return b.ts-a.ts;});

    VIEW.innerHTML =
      '<div class="wb-app-page">' +

        // ── left sidebar ──
        '<nav class="wb-left-nav">' +
          '<a class="wb-left-item'+(u.role==='psy'||u.role==='patient'?' wb-active':'')+'" href="#/">' +
            (u.avatarUrl?'<img class="wb-left-av" src="'+esc(u.avatarUrl)+'" alt="">':'<div class="wb-left-av wb-left-av-i" style="background:'+(u.color||'#1877f2')+'">'+esc((u.name||'?')[0].toUpperCase())+'</div>') +
            '<span>'+esc((u.name||'').split(' ')[0])+'</span></a>' +
          '<a class="wb-left-item" href="#/directorio"><svg class="wb-left-svg" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14z"/></svg>Directorio</a>' +
          '<a class="wb-left-item" href="#/comunidad"><svg class="wb-left-svg" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>Comunidad</a>' +
          '<a class="wb-left-item" href="#/publicaciones"><svg class="wb-left-svg" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>Publicaciones</a>' +
          '<a class="wb-left-item" href="#/mensajes"><svg class="wb-left-svg" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>Mensajes</a>' +
          '<a class="wb-left-item" href="#/meritocracia"><svg class="wb-left-svg" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>Ranking</a>' +
          (u.role==='psy'||u.role==='admin'||u.role==='root'
            ? '<div class="wb-left-sep"></div>' +
              '<a class="wb-left-item" href="../lizar/" target="_blank" rel="noopener"><svg class="wb-left-svg" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/></svg>Consultorio</a>' +
              '<a class="wb-left-item" href="../auraserver/" target="_blank" rel="noopener"><svg class="wb-left-svg" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>AuraKit</a>' +
              '<a class="wb-left-item" href="#/oficina"><svg class="wb-left-svg" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>Oficina</a>' +
              '<a class="wb-left-item" href="#/panel"><svg class="wb-left-svg" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>Mi panel</a>'
            : '') +
        '</nav>' +

        // ── main feed ──
        '<main class="wb-feed">' +
          // composer — Facebook-style expandable textarea
          '<div class="wb-composer">' +
            (u.avatarUrl?'<img class="wb-composer-av" src="'+esc(u.avatarUrl)+'" alt="">':'<div class="wb-composer-av wb-composer-av-i" style="background:'+(u.color||'#1877f2')+'">'+esc((u.name||'?')[0].toUpperCase())+'</div>') +
            '<div class="wb-composer-right">' +
              '<textarea class="wb-composer-ta" placeholder="'+(u.role==='psy'||u.role==='admin'||u.role==='root'?'Escribí una publicación…':'Hacé tu consulta aquí…')+'" rows="1" data-act="composer-input"></textarea>' +
              (u.role==='psy'||u.role==='admin'||u.role==='root'
                ? '<div class="wb-composer-attachments">' +
                    '<button class="wb-comp-att" data-act="add-video" title="Agregar video de YouTube"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z"/></svg>Video</button>' +
                    '<button class="wb-comp-att" data-act="add-image" title="Agregar imagen"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>Foto</button>' +
                    '<button class="wb-comp-att" data-act="add-doc" title="Agregar documento"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM9 11h2v2H9zm0 4h2v2H9zm4-4h2v2h-2zm0 4h2v2h-2z"/></svg>Documento</button>' +
                  '</div>'
                : '<div class="wb-composer-attachments">' +
                    '<button class="wb-comp-att" data-act="add-link" title="Agregar enlace"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>Link</button>' +
                  '</div>'
              ) +
              '<div class="wb-composer-submit-row">' +
                '<button class="fb-btn fb-btn-primary fb-btn-sm" data-act="submit-composer">Publicar</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          // feed
          (allFeed.length
            ? allFeed.map(function(item){ return item.type==='post' ? postCardHtml(item.data) : questionCardHtml(item.data); }).join('')
            : '<div class="wb-empty-feed">🌱 Todavía no hay actividad. ¡Empezá haciendo una consulta!</div>') +
        '</main>' +

        // ── right sidebar ──
        '<aside class="wb-right-sidebar">' +
          // mini search
          '<div class="wb-side-widget">' +
            '<span class="wb-side-title">Buscar profesional</span>' +
            '<form data-form="home-search">' +
              '<input class="wb-side-input" name="q" placeholder="Nombre o especialidad…">' +
              '<select class="wb-side-sel" name="specialty"><option value="">Especialidad</option>' +
                DB.config.specialties.slice(0,8).map(function(s){return '<option value="'+esc(s)+'">'+esc(s)+'</option>';}).join('') +
              '</select>' +
              '<button class="fb-btn fb-btn-primary fb-btn-sm" style="width:100%;margin-top:6px" type="submit">Buscar</button>' +
            '</form>' +
          '</div>' +
          // top pros
          '<div class="wb-side-widget">' +
            '<span class="wb-side-title">Profesionales destacados</span>' +
            ranking().slice(0,5).map(function(pp){
              var pu2=userById(pp.userId)||{};
              var photo2=pp.photoUrl||pu2.avatarUrl||'';
              return '<a class="wb-mini-pro" href="#/psicologo/'+pp.id+'">' +
                (photo2?'<img class="wb-mini-av" src="'+esc(photo2)+'" alt="'+esc(pp.name)+'" loading="lazy">':
                  '<div class="wb-mini-av wb-mini-av-i" style="background:'+(pu2.color||'#1877f2')+'">'+esc((pp.name||'?')[0].toUpperCase())+'</div>') +
                '<div><span class="wb-mini-name">'+esc(pp.name)+'</span><span class="wb-mini-sub">'+esc((pp.specialties||[])[0]||'')+'</span></div>' +
              '</a>';
            }).join('') +
            '<a class="wb-side-more" href="#/directorio">Ver directorio →</a>' +
          '</div>' +
          // aura
          '<div class="wb-side-widget wb-aura-widget">' +
            '<span class="wb-side-title">🌿 Aura — apoyo sin conexión</span>' +
            '<p class="wb-side-body">Ejercicios, contención y psicoeducación mientras esperás turno. No reemplaza terapia.</p>' +
            '<a class="fb-btn fb-btn-teal fb-btn-sm" style="width:100%;justify-content:center;display:flex" href="#/aura">Hablar con Aura</a>' +
          '</div>' +
        '</aside>' +

      '</div>';
  }
  function renderFbMiniPsy(p) {
    var pu = userById(p.userId)||{};
    var photo = p.photoUrl||pu.avatarUrl||'';
    return '<a class="wb-mini-pro" href="#/psicologo/'+p.id+'">' +
      (photo?'<img class="wb-mini-av" src="'+esc(photo)+'" alt="'+esc(p.name)+'" loading="lazy">':
        '<div class="wb-mini-av wb-mini-av-i" style="background:'+(pu.color||'#1877f2')+'">'+esc((p.name||'?')[0].toUpperCase())+'</div>') +
      '<div><span class="wb-mini-name">'+esc(p.name)+'</span><span class="wb-mini-sub">'+esc((p.specialties||[])[0]||'')+'</span></div>' +
    '</a>';
  }

  function renderOffice() {
    var tools = [
      { name: 'Word', icon: '📝', desc: 'Escribí y editá documentos de texto, cartas, informes y notas.', url: 'https://ifilex.github.io/WineBOX-Store/webapps/word/', tag: 'Documentos' },
      { name: 'Excel', icon: '📊', desc: 'Planillas, presupuestos, seguimiento de pacientes y cálculos.', url: 'https://ifilex.github.io/WineBOX-Store/webapps/excel/', tag: 'Planillas' },
      { name: 'PowerPoint', icon: '📽️', desc: 'Presentaciones para talleres, charlas y materiales de psicoeducación.', url: 'https://ifilex.github.io/WineBOX-Store/webapps/powerpoint/', tag: 'Presentaciones' },
      { name: 'Editor PDF', icon: '📄', desc: 'Abrí, anotá, firmá y organizá documentos PDF sin instalar Office.', url: 'https://ifilex.github.io/WineBOX-Store/webapps/pdf/', tag: 'PDF' }
    ];
    VIEW.innerHTML =
      '<div class="container page">' +
        '<div class="office-hero">' +
          '<div class="office-folder" aria-hidden="true">📁</div>' +
          '<div><span class="hero-eyebrow">Carpeta ofimática</span><h1>Oficina WineBOX.Clinic</h1>' +
            '<p>Word, Excel, PowerPoint y editor de PDF en el navegador. Herramientas incluidas para que los profesionales puedan escribir, editar y trabajar documentos completos aunque no tengan Microsoft Office instalado.</p>' +
            '<p class="small" style="color:rgba(255,255,255,.65);margin:0">Se abren en una pestaña nueva. Tus archivos se procesan en la herramienta que elijas.</p></div>' +
        '</div>' +
        '<div class="office-grid">' +
          tools.map(function (t) {
            return '<a class="office-card" href="' + t.url + '" target="_blank" rel="noopener">' +
              '<span class="office-icon">' + t.icon + '</span>' +
              '<span class="office-tag">' + esc(t.tag) + '</span>' +
              '<strong>' + esc(t.name) + '</strong>' +
              '<p>' + esc(t.desc) + '</p>' +
              '<span class="office-open">Abrir ' + esc(t.name) + ' →</span>' +
            '</a>';
          }).join('') +
        '</div>' +
        '<div class="panel" style="margin-top:20px"><div class="section-head" style="margin-bottom:0"><div><h2 style="margin:0;font-size:1.05rem">¿Cómo usar la carpeta?</h2>' +
          '<p class="small muted" style="margin:4px 0 0">Elegí una herramienta, creá o abrí tu archivo y descargalo cuando termines. No necesitás cuenta de Microsoft ni instalar nada. Para historia clínica y turnos usá el <a href="../lizar/" target="_blank" rel="noopener">Administrador de Consultorio</a>.</p></div>' +
          '<a class="btn btn-outline btn-sm" href="#/panel">Ir a mi panel</a></div></div>' +
      '</div>';
  }
  function renderUtilities() {
    openModal({
      title: 'Utilidades',
      sub: 'Herramientas y recursos accesibles para todos',
      size: 'narrow',
      body: '<div class="util-folder">' +
        '<div class="util-folder-head">' +
          '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>' +
          '<div><h2>Carpeta de herramientas</h2><p class="sub">Accedé a los recursos de WineBOX desde aquí</p></div>' +
        '</div>' +
        '<div class="util-grid">' +
          '<a class="util-card" href="https://winebox.cloud" target="_blank" rel="noopener">' +
            '<div class="util-card-icon wb">🎮</div>' +
            '<div class="util-card-text"><strong>WineBOX</strong><span>Juegos y estimulación cognitiva. Consolas interactivas para TDAH, TEA y más.</span></div>' +
            '<span class="util-card-arrow">›</span>' +
          '</a>' +
          '<a class="util-card" href="../aura.html" target="_blank" rel="noopener">' +
            '<div class="util-card-icon aura">🌿</div>' +
            '<div class="util-card-text"><strong>Aura</strong><span>Acompañamiento terapéutico y ejercicios de contención. Disponible 24/7, sin conexión.</span></div>' +
            '<span class="util-card-arrow">›</span>' +
          '</a>' +
          '<a class="util-card" href="#/oficina">' +
            '<div class="util-card-icon office">📂</div>' +
            '<div class="util-card-text"><strong>Office</strong><span>Word, Excel, PowerPoint y editor PDF. Herramientas de ofimática en el navegador.</span></div>' +
            '<span class="util-card-arrow">›</span>' +
          '</a>' +
        '</div>' +
      '</div>',
      foot: '<button class="btn btn-outline" data-act="close-utilities">Cerrar</button>'
    });
  }
  function renderExternalTool(name, desc, url) {
    VIEW.innerHTML = '<div class="container page"><div class="lizar-gate">' +
      '<span class="emoji">🛠️</span><h1 style="font-size:1.5rem">' + esc(name) + '</h1>' +
      '<p>' + esc(desc) + '</p>' +
      '<div class="btn-group" style="justify-content:center"><a class="btn btn-primary" href="' + esc(url) + '" target="_blank" rel="noopener">Abrir ' + esc(name) + '</a>' +
        '<a class="btn btn-outline" href="#/panel">Volver al panel</a></div>' +
      '<p class="help-text">Se abre en una pestaña nueva. AuraKit es una aplicación aparte, con su propio compilador y editor de bloques.</p>' +
    '</div></div>';
  }

  function filteredPosts() {
    var list = (DB.posts || []).slice();
    if (feedFilter === 'pros') list = list.filter(function (p) { var a = userById(p.authorId); return a && a.role === 'psy'; });
    else if (feedFilter === 'patients') list = list.filter(function (p) { var a = userById(p.authorId); return a && a.role === 'patient'; });
    else if (feedFilter === 'questions') list = list.filter(function (p) { return !!p.questionId; });
    return list.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  }
  function renderFeedList() {
    var box = $('#feedList');
    if (!box) return;
    var list = filteredPosts();
    box.innerHTML = list.length
      ? list.map(postCardHtml).join('')
      : '<div class="post-card post-empty">Todavía no hay publicaciones con este filtro. <button class="btn btn-outline btn-sm" data-act="feed-filter" data-filter="all">Ver todo</button></div>';
  }
  function ytEmbedUrl(url) {
    if (!url) return '';
    var m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
    return m ? 'https://www.youtube-nocookie.com/embed/' + m[1] : '';
  }
  function isYoutubeUrl(url) { return /youtu/i.test(url||''); }
  function postCardHtml(post) {
    var author = userById(post.authorId);
    if (!author) return '';
    var u = me();
    var psy = author.role==='psy' ? DB.psychs.filter(function(x){return x.userId===author.id;})[0] : null;
    var liked = u && (post.likes||[]).indexOf(u.id)!==-1;
    var canDelete = u && (u.id===author.id||u.role==='root'||u.role==='admin');
    var img = safeUrl(post.imageUrl) && !isYoutubeUrl(post.imageUrl) ? post.imageUrl : '';
    var ytUrl = ytEmbedUrl(post.videoUrl||post.imageUrl||'');
    var linkUrl = post.linkUrl || '';
    var comments = post.comments||[];
    var photo = psy ? (psy.photoUrl||(userById(psy.userId)||{}).avatarUrl||'') : (author.avatarUrl||'');
    return '<article class="fb-post-card" data-post="'+post.id+'">' +
      '<div class="fb-post-head">' +
        (photo
          ? '<img class="fb-post-av" src="'+esc(photo)+'" alt="'+esc(author.name)+'">'
          : '<div class="fb-post-av fb-post-av-i" style="background:'+(author.color||'#1877f2')+'">'+esc((author.name||'?')[0].toUpperCase())+'</div>') +
        '<div class="fb-post-meta">' +
          '<span class="fb-post-author">'+esc(author.name)+(psy&&psy.verified?' <span class="fb-verif">✔</span>':'')+'</span>' +
          '<span class="fb-post-time">'+(psy?esc((psy.specialties||[])[0]||'Psicólogo/a')+' · ':'')+timeAgo(post.createdAt)+'</span>' +
        '</div>' +
        (canDelete?'<button class="fb-post-del" data-act="post-delete" data-id="'+post.id+'" title="Eliminar">✕</button>':'') +
      '</div>' +
      '<p class="fb-post-body">'+esc(post.body)+'</p>' +
      (img?'<div class="fb-post-media"><img src="'+esc(img)+'" alt="" loading="lazy"></div>':'') +
      (ytUrl?'<div class="fb-post-yt"><iframe src="'+ytUrl+'" frameborder="0" allow="accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture" allowfullscreen loading="lazy"></iframe></div>':'') +
      (linkUrl&&!ytUrl?'<a class="fb-post-link" href="'+esc(linkUrl)+'" target="_blank" rel="noopener noreferrer">'+
        '<span class="fb-post-link-ico">🔗</span><span>'+esc(linkUrl.slice(0,60))+(linkUrl.length>60?'…':'')+'</span></a>':'') +
      (post.questionId?'<div class="fb-post-qlink"><a href="#/pregunta/'+post.questionId+'">Ver consulta completa →</a></div>':'') +
      '<div class="fb-post-actions">' +
        '<button class="fb-post-act'+(liked?' fb-post-act-liked':'')+'" data-act="post-like" data-id="'+post.id+'">'+
          (liked?'👍 Me gusta':'👍 Me gusta')+'</button>' +
        '<button class="fb-post-act" data-act="post-comment-focus" data-id="'+post.id+'">💬 Comentar ('+comments.length+')</button>' +
        (u&&u.id!==author.id?'<button class="fb-post-act" data-act="chat-open" data-id="'+author.id+'">✉️ Mensaje</button>':'') +
      '</div>' +
      '<div class="fb-post-comments">' +
        comments.map(function(cm){
          var ca=userById(cm.authorId);
          var canDelC=u&&(u.id===cm.authorId||u.role==='root'||u.role==='admin');
          return '<div class="fb-comment">' +
            (ca&&ca.avatarUrl?'<img class="fb-comment-av" src="'+esc(ca.avatarUrl)+'" alt="">':'<div class="fb-comment-av fb-comment-av-i" style="background:'+(ca&&ca.color||'#1877f2')+'">'+esc(((ca&&ca.name)||'?')[0].toUpperCase())+'</div>') +
            '<div class="fb-comment-bubble"><strong>'+esc((ca&&ca.name)||'Usuario')+'</strong> '+esc(cm.body)+
              (canDelC?' <button class="fb-del-comment" data-act="comment-delete" data-post="'+post.id+'" data-id="'+cm.id+'">×</button>':'')+'</div></div>';
        }).join('') +
        (u?'<form class="fb-comment-form" data-form="comment" data-id="'+post.id+'">' +
            (u.avatarUrl?'<img class="fb-comment-av" src="'+esc(u.avatarUrl)+'" alt="">':'<div class="fb-comment-av fb-comment-av-i" style="background:'+(u.color||'#1877f2')+'">'+esc((u.name||'?')[0].toUpperCase())+'</div>') +
            '<input class="fb-comment-input" name="body" maxlength="500" required placeholder="Escribí un comentario…">' +
          '</form>':'') +
      '</div>' +
    '</article>';
  }

  function psyCard(p, rank) {
    var r = ratingOf(p.id);
    var pts = pointsOf(p.id);
    var pu = userById(p.userId)||{};
    var photo = p.photoUrl||pu.avatarUrl||'';
    var online = isOnline(pu);
    var price = priceFrom(p);
    var u = me();
    var specs = (p.specialties||[]).slice(0,2).join(' · ')||'Psicólogo/a';
    var coverAttr = p.coverUrl ? ' style="background-image:url('+esc(p.coverUrl)+')"' : (photo ? ' style="background-image:url('+esc(photo)+')"' : '');
    return '<div class="wb-psy-card">' +
      // cover strip (thin gradient, or cover photo, or profile photo)
      '<div class="wb-psy-cover"'+coverAttr+'>'+
        (rank&&rank<=3?'<span class="wb-psy-rank">#'+rank+'</span>':'') +
      '</div>' +
      // avatar — always visible
      '<div class="wb-psy-av-row">' +
        '<div class="wb-psy-av-wrap">' +
          (photo
            ? '<img class="wb-psy-av" src="'+esc(photo)+'" alt="'+esc(p.name)+'" loading="lazy">'
            : '<div class="wb-psy-av wb-psy-av-i" style="background:'+(pu.color||'#1877f2')+'">'+esc((p.name||'?')[0].toUpperCase())+'</div>') +
          (online?'<span class="wb-psy-dot"></span>':'') +
        '</div>' +
        (price?'<span class="wb-psy-price">Desde '+fmtMoney(price,p.currency)+'</span>':'') +
      '</div>' +
      // info
      '<div class="wb-psy-info">' +
        '<a class="wb-psy-name" href="#/psicologo/'+p.id+'">'+esc(p.name)+
          (p.verified?' <span class="wb-verif">✔</span>':'')+'</a>' +
        '<p class="wb-psy-spec">'+esc(specs)+'</p>' +
        '<div class="wb-psy-row2">' +
          starsHtml(r.avg)+
          '<span class="wb-psy-rating-val">'+(r.count?r.avg.toFixed(1):'')+' </span>'+
          '<span class="wb-psy-pts">'+pts+' pts</span>'+
          ((p.modalities||[]).includes('online')?'<span class="wb-tag-mod wb-mod-online">Online</span>':'<span class="wb-tag-mod wb-mod-pres">Presencial</span>')+
        '</div>' +
        (p.city?'<p class="wb-psy-city">📍 '+esc(p.city)+'</p>':'') +
      '</div>' +
      '<div class="wb-psy-btns">' +
        '<a class="fb-btn fb-btn-primary fb-btn-sm" href="#/psicologo/'+p.id+'">Ver perfil</a>' +
        (u?'<button class="fb-btn fb-btn-ghost fb-btn-sm" data-act="contact" data-id="'+p.id+'">Escribir</button>':'') +
      '</div>' +
    '</div>';
  }

  function questionCardHtml(q) {
    var answers = q.answers.length;
    var resolved = q.answers.some(function(a){return a.accepted;});
    var author = userById(q.authorId)||{};
    var body = String(q.body||'');
    return '<div class="fb-post-card wb-q-post">' +
      '<div class="fb-post-head">' +
        (author.avatarUrl?'<img class="fb-post-av" src="'+esc(author.avatarUrl)+'" alt="">':'<div class="fb-post-av fb-post-av-i" style="background:'+(author.color||'#1877f2')+'">'+esc((author.name||'?')[0].toUpperCase())+'</div>') +
        '<div class="fb-post-meta">' +
          '<span class="fb-post-author">'+esc(author.name||'Paciente')+'</span>' +
          '<span class="fb-post-time">'+timeAgo(q.createdAt)+'</span>' +
        '</div>' +
        '<span class="fb-post-badge">'+esc(q.category)+'</span>' +
      '</div>' +
      '<a class="fb-post-title" href="#/pregunta/'+q.id+'">'+esc(q.title)+'</a>' +
      '<p class="fb-post-body">'+esc(body.slice(0,200))+(body.length>200?'…':'')+'</p>' +
      '<div class="fb-post-footer">' +
        (resolved
          ? '<span class="fb-post-stat wb-resolved">✔ Resuelta · '+answers+' '+(answers===1?'respuesta':'respuestas')+'</span>'
          : '<span class="fb-post-stat">'+answers+' '+(answers===1?'respuesta':'respuestas')+'</span>') +
        '<a class="fb-post-action" href="#/pregunta/'+q.id+'">Ver '+(answers?'respuestas':'y responder')+' →</a>' +
      '</div>' +
    '</div>';
  }

  /* ---------------- Directorio ---------------- */
  function provinces() {
    var set = {};
    DB.psychs.forEach(function (p) { if (p.province) set[p.province] = 1; });
    return Object.keys(set).sort();
  }
  function filteredPsychs() {
    var q = normalize(dirState.q);
    var list = DB.psychs.slice();
    if (q) {
      list = list.filter(function (p) {
        var hay = normalize([p.name, p.headline, p.bio, p.city, p.province, (p.specialties || []).join(' '), (p.approaches || []).join(' '), (p.degrees || []).map(function (d) { return d.title + ' ' + d.institution; }).join(' ')].join(' '));
        return hay.indexOf(q) !== -1;
      });
    }
    if (dirState.specialty) list = list.filter(function (p) { return (p.specialties || []).indexOf(dirState.specialty) !== -1; });
    if (dirState.modality) list = list.filter(function (p) { return (p.modalities || []).indexOf(dirState.modality) !== -1; });
    if (dirState.province) list = list.filter(function (p) { return p.province === dirState.province; });
    if (dirState.accepting) list = list.filter(function (p) { return p.acceptingNew; });
    if (dirState.maxPrice) {
      var max = Number(dirState.maxPrice);
      list = list.filter(function (p) { var f = priceFrom(p); return !f || f <= max; });
    }
    switch (dirState.sort) {
      case 'rating':
        list.sort(function (a, b) { return ratingOf(b.id).avg - ratingOf(a.id).avg || pointsOf(b.id) - pointsOf(a.id); });
        break;
      case 'price':
        list.sort(function (a, b) { return (priceFrom(a) || Infinity) - (priceFrom(b) || Infinity); });
        break;
      case 'years':
        list.sort(function (a, b) { return b.years - a.years; });
        break;
      case 'recent':
        list.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
        break;
      default:
        list.sort(function (a, b) { return pointsOf(b.id) - pointsOf(a.id) || ratingOf(b.id).avg - ratingOf(a.id).avg; });
    }
    return list;
  }

  function renderDirectory() {
    var u = me();
    var specOpts = DB.config.specialties.map(function (s) {
      return '<option value="'+esc(s)+'"'+(dirState.specialty===s?' selected':'')+'>'+esc(s)+'</option>';
    }).join('');
    var provOpts = provinces().map(function (s) {
      return '<option value="'+esc(s)+'"'+(dirState.province===s?' selected':'')+'>'+esc(s)+'</option>';
    }).join('');
    var prices = [20000,30000,40000,60000,100000];
    var priceOpts = prices.map(function (v) {
      return '<option value="'+v+'"'+(String(dirState.maxPrice)===String(v)?' selected':'')+'>Hasta '+fmtMoney(v,'ARS')+'</option>';
    }).join('');
    VIEW.innerHTML =
      '<div class="wb-dir-page">' +
        '<div class="wb-dir-header">' +
          '<div class="wb-dir-title-row">' +
            '<div><h1 class="wb-dir-h1">Directorio de profesionales</h1>' +
              '<p class="wb-dir-sub">'+DB.psychs.length+' profesionales · ordenados por mérito de la comunidad</p></div>' +
          '</div>' +
          '<div class="wb-dir-filters">' +
            '<div class="wb-dir-search-wrap">' +
              '<svg class="wb-search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' +
              '<input class="wb-dir-q" id="dirQ" data-filter="dir-q" value="'+esc(dirState.q)+'" placeholder="Nombre, especialidad, enfoque, ciudad…">' +
            '</div>' +
            '<select class="wb-dir-sel" id="dirSpec" data-filter="dir-specialty"><option value="">Especialidad</option>'+specOpts+'</select>' +
            '<select class="wb-dir-sel" id="dirMod" data-filter="dir-modality">' +
              '<option value="">Modalidad</option>' +
              '<option value="online"'+(dirState.modality==='online'?' selected':'')+'>Online</option>' +
              '<option value="presencial"'+(dirState.modality==='presencial'?' selected':'')+'>Presencial</option>' +
            '</select>' +
            '<select class="wb-dir-sel" id="dirProv" data-filter="dir-province"><option value="">Provincia</option>'+provOpts+'</select>' +
            '<select class="wb-dir-sel" id="dirPrice" data-filter="dir-price"><option value="">Sin límite</option>'+priceOpts+'</select>' +
            '<select class="wb-dir-sel" id="dirSort" data-filter="dir-sort">' +
              '<option value="points"'+(dirState.sort==='points'?' selected':'')+'>Mérito</option>' +
              '<option value="rating"'+(dirState.sort==='rating'?' selected':'')+'>Mejor valorados</option>' +
              '<option value="price"'+(dirState.sort==='price'?' selected':'')+'>Menor precio</option>' +
              '<option value="years"'+(dirState.sort==='years'?' selected':'')+'>Más experiencia</option>' +
            '</select>' +
            '<label class="wb-dir-check"><input type="checkbox" data-filter="dir-accepting"'+(dirState.accepting?' checked':'')+'>Solo acepta pacientes</label>' +
            '<button class="fb-btn fb-btn-ghost fb-btn-sm" data-act="clear-dir">Limpiar</button>' +
          '</div>' +
        '</div>' +
        '<div class="wb-dir-results-bar"><span id="dirCount">—</span>' +
          '<a class="wb-dir-merit-link" href="#/meritocracia">¿Cómo funciona el puntaje?</a>' +
        '</div>' +
        '<div id="dirResults" class="wb-dir-results"></div>' +
      '</div>';
    renderDirResults();
  }

  function renderDirResults() {
    var list = filteredPsychs();
    var box = $('#dirResults');
    var count = $('#dirCount');
    if (!box) return;
    if (count) count.textContent = list.length + (list.length === 1 ? ' profesional encontrado' : ' profesionales encontrados');
    if (!list.length) {
      box.innerHTML = '<div class="empty"><span class="emoji">🔍</span><h3>No encontramos psicólogos con esos filtros</h3>' +
        '<p>Probá ampliar la zona, subir el precio máximo o quitar la especialidad. También podés preguntar en la comunidad y pedir orientación.</p>' +
        '<button class="btn btn-outline" data-act="clear-dir">Limpiar filtros</button></div>';
      return;
    }
    var ranks = {};
    ranking().forEach(function (p, i) { ranks[p.id] = i + 1; });
    box.innerHTML = '<div class="dir-grid">' + list.map(function (p) { return psyCard(p, ranks[p.id]); }).join('') + '</div>';
  }

  /* ---------------- Perfil profesional ---------------- */
  var WEEK_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  function pad2(n) { return String(n).padStart(2, '0'); }
  function parseDayText(text) {
    var names = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    var t = normalize(text || '');
    var out = [];
    var range = t.match(/(lunes|martes|miercoles|jueves|viernes|sabado|domingo)\s+a\s+(lunes|martes|miercoles|jueves|viernes|sabado|domingo)/);
    if (range) {
      var a = names.indexOf(range[1]), b = names.indexOf(range[2]);
      if (a !== -1 && b !== -1) {
        if (a <= b) for (var i = a; i <= b; i++) out.push(i);
        else { for (var j = a; j < 7; j++) out.push(j); for (var k = 0; k <= b; k++) out.push(k); }
        return out;
      }
    }
    names.forEach(function (n, i) { if (t.indexOf(n) !== -1 && out.indexOf(i) === -1) out.push(i); });
    return out;
  }
  function scheduleFor(p) {
    var base = WEEK_DAYS.map(function (d) { return { day: d, enabled: false, from: '09:00', to: '19:00' }; });
    if (Array.isArray(p.schedule) && p.schedule.length) {
      return base.map(function (b, i) {
        var s = p.schedule[i] || {};
        return { day: b.day, enabled: !!s.enabled, from: /^\d{2}:\d{2}$/.test(s.from) ? s.from : '09:00', to: /^\d{2}:\d{2}$/.test(s.to) ? s.to : '19:00' };
      });
    }
    var any = false;
    (p.availability || []).forEach(function (a) {
      var m = String(a.hours || '').match(/(\d{1,2})[:.](\d{2}).*?(\d{1,2})[:.](\d{2})/);
      var from = m ? pad2(m[1]) + ':' + m[2] : '09:00';
      var to = m ? pad2(m[3]) + ':' + m[4] : '19:00';
      parseDayText(a.days).forEach(function (i) {
        base[i].enabled = true; base[i].from = from; base[i].to = to; any = true;
      });
    });
    if (!any) [0, 1, 2, 3, 4].forEach(function (i) { base[i].enabled = true; });
    return base;
  }
  function scheduleEditorHtml(p) {
    var rows = scheduleFor(p);
    return '<div class="schedule-editor">' +
      rows.map(function (r, i) {
        return '<div class="schedule-row' + (r.enabled ? ' on' : '') + '">' +
          '<label class="checkline"><input type="checkbox" name="day' + i + 'Enabled"' + (r.enabled ? ' checked' : '') + '> ' + r.day + '</label>' +
          '<input class="input" type="time" name="day' + i + 'From" value="' + r.from + '" aria-label="Desde ' + r.day + '">' +
          '<span class="sch-sep">a</span>' +
          '<input class="input" type="time" name="day' + i + 'To" value="' + r.to + '" aria-label="Hasta ' + r.day + '">' +
        '</div>';
      }).join('') +
    '</div>' +
    '<div class="schedule-presets">' +
      '<button class="chip-btn" type="button" data-act="schedule-preset" data-preset="week">Lun a Vie · 9 a 19</button>' +
      '<button class="chip-btn" type="button" data-act="schedule-preset" data-preset="long">Lun a Sáb · 10 a 20</button>' +
      '<button class="chip-btn" type="button" data-act="schedule-preset" data-preset="clear">Borrar horarios</button>' +
    '</div>' +
    '<p class="help-text">Marcá los días que atendés y elegí el horario. Los pacientes verán esta disponibilidad en tu ficha.</p>';
  }
  function publicScheduleHtml(p) {
    var rows = scheduleFor(p).filter(function (r) { return r.enabled; });
    if (!rows.length) return '<p class="muted small">Horarios a convenir.</p>';
    return '<div class="schedule-list">' + rows.map(function (r) {
      return '<div class="schedule-item"><strong>' + esc(r.day) + '</strong><span>' + esc(r.from) + ' – ' + esc(r.to) + '</span></div>';
    }).join('') + '</div>';
  }
  function renderPsychProfile(id) {
    var p = psyById(id);
    if (!p) return renderNotFound();
    var r = ratingOf(p.id);
    var pts = pointsOf(p.id);
    var st = psyStats(p.id);
    var u = me();
    var own = u && u.role === 'psy' && p.userId === u.id;
    var pros = DB.publications.filter(function (x) { return x.psyId === p.id; });
    var socialPosts = DB.posts.filter(function (x) { return x.authorId === p.userId; }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    var myQuestions = DB.questions.filter(function (q) {
      return q.answers.some(function (a) { return a.psyId === p.id; });
    });
    var revs = reviewsOf(p.id).slice().sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    var price = priceFrom(p);
    var mapQuery = p.mapQuery || p.address || p.city;
    var waText = encodeURIComponent('Hola ' + p.name + ', te escribo desde WineBOX.Clinic para consultar por una sesión.');
    var canReview = canReviewPsy(p.id);

    VIEW.innerHTML =
      '<div class="container page">' +
        '<div class="profile-hero">' +
          '<div class="profile-top">' + avatarPsy(p, 'avatar-lg') +
            '<div class="profile-id">' +
              '<h1>' + esc(p.name) + '</h1>' +
              '<p class="headline">' + esc(p.headline || 'Perfil profesional') + '</p>' +
              '<div class="profile-badges">' +
                (p.verified ? '<span class="badge badge-verified">✔ Matrícula verificada</span>' : '<span class="badge badge-gray">◌ Verificación pendiente</span>') +
                '<span class="badge">' + esc(p.license || 'Matrícula no informada') + '</span>' +
                '<span class="badge">' + (p.years || 0) + ' años de experiencia</span>' +
                '<span class="badge">' + (r.count ? '★ ' + r.avg.toFixed(1) + ' · ' + r.count + ' reseñas' : 'Sin reseñas aún') + '</span>' +
              '</div>' +
              '<div class="profile-actions">' +
                (own ? '<a class="btn btn-teal" href="#/panel">Editar mi perfil</a>' : '<button class="btn btn-teal" data-act="contact" data-id="' + p.id + '">Contactar</button>') +
                (!own && u ? '<button class="btn btn-outline" data-act="chat-open" data-id="' + p.userId + '">Mensaje directo</button>' : '') +
                (p.whatsapp ? '<a class="btn btn-wa" href="https://wa.me/' + esc(p.whatsapp) + '?text=' + waText + '" target="_blank" rel="noopener">WhatsApp</a>' : '') +
                '<button class="btn btn-outline" data-act="copy-link">Compartir perfil</button>' +
              '</div>' +
            '</div>' +
            '<div style="text-align:right;min-width:150px">' +
              '<div class="points-pill" style="font-size:.9rem;padding:8px 14px">' + tierBadge(pts) + ' ' + pts + ' pts</div>' +
              '<p class="small" style="color:rgba(255,255,255,.65);margin:8px 0 0">Puesto #' + rankOf(p.id) + ' del ranking</p>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="profile-layout">' +
          '<div class="profile-main">' +

            '<section class="section-card"><h2><span class="ic">👤</span> Sobre mí y cómo trabajo</h2>' +
              '<div class="prose">' + toParagraphs(p.bio || 'Este profesional todavía no completó su presentación.') + '</div>' +
              '<div class="two-col" style="margin-top:18px">' +
                '<div><h3 style="font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)">Especialidades</h3>' +
                  '<div class="tag-list">' + (p.specialties || []).map(function (s) { return '<span class="chip chip-teal">' + esc(s) + '</span>'; }).join('') + '</div></div>' +
                '<div><h3 style="font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)">Enfoques</h3>' +
                  '<div class="tag-list">' + (p.approaches || []).map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('') + '</div></div>' +
              '</div>' +
            '</section>' +

            '<section class="section-card"><h2><span class="ic">🎓</span> Formación y títulos</h2>' +
              ((p.degrees || []).length ? (p.degrees || []).map(function (d) {
                return '<div class="degree"><strong>' + esc(d.title) + '</strong><span>' + esc(d.institution || '') + (d.year ? ' · ' + esc(d.year) : '') + '</span></div>';
              }).join('') : '<p class="muted small">Formación no informada.</p>') +
              ((p.certifications || []).length ? '<h3 style="font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-top:18px">Certificaciones y cursos</h3>' +
                '<ul class="small" style="color:#3b4d60">' + p.certifications.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' : '') +
            '</section>' +

            '<section class="section-card"><h2><span class="ic">💳</span> Servicios y honorarios</h2>' +
              ((p.services || []).length ? p.services.map(function (s) {
                return '<div class="service-row"><div class="s-name">' + esc(s.name) + (s.note ? '<span class="s-note">' + esc(s.note) + '</span>' : '') + '</div>' +
                  '<div class="s-price">' + fmtMoney(s.price, p.currency) + (s.duration ? '<span class="small muted" style="font-weight:400"> · ' + esc(s.duration) + ' min</span>' : '') + '</div></div>';
              }).join('') : '<p class="muted small">Honorarios a convenir. Consultá por el formulario de contacto.</p>') +
              '<p class="help-text">Los valores son orientativos y pueden variar según cobertura y frecuencia. Preguntá siempre antes de la primera sesión.</p>' +
            '</section>' +

            '<section class="section-card"><h2><span class="ic">📅</span> Modalidad, cobertura y disponibilidad</h2>' +
              '<div class="two-col">' +
                '<div><ul class="info-list">' +
                  '<li><span class="k">💻</span><div class="v"><strong>Modalidad</strong><span>' + (p.modalities || []).map(function (m) { return m === 'online' ? 'Online' : 'Presencial'; }).join(' · ') + '</span></div></li>' +
                  '<li><span class="k">📍</span><div class="v"><strong>Ubicación</strong><span>' + esc([p.address, p.city, p.province].filter(Boolean).join(', ')) + '</span></div></li>' +
                  '<li><span class="k">🗣️</span><div class="v"><strong>Idiomas</strong><span>' + esc((p.languages || []).join(', ')) + '</span></div></li>' +
                  '<li><span class="k">⏱️</span><div class="v"><strong>Tiempo de respuesta</strong><span>' + esc(p.responseTime || 'a convenir') + '</span></div></li>' +
                '</ul></div>' +
                '<div><ul class="info-list">' +
                  '<li><span class="k">🏥</span><div class="v"><strong>Coberturas</strong><span>' + esc((p.coverage || ['Particular']).join(', ')) + '</span></div></li>' +
                  '<li><span class="k">💳</span><div class="v"><strong>Formas de pago</strong><span>' + esc((p.paymentMethods || []).join(', ') || 'A convenir') + '</span></div></li>' +
                  '<li><span class="k">🟢</span><div class="v"><strong>Nuevos pacientes</strong><span>' + (p.acceptingNew ? 'Sí, recibe consultas' : 'Por el momento, lista de espera') + '</span></div></li>' +
                  '<li><span class="k">🚨</span><div class="v"><strong>Urgencias</strong><span>No atiende urgencias por este medio. En crisis, llamá al 135 / 911.</span></div></li>' +
                '</ul></div>' +
              '</div>' +
              '<div style="margin-top:16px"><h3 style="font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)">Horarios de atención</h3>' +
                publicScheduleHtml(p) + '</div>' +
            '</section>' +

            (myQuestions.length ? '<section class="section-card"><h2><span class="ic">💬</span> Respuestas en la comunidad</h2>' +
              myQuestions.slice(0, 6).map(function (q) {
                return '<div class="row-item"><div class="grow"><a class="title" href="#/pregunta/' + q.id + '">' + esc(q.title) + '</a>' +
                  '<p class="sub">' + esc(q.category) + ' · ' + timeAgo(q.createdAt) + '</p></div>' +
                  '<span class="badge badge-outline">' + q.answers.filter(function (a) { return a.psyId === p.id; }).length + ' respuesta</span></div>';
              }).join('') + '</section>' : '') +

            (pros.length ? '<section class="section-card"><h2><span class="ic">📚</span> Publicaciones</h2>' +
              pros.map(function (pub) {
                return '<div class="row-item"><div class="grow"><button class="title" style="border:0;background:none;padding:0;text-align:left;cursor:pointer" data-act="open-pub" data-id="' + pub.id + '">' + esc(pub.title) + '</button>' +
                  '<p class="sub">' + (pub.type === 'ebook' ? 'Ebook' : 'Artículo') + ' · ' + esc(pub.category) + ' · ' + fmtDate(pub.createdAt) + '</p></div>' +
                  '<span class="badge badge-teal">' + pub.likes.length + ' ♥</span></div>';
              }).join('') + '</section>' : '') +

            (socialPosts.length ? '<section class="section-card"><h2><span class="ic">✨</span> En el feed</h2>' +
              socialPosts.slice(0, 2).map(postCardHtml).join('') +
              '<p class="help-text">Publicaciones de ' + esc(p.name) + ' en la comunidad.</p></section>' : '') +

            '<section class="section-card"><h2><span class="ic">⭐</span> Reseñas de pacientes <span class="badge">' + r.count + '</span></h2>' +
              (r.count ? '<div class="rating-line" style="margin-bottom:14px">' + starsHtml(r.avg) + '<strong>' + r.avg.toFixed(1) + ' de 5</strong><span>· ' + r.count + ' reseñas verificadas</span></div>' : '<p class="muted small">Todavía no hay reseñas. Las reseñas solo pueden dejarlas pacientes que contactaron y fueron atendidos.</p>') +
              revs.map(function (rev) {
                var pu = userById(rev.patientId);
                return '<div class="review"><div class="review-head">' + avatarUser(pu || { name: 'Paciente', color: '#8494a5' }, 'avatar-sm') +
                  '<span class="name">' + esc(pu ? pu.name : 'Paciente') + '</span>' + starsHtml(rev.rating) +
                  '<span class="date">' + fmtDate(rev.createdAt) + '</span></div><p>' + esc(rev.comment) + '</p></div>';
              }).join('') +
              (canReview ? '<div style="margin-top:16px"><button class="btn btn-outline btn-sm" data-act="review" data-id="' + p.id + '">Dejar mi reseña</button></div>' : '') +
            '</section>' +

          '</div>' +

          '<aside class="profile-aside">' +
            '<div class="section-card">' +
              '<div class="price-line" style="margin-bottom:12px"><strong>' + (price ? fmtMoney(price, p.currency) : 'Consultar') + '</strong>' +
                '<small>' + (price ? 'desde · por sesión' : 'honorarios a convenir') + '</small></div>' +
              '<ul class="info-list">' +
                '<li><span class="k">📌</span><div class="v"><strong>Atiende</strong><span>' + (p.modalities || []).map(function (m) { return m === 'online' ? 'Online' : 'Presencial'; }).join(' y ') + '</span></div></li>' +
                '<li><span class="k">🗺️</span><div class="v"><strong>Zona</strong><span>' + esc(p.city + (p.province ? ', ' + p.province : '')) + '</span></div></li>' +
                '<li><span class="k">🎓</span><div class="v"><strong>Matrícula</strong><span>' + esc(p.license || 'No informada') + '</span></div></li>' +
              '</ul>' +
              '<div style="display:flex;flex-direction:column;gap:8px;margin-top:16px">' +
                (own ? '<a class="btn btn-primary btn-block" href="#/panel">Editar mi perfil</a>' : '<button class="btn btn-primary btn-block" data-act="contact" data-id="' + p.id + '">Enviar consulta</button>') +
                (!own ? '<button class="btn btn-outline btn-block" data-act="chat-open" data-id="' + p.userId + '">Mensaje directo</button>' : '') +
                (p.whatsapp ? '<a class="btn btn-wa btn-block" href="https://wa.me/' + esc(p.whatsapp) + '?text=' + waText + '" target="_blank" rel="noopener">Escribir por WhatsApp</a>' : '') +
                (mapQuery ? '<a class="btn btn-outline btn-block" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(mapQuery) + '" target="_blank" rel="noopener">Ver ubicación</a>' : '') +
                (safeUrl(p.website) ? '<a class="btn btn-outline btn-block" href="' + esc(safeUrl(p.website)) + '" target="_blank" rel="noopener">' + (own ? 'Mi sitio web' : 'Sitio web') + '</a>' : '') +
                (own ? '<a class="btn btn-outline btn-block" href="../lizar/" target="_blank" rel="noopener">Administrador de Consultorio</a>' : '') +
                (own ? '<a class="btn btn-outline btn-block" href="../auraserver/" target="_blank" rel="noopener">AuraKit</a>' : '') +
              '</div>' +
              '<p class="help-text" style="margin-top:12px">Contactar es gratis y no genera ningún compromiso. Los datos de tu consulta son privados: solo los ve el profesional.</p>' +
            '</div>' +
            '<div class="section-card">' +
              '<h2 style="font-size:.95rem"><span class="ic">🛟</span> ¿Necesitás hablar ahora?</h2>' +
              '<p class="small" style="color:var(--muted)">Si estás en crisis o no podés esperar una respuesta, Aura puede acompañarte de inmediato, sin conexión.</p>' +
              '<a class="btn btn-teal btn-block btn-sm" href="#/aura">Hablar con Aura</a>' +
              '<p class="help-text">Aura no reemplaza atención profesional ni servicios de emergencia.</p>' +
            '</div>' +
          '</aside>' +
        '</div>' +
      '</div>';
  }

  /* ---------------- Foro ---------------- */
  function visibleQuestions() {
    var list = DB.questions.slice();
    var q = normalize(forumState.q);
    if (forumState.category) list = list.filter(function (x) { return x.category === forumState.category; });
    if (q) list = list.filter(function (x) {
      return normalize([x.title, x.body, x.category, (x.tags || []).join(' ')].join(' ')).indexOf(q) !== -1;
    });
    if (forumState.status === 'open') list = list.filter(function (x) { return !x.answers.some(function (a) { return a.accepted; }); });
    if (forumState.status === 'answered') list = list.filter(function (x) { return x.answers.length > 0; });
    if (forumState.status === 'unanswered') list = list.filter(function (x) { return x.answers.length === 0; });
    if (forumState.sort === 'answers') list.sort(function (a, b) { return b.answers.length - a.answers.length; });
    else if (forumState.sort === 'views') list.sort(function (a, b) { return b.views - a.views; });
    else list.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    return list;
  }
  function renderForum() {
    var u = me();
    var askBtn = u && u.role === 'patient'
      ? '<button class="btn btn-primary" data-act="ask">Hacer una pregunta</button>'
      : (u && u.role === 'psy'
        ? '<span class="badge badge-plum">Los psicólogos responden; las preguntas las abren los pacientes</span>'
        : '<a class="btn btn-primary" href="#/registro">Crear cuenta para preguntar</a>');
    var cats = ['<button class="chip-btn' + (!forumState.category ? ' active' : '') + '" data-act="forum-cat" data-cat="">Todas</button>']
      .concat(DB.config.categories.map(function (c) {
        return '<button class="chip-btn' + (forumState.category === c ? ' active' : '') + '" data-act="forum-cat" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
      })).join('');

    VIEW.innerHTML =
      '<div class="container page">' +
        '<div class="page-head"><span class="eyebrow">Comunidad</span>' +
          '<h1>Consultas de la comunidad, respondidas por psicólogos</h1>' +
          '<p>Los pacientes abren las preguntas; solo profesionales matriculados responden. Las mejores respuestas suben en el ranking y dan visibilidad a quien ayuda.</p></div>' +
        '<div class="forum-toolbar">' +
          '<div class="chips-scroll">' + cats + '</div>' +
          '<div class="btn-group">' + askBtn + '</div>' +
        '</div>' +
        '<div class="filters" style="padding:14px">' +
          '<div class="filters-row" style="grid-template-columns:1.6fr 1fr 1fr">' +
            '<div class="field search-wrap"><label for="forumQ">Buscar</label>' +
              '<input class="input" id="forumQ" data-filter="forum-q" value="' + esc(forumState.q) + '" placeholder="Palabra clave, tema, etiqueta…"></div>' +
            '<div class="field"><label for="forumStatus">Estado</label>' +
              '<select class="select" id="forumStatus" data-filter="forum-status">' +
                '<option value="all"' + (forumState.status === 'all' ? ' selected' : '') + '>Todas</option>' +
                '<option value="unanswered"' + (forumState.status === 'unanswered' ? ' selected' : '') + '>Sin responder</option>' +
                '<option value="answered"' + (forumState.status === 'answered' ? ' selected' : '') + '>Con respuestas</option>' +
                '<option value="open"' + (forumState.status === 'open' ? ' selected' : '') + '>Sin mejor respuesta</option>' +
              '</select></div>' +
            '<div class="field"><label for="forumSort">Ordenar</label>' +
              '<select class="select" id="forumSort" data-filter="forum-sort">' +
                '<option value="recent"' + (forumState.sort === 'recent' ? ' selected' : '') + '>Más recientes</option>' +
                '<option value="answers"' + (forumState.sort === 'answers' ? ' selected' : '') + '>Más respondidas</option>' +
                '<option value="views"' + (forumState.sort === 'views' ? ' selected' : '') + '>Más vistas</option>' +
              '</select></div>' +
          '</div>' +
        '</div>' +
        '<div class="results-bar"><p id="forumCount">—</p><span class="small muted">Solo psicólogos pueden publicar respuestas</span></div>' +
        '<div class="question-list" id="forumList"></div>' +
        '<div class="panel" style="margin-top:26px">' +
          '<h3 style="margin-top:0">Reglas de la comunidad</h3>' +
          '<div class="grid grid-3">' +
            '<div><strong class="small">Respeto y privacidad</strong><p class="small muted" style="margin:4px 0 0">No compartas datos de terceros ni información que te identifique. Podés usar un seudónimo en tu perfil.</p></div>' +
            '<div><strong class="small">Sin diagnósticos a distancia</strong><p class="small muted" style="margin:4px 0 0">Las respuestas son orientativas. Un diagnóstico requiere evaluación profesional en consulta.</p></div>' +
            '<div><strong class="small">Una respuesta por profesional</strong><p class="small muted" style="margin:4px 0 0">Cada psicólogo puede responder una vez por pregunta. El autor elige la mejor respuesta.</p></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    renderForumList();
  }
  function renderForumList() {
    var list = visibleQuestions();
    var box = $('#forumList'), count = $('#forumCount');
    if (!box) return;
    if (count) count.textContent = list.length + (list.length === 1 ? ' pregunta' : ' preguntas');
    box.innerHTML = list.length
      ? list.map(questionCardHtml).join('')
      : '<div class="empty"><span class="emoji">💬</span><h3>No hay preguntas con esos filtros</h3><p>Probá otra categoría o creá la primera pregunta.</p>' +
        (me() && me().role === 'patient' ? '<button class="btn btn-primary" data-act="ask">Hacer una pregunta</button>' : '<a class="btn btn-primary" href="#/registro">Crear cuenta</a>') + '</div>';
  }

  function renderQuestion(id) {
    var q = DB.questions.filter(function (x) { return x.id === id; })[0];
    if (!q) return renderNotFound();
    if (!viewed[q.id]) {
      viewed[q.id] = true;
      q.views = (Number(q.views) || 0) + 1;
      save();
    }
    var u = me();
    var author = userById(q.authorId);
    var resolved = q.answers.some(function (a) { return a.accepted; });
    var answers = q.answers.slice().sort(function (a, b) {
      if (a.accepted !== b.accepted) return a.accepted ? -1 : 1;
      return b.upvotes.length - a.upvotes.length || new Date(a.createdAt) - new Date(b.createdAt);
    });
    var myP = myPsych();
    var alreadyAnswered = myP && q.answers.some(function (a) { return a.psyId === myP.id; });
    var related = DB.questions.filter(function (x) { return x.category === q.category && x.id !== q.id; }).slice(0, 4);

    var answerFormHtml = '';
    if (u && u.role === 'psy') {
      if (alreadyAnswered) {
        answerFormHtml = '<div class="inbox-note">Ya respondiste esta pregunta. Podés editar tu respuesta desde tu panel profesional.</div>';
      } else {
        answerFormHtml =
          '<div class="section-card answer-form" style="margin-top:18px">' +
            '<h2 style="font-size:1.02rem"><span class="ic">✍️</span> Tu respuesta profesional</h2>' +
            '<form data-form="answer" data-id="' + q.id + '">' +
              '<div class="field"><label for="answerBody">Respuesta</label>' +
                '<textarea class="textarea" id="answerBody" name="body" required minlength="40" placeholder="Respondé con claridad, sin diagnosticar a distancia. Explicá qué harías y cuándo conviene consultar."></textarea>' +
                '<p class="help-text">Se publicará con tu nombre, matrícula y especialidades. Responder suma +10 puntos; si el autor la elige como mejor respuesta, +25 más.</p></div>' +
              '<div class="form-actions"><button class="btn btn-primary" type="submit">Publicar respuesta</button>' +
                '<a class="btn btn-outline" href="#/panel">Ir a mi panel</a></div>' +
            '</form>' +
          '</div>';
      }
    } else if (!u) {
      answerFormHtml = '<div class="section-card" style="margin-top:18px;text-align:center">' +
        '<p class="muted" style="margin:0 0 10px">¿Sos psicólogo/a y querés responder? Ingresá con tu cuenta profesional.</p>' +
        '<button class="btn btn-primary" data-act="open-login">Ingresar como psicólogo</button></div>';
    } else {
      answerFormHtml = '<div class="inbox-note" style="margin-top:18px">Solo los psicólogos matriculados pueden responder en la comunidad. Si sos profesional, <a href="#/registro/psy">creá tu perfil</a>.</div>';
    }

    VIEW.innerHTML =
      '<div class="container page">' +
        '<p class="small" style="margin-bottom:14px"><a href="#/comunidad">Comunidad</a> / ' + esc(q.category) + '</p>' +
        '<div class="question-head">' +
          '<div class="q-meta" style="margin-bottom:8px"><span class="badge badge-outline">' + esc(q.category) + '</span>' +
            (resolved ? '<span class="badge badge-green">✔ Resuelta</span>' : '<span class="badge badge-gray">Abierta</span>') +
            '<span>' + fmtDate(q.createdAt) + '</span><span>·</span><span>' + q.views + ' vistas</span></div>' +
          '<h1>' + esc(q.title) + '</h1>' +
          '<div class="prose">' + toParagraphs(q.body) + '</div>' +
          '<div class="q-author" style="margin-top:12px">' + avatarUser(author || { name: 'Paciente', color: '#8494a5' }, 'avatar-sm') +
            '<span>Pregunta de <strong>' + esc(author ? author.name : 'Paciente') + '</strong></span>' +
            '<span>·</span><span>' + timeAgo(q.createdAt) + '</span>' +
            '<span class="q-meta" style="margin-left:auto">' + (q.tags || []).map(function (t) { return '<span class="chip">#' + esc(t) + '</span>'; }).join('') + '</span>' +
          '</div>' +
          '<div class="btn-group" style="margin-top:14px">' +
            '<button class="btn btn-outline btn-sm" data-act="copy-link">Compartir</button>' +
            '<button class="btn btn-ghost btn-sm" data-act="report" data-type="question" data-id="' + q.id + '">Reportar</button>' +
          '</div>' +
        '</div>' +

        '<div class="profile-layout">' +
          '<div class="profile-main">' +
            '<h2 style="font-size:1.05rem">' + answers.length + (answers.length === 1 ? ' respuesta' : ' respuestas') + '</h2>' +
            (answers.length ? answers.map(function (a) { return answerCardHtml(q, a); }).join('') : '<div class="empty"><span class="emoji">🕊️</span><h3>Todavía nadie respondió</h3><p>Los psicólogos de la comunidad reciben las preguntas nuevas. Mientras esperás, Aura puede acompañarte.</p><a class="btn btn-teal" href="#/aura">Hablar con Aura</a></div>') +
            answerFormHtml +
          '</div>' +

          '<aside class="profile-aside">' +
            '<div class="section-card"><h2 style="font-size:.95rem"><span class="ic">🧭</span> Cómo funciona</h2>' +
              '<ol class="small" style="color:var(--muted);margin:0;padding-left:18px">' +
                '<li>Pacientes registrados abren preguntas.</li>' +
                '<li>Solo psicólogos matriculados responden.</li>' +
                '<li>El autor elige la mejor respuesta (+25 pts).</li>' +
                '<li>Los votos de pacientes también suman (+3 pts).</li>' +
                '<li>Las respuestas no reemplazan una consulta.</li>' +
              '</ol>' +
            '</div>' +
            '<div class="section-card"><h2 style="font-size:.95rem"><span class="ic">🛟</span> Si es urgente</h2>' +
              '<p class="small muted">Esta comunidad no es un servicio de emergencia. Si estás en riesgo, llamá al 135 (CABA), 911 o al número de emergencias de tu país.</p>' +
              '<a class="btn btn-teal btn-sm btn-block" href="#/aura">Abrir Aura</a>' +
            '</div>' +
            (related.length ? '<div class="section-card"><h2 style="font-size:.95rem"><span class="ic">🔗</span> Preguntas relacionadas</h2>' +
              related.map(function (x) {
                return '<div class="row-item"><div class="grow"><a class="title" href="#/pregunta/' + x.id + '">' + esc(x.title) + '</a>' +
                  '<p class="sub">' + x.answers.length + ' respuestas · ' + timeAgo(x.createdAt) + '</p></div></div>';
              }).join('') + '</div>' : '') +
          '</aside>' +
        '</div>' +
      '</div>';
  }

  function answerCardHtml(q, a) {
    var p = psyById(a.psyId);
    var u = me();
    var voted = u && u.role === 'patient' && a.upvotes.indexOf(u.id) !== -1;
    var canVote = u && u.role === 'patient';
    var canAccept = u && q.authorId === u.id && !q.answers.some(function (x) { return x.accepted; });
    var pts = p ? pointsOf(p.id) : 0;
    return '<article class="answer-card' + (a.accepted ? ' accepted' : '') + '">' +
      '<div class="answer-top">' + avatarPsy(p || { name: 'Psicólogo' }) +
        '<div class="who">' +
          (p ? '<a href="#/psicologo/' + p.id + '">' + esc(p.name) + '</a>' : '<strong>Psicólogo</strong>') +
          '<div class="sub">' + esc(p ? (p.license || 'Matrícula no informada') : 'Profesional') + (p ? ' · ' + esc((p.specialties || []).slice(0, 2).join(' · ')) : '') + '</div>' +
          '<div style="margin-top:4px">' + tierBadge(pts) + (a.accepted ? ' <span class="accepted-flag">✔ Mejor respuesta</span>' : '') + '</div>' +
        '</div>' +
        '<span class="small muted">' + timeAgo(a.createdAt) + '</span>' +
      '</div>' +
      '<div class="answer-body">' + toParagraphs(a.body) + '</div>' +
      '<div class="answer-foot">' +
        '<button class="vote-btn ' + (voted ? 'voted' : '') + '" data-act="vote" data-id="' + a.id + '" data-q="' + q.id + '"' + (canVote ? '' : ' title="Ingresá como paciente para votar"') + '>👍 ' + a.upvotes.length + ' útil</button>' +
        (canAccept ? '<button class="btn btn-outline btn-sm" data-act="accept" data-id="' + a.id + '" data-q="' + q.id + '">Elegir como mejor respuesta (+25)</button>' : '') +
        '<button class="btn btn-ghost btn-sm" data-act="report" data-type="answer" data-id="' + a.id + '">Reportar</button>' +
        '<span class="small muted" style="margin-left:auto">' + (a.upvotes.length * 3) + ' pts por votos</span>' +
      '</div>' +
    '</article>';
  }

  /* ---------------- Publicaciones ---------------- */
  function renderPublications() {
    var u = me();
    var cats = ['all'].concat(DB.config.categories);
    VIEW.innerHTML =
      '<div class="container page">' +
        '<div class="page-head"><span class="eyebrow">Biblioteca comunitaria</span>' +
          '<h1>Artículos y ebooks de psicólogos</h1>' +
          '<p>Material clínico escrito por profesionales de la comunidad. Publicar suma puntos y visibilidad; leer es gratis.</p></div>' +
        '<div class="forum-toolbar">' +
          '<div class="chips-scroll">' +
            '<button class="chip-btn' + (pubState.type === 'all' ? ' active' : '') + '" data-act="pub-type" data-type="all">Todo</button>' +
            '<button class="chip-btn' + (pubState.type === 'article' ? ' active' : '') + '" data-act="pub-type" data-type="article">Artículos</button>' +
            '<button class="chip-btn' + (pubState.type === 'ebook' ? ' active' : '') + '" data-act="pub-type" data-type="ebook">Ebooks</button>' +
          '</div>' +
          '<div class="btn-group">' +
            (u && u.role === 'psy' ? '<button class="btn btn-primary" data-act="publish">Publicar</button>' : '') +
          '</div>' +
        '</div>' +
        '<div class="filters" style="padding:14px"><div class="filters-row" style="grid-template-columns:1.6fr 1fr">' +
          '<div class="field search-wrap"><label for="pubQ">Buscar</label><input class="input" id="pubQ" data-filter="pub-q" value="' + esc(pubState.q) + '" placeholder="Título, tema, autor…"></div>' +
          '<div class="field"><label for="pubCat">Categoría</label><select class="select" id="pubCat" data-filter="pub-cat">' +
            cats.map(function (c) { return '<option value="' + esc(c) + '"' + (pubState.category === c ? ' selected' : '') + '>' + (c === 'all' ? 'Todas' : esc(c)) + '</option>'; }).join('') +
          '</select></div>' +
        '</div></div>' +
        '<div class="results-bar"><p id="pubCount">—</p><span class="small muted">Biblioteca integrada con 14 ebooks disponibles para leer directamente</span></div>' +
        '<div class="pub-grid" id="pubGrid"></div>' +
      '</div>';
    renderPubGrid();
  }
  function renderPubGrid() {
    var q = normalize(pubState.q);
    var list = DB.publications.slice().filter(function (p) {
      if (pubState.type !== 'all' && p.type !== pubState.type) return false;
      if (pubState.category !== 'all' && p.category !== pubState.category) return false;
      if (q) {
        var author = psyById(p.psyId);
        return normalize([p.title, p.summary, p.body, p.category, author ? author.name : ''].join(' ')).indexOf(q) !== -1;
      }
      return true;
    });
    list.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    var box = $('#pubGrid'), count = $('#pubCount');
    if (!box) return;
    if (count) count.textContent = list.length + (list.length === 1 ? ' publicación' : ' publicaciones');
    if (!list.length) {
      box.innerHTML = '<div class="empty" style="grid-column:1/-1"><span class="emoji">📚</span><h3>Sin publicaciones con esos filtros</h3><p>Probá con otra categoría o buscá en la biblioteca completa.</p></div>';
      return;
    }
    box.innerHTML = list.map(function (p, i) {
      var author = psyById(p.psyId);
      var liked = me() && p.likes.indexOf(me().id) !== -1;
      return '<article class="pub-card">' +
        '<div class="pub-cover c' + ((i % 6) + 1) + '"><span class="pub-kind">' + (p.type === 'ebook' ? 'Ebook' : 'Artículo') + '</span><span>' + esc(p.title) + '</span></div>' +
        '<div class="pub-body">' +
          '<h3><button style="border:0;background:none;padding:0;text-align:left;font:inherit;cursor:pointer;color:var(--navy)" data-act="open-pub" data-id="' + p.id + '">' + esc(p.title) + '</button></h3>' +
          '<p>' + esc(p.summary || '') + '</p>' +
          '<div class="pub-foot">' +
            '<span class="pub-author">' + avatarPsy(author || { name: 'WineBOX' }, 'avatar-sm') + esc(author ? author.name : 'WineBOX') + '</span>' +
            '<button class="like-btn ' + (liked ? 'liked' : '') + '" data-act="like-pub" data-id="' + p.id + '">♥ ' + p.likes.length + '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }
  function openPublication(id) {
    var p = DB.publications.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var author = psyById(p.psyId);
    var liked = me() && p.likes.indexOf(me().id) !== -1;
    var pubUrl = safeUrl(p.url);
    openModal({
      title: p.title,
      sub: (p.type === 'ebook' ? 'Ebook' : 'Artículo') + ' · ' + p.category + ' · ' + (author ? author.name : 'WineBOX'),
      size: 'wide',
      body: '<div class="prose">' + toParagraphs(p.body) + '</div>' +
        (pubUrl ? '<div style="margin-top:16px"><a class="btn btn-teal" href="' + esc(pubUrl) + '" target="_blank" rel="noopener">Abrir ' + (p.type === 'ebook' ? 'ebook' : 'recurso') + '</a></div>' : '') +
        '<div class="divider"></div>' +
        '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
          '<button class="like-btn ' + (liked ? 'liked' : '') + '" data-act="like-pub" data-id="' + p.id + '">♥ Me gusta · ' + p.likes.length + '</button>' +
          (author ? '<a class="btn btn-outline btn-sm" href="#/psicologo/' + author.id + '">Ver perfil de ' + esc(author.name) + '</a>' : '') +
          '<button class="btn btn-ghost btn-sm" data-act="report" data-type="publication" data-id="' + p.id + '">Reportar</button>' +
        '</div>' +
        '<p class="help-text">Este contenido es orientativo y no reemplaza una consulta profesional.</p>',
      foot: '<button class="btn btn-outline" data-act="close-modal">Cerrar</button>'
    });
  }

  /* ---------------- Mensajes directos ---------------- */
  function renderMessages(partnerId) {
    var u = me();
    if (!u) {
      VIEW.innerHTML = gateHtml('Ingresá para ver tus mensajes', 'Los mensajes directos son privados. Necesitás una cuenta para conversar con psicólogos y con la comunidad.');
      return;
    }
    var partners = conversationPartners();
    var partner = partnerId && partnerId !== u.id ? userById(partnerId) : null;
    if (partner && !partners.some(function (x) { return x.user.id === partner.id; })) {
      partners.unshift({ user: partner, last: lastMessageWith(partner.id), unread: unreadFrom(partner.id), ts: 0 });
    }
    if (partner) markConversationRead(partner.id);
    var listHtml = partners.length
      ? partners.map(function (x) {
          var last = x.last;
          return '<a class="chat-item' + (partner && partner.id === x.user.id ? ' active' : '') + '" href="#/mensajes/' + x.user.id + '">' +
            avatarUser(x.user, 'avatar-sm') +
            '<div class="grow"><div class="nm"><span>' + esc(x.user.name) + '</span><time>' + (last ? timeAgo(last.createdAt) : '') + '</time></div>' +
              '<div class="last">' + (last ? (last.fromId === u.id ? 'Vos: ' : '') + esc(last.body) : 'Empezar una conversación') + '</div>' +
              (x.unread ? '<span class="unread">' + x.unread + '</span>' : '') +
            '</div></a>';
        }).join('')
      : '<div class="chat-empty" style="padding:26px 16px"><span class="emoji">✉️</span><p class="small">Todavía no tenés conversaciones. Buscá un profesional y escribile.</p><a class="btn btn-teal btn-sm" href="#/directorio">Ver directorio</a></div>';

    VIEW.innerHTML =
      '<div class="container page">' +
        '<div class="page-head" style="margin-bottom:16px"><span class="eyebrow">Mensajes</span><h1>Conversaciones</h1>' +
          '<p>Hablar por acá es privado y no reemplaza una consulta de urgencia. Si es una crisis, llamá al 135 o al 911.</p></div>' +
        '<div class="chat-layout' + (partner ? ' mobile-thread' : '') + '">' +
          '<aside class="chat-list-card">' +
            '<div class="chat-list-head"><h2>Tus chats</h2>' +
              '<button class="icon-btn" title="Nuevo mensaje" data-act="new-message">＋</button></div>' +
            '<div class="chat-list">' + listHtml + '</div>' +
          '</aside>' +
          (partner
            ? '<section class="chat-pane">' +
                '<div class="chat-pane-head">' +
                  '<a class="mini-btn" href="#/mensajes" title="Volver a conversaciones" style="display:none" id="chatBack">←</a>' +
                  avatarUser(partner, '') +
                  '<div class="grow"><a class="nm" href="' + (partner.role === 'psy' ? profileHrefForUser(partner) : '#/usuario/' + partner.id) + '">' + esc(partner.name) + '</a>' +
                    '<span class="st">' + (isOnline(partner) ? '<span class="online-label"><span class="dot"></span> En línea</span>' : '<span class="online-label off"><span class="dot"></span> Desconectado/a · puede responder cuando se conecte</span>') + '</span></div>' +
                  '<a class="mini-btn" href="' + (partner.role === 'psy' ? profileHrefForUser(partner) : '#/usuario/' + partner.id) + '">Ver perfil</a>' +
                '</div>' +
                '<div class="chat-pane-body" id="chatBody">' + chatMessagesHtml(partner) + '</div>' +
                '<form class="chat-compose" data-form="chat" data-id="' + partner.id + '">' +
                  '<textarea name="body" rows="1" required maxlength="2000" placeholder="Escribí un mensaje para ' + esc(partner.name.split(' ')[0]) + '…"></textarea>' +
                  '<button class="btn btn-primary" type="submit">Enviar</button>' +
                '</form>' +
                '<div class="chat-safety">Mensajes guardados en este dispositivo. No compartas datos sensibles innecesarios.</div>' +
              '</section>'
            : '<section class="chat-pane"><div class="chat-empty"><span class="emoji">💬</span><h3>Elegí una conversación</h3>' +
                '<p>O empezá una nueva con un profesional. Si está en línea, puede responderte en el momento.</p>' +
                '<div class="btn-group" style="justify-content:center"><button class="btn btn-teal btn-sm" data-act="new-message">Nuevo mensaje</button><a class="btn btn-outline btn-sm" href="#/directorio">Ver psicólogos</a></div>' +
              '</div></section>') +
        '</div>' +
      '</div>';
    var body = $('#chatBody');
    if (body) body.scrollTop = body.scrollHeight;

    var currentUserId = me()?.id;
    if (currentUserId && partner && window.ICQChat) {
      // Escuchar mensajes ICQ en tiempo real
      window.ICQChat.listen(partner.id, function(messages) {
        var chatBody = $('#chatBody');
        if (chatBody) {
          var html = '';
          if (!messages.length) {
            html = '<div class="chat-empty"><span class="emoji">👋</span><p>Este es el comienzo de tu conversación con <strong>' + esc(partner.name) + '</strong>. Escribí abajo para empezar.</p></div>';
          } else {
            var lastDay = '';
            messages.forEach(function(m) {
              var day = fmtDate(m.timestamp);
              if (day !== lastDay) { html += '<div class="chat-day">' + day + '</div>'; lastDay = day; }
              var mine = m.fromId === currentUserId;
              var timeStr = m.timestamp ? new Date(m.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '';
              html += '<div class="bubble-row' + (mine ? ' me' : '') + '">' +
                '<div><div class="bubble">' + esc(m.body) + '</div><div class="bubble-time">' +
                timeStr + (mine ? (m.read ? ' · leído' : ' · enviado') : '') + '</div></div></div>';
            });
          }
          chatBody.innerHTML = html;
          chatBody.scrollTop = chatBody.scrollHeight;
        }
      });
    }
  }

  // Renderizar HTML de mensajes (función auxiliar)
  function renderChatMessages(messages, currentUserId, partnerName) {
    if (!messages || !messages.length) {
      return '<div class="chat-empty"><span class="emoji">👋</span><p>Este es el comienzo de tu conversación con <strong>' + esc(partnerName) + '</strong>. Escribí abajo para empezar.</p></div>';
    }
    var html = '', lastDay = '';
    messages.forEach(function(m) {
      var day = fmtDate(m.createdAt);
      if (day !== lastDay) { html += '<div class="chat-day">' + day + '</div>'; lastDay = day; }
      var mine = m.fromId === currentUserId;
      var timeStr = m.createdAt ? new Date(m.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '';
      html += '<div class="bubble-row' + (mine ? ' me' : '') + '">' +
        '<div><div class="bubble">' + esc(m.body) + '</div><div class="bubble-time">' +
        timeStr + (mine ? (m.readAt ? ' · leído' : ' · enviado') : '') + '</div></div></div>';
    });
    return html;
  }
  function profileHrefForUser(u) {
    if (!u) return '#/';
    if (u.role === 'psy') {
      var p = DB.psychs.filter(function (x) { return x.userId === u.id; })[0];
      if (p) return '#/psicologo/' + p.id;
    }
    return '#/usuario/' + u.id;
  }
  function chatMessagesHtml(partner) {
    var u = me();
    var list = messagesWith(partner.id);
    if (!list.length) {
      return '<div class="chat-empty"><span class="emoji">👋</span><p>Este es el comienzo de tu conversación con <strong>' + esc(partner.name) + '</strong>. Escribí abajo para empezar.</p></div>';
    }
    var html = '', lastDay = '';
    list.forEach(function (m) {
      var day = fmtDate(m.createdAt);
      if (day !== lastDay) { html += '<div class="chat-day">' + day + '</div>'; lastDay = day; }
      var mine = m.fromId === u.id;
      html += '<div class="bubble-row' + (mine ? ' me' : '') + '">' +
        '<div><div class="bubble">' + esc(m.body) + '</div><div class="bubble-time">' + new Date(m.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + (mine ? (m.readAt ? ' · leído' : ' · enviado') : '') + '</div></div></div>';
    });
    return html;
  }
  function openNewMessage() {
    var u = me();
    if (!u) return openLogin('Ingresá para enviar mensajes directos.');
    var candidates = DB.users.filter(function (x) { return x.id !== u.id && !x.blocked && x.role !== 'root'; })
      .sort(function (a, b) { return (isOnline(b) ? 1 : 0) - (isOnline(a) ? 1 : 0) || a.name.localeCompare(b.name); });
    openModal({
      title: 'Nuevo mensaje',
      sub: 'Elegí a quién querés escribirle. Los profesionales en línea aparecen primero.',
      size: 'narrow',
      body: '<form data-form="new-message">' +
        '<div class="field"><label for="newMsgUser">Persona</label><select class="select" id="newMsgUser" name="userId" required>' +
          candidates.map(function (x) {
            return '<option value="' + x.id + '">' + esc(x.name) + ' · ' + esc(roleLabel(x)) + (isOnline(x) ? ' · en línea' : '') + '</option>';
          }).join('') +
        '</select></div>' +
        '<div class="form-actions"><button class="btn btn-primary" type="submit">Abrir chat</button>' +
          '<button class="btn btn-outline" type="button" data-act="close-modal">Cancelar</button></div>' +
      '</form>'
    });
  }

  /* ---------------- Aura Chat Widget Simplificado ---------------- */
  var auraOpen = false;
  var auraMessages = [];

  function initAura() {
    if (window.Aura) {
      auraMessages = window.Aura.getHistory() || [];
    }
  }

  function renderAuraDock() {
    var dock = document.getElementById('chatDock');
    if (!dock) return;

    var route = parseRoute().name;
    if (route === 'aura') {
      dock.innerHTML = '';
      return;
    }

    if (!auraOpen) {
      // Botón flotante simple
      dock.innerHTML = '<button class="aura-btn" id="auraBtn" type="button">' +
        '<span class="aura-icon">🌿</span>' +
        '<span class="aura-label">Aura</span>' +
      '</button>';

      var btn = document.getElementById('auraBtn');
      if (btn) {
        btn.addEventListener('click', function() {
          auraOpen = true;
          renderAuraDock();
        });
      }
    } else {
      // Chat abierto
      renderAuraChat();
    }
  }

  function renderAuraChat() {
    var dock = document.getElementById('chatDock');
    if (!dock) return;

    if (auraMessages.length === 0) {
      auraMessages = [{ type: 'bot', text: '¡Hola! Soy Aura 🌿. ¿En qué puedo ayudarte? Preguntame sobre el directorio, cómo publicar, contactar psicólogos, o hacé el cuestionario de bienestar.' }];
    }

    var msgsHtml = auraMessages.map(function(m) {
      return '<div class="aura-msg ' + m.type + '">' + esc(m.text) + '</div>';
    }).join('');

    dock.innerHTML =
      '<div class="aura-chat">' +
        '<div class="aura-chat-header">' +
          '<span class="aura-chat-title">🌿 Aura</span>' +
          '<button class="aura-chat-close" id="auraCloseBtn" type="button">×</button>' +
        '</div>' +
        '<div class="aura-chat-body" id="auraChatBody">' + msgsHtml + '</div>' +
        '<form class="aura-chat-form" id="auraChatForm">' +
          '<input class="aura-chat-input" name="msg" type="text" placeholder="Escribí tu mensaje..." autocomplete="off">' +
          '<button class="aura-chat-send" type="submit">➤</button>' +
        '</form>' +
      '</div>';

    // Cerrar
    var closeBtn = document.getElementById('auraCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        auraOpen = false;
        renderAuraDock();
      });
    }

    // Enviar
    var form = document.getElementById('auraChatForm');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var input = form.querySelector('.aura-chat-input');
        if (!input || !input.value.trim()) return;
        var text = input.value.trim();
        input.value = '';
        addAuraMsg('user', text);
        if (window.Aura) {
          var response = window.Aura.process(text);
          setTimeout(function() {
            addAuraMsg('bot', response);
          }, 300);
        }
      });
    }

    // Scroll al fondo
    var body = document.getElementById('auraChatBody');
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }

  function addAuraMsg(type, text) {
    auraMessages.push({ type: type, text: text });
    var body = document.getElementById('auraChatBody');
    if (!body) return;
    var div = document.createElement('div');
    div.className = 'aura-msg ' + type;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function handleChatDockSend(form, partnerId) {
    var u = me();
    if (!u) return;
    var partner = userById(partnerId);
    if (!partner) return;
    var body = String(form.elements.body.value || '').trim();
    if (!body) return;

    // Verificar permiso para chatear
    var canChat = false;
    if (window.ChatSystem) {
      canChat = window.ChatSystem.canChat(partner.id, u.id);
    } else {
      if (u.id === 'u-root' || partner.id === 'u-root') canChat = true;
      if (DB.contacts) {
        canChat = DB.contacts.some(function(c) {
          return c.status === 'accepted' &&
                 ((c.psyId === partner.id && c.patientId === u.id) ||
                  (c.psyId === u.id && c.patientId === partner.id));
        });
      }
    }

    if (!canChat) {
      toast('Necesitás tener un contacto aceptado para chatear.', 'warn');
      return;
    }

    // Enviar mensaje ICQ
    if (window.ICQChat) {
      window.ICQChat.send(partner.id, body);
    }

    u.lastSeen = new Date().toISOString();
    u.online = true;
    save();
    renderAuraDock();
    renderHeader();
    setTimeout(function () { var i = $('#chatDock input[name="body"]'); if (i) i.focus(); }, 30);
  }

  function renderUserProfile(id) {
    var user = userById(id);
    if (!user) return renderNotFound();
    if (user.role === 'psy') {
      var psy = DB.psychs.filter(function (p) { return p.userId === user.id; })[0];
      if (psy) return renderPsychProfile(psy.id);
    }
    var u = me();
    var own = u && u.id === user.id;
    var posts = DB.posts.filter(function (p) { return p.authorId === user.id; }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    var questions = DB.questions.filter(function (q) { return q.authorId === user.id; });
    var website = safeUrl(user.website);
    var wa = String(user.whatsapp || '').replace(/[^\d]/g, '');
    VIEW.innerHTML =
      '<div class="container page">' +
        '<div class="user-hero">' +
          '<div class="user-cover"></div>' +
          '<div class="user-hero-body">' + avatarUser(user, 'avatar-lg') +
            '<div class="user-hero-info">' +
              '<div><h1>' + esc(user.name) + '</h1>' +
                '<div class="user-handle">' + '<span class="role-pill ' + esc(user.role) + '">' + esc(roleLabel(user)) + '</span>' +
                  (user.city ? ' · 📍 ' + esc(user.city) : '') + (isOnline(user) ? ' · <span class="online-label"><span class="dot"></span> En línea</span>' : '') + '</div>' +
                (user.headline ? '<p class="user-bio" style="font-weight:600;color:var(--navy)">' + esc(user.headline) + '</p>' : '') +
                (user.bio ? '<p class="user-bio">' + esc(user.bio) + '</p>' : '') +
                '<div class="user-links">' +
                  (website ? '<a href="' + esc(website) + '" target="_blank" rel="noopener">🌐 ' + esc(website.replace(/^https?:\/\//, '')) + '</a>' : '') +
                  (wa ? '<a href="https://wa.me/' + esc(wa) + '" target="_blank" rel="noopener">💬 WhatsApp</a>' : '') +
                  '<span>✍️ ' + posts.length + ' publicaciones</span><span>❓ ' + questions.length + ' preguntas</span>' +
                '</div>' +
              '</div>' +
              '<div class="user-actions">' +
                (own ? '<a class="btn btn-outline btn-sm" href="#/cuenta">Editar mi perfil</a>' : '') +
                (u && !own ? '<button class="btn btn-primary btn-sm" data-act="chat-open" data-id="' + user.id + '">Enviar mensaje</button>' : '') +
                (!u ? '<button class="btn btn-outline btn-sm" data-act="open-login">Ingresar para escribir</button>' : '') +
                '<a class="btn btn-ghost btn-sm" href="#/">← Volver al inicio</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="profile-layout">' +
          '<div class="profile-main">' +
            '<h2 style="font-size:1.05rem">Publicaciones de ' + esc(user.name.split(' ')[0]) + '</h2>' +
            (posts.length ? posts.map(postCardHtml).join('') : '<div class="post-card post-empty">Todavía no publicó nada.</div>') +
          '</div>' +
          '<aside class="profile-aside">' +
            '<div class="section-card"><h2 style="font-size:.95rem">Sobre esta cuenta</h2>' +
              '<ul class="info-list">' +
                '<li><span class="k">🪪</span><div class="v"><strong>Tipo de cuenta</strong><span>' + esc(roleLabel(user)) + '</span></div></li>' +
                '<li><span class="k">📍</span><div class="v"><strong>Ciudad</strong><span>' + esc(user.city || 'No informada') + '</span></div></li>' +
                '<li><span class="k">📅</span><div class="v"><strong>Miembro desde</strong><span>' + fmtDate(user.createdAt) + '</span></div></li>' +
              '</ul>' +
              '<p class="help-text">Los datos de contacto son públicos si la persona los cargó. El email nunca se muestra.</p>' +
            '</div>' +
            '<div class="section-card"><h2 style="font-size:.95rem">¿Necesitás ayuda profesional?</h2>' +
              '<p class="small muted">Encontrá psicólogos verificados por especialidad, precio y modalidad.</p>' +
              '<a class="btn btn-teal btn-sm btn-block" href="#/directorio">Buscar psicólogo</a>' +
            '</div>' +
          '</aside>' +
        '</div>' +
      '</div>';
  }

  function renderMerit() {
    var rank = ranking();
    var rules = DB.config.pointRules.map(function (r) {
      var neg = r.delta < 0;
      return '<tr><td><strong>' + esc(r.label) + '</strong></td><td class="rule-delta' + (neg ? ' neg' : '') + '">' + (r.delta > 0 ? '+' : '') + r.delta + ' pts</td></tr>';
    }).join('');
    VIEW.innerHTML =
      '<div class="container page">' +
        '<div class="merit-hero">' +
          '<h1>La visibilidad se gana ayudando</h1>' +
          '<p>WineBOX.Clinic no vende posiciones. El orden del directorio surge de un sistema de mérito transparente: respuestas útiles, mejores respuestas elegidas por pacientes, publicaciones y reseñas verificadas. Las malas experiencias también pesan.</p>' +
          '<div class="tier-row">' + tiers().map(function (t) { return '<span class="tier" style="--tier-color:' + t.color + '">' + esc(t.name) + ' · desde ' + t.min + ' pts</span>'; }).join('') + '</div>' +
          '<div class="hero-actions" style="margin-top:20px"><a class="btn btn-teal" href="#/registro/psy">Quiero sumarme como psicólogo</a><a class="btn btn-outline" href="#/directorio">Ver directorio</a></div>' +
        '</div>' +

        '<div class="merit-columns">' +
          '<div>' +
            '<div class="panel"><h2 style="margin-top:0">Ranking de profesionales</h2>' +
              '<p class="small muted">Actualizado en tiempo real con la actividad de la comunidad. Los empates se resuelven por calificación promedio.</p>' +
              '<div class="ranking">' + rank.map(function (p, i) {
                var r = ratingOf(p.id), pts = pointsOf(p.id), st = psyStats(p.id);
                return '<div class="rank-row">' +
                  '<div class="rank-num' + (i < 3 ? ' g' + (i + 1) : '') + '">' + (i + 1) + '</div>' +
                  '<div class="rank-main"><a class="name" href="#/psicologo/' + p.id + '">' + esc(p.name) + '</a>' +
                    '<div class="sub">' + esc((p.specialties || []).slice(0, 2).join(' · ')) + ' · ' + esc(p.city) + '</div></div>' +
                  '<div class="rank-metrics">' +
                    '<div><strong>' + pts + '</strong><span>puntos</span></div>' +
                    '<div><strong>' + (r.count ? r.avg.toFixed(1) : '—') + '</strong><span>calificación</span></div>' +
                    '<div><strong>' + st.accepted + '</strong><span>mejores resp.</span></div>' +
                  '</div>' +
                  '<div class="rank-cta">' + tierBadge(pts) + '</div>' +
                '</div>';
              }).join('') + '</div>' +
            '</div>' +
            '<div class="panel" style="margin-top:20px"><h2 style="margin-top:0">Cómo se suman y restan puntos</h2>' +
              '<table class="rules-table"><thead><tr><th>Acción</th><th>Puntos</th></tr></thead><tbody>' + rules + '</tbody></table>' +
              '<p class="help-text">Los puntos son acumulativos y no vencen. Las reseñas solo pueden dejarlas pacientes que contactaron al profesional y fueron aceptados, para evitar ataques coordinados.</p>' +
            '</div>' +
          '</div>' +

          '<aside class="profile-aside">' +
            '<div class="section-card"><h2 style="font-size:.95rem"><span class="ic">🛡️</span> Reglas anti-abuso</h2>' +
              '<ul class="small" style="color:var(--muted);padding-left:18px;margin:0">' +
                '<li>Un voto por paciente y por respuesta.</li>' +
                '<li>Una reseña por paciente y profesional, y solo después de un contacto aceptado.</li>' +
                '<li>Una respuesta por psicólogo en cada pregunta.</li>' +
                '<li>El autor de la pregunta elige una sola mejor respuesta.</li>' +
                '<li>Cuentas duplicadas o coordinadas se suspenden y pierden puntos.</li>' +
                '<li>Los reportes de la comunidad son revisados por el equipo.</li>' +
              '</ul>' +
            '</div>' +
            '<div class="section-card"><h2 style="font-size:.95rem"><span class="ic">📈</span> Qué implica tener más puntos</h2>' +
              '<p class="small muted">Aparecer primero en el directorio, en los destacados de la home y en el ranking. Los niveles (Bronce a Diamante) se muestran en tu ficha y en cada respuesta.</p>' +
              '<a class="btn btn-outline btn-sm btn-block" href="#/directorio">Ver el directorio ordenado</a>' +
            '</div>' +
            '<div class="section-card"><h2 style="font-size:.95rem"><span class="ic">💡</span> ¿Sos paciente?</h2>' +
              '<p class="small muted">Tu rol también cuenta: votá las respuestas que te ayudaron, elegí la mejor y dejá una reseña honesta. Eso hace que el sistema funcione.</p>' +
              '<a class="btn btn-teal btn-sm btn-block" href="#/registro">Crear mi cuenta</a>' +
            '</div>' +
          '</aside>' +
        '</div>' +
      '</div>';
  }

  /* ---------------- Aura - Asistente de Ayuda ---------------- */
  function renderAura() {
    if (!chatLog) {
      chatLog = window.Aura ? window.Aura.getHistory() :
        [{ type: 'bot', text: '¡Hola! Soy Aura, tu asistente de WineBOX.Clinic. Estoy acá para ayudarte a navegar el sitio.' }];
    }
    VIEW.innerHTML =
      '<div class="container page" style="max-width:800px">' +
        '<div class="aura-hero">' +
          '<h1>Aura · Asistente del sitio</h1>' +
          '<p>Tu guía para usar WineBOX.Clinic. Preguntame sobre cualquier sección, cómo publicar, buscar profesionales, descargar ebooks, o cualquier duda funcional.</p>' +
        '</div>' +
        '<div class="chat-card" style="max-width:700px;margin:0 auto">' +
          '<div class="chat-head">' + avatar('Aura', '', '#7c5aa6') +
            '<div class="who"><strong>Aura</strong><span>Asistente de ayuda · 24/7</span></div>' +
          '</div>' +
          '<div class="chat-log" id="chatLog" aria-live="polite"></div>' +
          '<div class="chat-suggest">' +
            '<button data-act="aura-btn" data-q="cómo funciona el directorio">Directorio</button>' +
            '<button data-act="aura-btn" data-q="cómo publicar algo">Publicar</button>' +
            '<button data-act="aura-btn" data-q="cómo contactar un psicólogo">Contactar</button>' +
            '<button data-act="aura-btn" data-q="dónde están los ebooks">Ebooks</button>' +
            '<button data-act="aura-btn" data-q="quiero el cuestionario de bienestar">Bienestar</button>' +
          '</div>' +
          '<form class="chat-form" data-form="chat-aura">' +
            '<input name="msg" autocomplete="off" placeholder="Escribí tu pregunta..." aria-label="Pregunta para Aura">' +
            '<button class="btn btn-primary" type="submit">Enviar</button>' +
          '</form>' +
        '</div>' +
        '<p class="aura-disclaimer" style="text-align:center;margin-top:16px">Aura es un asistente de ayuda y navegación. No reemplaza la atención de un profesional. Si necesitás ayuda urgente, llamá al 135 (CABA) o 911.</p>' +
      '</div>';
    var log = $('#chatLog');
    chatLog.forEach(function (m) {
      var d = document.createElement('div');
      d.className = 'msg ' + (m.type || 'bot');
      d.textContent = m.text;
      if (log) log.appendChild(d);
    });
    if (log) log.scrollTop = log.scrollHeight;
  }

  function addChat(type, text) {
    chatLog.push({ type: type, text: text });
    var log = $('#chatLog');
    if (!log) return;
    var d = document.createElement('div');
    d.className = 'msg ' + (type || 'bot');
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }

  function sendChat(text) {
    text = String(text || '').trim();
    if (!text) return;
    if (!chatLog) chatLog = [];
    addChat('user', text);

    if (window.Aura) {
      var response = window.Aura.process(text);
      setTimeout(function() { addChat('bot', response); }, 400);
    } else {
      setTimeout(function() { addChat('bot', 'Aura está cargando...'); }, 400);
    }
  }

  // Crisis detection (mantener para seguridad)
  var AURA_CRISIS = /suicid|matar|morir|no quiero vivir|autolesi|lastim|desaparec|quitarme la vida|cortarme/i;

  function openBreath() {
    openModal({
      title: 'Respiración 4-7-8',
      sub: 'Cuatro ciclos para bajar la activación. No forces la respiración: si te marea, volvé a tu ritmo.',
      body: '<div class="breath-stage"><div class="breath-circle" id="breathCircle">Inhala</div>' +
        '<p id="breathPhase" class="small muted" style="margin:0;text-align:center">Seguí el círculo. Empezá cuando quieras.</p>' +
        '<div class="btn-group"><button class="btn btn-teal" data-act="breath-start">Comenzar</button>' +
        '<button class="btn btn-outline" data-act="close-modal">Cerrar</button></div></div>',
      foot: null
    });
  }
  function startBreath() {
    clearBreath();
    var circle = document.getElementById('breathCircle');
    if (!circle) return;
    var phases = [
      { t: 'Inhala por la nariz', c: 'inhale', s: 4 },
      { t: 'Sostené el aire', c: '', s: 7 },
      { t: 'Exhalá por la boca', c: 'exhale', s: 8 }
    ];
    var count = 0, total = 12;
    function step() {
      var c = document.getElementById('breathCircle');
      if (!c) return;
      if (count >= total) {
        c.className = 'breath-circle';
        c.textContent = 'Listo. Sentí tu cuerpo.';
        var ph = document.getElementById('breathPhase');
        if (ph) ph.textContent = 'Terminaste los 4 ciclos. Tomate un momento antes de seguir.';
        return;
      }
      var phase = phases[count % 3];
      c.className = 'breath-circle ' + phase.c;
      c.textContent = phase.t + '\n' + phase.s + ' s';
      count++;
      breathTimers.push(setTimeout(step, phase.s * 1000));
    }
    step();
  }
  function clearBreath() {
    breathTimers.forEach(function (t) { clearTimeout(t); });
    breathTimers = [];
  }
  function openGrounding() {
    openModal({
      title: 'Anclaje 5-4-3-2-1',
      sub: 'Para cuando la cabeza se va al futuro o vuelve al pasado.',
      body: '<ol class="small" style="line-height:1.9;padding-left:20px">' +
        '<li><strong>5 cosas que ves.</strong> Nombrálas en voz baja, con detalle: color, forma, textura.</li>' +
        '<li><strong>4 cosas que podés tocar.</strong> La silla, tu ropa, la mesa, el piso.</li>' +
        '<li><strong>3 sonidos.</strong> Cercanos y lejanos.</li>' +
        '<li><strong>2 olores.</strong> Si no hay, recordá dos que te gusten.</li>' +
        '<li><strong>1 sabor.</strong> Un sorbo de agua sirve.</li></ol>' +
        '<p class="small muted">Hacelo lento, sin apuro. Si te cuesta, empezá por uno solo. El objetivo no es distraerte, es volver al presente.</p>',
      foot: '<button class="btn btn-teal" data-act="breath">Respirar con Aura</button><button class="btn btn-outline" data-act="close-modal">Cerrar</button>'
    });
  }
  function openCrisis() {
    openModal({
      title: 'Recursos de crisis',
      sub: 'Si hay riesgo para tu vida o la de otra persona, actuá ahora.',
      body: '<div class="crisis-box"><strong>En Argentina</strong><br>' +
        '• 135 · CABA, las 24 horas<br>• 911 · Emergencias<br>• 0800 345 1435 · Salud Mental Responde (Nación)<br><br>' +
        '<strong>Fuera de Argentina</strong><br>Llamá al número de emergencias local o acudí a la guardia más cercana.</div>' +
        '<p class="small" style="margin-top:14px">No te quedes solo/a: avisale a alguien de confianza. Si podés, alejá de tu alcance objetos que podrían lastimarte. Una crisis es un momento, no una condena; con ayuda se puede atravesar.</p>' +
        '<p class="small muted">Aura no puede contactar servicios de emergencia. Si estás en peligro, llamá vos.</p>',
      foot: '<a class="btn btn-danger" href="tel:135">Llamar al 135</a><a class="btn btn-outline" href="tel:911">Llamar al 911</a>'
    });
  }

  /* ---------------- Cuenta ---------------- */
  function gateHtml(title, text) {
    return '<div class="container page"><div class="empty" style="max-width:560px;margin:30px auto">' +
      '<span class="emoji">🔐</span><h3>' + esc(title) + '</h3><p>' + esc(text) + '</p>' +
      '<div class="btn-group" style="justify-content:center">' +
        '<button class="btn btn-primary" data-act="open-login">Ingresar</button>' +
        '<a class="btn btn-outline" href="#/registro">Crear cuenta</a>' +
      '</div></div></div>';
  }
  function renderAccount() {
    var u = me();
    if (!u) {
      VIEW.innerHTML = gateHtml('Ingresá para ver tu cuenta', 'Desde tu cuenta podés seguir tus preguntas, consultas y reseñas, y descargar una copia de tus datos.');
      return;
    }
    if (u.role === 'psy') return renderPanel();
    if (u.role === 'root') return renderRoot();
    if (u.role === 'admin') return renderAdmin();
    var myQs = DB.questions.filter(function (q) { return q.authorId === u.id; }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    var myContacts = DB.contacts.filter(function (c) { return c.patientId === u.id; }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    var myReviews = DB.reviews.filter(function (r) { return r.patientId === u.id; }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

    VIEW.innerHTML =
      '<div class="container page">' +
        '<div class="page-head"><span class="eyebrow">Mi cuenta</span><h1>Hola, ' + esc(u.name.split(' ')[0]) + '</h1>' +
          '<p>Tu espacio como paciente. Todo lo que hacés acá queda guardado solo en este dispositivo.</p></div>' +
        '<div class="kpi-grid" style="margin-bottom:20px">' +
          '<div class="kpi teal"><strong>' + myQs.length + '</strong><span>preguntas</span></div>' +
          '<div class="kpi"><strong>' + myContacts.length + '</strong><span>consultas</span></div>' +
          '<div class="kpi gold"><strong>' + myReviews.length + '</strong><span>reseñas</span></div>' +
          '<div class="kpi"><strong>' + (DB.psychs.filter(function (p) { return p.verified; }).length) + '</strong><span>psicólogos</span></div>' +
        '</div>' +

        '<div class="panel" style="margin-bottom:18px"><h2 style="margin-top:0">Mi perfil social</h2>' +
          '<p class="small muted">Así te ven en el feed, en tus preguntas y en los mensajes. Podés usar tu nombre o un seudónimo.</p>' +
          '<form data-form="patient-profile">' +
            '<div class="form-grid">' +
              '<div class="field"><label>Nombre o seudónimo</label><input class="input" name="name" value="' + esc(u.name) + '" required></div>' +
              '<div class="field"><label>Ciudad</label><input class="input" name="city" value="' + esc(u.city || '') + '"></div>' +
              '<div class="field span-2"><label>Frase de presentación</label><input class="input" name="headline" value="' + esc(u.headline || '') + '" placeholder="Ej: Diseñadora · aprendiendo a cuidar mi cabeza"></div>' +
              '<div class="field span-2"><label>Sobre mí</label><textarea class="textarea" name="bio" rows="3" maxlength="500" placeholder="Contá lo que quieras compartir. No incluyas datos sensibles.">' + esc(u.bio || '') + '</textarea></div>' +
              '<div class="field"><label>Sitio web</label><input class="input" name="website" value="' + esc(u.website || '') + '" placeholder="https://"></div>' +
              '<div class="field"><label>WhatsApp (contacto directo)</label><input class="input" name="whatsapp" value="' + esc(u.whatsapp || '') + '" placeholder="5491166116631"></div>' +
              '<div class="field span-2"><label>Foto de presentación</label>' +
                '<input class="input" name="avatarUrl" value="' + esc(u.avatarUrl || '') + '" placeholder="https://… o subí una imagen">' +
                '<div style="display:flex;gap:10px;align-items:center;margin-top:7px"><label class="btn btn-outline btn-sm" style="cursor:pointer">Subir imagen<input type="file" accept="image/*" data-image data-target="avatarUrl" hidden></label>' +
                '<img data-preview="avatarUrl" src="' + esc(u.avatarUrl || '') + '" alt="" style="width:52px;height:52px;border-radius:50%;object-fit:cover;' + (u.avatarUrl ? '' : 'display:none') + '"></div>' +
                '<p class="help-text">Se recorta a 256 px y se guarda en este dispositivo.</p></div>' +
              '<div class="field"><label>Email</label><input class="input" value="' + esc(u.email) + '" disabled></div>' +
              '<div class="field"><label>Rol</label><input class="input" value="Paciente" disabled></div>' +
            '</div>' +
            '<div class="form-actions"><button class="btn btn-primary" type="submit">Guardar perfil</button>' +
              '<a class="btn btn-outline" href="#/usuario/' + u.id + '">Ver mi perfil público</a></div>' +
          '</form>' +
        '</div>' +

        '<div class="panel" style="margin-bottom:18px"><div class="section-head" style="margin-bottom:8px"><h2 style="margin:0">Mis preguntas</h2>' +
          '<button class="btn btn-outline btn-sm" data-act="ask">Hacer una pregunta</button></div>' +
          (myQs.length ? myQs.map(function (q) {
            return '<div class="row-item"><div class="grow"><a class="title" href="#/pregunta/' + q.id + '">' + esc(q.title) + '</a>' +
              '<p class="sub">' + esc(q.category) + ' · ' + fmtDate(q.createdAt) + ' · ' + q.answers.length + ' respuestas</p></div>' +
              (q.answers.some(function (a) { return a.accepted; }) ? '<span class="status accepted">Resuelta</span>' : '<span class="status pending">Abierta</span>') + '</div>';
          }).join('') : '<p class="small muted">Todavía no hiciste preguntas. Podés preguntar en la comunidad y recibir respuestas solo de psicólogos.</p>') +
        '</div>' +

        '<div class="panel" style="margin-bottom:18px"><h2 style="margin-top:0">Mis consultas</h2>' +
          (myContacts.length ? myContacts.map(function (c) {
            var p = psyById(c.psyId);
            return '<div class="row-item"><div class="grow"><a class="title" href="#/psicologo/' + c.psyId + '">' + esc(p ? p.name : 'Profesional') + '</a>' +
              '<p class="sub">' + esc(c.subject) + ' · ' + fmtDate(c.createdAt) + '</p></div>' +
              '<span class="status ' + c.status + '">' + ({ pending: 'Pendiente', accepted: 'Aceptada', declined: 'Rechazada', closed: 'Cerrada' }[c.status] || c.status) + '</span>' +
              (c.status === 'accepted' && p ? '<a class="btn btn-outline btn-sm" href="#/psicologo/' + p.id + '">Ver perfil</a>' : '') + '</div>';
          }).join('') : '<p class="small muted">No enviaste consultas todavía. <a href="#/directorio">Buscá un psicólogo</a> y contactalo cuando quieras.</p>') +
        '</div>' +

        '<div class="panel" style="margin-bottom:18px"><h2 style="margin-top:0">Mis reseñas</h2>' +
          (myReviews.length ? myReviews.map(function (rev) {
            var p = psyById(rev.psyId);
            return '<div class="row-item"><div class="grow"><strong class="title">' + esc(p ? p.name : 'Profesional') + ' · ' + starsHtml(rev.rating) + '</strong>' +
              '<p class="sub">' + esc(rev.comment) + ' · ' + fmtDate(rev.createdAt) + '</p></div></div>';
          }).join('') : '<p class="small muted">Solo podés reseñar a un profesional después de que acepte tu consulta. Las reseñas ayudan a otros pacientes y afectan el puntaje.</p>') +
        '</div>' +

        '<div class="panel" style="margin-bottom:18px;background:linear-gradient(135deg,#f4fbf9,#f7f4fd)">' +
          '<h2 style="margin-top:0">¿Necesitás contención ahora?</h2>' +
          '<p class="small" style="color:var(--muted)">Si todavía no te respondieron o estás pasando un momento difícil, Aura puede acompañarte sin conexión. También podés usar la consola de estimulación para regular la activación.</p>' +
          '<div class="btn-group"><a class="btn btn-teal btn-sm" href="#/aura">Hablar con Aura</a>' +
            '<a class="btn btn-outline btn-sm" href="https://winebox.cloud" target="_blank" rel="noopener">Consola de estimulación</a></div>' +
        '</div>' +

        '<div class="panel"><h2 style="margin-top:0">Datos y privacidad</h2>' +
          '<p class="small muted">Esta demostración guarda todo en tu navegador (localStorage). Podés exportar una copia, importarla en otro dispositivo o restablecer los datos de ejemplo.</p>' +
          dataToolsHtml() +
          '<div class="form-actions"><button class="btn btn-ghost btn-sm" data-act="logout">Cerrar sesión</button></div>' +
        '</div>' +
      '</div>';
  }

  function dataToolsHtml() {
    return '<div class="btn-group">' +
      '<button class="btn btn-outline btn-sm" data-act="export">Exportar datos (JSON)</button>' +
      '<button class="btn btn-outline btn-sm" data-act="import">Importar datos</button>' +
      '<button class="btn btn-danger btn-sm" data-act="reset">Restablecer demo</button>' +
      '<input type="file" accept="application/json,.json" data-import hidden>' +
    '</div>';
  }

  /* ---------------- Root / administración total ---------------- */
  var rootState = { q: '', role: 'all' };
  function renderRoot() {
    var u = me();
    if (!u || u.role !== 'root') {
      if (u && u.role !== 'root') {
        VIEW.innerHTML = '<div class="container page"><div class="empty" style="max-width:560px;margin:30px auto"><span class="emoji">🔐</span><h3>Consola exclusiva de root</h3>' +
          '<p>Tu cuenta actual es <strong>' + esc(roleLabel(u)) + '</strong>. Para administrar usuarios necesitás la cuenta root.</p>' +
          '<div class="btn-group" style="justify-content:center"><button class="btn btn-outline" data-act="logout">Cerrar sesión</button><a class="btn btn-primary" href="#/">Volver al inicio</a></div></div></div>';
        return;
      }
      VIEW.innerHTML = '<div class="container page"><div class="root-login">' +
        '<span class="root-tag">🔐 Acceso root</span>' +
        '<h1 style="font-size:1.5rem;margin-bottom:6px">Consola de administración</h1>' +
        '<p class="small muted" style="margin-bottom:16px">Desde acá podés editar, suspender y eliminar usuarios, verificar matrículas y revisar reportes. Esta ruta no está enlazada en la navegación pública.</p>' +
        '<form data-form="root-login">' +
          '<div class="field" style="margin-bottom:10px"><label for="rootEmail">Email root</label><input class="input" id="rootEmail" name="email" type="email" required placeholder="root@winebox.clinic"></div>' +
          '<div class="field" style="margin-bottom:12px"><label for="rootPass">Contraseña</label><input class="input" id="rootPass" name="password" type="password" required autocomplete="current-password" placeholder="••••••••"></div>' +
          '<button class="btn btn-primary btn-block" type="submit">Entrar a la consola</button>' +
        '</form>' +
        '<div class="inbox-note" style="margin-top:12px"><strong>Demo:</strong> <code>root@winebox.clinic</code> · contraseña <code>Root2026!</code><br>Cambiá esta contraseña antes de publicar el sitio.</div>' +
        '<p class="help-text">Solo root puede administrar usuarios. La moderación normal sigue disponible para administración.</p>' +
      '</div></div>';
      return;
    }
    var users = DB.users.slice();
    var stats = {
      users: users.length,
      patients: users.filter(function (x) { return x.role === 'patient'; }).length,
      psychs: users.filter(function (x) { return x.role === 'psy'; }).length,
      online: users.filter(isOnline).length,
      posts: DB.posts.length,
      messages: DB.messages.length
    };
    VIEW.innerHTML =
      '<div class="container page">' +
        '<div class="page-head"><span class="eyebrow">Root · control total</span><h1>Administración de la comunidad</h1>' +
          '<p>Usuarios, matrículas, contenido y datos. Las acciones de borrado son definitivas en este dispositivo.</p></div>' +
        '<div class="kpi-grid" style="margin-bottom:18px">' +
          '<div class="kpi"><strong>' + stats.users + '</strong><span>usuarios</span></div>' +
          '<div class="kpi teal"><strong>' + stats.psychs + '</strong><span>psicólogos</span></div>' +
          '<div class="kpi gold"><strong>' + stats.patients + '</strong><span>pacientes</span></div>' +
          '<div class="kpi"><strong>' + stats.online + '</strong><span>en línea</span></div>' +
        '</div>' +
        '<div class="panel" style="margin-bottom:18px">' +
          '<div class="section-head" style="margin-bottom:0"><div><h2 style="margin:0">Usuarios</h2><p class="small muted" style="margin:3px 0 0">Editá datos, roles, contraseñas y estado de las cuentas.</p></div>' +
            '<button class="btn btn-primary btn-sm" data-act="root-new">Crear usuario</button></div>' +
          '<div class="root-toolbar">' +
            '<div class="field search-wrap" style="flex:1;min-width:220px"><label for="rootQ">Buscar</label><input class="input" id="rootQ" data-filter="root-q" value="' + esc(rootState.q) + '" placeholder="Nombre, email, ciudad…"></div>' +
            '<div class="field"><label for="rootRole">Rol</label><select class="select" id="rootRole" data-filter="root-role">' +
              ['all', 'patient', 'psy', 'admin', 'root'].map(function (r) { return '<option value="' + r + '"' + (rootState.role === r ? ' selected' : '') + '>' + (r === 'all' ? 'Todos' : r) + '</option>'; }).join('') +
            '</select></div>' +
            '<div class="field" style="justify-content:flex-end"><label>&nbsp;</label><button class="btn btn-outline btn-sm" data-act="root-clear">Limpiar</button></div>' +
          '</div>' +
          '<div id="rootUsers">' + rootUsersTableHtml() + '</div>' +
        '</div>' +
        '<div class="panel" style="margin-bottom:18px"><h2 style="margin-top:0">Reportes de la comunidad</h2>' +
          (DB.reports.length ? DB.reports.slice().sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); }).map(function (r) {
            return '<div class="row-item"><div class="grow"><p class="title">' + esc(r.targetType) + ' · ' + esc(r.targetId) + '</p>' +
              '<p class="sub">' + esc(r.reason) + ' · ' + fmtDate(r.createdAt) + '</p></div>' +
              (r.status === 'open' ? '<button class="mini-btn" data-act="resolve-report" data-id="' + r.id + '">Marcar resuelto</button>' : '<span class="status closed">Resuelto</span>') + '</div>';
          }).join('') : '<p class="small muted">Sin reportes.</p>') +
        '</div>' +
        '<div class="panel"><h2 style="margin-top:0">Datos del sistema</h2><p class="small muted">Exportá una copia antes de cambios masivos. Podés importar el JSON en otro dispositivo.</p>' +
          dataToolsHtml() +
          '<div class="form-actions"><button class="btn btn-ghost btn-sm" data-act="logout">Cerrar sesión root</button></div>' +
        '</div>' +
      '</div>';
  }
  function rootUsersTableHtml() {
    var q = normalize(rootState.q);
    var list = DB.users.filter(function (u) {
      if (rootState.role !== 'all' && u.role !== rootState.role) return false;
      if (q && normalize([u.name, u.email, u.city, u.id].join(' ')).indexOf(q) === -1) return false;
      return true;
    }).sort(function (a, b) {
      var order = { root: 0, admin: 1, psy: 2, patient: 3 };
      return (order[a.role] || 9) - (order[b.role] || 9) || a.name.localeCompare(b.name);
    });
    if (!list.length) return '<p class="small muted">No hay usuarios con ese filtro.</p>';
    return '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th>Usuario</th><th>Rol</th><th>Ciudad</th><th>Estado</th><th>Registro</th><th>Acciones</th>' +
      '</tr></thead><tbody>' + list.map(function (u) {
        var psy = DB.psychs.filter(function (p) { return p.userId === u.id; })[0];
        return '<tr>' +
          '<td><div class="u-cell">' + avatarUser(u, 'avatar-sm') +
            '<div><div class="nm">' + esc(u.name) + (u.role === 'root' ? ' <span class="role-pill root">root</span>' : '') + '</div><div class="em">' + esc(u.email) + '</div></div></div></td>' +
          '<td><span class="role-pill ' + esc(u.role) + '">' + esc(roleLabel(u)) + '</span>' + (psy && psy.verified ? ' <span class="badge badge-verified">✓</span>' : '') + '</td>' +
          '<td>' + esc(u.city || '—') + '</td>' +
          '<td>' + (u.blocked ? '<span class="status declined">Suspendido</span>' : '<span class="small"><span class="status-dot' + (isOnline(u) ? '' : ' off') + '"></span>' + (isOnline(u) ? 'En línea' : 'Desconectado') + '</span>') + '</td>' +
          '<td class="small muted">' + fmtDate(u.createdAt) + '</td>' +
          '<td><div class="row-actions">' +
            '<button class="mini-btn" data-act="root-edit" data-id="' + u.id + '">Editar</button>' +
            '<button class="mini-btn" data-act="root-pass" data-id="' + u.id + '">Clave</button>' +
            (psy ? '<button class="mini-btn" data-act="root-verify" data-id="' + u.id + '">' + (psy.verified ? 'Quitar ✓' : 'Verificar') + '</button>' : '') +
            '<button class="mini-btn" data-act="root-block" data-id="' + u.id + '">' + (u.blocked ? 'Reactivar' : 'Suspender') + '</button>' +
            '<button class="mini-btn danger" data-act="root-delete" data-id="' + u.id + '">Eliminar</button>' +
          '</div></td>' +
        '</tr>';
      }).join('') + '</tbody></table></div>';
  }
  function renderRootUsers() {
    var box = $('#rootUsers');
    if (box) box.innerHTML = rootUsersTableHtml();
  }
  function openRootUserForm(id) {
    var u = id ? userById(id) : null;
    var isNew = !u;
    var psy = u ? DB.psychs.filter(function (p) { return p.userId === u.id; })[0] : null;
    openModal({
      title: isNew ? 'Crear usuario' : 'Editar ' + (u ? u.name : 'usuario'),
      sub: isNew ? 'La contraseña inicial se define acá. El usuario puede cambiarla luego.' : 'Los cambios se aplican de inmediato en este dispositivo.',
      size: 'wide',
      body: '<form data-form="root-user" data-id="' + (u ? u.id : '') + '">' +
        '<div class="form-grid">' +
          '<div class="field"><label>Nombre</label><input class="input" name="name" value="' + esc(u ? u.name : '') + '" required></div>' +
          '<div class="field"><label>Email</label><input class="input" type="email" name="email" value="' + esc(u ? u.email : '') + '" required></div>' +
          '<div class="field"><label>Rol</label><select class="select" name="role"' + (u && u.role === 'root' ? ' disabled' : '') + '>' +
            ['patient', 'psy', 'admin'].map(function (r) { return '<option value="' + r + '"' + (u && u.role === r ? ' selected' : '') + '>' + roleLabel({ role: r }) + '</option>'; }).join('') +
            (u && u.role === 'root' ? '<option value="root" selected>Root</option>' : '') +
          '</select></div>' +
          '<div class="field"><label>Ciudad</label><input class="input" name="city" value="' + esc(u ? u.city : '') + '"></div>' +
          '<div class="field span-2"><label>Frase / titular</label><input class="input" name="headline" value="' + esc(u ? u.headline : '') + '"></div>' +
          '<div class="field span-2"><label>Bio</label><textarea class="textarea" name="bio" rows="3">' + esc(u ? u.bio : '') + '</textarea></div>' +
          '<div class="field"><label>Sitio web</label><input class="input" name="website" value="' + esc(u ? u.website : '') + '" placeholder="https://"></div>' +
          '<div class="field"><label>WhatsApp</label><input class="input" name="whatsapp" value="' + esc(u ? u.whatsapp : '') + '" placeholder="5491166116631"></div>' +
          '<div class="field span-2"><label>Imagen de perfil (URL o subir)</label>' +
            '<input class="input" name="avatarUrl" value="' + esc(u ? u.avatarUrl : '') + '" placeholder="https://…">' +
            '<div style="display:flex;gap:10px;align-items:center;margin-top:7px"><label class="btn btn-outline btn-sm" style="cursor:pointer">Subir imagen<input type="file" accept="image/*" data-image data-target="avatarUrl" hidden></label>' +
            '<img data-preview="avatarUrl" src="' + esc(u ? u.avatarUrl : '') + '" alt="" style="width:44px;height:44px;border-radius:50%;object-fit:cover;' + (u && u.avatarUrl ? '' : 'display:none') + '"></div></div>' +
          (isNew ? '<div class="field"><label>Contraseña inicial</label><input class="input" type="password" name="password" minlength="8" required placeholder="Mínimo 8 caracteres"></div>' : '') +
          (psy || (u && u.role === 'psy') ? '<div class="field"><label class="checkline"><input type="checkbox" name="verified"' + (psy && psy.verified ? ' checked' : '') + '> Matrícula verificada</label></div>' : '') +
          '<div class="field"><label class="checkline"><input type="checkbox" name="blocked"' + (u && u.blocked ? ' checked' : '') + '> Cuenta suspendida</label></div>' +
        '</div>' +
        '<div class="form-actions"><button class="btn btn-primary" type="submit">' + (isNew ? 'Crear usuario' : 'Guardar cambios') + '</button>' +
          '<button class="btn btn-outline" type="button" data-act="close-modal">Cancelar</button></div>' +
      '</form>'
    });
  }
  function handleRootUser(form) {
    var actor = me();
    if (!actor || actor.role !== 'root') return formError(form, 'Solo root puede administrar usuarios.');
    var id = form.dataset.id;
    var isNew = !id;
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var role = form.elements.role.value;
    var city = form.elements.city.value.trim();
    var headline = form.elements.headline.value.trim();
    var bio = form.elements.bio.value.trim();
    var website = form.elements.website.value.trim();
    var whatsapp = form.elements.whatsapp.value.trim().replace(/[^\d]/g, '');
    var avatarUrl = form.elements.avatarUrl.value.trim();
    var blocked = !!form.elements.blocked.checked;
    if (avatarUrl && !safeUrl(avatarUrl)) return formError(form, 'La imagen debe ser una URL válida o una imagen subida.');
    if (website && !safeUrl(website)) return formError(form, 'El sitio web debe empezar con https://.');
    if (name.length < 3) return formError(form, 'Ingresá un nombre válido.');
    if (DB.users.some(function (x) { return normalize(x.email) === normalize(email) && x.id !== id; })) return formError(form, 'Ese email ya está en uso.');
    var user = id ? userById(id) : null;
    if (isNew) {
      var pass = form.elements.password.value;
      if (pass.length < 8) return formError(form, 'La contraseña inicial debe tener al menos 8 caracteres.');
      var salt = uid('s');
      user = { id: uid(role === 'psy' ? 'u-psy' : 'u-pat'), role: role, name: name, email: email, city: city, headline: headline, bio: bio, website: website, whatsapp: whatsapp, avatarUrl: avatarUrl, blocked: blocked, color: colorFor(name), salt: salt, passHash: hashPass(pass, salt), createdAt: new Date().toISOString(), online: false, lastSeen: '' };
      DB.users.push(user);
    } else {
      if (!user) return formError(form, 'Usuario no encontrado.');
      user.name = name;
      user.email = email;
      user.city = city;
      user.headline = headline;
      user.bio = bio;
      user.website = website;
      user.whatsapp = whatsapp;
      user.avatarUrl = avatarUrl;
      user.blocked = blocked;
      if (user.role !== 'root') user.role = role;
    }
    var psy = DB.psychs.filter(function (p) { return p.userId === user.id; })[0];
    if (user.role === 'psy' && !psy) {
      psy = {
        id: uid('psy'), userId: user.id, name: user.name, headline: headline, bio: bio,
        specialties: [], approaches: [], modalities: ['online'], city: city, province: '', country: 'Argentina',
        address: '', mapQuery: city, languages: ['Español'], license: '', years: 0, degrees: [], certifications: [],
        services: [], currency: 'ARS', paymentMethods: [], coverage: [], availability: [], whatsapp: whatsapp,
        website: website, acceptingNew: true, verified: !!(form.elements.verified && form.elements.verified.checked),
        responseTime: '1 a 2 días', photoUrl: avatarUrl || '', createdAt: new Date().toISOString()
      };
      DB.psychs.push(psy);
      DB.aurakitProjects.push(auraKitBlank(user.name + ' · AuraKit', psy.id, user));
    } else if (psy) {
      psy.name = user.name;
      psy.city = user.city || psy.city;
      psy.whatsapp = user.whatsapp || psy.whatsapp;
      psy.website = user.website || psy.website;
      psy.photoUrl = avatarUrl || psy.photoUrl;
      if (form.elements.verified) psy.verified = !!form.elements.verified.checked;
      if (user.role !== 'psy') {
        DB.psychs = DB.psychs.filter(function (p) { return p.id !== psy.id; });
        DB.pointEvents = DB.pointEvents.filter(function (e) { return e.psyId !== psy.id; });
        DB.aurakitProjects = DB.aurakitProjects.filter(function (p) { return p.psyId !== psy.id; });
      }
    }
    save();
    closeModal();
    toast(isNew ? 'Usuario creado.' : 'Usuario actualizado.', 'ok');
    renderHeader();
    renderRoot();
  }
  function openRootPassword(id) {
    var u = userById(id);
    if (!u) return;
    openModal({
      title: 'Cambiar contraseña de ' + u.name,
      sub: 'Se aplica de inmediato. Avisale a la persona por un canal seguro.',
      size: 'narrow',
      body: '<form data-form="root-pass" data-id="' + u.id + '">' +
        '<div class="field" style="margin-bottom:10px"><label>Nueva contraseña</label><input class="input" type="password" name="password" minlength="8" required></div>' +
        '<div class="field" style="margin-bottom:12px"><label>Repetir</label><input class="input" type="password" name="password2" minlength="8" required></div>' +
        '<div class="form-actions"><button class="btn btn-primary" type="submit">Cambiar contraseña</button><button class="btn btn-outline" type="button" data-act="close-modal">Cancelar</button></div>' +
      '</form>'
    });
  }
  function handleRootPassword(form) {
    var actor = me();
    if (!actor || actor.role !== 'root') return formError(form, 'Solo root.');
    var u = userById(form.dataset.id);
    if (!u) return formError(form, 'Usuario no encontrado.');
    var p1 = form.elements.password.value, p2 = form.elements.password2.value;
    if (p1.length < 8) return formError(form, 'Mínimo 8 caracteres.');
    if (p1 !== p2) return formError(form, 'Las contraseñas no coinciden.');
    u.salt = uid('s');
    u.passHash = hashPass(p1, u.salt);
    save();
    closeModal();
    toast('Contraseña actualizada.', 'ok');
  }
  function rootToggleBlock(id) {
    var actor = me();
    if (!actor || actor.role !== 'root') return;
    var u = userById(id);
    if (!u || u.role === 'root') return toast('No se puede suspender la cuenta root.', 'warn');
    u.blocked = !u.blocked;
    save();
    toast(u.blocked ? 'Cuenta suspendida.' : 'Cuenta reactivada.', 'ok');
    renderRoot();
  }
  function rootToggleVerify(id) {
    var actor = me();
    if (!actor || actor.role !== 'root') return;
    var psy = DB.psychs.filter(function (p) { return p.userId === id; })[0];
    if (!psy) return;
    psy.verified = !psy.verified;
    save();
    toast(psy.verified ? 'Matrícula verificada.' : 'Verificación retirada.', 'ok');
    renderRoot();
  }
  function deleteUserCascade(id) {
    var actor = me();
    if (!actor || actor.role !== 'root') return;
    var u = userById(id);
    if (!u) return;
    if (u.role === 'root') return toast('La cuenta root no se puede eliminar.', 'warn');
    if (!confirm('¿Eliminar definitivamente a ' + u.name + '? Se borrarán su perfil, publicaciones, respuestas, mensajes y consultas asociadas. Esta acción no se puede deshacer.')) return;
    var psy = DB.psychs.filter(function (p) { return p.userId === id; })[0];
    var psyId = psy ? psy.id : null;
    DB.questions = DB.questions.filter(function (q) { return q.authorId !== id; });
    DB.questions.forEach(function (q) {
      if (psyId) q.answers = q.answers.filter(function (a) { return a.psyId !== psyId; });
      q.status = q.answers.some(function (a) { return a.accepted; }) ? 'answered' : (q.answers.length ? 'answered' : 'open');
    });
    if (psyId) {
      DB.publications = DB.publications.filter(function (p) { return p.psyId !== psyId; });
      DB.reviews = DB.reviews.filter(function (r) { return r.psyId !== psyId; });
      DB.pointEvents = DB.pointEvents.filter(function (e) { return e.psyId !== psyId; });
      DB.aurakitProjects = DB.aurakitProjects.filter(function (p) { return p.psyId !== psyId; });
      DB.appointments = DB.appointments.filter(function (a) { return a.psyId !== psyId; });
    }
    DB.reviews = DB.reviews.filter(function (r) { return r.patientId !== id; });
    DB.contacts = DB.contacts.filter(function (c) { return c.patientId !== id && c.psyId !== psyId; });
    DB.messages = DB.messages.filter(function (m) { return m.fromId !== id && m.toId !== id; });
    DB.posts = DB.posts.filter(function (p) { return p.authorId !== id; });
    DB.posts.forEach(function (p) { p.comments = (p.comments || []).filter(function (c) { return c.authorId !== id; }); });
    DB.appointments = DB.appointments.filter(function (a) { return a.patientId !== id; });
    DB.reports = DB.reports.filter(function (r) { return r.reporterId !== id; });
    DB.users = DB.users.filter(function (x) { return x.id !== id; });
    DB.psychs = DB.psychs.filter(function (p) { return p.userId !== id; });
    if (SESSION && SESSION.userId === id) { SESSION = null; saveSession(); }
    save();
    toast('Usuario eliminado.', 'ok');
    renderRoute();
  }

  /* ---------------- Acceso al Administrador de Consultorio ---------------- */
  function renderLizarGate() {
    var u = me();
    var allowed = u && (u.role === 'psy' || u.role === 'root' || u.role === 'admin');
    if (!u) {
      try { sessionStorage.setItem('winebox_after_login', '../lizar/'); } catch (e) {}
    }
    VIEW.innerHTML = '<div class="container page"><div class="lizar-gate">' +
      '<span class="emoji">🗂️</span>' +
      '<h1 style="font-size:1.5rem">Administrador de Consultorio</h1>' +
      (allowed
        ? '<p>Tu cuenta está habilitada. Acá gestionás pacientes, turnos, evaluaciones, historia clínica y finanzas. Es de uso exclusivo de profesionales matriculados.</p>' +
          '<div class="btn-group" style="justify-content:center"><a class="btn btn-primary" href="../lizar/">Abrir Administrador de Consultorio</a><a class="btn btn-outline" href="#/panel">Volver al panel</a></div>'
        : u
          ? '<p>Estás con una cuenta de <strong>' + esc(roleLabel(u)) + '</strong>. El Administrador de Consultorio está reservado a psicólogos, administración y root: contiene datos clínicos y herramientas de gestión que no corresponden a una cuenta de paciente.</p>' +
            '<div class="btn-group" style="justify-content:center"><button class="btn btn-outline" data-act="logout">Cerrar sesión y entrar como profesional</button><a class="btn btn-primary" href="#/">Volver al directorio</a></div>' +
            '<p class="help-text">Si sos profesional, iniciá sesión con tu cuenta de psicólogo. Si sos paciente, tu espacio es el directorio, la comunidad, los mensajes y Aura.</p>'
          : '<p>Para abrir el Administrador de Consultorio necesitás iniciar sesión con una cuenta de psicólogo verificada. Si todavía no tenés cuenta profesional, podés crear tu perfil.</p>' +
            '<div class="btn-group" style="justify-content:center"><button class="btn btn-primary" data-act="open-login">Ingresar como profesional</button><a class="btn btn-outline" href="#/registro/psy">Crear perfil profesional</a></div>') +
      '<div class="inbox-note" style="margin-top:16px;text-align:left"><strong>Privacidad:</strong> esta herramienta contiene información clínica sensible. No compartas tu sesión ni accedas desde dispositivos públicos. Los pacientes no tienen acceso.</div>' +
    '</div></div>';
  }
  function consumeAfterLogin() {
    var next = '';
    try { next = sessionStorage.getItem('winebox_after_login') || ''; sessionStorage.removeItem('winebox_after_login'); } catch (e) {}
    return next;
  }

  function renderRegister(role) {
    regRole = role === 'psy' || role === 'psicologo' ? 'psy' : 'patient';
    var isPsy = regRole === 'psy';
    VIEW.innerHTML =
      '<div class="container page" style="max-width:860px">' +
        '<div class="page-head"><span class="eyebrow">Crear cuenta</span><h1>' + (isPsy ? 'Sumá tu perfil profesional' : 'Creá tu cuenta de paciente') + '</h1>' +
          '<p>' + (isPsy
            ? 'Publicá tu perfil en el directorio, respondé preguntas y sumá puntos por mérito. La verificación de matrícula es manual y gratuita.'
            : 'Registrarte es gratis y es lo único que necesitás para contactar psicólogos y hacer preguntas en la comunidad.') + '</p></div>' +
        '<div class="btn-group" style="margin-bottom:18px">' +
          '<button class="btn ' + (!isPsy ? 'btn-primary' : 'btn-outline') + '" data-act="reg-tab" data-role="patient">Soy paciente</button>' +
          '<button class="btn ' + (isPsy ? 'btn-primary' : 'btn-outline') + '" data-act="reg-tab" data-role="psy">Soy psicólogo/a</button>' +
        '</div>' +
        '<div class="panel">' +
          '<form data-form="register" data-role="' + regRole + '">' +
            '<div class="form-grid">' +
              '<div class="field"><label for="regName">Nombre y apellido *</label><input class="input" id="regName" name="name" required minlength="3" placeholder="' + (isPsy ? 'Lic. Nombre Apellido' : 'Tu nombre') + '"></div>' +
              '<div class="field"><label for="regEmail">Email *</label><input class="input" id="regEmail" name="email" type="email" required placeholder="tu@email.com"></div>' +
              '<div class="field"><label for="regCity">Ciudad</label><input class="input" id="regCity" name="city" placeholder="CABA, Rosario, Córdoba…"></div>' +
              (isPsy ? '<div class="field"><label for="regLicense">Matrícula *</label><input class="input" id="regLicense" name="license" required placeholder="MN 12345 · MP 67890"></div>' : '') +
              '<div class="field"><label for="regPass">Contraseña *</label><input class="input" id="regPass" name="password" type="password" required minlength="8" autocomplete="new-password" placeholder="Mínimo 8 caracteres"></div>' +
              '<div class="field"><label for="regPass2">Repetir contraseña *</label><input class="input" id="regPass2" name="password2" type="password" required minlength="8" autocomplete="new-password"></div>' +
            '</div>' +
            (isPsy ? '<div class="inbox-note">Al crear el perfil vas a poder completar tu presentación, especialidades, formación, honorarios y modalidad. Hasta que el equipo verifique tu matrícula, tu perfil mostrará "verificación pendiente".</div>' : '<div class="inbox-note">Como paciente podés usar un seudónimo si preferís. Tu email no se muestra públicamente.</div>') +
            '<label class="checkline" style="margin-top:14px"><input type="checkbox" name="terms" required> Acepto las normas de la comunidad y el tratamiento de mis datos en este dispositivo.</label>' +
            '<div class="form-actions"><button class="btn btn-primary btn-lg" type="submit">' + (isPsy ? 'Crear perfil profesional' : 'Crear mi cuenta') + '</button>' +
              '<a class="btn btn-outline" href="#/">Cancelar</a></div>' +
          '</form>' +
          '<p class="help-text">¿Ya tenés cuenta? <button class="btn btn-ghost btn-sm" data-act="open-login">Ingresar</button></p>' +
        '</div>' +
        (isPsy ? '<div class="panel" style="margin-top:18px"><h3 style="margin-top:0">Qué vas a poder hacer</h3><div class="grid grid-3">' +
          '<div><strong class="small">Mostrar tu trabajo</strong><p class="small muted" style="margin:4px 0 0">Especialidades, títulos, años, honorarios, modalidad y disponibilidad.</p></div>' +
          '<div><strong class="small">Responder y sumar</strong><p class="small muted" style="margin:4px 0 0">Cada respuesta suma 10 puntos; si la eligen como mejor, 25 más.</p></div>' +
          '<div><strong class="small">Publicar</strong><p class="small muted" style="margin:4px 0 0">Artículos (+20) y ebooks (+40) que aumentan tu visibilidad.</p></div>' +
        '</div></div>' : '') +
      '</div>';
  }

  /* ---------------- Panel profesional / admin ---------------- */
  function renderPanel() {
    var u = me();
    if (!u) return (VIEW.innerHTML = gateHtml('Ingresá a tu panel profesional', 'Desde acá gestionás tu perfil, tus respuestas, tus publicaciones y tus consultas.'));
    if (u.role === 'root') return renderRoot();
    if (u.role === 'admin') return renderAdmin();
    if (u.role === 'patient') {
      VIEW.innerHTML = '<div class="container page"><div class="empty"><span class="emoji">🧑‍⚕️</span><h3>Tu cuenta es de paciente</h3>' +
        '<p>Para tener un perfil profesional necesitás crear una cuenta de psicólogo con tu matrícula.</p>' +
        '<div class="btn-group" style="justify-content:center"><a class="btn btn-primary" href="#/registro/psy">Crear perfil profesional</a><a class="btn btn-outline" href="#/cuenta">Ir a mi cuenta</a></div></div></div>';
      return;
    }
    var p = myPsych();
    if (!p) {
      VIEW.innerHTML = '<div class="container page"><div class="empty"><span class="emoji">⚠️</span><h3>No encontramos tu perfil profesional</h3><p>Puede haberse dañado el almacenamiento local. Restablecé los datos demo o volvé a registrarte.</p><a class="btn btn-primary" href="#/registro/psy">Crear perfil</a></div></div>';
      return;
    }
    var st = psyStats(p.id), r = ratingOf(p.id), pts = st.points, tier = tierOf(pts), next = nextTierOf(pts);
    var completion = profileCompletion(p);
    var pending = DB.contacts.filter(function (c) { return c.psyId === p.id && c.status === 'pending'; }).length;
    var tabs = [
      ['resumen', 'Resumen'], ['perfil', 'Mi perfil'], ['preguntas', 'Comunidad'],
      ['publicaciones', 'Publicaciones'], ['consultas', 'Consultas' + (pending ? ' (' + pending + ')' : '')],
      ['resenas', 'Reseñas'], ['puntos', 'Mis puntos'], ['datos', 'Datos']
    ];

    var body = '';
    if (panelTab === 'perfil') body = panelProfileHtml(p, completion);
    else if (panelTab === 'preguntas') body = panelQuestionsHtml(p);
    else if (panelTab === 'publicaciones') body = panelPubsHtml(p);
    else if (panelTab === 'consultas') body = panelContactsHtml(p);
    else if (panelTab === 'resenas') body = panelReviewsHtml(p);
    else if (panelTab === 'puntos') body = panelPointsHtml(p);
    else if (panelTab === 'datos') body = panelDataHtml(p);
    else body = panelSummaryHtml(p, st, r, pts, tier, next, completion, pending);

    VIEW.innerHTML =
      '<div class="container page">' +
        '<div class="page-head" style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:flex-end">' +
          '<div><span class="eyebrow">Panel profesional</span><h1>' + esc(p.name) + '</h1>' +
            '<p>Puesto #' + rankOf(p.id) + ' del ranking · ' + tierBadge(pts) + ' · ' + pts + ' puntos</p></div>' +
          '<div class="btn-group"><a class="btn btn-outline btn-sm" href="#/psicologo/' + p.id + '">Ver mi perfil público</a>' +
            '<a class="btn btn-outline btn-sm" href="../lizar/" target="_blank" rel="noopener">Administrador de Consultorio</a></div>' +
        '</div>' +
        (!p.verified ? '<div class="verify-banner" style="margin-bottom:18px">⚠️ <div><strong>Verificación pendiente.</strong> Tu perfil ya es visible, pero la matrícula todavía no fue validada por el equipo. Mientras tanto, el badge de verificación no aparece y perdés prioridad frente a perfiles verificados. Escribinos a hola@winebox.clinic con tu matrícula.</div></div>' : '') +
        '<div class="quick-grid" style="margin-bottom:18px">' +
          '<a class="quick-tile" href="../lizar/" target="_blank" rel="noopener"><span class="qt-ico">🗂️</span><span><strong>Administrador de Consultorio</strong><small>Pacientes, turnos, historia clínica y finanzas</small></span></a>' +
          '<a class="quick-tile" href="../auraserver/" target="_blank" rel="noopener"><span class="qt-ico">🛠️</span><span><strong>AuraKit</strong><small>Tu web, tienda, turnos y app</small></span></a>' +
          '<a class="quick-tile" href="#/oficina"><span class="qt-ico">📁</span><span><strong>Oficina</strong><small>Word, Excel, PowerPoint y PDF</small></span></a>' +
          '<a class="quick-tile" href="#/mensajes"><span class="qt-ico">💬</span><span><strong>Mensajes</strong><small>Chat en línea con pacientes</small></span></a>' +
          '<a class="quick-tile" href="#/comunidad"><span class="qt-ico">🗣️</span><span><strong>Comunidad</strong><small>Consultas para responder</small></span></a>' +
          '<a class="quick-tile" href="#/psicologo/' + p.id + '"><span class="qt-ico">👤</span><span><strong>Mi ficha pública</strong><small>Así te ven los pacientes</small></span></a>' +
        '</div>' +
        '<div class="dash-grid">' +
          '<nav class="dash-nav" aria-label="Secciones del panel">' +
            tabs.map(function (t) {
              return '<button data-act="panel-tab" data-tab="' + t[0] + '" class="' + (panelTab === t[0] ? 'active' : '') + '">' + esc(t[1]) + '</button>';
            }).join('') +
          '</nav>' +
          '<div class="dash-body">' + body + '</div>' +
        '</div>' +
      '</div>';
  }

  function panelSummaryHtml(p, st, r, pts, tier, next, completion, pending) {
    var progressToNext = next ? Math.max(0, Math.min(100, Math.round(((pts - tier.min) / (next.min - tier.min)) * 100))) : 100;
    return '<div class="kpi-grid">' +
        '<div class="kpi teal"><strong>' + pts + '</strong><span>puntos</span></div>' +
        '<div class="kpi gold"><strong>' + (r.count ? r.avg.toFixed(1) : '—') + '</strong><span>calificación</span></div>' +
        '<div class="kpi"><strong>' + st.answers + '</strong><span>respuestas</span></div>' +
        '<div class="kpi"><strong>' + pending + '</strong><span>consultas nuevas</span></div>' +
      '</div>' +
      '<div class="panel"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">' +
        '<h2 style="margin:0">Nivel ' + esc(tier.name) + '</h2>' +
        '<span class="small muted">' + (next ? 'Faltan ' + (next.min - pts) + ' pts para ' + esc(next.name) : 'Nivel máximo alcanzado') + '</span></div>' +
        '<div class="progress"><span style="width:' + progressToNext + '%"></span></div>' +
        '<p class="help-text">El nivel se muestra en tu ficha y en cada respuesta. Más puntos = mejor posición en el directorio.</p>' +
      '</div>' +
      '<div class="panel"><h2 style="margin-top:0">Completá tu perfil</h2>' +
        '<p class="small muted">Un perfil completo recibe más consultas y suma 10 puntos una sola vez.</p>' +
        '<div class="progress"><span style="width:' + completion + '%"></span></div>' +
        '<p class="small">' + completion + '% completo</p>' +
        '<div class="btn-group"><button class="btn btn-primary btn-sm" data-act="panel-tab" data-tab="perfil">Editar perfil</button>' +
          '<button class="btn btn-outline btn-sm" data-act="publish">Publicar artículo o ebook</button>' +
          '<a class="btn btn-teal btn-sm" href="../auraserver/" target="_blank" rel="noopener">Abrir AuraKit</a>' +
          '<a class="btn btn-outline btn-sm" href="#/comunidad">Ver la comunidad</a></div>' +
      '</div>' +
      '<div class="panel"><h2 style="margin-top:0">Actividad reciente</h2>' + recentActivityHtml(p) + '</div>';
  }
  function recentActivityHtml(p) {
    var items = [];
    DB.questions.forEach(function (q) {
      q.answers.forEach(function (a) {
        if (a.psyId === p.id) items.push({ date: a.createdAt, text: 'Respondiste "' + q.title + '"', href: '#/pregunta/' + q.id });
      });
    });
    DB.publications.forEach(function (pub) {
      if (pub.psyId === p.id) items.push({ date: pub.createdAt, text: 'Publicaste "' + pub.title + '"', href: '#/publicaciones' });
    });
    DB.contacts.forEach(function (c) {
      if (c.psyId === p.id) {
        var pu = userById(c.patientId);
        items.push({ date: c.createdAt, text: 'Consulta de ' + (pu ? pu.name : 'un paciente') + ': ' + c.subject, href: '#/panel' });
      }
    });
    items.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    if (!items.length) return '<p class="small muted">Todavía no hay actividad. Empezá respondiendo una pregunta de la comunidad.</p>';
    return items.slice(0, 6).map(function (i) {
      return '<div class="row-item"><div class="grow"><p class="title" style="font-weight:600">' + esc(i.text) + '</p><p class="sub">' + timeAgo(i.date) + '</p></div></div>';
    }).join('');
  }

  function panelProfileHtml(p, completion) {
    var specChecks = DB.config.specialties.map(function (s) {
      return '<label class="checkline"><input type="checkbox" name="specialties" value="' + esc(s) + '"' + ((p.specialties || []).indexOf(s) !== -1 ? ' checked' : '') + '> ' + esc(s) + '</label>';
    }).join('');
    var appChecks = DB.config.approaches.map(function (s) {
      return '<label class="checkline"><input type="checkbox" name="approaches" value="' + esc(s) + '"' + ((p.approaches || []).indexOf(s) !== -1 ? ' checked' : '') + '> ' + esc(s) + '</label>';
    }).join('');
    var services = (p.services || []).map(function (s) { return [s.name, s.price, s.duration, s.note || ''].join(' | '); }).join('\n');
    var degrees = (p.degrees || []).map(function (d) { return [d.title, d.institution, d.year].join(' | '); }).join('\n');
    var availability = (p.availability || []).map(function (a) { return [a.days, a.hours].join(' | '); }).join('\n');
    return '<div class="panel"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">' +
        '<h2 style="margin:0">Mi perfil profesional</h2><span class="small muted">' + completion + '% completo</span></div>' +
      '<form data-form="psy-profile" data-id="' + p.id + '">' +
        '<div class="form-grid">' +
          '<div class="field"><label>Nombre público</label><input class="input" name="name" value="' + esc(p.name) + '" placeholder="Lic. Nombre Apellido"></div>' +
          '<div class="field"><label>Frase de presentación</label><input class="input" name="headline" maxlength="150" value="' + esc(p.headline || '') + '" placeholder="Ej: Ansiedad y pánico · TCC · Online y presencial"></div>' +
          '<div class="field span-2"><label>Foto de presentación</label>' +
            '<input class="input" name="photoUrl" value="' + esc(p.photoUrl || (userById(p.userId) || {}).avatarUrl || '') + '" placeholder="https://… o subí una imagen">' +
            '<div style="display:flex;gap:10px;align-items:center;margin-top:7px"><label class="btn btn-outline btn-sm" style="cursor:pointer">Subir imagen<input type="file" accept="image/*" data-image data-target="photoUrl" hidden></label>' +
            '<img data-preview="photoUrl" src="' + esc(p.photoUrl || '') + '" alt="" style="width:52px;height:52px;border-radius:50%;object-fit:cover;' + (p.photoUrl ? '' : 'display:none') + '"></div>' +
            '<p class="help-text">Aparece en tu ficha, en el feed y en el directorio. Se guarda en este dispositivo.</p></div>' +
            '<div class="field span-2"><label>Foto de portada (tu espacio, estilo Facebook)</label>' +
              '<input class="input" name="coverUrl" value="' + esc(p.coverUrl || '') + '" placeholder="https://… o subí una portada">' +
              '<div style="display:flex;gap:10px;align-items:center;margin-top:7px"><label class="btn btn-outline btn-sm" style="cursor:pointer">Subir portada<input type="file" accept="image/*" data-image data-target="coverUrl" hidden></label>' +
              '<img data-preview="coverUrl" src="' + esc(p.coverUrl || '') + '" alt="" style="width:140px;height:52px;border-radius:8px;object-fit:cover;' + (p.coverUrl ? '' : 'display:none') + '"></div></div>' +
            '<div class="field span-2"><label>Galería de fotos (una URL por línea)</label>' +
              '<textarea class="textarea" name="gallery" rows="3" placeholder="https://…&#10;https://…">' + esc((p.gallery || []).join('\n')) + '</textarea>' +
              '<label class="btn btn-outline btn-sm" style="cursor:pointer;margin-top:7px">Agregar foto a la galería<input type="file" accept="image/*" data-image data-target="gallery" data-append="1" hidden></label>' +
              '<p class="help-text">Se muestran en tu ficha como un espacio visual para que los pacientes te conozcan.</p></div>' +
          '<div class="field span-2"><label>Presentación / cómo trabajás</label><textarea class="textarea" name="bio" rows="6" placeholder="Contá tu enfoque, a quién atendés y qué puede esperar alguien en la primera sesión.">' + esc(p.bio || '') + '</textarea><p class="help-text">Mínimo 80 caracteres para considerarse completo.</p></div>' +
          '<div class="field"><label>Matrícula</label><input class="input" name="license" value="' + esc(p.license || '') + '" placeholder="MN 12345 · MP 67890"></div>' +
          '<div class="field"><label>Años de experiencia</label><input class="input" type="number" min="0" max="60" name="years" value="' + (p.years || 0) + '"></div>' +
          '<div class="field"><label>Ciudad</label><input class="input" name="city" value="' + esc(p.city || '') + '"></div>' +
          '<div class="field"><label>Provincia</label><input class="input" name="province" value="' + esc(p.province || '') + '"></div>' +
          '<div class="field span-2"><label>Dirección del consultorio (si es presencial)</label><input class="input" name="address" value="' + esc(p.address || '') + '"></div>' +
          '<div class="field"><label>Idiomas (separados por coma)</label><input class="input" name="languages" value="' + esc((p.languages || []).join(', ')) + '"></div>' +
          '<div class="field"><label>WhatsApp (código país, sin + ni espacios)</label><input class="input" name="whatsapp" value="' + esc(p.whatsapp || '') + '" placeholder="5491166116631"></div>' +
          '<div class="field"><label>Sitio web</label><input class="input" name="website" value="' + esc(p.website || '') + '" placeholder="https://"></div>' +
          '<div class="field"><label>Moneda</label><select class="select" name="currency"><option value="ARS"' + (p.currency === 'ARS' ? ' selected' : '') + '>ARS</option><option value="USD"' + (p.currency === 'USD' ? ' selected' : '') + '>USD</option></select></div>' +
          '<div class="field"><label>Tiempo de respuesta</label><select class="select" name="responseTime">' +
            ['menos de 24 h', 'menos de 48 h', '1 a 2 días', '1 a 3 días', 'a convenir'].map(function (t) { return '<option value="' + t + '"' + (p.responseTime === t ? ' selected' : '') + '>' + t + '</option>'; }).join('') +
          '</select></div>' +
          '<div class="field"><label class="checkline"><input type="checkbox" name="acceptingNew"' + (p.acceptingNew ? ' checked' : '') + '> Acepto nuevos pacientes</label></div>' +
          '<div class="field"><label>Modalidad</label><label class="checkline"><input type="checkbox" name="modalities" value="online"' + ((p.modalities || []).indexOf('online') !== -1 ? ' checked' : '') + '> Online</label>' +
            '<label class="checkline"><input type="checkbox" name="modalities" value="presencial"' + ((p.modalities || []).indexOf('presencial') !== -1 ? ' checked' : '') + '> Presencial</label></div>' +
          '<div class="field span-2"><label>Especialidades</label><div class="grid grid-2" style="gap:4px 18px">' + specChecks + '</div></div>' +
          '<div class="field span-2"><label>Enfoques terapéuticos</label><div class="grid grid-2" style="gap:4px 18px">' + appChecks + '</div></div>' +
          '<div class="field span-2"><label>Servicios y honorarios (una línea por servicio: Nombre | Precio | Minutos | Nota)</label>' +
            '<textarea class="textarea" name="services" rows="5" placeholder="Primera consulta | 30000 | 50 | Evaluación inicial&#10;Sesión online | 28000 | 50">' + esc(services) + '</textarea></div>' +
          '<div class="field span-2"><label>Formación (una línea: Título | Institución | Año)</label>' +
            '<textarea class="textarea" name="degrees" rows="4" placeholder="Licenciatura en Psicología | UBA | 2014&#10;Posgrado en TCC | AATC | 2018">' + esc(degrees) + '</textarea></div>' +
          '<div class="field span-2"><label>Certificaciones (una por línea)</label>' +
            '<textarea class="textarea" name="certifications" rows="3">' + esc((p.certifications || []).join('\n')) + '</textarea></div>' +
          '<div class="field span-2"><label>Días y horarios de atención</label>' + scheduleEditorHtml(p) + '</div>' +
          '<div class="field"><label>Formas de pago (separadas por coma)</label><input class="input" name="paymentMethods" value="' + esc((p.paymentMethods || []).join(', ')) + '"></div>' +
          '<div class="field"><label>Coberturas (separadas por coma)</label><input class="input" name="coverage" value="' + esc((p.coverage || []).join(', ')) + '"></div>' +
        '</div>' +
        '<div class="form-actions"><button class="btn btn-primary" type="submit">Guardar perfil</button>' +
          '<a class="btn btn-outline" href="#/psicologo/' + p.id + '">Ver perfil público</a></div>' +
      '</form></div>';
  }

  function panelQuestionsHtml(p) {
    var answered = DB.questions.filter(function (q) { return q.answers.some(function (a) { return a.psyId === p.id; }); });
    var open = DB.questions.filter(function (q) {
      if (q.answers.some(function (a) { return a.psyId === p.id; })) return false;
      if (!q.answers.length) return true;
      return (p.specialties || []).indexOf(q.category) !== -1;
    }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    return '<div class="panel"><h2 style="margin-top:0">Preguntas que puedo responder</h2>' +
      '<p class="small muted">Responder suma +10 puntos; si el paciente elige tu respuesta como la mejor, +25.</p>' +
      (open.length ? open.slice(0, 10).map(function (q) {
        return '<div class="row-item"><div class="grow"><a class="title" href="#/pregunta/' + q.id + '">' + esc(q.title) + '</a>' +
          '<p class="sub">' + esc(q.category) + ' · ' + q.answers.length + ' respuestas · ' + timeAgo(q.createdAt) + '</p></div>' +
          '<a class="btn btn-outline btn-sm" href="#/pregunta/' + q.id + '">Responder</a></div>';
      }).join('') : '<p class="small muted">No hay preguntas abiertas en tus especialidades ahora mismo. Podés ver toda la comunidad.</p>') +
      '<div class="form-actions"><a class="btn btn-outline btn-sm" href="#/comunidad">Ver toda la comunidad</a></div></div>' +
      '<div class="panel"><h2 style="margin-top:0">Mis respuestas</h2>' +
      (answered.length ? answered.map(function (q) {
        var mine = q.answers.filter(function (a) { return a.psyId === p.id; })[0];
        return '<div class="row-item"><div class="grow"><a class="title" href="#/pregunta/' + q.id + '">' + esc(q.title) + '</a>' +
          '<p class="sub">' + timeAgo(mine.createdAt) + ' · ' + mine.upvotes.length + ' votos · ' + (mine.accepted ? 'Mejor respuesta ✔' : 'Sin elegir') + '</p></div>' +
          '<span class="badge ' + (mine.accepted ? 'badge-green' : 'badge-gray') + '">' + (mine.accepted ? '+35' : '+10') + '</span></div>';
      }).join('') : '<p class="small muted">Todavía no respondiste preguntas.</p>') +
      '</div>';
  }

  function panelPubsHtml(p) {
    var pubs = DB.publications.filter(function (x) { return x.psyId === p.id; });
    return '<div class="panel"><div class="section-head" style="margin-bottom:10px"><h2 style="margin:0">Mis publicaciones</h2>' +
      '<button class="btn btn-primary btn-sm" data-act="publish">Publicar</button></div>' +
      (pubs.length ? pubs.map(function (pub) {
        return '<div class="row-item"><div class="grow"><button class="title" style="border:0;background:none;padding:0;text-align:left;cursor:pointer" data-act="open-pub" data-id="' + pub.id + '">' + esc(pub.title) + '</button>' +
          '<p class="sub">' + (pub.type === 'ebook' ? 'Ebook' : 'Artículo') + ' · ' + esc(pub.category) + ' · ' + fmtDate(pub.createdAt) + ' · ' + pub.likes.length + ' me gusta</p></div>' +
          '<span class="badge badge-teal">+' + (pub.type === 'ebook' ? 40 : 20) + ' pts</span></div>';
      }).join('') : '<p class="small muted">Todavía no publicaste. Un artículo suma +20 y un ebook +40 puntos, además de mostrar tu criterio clínico.</p>') +
      '</div>';
  }

  function panelContactsHtml(p) {
    var list = DB.contacts.filter(function (c) { return c.psyId === p.id; }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    return '<div class="panel"><h2 style="margin-top:0">Consultas recibidas</h2>' +
      '<p class="small muted">Cuando aceptás una consulta, el paciente puede dejarte una reseña. Respondé siempre por el canal que acordaron, nunca por este panel.</p>' +
      (list.length ? list.map(function (c) {
        var pu = userById(c.patientId);
        return '<div class="row-item" style="align-items:flex-start"><div class="grow">' +
          '<p class="title">' + esc(c.subject) + '</p>' +
          '<p class="sub">' + esc(pu ? pu.name : 'Paciente') + ' · ' + fmtDate(c.createdAt, true) + ' · ' + esc(pu ? (pu.city || '') : '') + '</p>' +
          '<p class="small" style="margin:6px 0 0;color:#33465a;background:#f7f9fc;padding:8px 10px;border-radius:8px">' + esc(c.message) + '</p>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">' +
            '<span class="status ' + c.status + '">' + ({ pending: 'Pendiente', accepted: 'Aceptada', declined: 'Rechazada', closed: 'Cerrada' }[c.status] || c.status) + '</span>' +
            (c.status === 'pending'
              ? '<button class="btn btn-teal btn-sm" data-act="contact-status" data-id="' + c.id + '" data-status="accepted">Aceptar</button>' +
                '<button class="btn btn-outline btn-sm" data-act="contact-status" data-id="' + c.id + '" data-status="declined">Rechazar</button>'
              : '') +
          '</div></div>';
      }).join('') : '<p class="small muted">No recibiste consultas todavía. Completá tu perfil y respondé en la comunidad para ganar visibilidad.</p>') +
      '</div>';
  }

  function panelReviewsHtml(p) {
    var list = reviewsOf(p.id).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    var r = ratingOf(p.id);
    return '<div class="panel"><h2 style="margin-top:0">Reseñas de pacientes</h2>' +
      (r.count ? '<div class="rating-line" style="margin-bottom:12px">' + starsHtml(r.avg) + '<strong>' + r.avg.toFixed(1) + ' de 5</strong><span>· ' + r.count + ' reseñas</span></div>' : '') +
      (list.length ? list.map(function (rev) {
        var pu = userById(rev.patientId);
        return '<div class="review"><div class="review-head">' + avatarUser(pu || { name: 'Paciente', color: '#8494a5' }, 'avatar-sm') +
          '<span class="name">' + esc(pu ? pu.name : 'Paciente') + '</span>' + starsHtml(rev.rating) +
          '<span class="date">' + fmtDate(rev.createdAt) + '</span></div><p>' + esc(rev.comment) + '</p>' +
          '<p class="help-text">Aporte al puntaje: ' + (rev.rating >= 3 ? '+' : '') + reviewDelta(rev.rating) + ' pts</p></div>';
      }).join('') : '<p class="small muted">Aún no tenés reseñas. Las reseñas se habilitan cuando aceptás una consulta y el paciente decide calificarte.</p>') +
      '</div>';
  }
  function reviewDelta(rating) {
    return { 5: 15, 4: 8, 3: 0, 2: -15, 1: -30 }[Number(rating)] || 0;
  }

  function panelPointsHtml(p) {
    var events = DB.pointEvents.filter(function (e) { return e.psyId === p.id; }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    var pts = pointsOf(p.id), tier = tierOf(pts), next = nextTierOf(pts);
    return '<div class="panel"><h2 style="margin-top:0">Mis puntos</h2>' +
      '<div class="kpi-grid" style="margin-bottom:14px">' +
        '<div class="kpi teal"><strong>' + pts + '</strong><span>total</span></div>' +
        '<div class="kpi gold"><strong>' + esc(tier.name) + '</strong><span>nivel</span></div>' +
        '<div class="kpi"><strong>#' + rankOf(p.id) + '</strong><span>puesto</span></div>' +
        '<div class="kpi"><strong>' + (next ? next.min - pts : 0) + '</strong><span>para ' + (next ? esc(next.name) : 'el máximo') + '</span></div>' +
      '</div>' +
      '<div class="ledger">' + events.map(function (e) {
        return '<div class="ledger-row"><div class="lbl">' + esc(e.label) + '<small>' + fmtDate(e.createdAt) + ' · ' + esc(e.type) + '</small></div>' +
          '<div class="delta ' + (e.delta >= 0 ? 'plus' : 'minus') + '">' + (e.delta > 0 ? '+' : '') + e.delta + '</div></div>';
      }).join('') + '</div>' +
      '<p class="help-text">Los puntos se acumulan. Las reseñas negativas restan según la calificación (2★: -15, 1★: -30).</p>' +
      '<div class="form-actions"><a class="btn btn-outline btn-sm" href="#/meritocracia">Ver reglas completas</a></div></div>';
  }

  function panelDataHtml(p) {
    return '<div class="panel"><h2 style="margin-top:0">Datos y cuenta</h2>' +
      '<p class="small muted">Todo se guarda en este navegador. Exportá una copia para migrar de dispositivo o resguardar la información.</p>' +
      dataToolsHtml() +
      '<div class="divider"></div>' +
      '<p class="small"><strong>Email de la cuenta:</strong> ' + esc((me() || {}).email || '') + '</p>' +
      '<p class="small"><strong>Perfil público:</strong> <a href="#/psicologo/' + p.id + '">#/psicologo/' + p.id + '</a></p>' +
      '<div class="form-actions"><button class="btn btn-ghost btn-sm" data-act="logout">Cerrar sesión</button></div>' +
      '</div>';
  }

  function renderAdmin() {
    var u = me();
    if (!u || u.role !== 'admin') return renderNotFound();
    var reports = (DB.reports || []).slice().sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    VIEW.innerHTML =
      '<div class="container page">' +
        '<div class="page-head"><span class="eyebrow">Administración</span><h1>Moderación y verificación</h1>' +
          '<p>Panel local de demostración. En producción estas acciones requerirían autenticación de servidor y registro de auditoría.</p></div>' +
        '<div class="kpi-grid" style="margin-bottom:20px">' +
          '<div class="kpi"><strong>' + DB.psychs.length + '</strong><span>psicólogos</span></div>' +
          '<div class="kpi teal"><strong>' + DB.psychs.filter(function (p) { return p.verified; }).length + '</strong><span>verificados</span></div>' +
          '<div class="kpi gold"><strong>' + reports.filter(function (r) { return r.status === 'open'; }).length + '</strong><span>reportes abiertos</span></div>' +
          '<div class="kpi"><strong>' + DB.questions.length + '</strong><span>preguntas</span></div>' +
        '</div>' +
        '<div class="panel" style="margin-bottom:18px"><h2 style="margin-top:0">Verificación de matrículas</h2>' +
          '<p class="small muted">Verificá el número de matrícula contra el registro oficial antes de habilitar el badge.</p>' +
          DB.psychs.map(function (p) {
            return '<div class="row-item"><div class="grow"><strong class="title">' + esc(p.name) + '</strong>' +
              '<p class="sub">' + esc(p.license || 'Sin matrícula') + ' · ' + esc(p.city) + ' · ' + (p.verified ? 'Verificado' : 'Pendiente') + '</p></div>' +
              '<button class="btn ' + (p.verified ? 'btn-outline' : 'btn-teal') + ' btn-sm" data-act="verify" data-id="' + p.id + '">' + (p.verified ? 'Quitar verificación' : 'Verificar') + '</button></div>';
          }).join('') +
        '</div>' +
        '<div class="panel"><h2 style="margin-top:0">Reportes de la comunidad</h2>' +
          (reports.length ? reports.map(function (r) {
            return '<div class="row-item"><div class="grow"><p class="title">' + esc(r.targetType) + ' · ' + esc(r.targetId) + '</p>' +
              '<p class="sub">' + esc(r.reason) + ' · ' + fmtDate(r.createdAt) + ' · ' + esc(r.status) + '</p></div>' +
              (r.status === 'open' ? '<button class="btn btn-outline btn-sm" data-act="resolve-report" data-id="' + r.id + '">Marcar resuelto</button>' : '<span class="status closed">Resuelto</span>') + '</div>';
          }).join('') : '<p class="small muted">No hay reportes.</p>') +
        '</div>' +
        '<div class="panel" style="margin-top:18px"><h2 style="margin-top:0">Datos</h2>' + dataToolsHtml() +
          '<div class="form-actions"><button class="btn btn-ghost btn-sm" data-act="logout">Cerrar sesión</button></div></div>' +
      '</div>';
  }

  /* ============================================================
     AuraKit · webs, landings, agenda y apps para psicólogos
     ============================================================ */
  var AK_BLOCKS = {
    hero: 'Portada / hero',
    services: 'Servicios y precios',
    about: 'Sobre mí',
    booking: 'Turnos y agenda',
    books: 'Libros y ebooks',
    testimonials: 'Testimonios',
    contact: 'Contacto',
    aura: 'Asistente Aura'
  };
  var AK_TEMPLATES = {
    landing: { name: 'Landing profesional', desc: 'Presentación, servicios, testimonios y contacto.', blocks: ['hero', 'about', 'services', 'testimonials', 'contact', 'aura'] },
    sesiones: { name: 'Vender sesiones', desc: 'Portada con CTA, servicios, turnos y contacto.', blocks: ['hero', 'services', 'about', 'booking', 'testimonials', 'contact', 'aura'] },
    tienda: { name: 'Tienda de ebooks', desc: 'Libros, precios y enlaces de pago o descarga.', blocks: ['hero', 'books', 'about', 'testimonials', 'contact', 'aura'] },
    agenda: { name: 'Agenda y turnos', desc: 'Reservas por WhatsApp, servicios y contacto.', blocks: ['hero', 'booking', 'services', 'contact', 'aura'] },
    app: { name: 'App Android (PWA)', desc: 'Web instalable + envoltorio Capacitor para Play Store.', blocks: ['hero', 'services', 'booking', 'contact', 'aura'] }
  };
  function akDefaultBlocks(template) {
    var enabled = (AK_TEMPLATES[template] || AK_TEMPLATES.sesiones).blocks;
    return Object.keys(AK_BLOCKS).map(function (type) {
      return { type: type, enabled: enabled.indexOf(type) !== -1 };
    });
  }
  function auraKitBlank(name, psyId, user) {
    var psy = psyById(psyId);
    var u = user || (psy ? userById(psy.userId) : null);
    return {
      id: uid('akp'), psyId: psyId, name: name || (psy ? psy.name : 'Mi consultorio'),
      template: 'sesiones', brand: '#0f4a63', accent: '#17a589',
      headline: (psy && psy.headline) ? psy.headline : 'Un espacio para entenderte y avanzar',
      subheadline: (psy && psy.bio) ? String(psy.bio).slice(0, 160) : 'Atención profesional, con un plan claro y humano.',
      about: (psy && psy.bio) || '', cta: 'Reservar una consulta',
      services: (psy && psy.services && psy.services.length) ? psy.services.map(function (s) { return { name: s.name, price: s.price, desc: s.note || '' }; }) : [{ name: 'Primera consulta', price: 30000, desc: 'Evaluación inicial y plan de trabajo.' }],
      books: [], testimonials: [],
      contact: {
        whatsapp: (psy && psy.whatsapp) || (u && u.whatsapp) || '',
        email: (u && u.email) || '', address: (psy && psy.address) || '',
        schedule: (psy && psy.availability && psy.availability[0]) ? (psy.availability[0].days + ' · ' + psy.availability[0].hours) : ''
      },
      blocks: akDefaultBlocks('sesiones'), publishedUrl: '',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
  }
  function renderAuraKit() {
    var u = me();
    if (!u) {
      VIEW.innerHTML = gateHtml('Ingresá a AuraKit', 'AuraKit es la herramienta de los profesionales para crear webs, landings, tiendas y apps, ordenar la agenda y generar los archivos para publicar.');
      return;
    }
    if (u.role !== 'psy') {
      VIEW.innerHTML = '<div class="container page"><div class="empty" style="max-width:620px;margin:30px auto"><span class="emoji">🛠️</span><h3>AuraKit es exclusivo de psicólogos</h3>' +
        '<p>Con AuraKit los profesionales crean sus webs y apps, venden sesiones o libros, ordenan la agenda y generan los archivos para publicar. Los pacientes no tienen acceso a esta herramienta.</p>' +
        '<div class="btn-group" style="justify-content:center"><a class="btn btn-primary" href="#/registro/psy">Crear perfil profesional</a><a class="btn btn-outline" href="#/">Volver a la comunidad</a></div></div></div>';
      return;
    }
    var p = myPsych();
    if (!p) return renderNotFound();
    var projects = DB.aurakitProjects.filter(function (x) { return x.psyId === p.id; });
    var active = null;
    if (projects.length) {
      active = projects.filter(function (x) { return x.id === akState.projectId; })[0] || projects[0];
      akState.projectId = active.id;
      if (akState.loadedId !== active.id) {
        akState.blocks = clone(active.blocks || akDefaultBlocks(active.template));
        akState.loadedId = active.id;
        akState.aiLog = '';
      }
    } else {
      active = null;
      akState.blocks = null;
      akState.loadedId = null;
    }
    VIEW.innerHTML =
      '<div class="container page">' +
        '<div class="ak-hero">' +
          '<span class="hero-eyebrow">AuraKit · para profesionales</span>' +
          '<h1>Tu web, tu agenda y tu app, en minutos</h1>' +
          '<p>Creá una web o landing para vender sesiones, turnos o libros; configurá tu agenda; generá una app Android instalable y descargá todos los archivos para publicarlos en cualquier servidor. La IA de AuraKit ordena el contenido mientras hablás o escribís, y el editor de bloques te deja mover las secciones con el mouse.</p>' +
          '<div class="ak-badges"><span>IA de contenido</span><span>Editor de bloques</span><span>Agenda / CRM</span><span>PWA + Android</span><span>Export ZIP</span><span>Sin PHP</span></div>' +
        '</div>' +
        '<div class="ak-layout">' +
          '<aside class="ak-side">' +
            '<div class="side-card"><h2 class="side-title">Mis proyectos</h2>' +
              '<div class="ak-projects">' +
                (projects.length ? projects.map(function (pr) {
                  return '<button class="ak-project-btn' + (active && pr.id === active.id ? ' active' : '') + '" data-act="ak-select" data-id="' + pr.id + '">🌐 <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(pr.name) + '</span></button>';
                }).join('') : '<p class="small muted" style="margin:0">Todavía no tenés proyectos.</p>') +
              '</div>' +
              '<button class="btn btn-teal btn-sm btn-block" style="margin-top:9px" data-act="ak-new">＋ Nuevo proyecto</button>' +
            '</div>' +
            '<div class="side-card"><h2 class="side-title">Herramientas</h2>' +
              '<div class="left-nav" style="gap:0">' +
                '<a href="#/panel"><span class="ico">🗂️</span> Panel profesional</a>' +
                '<a href="../lizar/" target="_blank" rel="noopener"><span class="ico">📋</span> Administrador de Consultorio</a>' +
                '<a href="#/psicologo/' + p.id + '"><span class="ico">👤</span> Ver mi ficha</a>' +
                '<a href="#/meritocracia"><span class="ico">🏆</span> Mi ranking</a>' +
              '</div>' +
            '</div>' +
            '<div class="side-card left-foot">Los archivos se generan en tu navegador. La publicación final en Play Store requiere una cuenta de Google Play y compilar el APK/AAB con Android Studio: AuraKit te deja el proyecto listo con Capacitor.</div>' +
          '</aside>' +
          '<div>' +
            (active
              ? '<div class="ak-tabs">' +
                  ['diseno:Constructor', 'agenda:Agenda / CRM', 'publicar:Publicar y descargar', 'ayuda:Guía'].map(function (t) {
                    var parts = t.split(':');
                    return '<button class="ak-tab' + (akState.tab === parts[0] ? ' active' : '') + '" data-act="ak-tab" data-tab="' + parts[0] + '">' + parts[1] + '</button>';
                  }).join('') +
                '</div>' +
                (akState.tab === 'agenda' ? renderAkAgenda(p) : akState.tab === 'publicar' ? renderAkPublish(active, p) : akState.tab === 'ayuda' ? renderAkHelp() : renderAkConstructor(active, p))
              : renderAkWelcome()) +
          '</div>' +
        '</div>' +
      '</div>';
    if (active && akState.tab === 'diseno') setTimeout(updateAkPreview, 30);
  }
  function renderAkWelcome() {
    return '<div class="ak-panel">' +
      '<h2 style="margin-top:0">Creá tu primer proyecto</h2>' +
      '<p class="small muted">Elegí una plantilla o contale a la IA qué querés. Después podés mover los bloques y editar todo.</p>' +
      '<div class="ak-template-grid">' +
        Object.keys(AK_TEMPLATES).map(function (k) {
          var t = AK_TEMPLATES[k];
          return '<button class="ak-template" data-act="ak-new" data-template="' + k + '"><strong>' + esc(t.name) + '</strong><span>' + esc(t.desc) + '</span></button>';
        }).join('') +
      '</div>' +
      '<div class="ak-ai-box"><h3>✨ AuraKit IA</h3><p>Contale tu idea. Podés escribir o dictar: “Quiero una web para vender sesiones de ansiedad a 30000, con turnos los martes y jueves, online”.</p>' +
        '<div class="ak-ai-row"><input class="input" id="akAiText" placeholder="Describí tu web, servicios, precios y horarios…"><button class="btn btn-teal btn-sm" data-act="ak-ai">Generar</button><button class="btn btn-outline btn-sm" data-act="ak-voice">🎙️ Dictar</button></div>' +
      '</div>' +
      '<div class="ak-note">AuraKit genera HTML, CSS, manifest, service worker y un proyecto Capacitor listo para Android. No compila el APK por vos (eso requiere Android Studio/Play Console), pero te deja todos los archivos y los pasos.</div>' +
    '</div>';
  }
  function renderAkConstructor(project, psy) {
    var blocks = akState.blocks || clone(project.blocks || akDefaultBlocks(project.template));
    return '<div class="ak-grid">' +
      '<div class="ak-panel">' +
        '<div class="ak-ai-box"><h3>✨ AuraKit IA</h3><p>Dictá o escribí qué necesitás. AuraKit completa portada, servicios, precios, turnos y bloques.</p>' +
          '<div class="ak-ai-row"><input class="input" id="akAiText" placeholder="Ej: landing para vender sesiones de TDAH a 35000 con turnos online de martes a jueves"><button class="btn btn-teal btn-sm" data-act="ak-ai">Generar</button><button class="btn btn-outline btn-sm" data-act="ak-voice">🎙️ Dictar</button></div>' +
          (akState.aiLog ? '<div class="ak-ai-log">' + esc(akState.aiLog) + '</div>' : '') +
        '</div>' +
        '<form data-form="ak-save" data-id="' + project.id + '">' +
          '<input type="hidden" name="template" value="' + esc(project.template) + '">' +
          '<div class="ak-template-grid">' +
            Object.keys(AK_TEMPLATES).map(function (k) {
              return '<button type="button" class="ak-template' + (project.template === k ? ' active' : '') + '" data-act="ak-template" data-template="' + k + '"><strong>' + esc(AK_TEMPLATES[k].name) + '</strong><span>' + esc(AK_TEMPLATES[k].desc) + '</span></button>';
            }).join('') +
          '</div>' +
          '<div class="form-grid">' +
            '<div class="ak-field"><label>Nombre del proyecto</label><input class="input" name="name" value="' + esc(project.name) + '" required></div>' +
            '<div class="ak-field"><label>Llamado a la acción</label><input class="input" name="cta" value="' + esc(project.cta) + '"></div>' +
            '<div class="ak-field span-2"><label>Titular</label><input class="input" name="headline" value="' + esc(project.headline) + '" required></div>' +
            '<div class="ak-field span-2"><label>Subtítulo</label><textarea class="textarea" name="subheadline" rows="2">' + esc(project.subheadline) + '</textarea></div>' +
            '<div class="ak-field span-2"><label>Sobre mí</label><textarea class="textarea" name="about" rows="4">' + esc(project.about) + '</textarea></div>' +
            '<div class="ak-field"><label>Color principal</label><input class="input" type="color" name="brand" value="' + esc(project.brand) + '" style="height:42px;padding:4px"></div>' +
            '<div class="ak-field"><label>Color de acento</label><input class="input" type="color" name="accent" value="' + esc(project.accent) + '" style="height:42px;padding:4px"></div>' +
            '<div class="ak-field"><label>WhatsApp (solo números)</label><input class="input" name="whatsapp" value="' + esc((project.contact || {}).whatsapp || '') + '" placeholder="5491166116631"></div>' +
            '<div class="ak-field"><label>Email de contacto</label><input class="input" name="email" value="' + esc((project.contact || {}).email || '') + '"></div>' +
            '<div class="ak-field"><label>Dirección</label><input class="input" name="address" value="' + esc((project.contact || {}).address || '') + '"></div>' +
            '<div class="ak-field"><label>Horarios</label><input class="input" name="schedule" value="' + esc((project.contact || {}).schedule || '') + '"></div>' +
            '<div class="ak-field span-2"><label>Servicios (una línea: Nombre | Precio | Descripción)</label><textarea class="textarea" name="services" rows="4" placeholder="Consulta | 30000 | Primera entrevista y plan">' + esc(akServicesText(project.services)) + '</textarea></div>' +
            '<div class="ak-field span-2"><label>Libros / ebooks (una línea: Título | Precio | Descripción | URL)</label><textarea class="textarea" name="books" rows="3" placeholder="Mi ebook | 0 | Guía gratuita | ../ebooks/">' + esc(akBooksText(project.books)) + '</textarea></div>' +
            '<div class="ak-field span-2"><label>Testimonios (una línea: Nombre | Texto)</label><textarea class="textarea" name="testimonials" rows="3">' + esc(akTestimonialsText(project.testimonials)) + '</textarea></div>' +
          '</div>' +
          '<div style="margin-top:14px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><strong style="font-size:.86rem;color:var(--navy)">Bloques de la página</strong><span class="small muted">Arrastrá para ordenar</span></div>' +
            '<div class="ak-block-list" id="akBlocks">' + renderAkBlocksHtml() + '</div>' +
            '<div class="ak-palette">' + Object.keys(AK_BLOCKS).map(function (t) { return '<button type="button" data-act="ak-add-block" data-type="' + t + '">＋ ' + esc(AK_BLOCKS[t]) + '</button>'; }).join('') + '</div>' +
          '</div>' +
          '<div class="ak-actions"><button class="btn btn-primary" type="submit">Guardar proyecto</button>' +
            '<button class="btn btn-outline" type="button" data-act="ak-preview">Actualizar vista previa</button>' +
            '<button class="btn btn-outline" type="button" data-act="ak-download-html">Descargar HTML</button>' +
            '<button class="btn btn-teal" type="button" data-act="ak-download-zip">Descargar ZIP</button></div>' +
        '</form>' +
        '<div class="ak-note">El HTML generado es autónomo: incluye estilos, formulario de turnos por WhatsApp, asistente de soporte y botón flotante. Podés subirlo a cualquier hosting sin PHP.</div>' +
      '</div>' +
      '<div class="ak-preview">' +
        '<div class="ak-preview-head"><span class="dots"><span></span><span></span><span></span></span><span class="url">' + esc(akSlug(project.name)) + '.winebox.site</span></div>' +
        '<iframe id="akPreview" title="Vista previa del sitio" sandbox="allow-scripts allow-forms allow-popups"></iframe>' +
      '</div>' +
    '</div>';
  }
  function akServicesText(list) {
    return (list || []).map(function (s) { return [s.name, s.price, s.desc].join(' | '); }).join('\n');
  }
  function akBooksText(list) {
    return (list || []).map(function (b) { return [b.title, b.price, b.desc, b.url].join(' | '); }).join('\n');
  }
  function akTestimonialsText(list) {
    return (list || []).map(function (t) { return [t.name, t.text].join(' | '); }).join('\n');
  }
  function renderAkBlocksHtml() {
    var blocks = akState.blocks || [];
    return blocks.map(function (b, i) {
      return '<div class="ak-block" draggable="true" data-ak-type="' + b.type + '" data-ak-index="' + i + '">' +
        '<span class="grip" title="Arrastrar">⠿</span><div class="grow"><span class="type">Bloque ' + (i + 1) + '</span>' + esc(AK_BLOCKS[b.type] || b.type) + '</div>' +
        '<label class="switch" title="Mostrar u ocultar"><input type="checkbox" data-ak-toggle="' + b.type + '"' + (b.enabled ? ' checked' : '') + '><span class="slider"></span></label>' +
        '<button type="button" class="mini-btn danger" data-act="ak-remove-block" data-type="' + b.type + '" title="Quitar">×</button>' +
      '</div>';
    }).join('');
  }
  function renderAkBlockList() {
    var box = $('#akBlocks');
    if (box) box.innerHTML = renderAkBlocksHtml();
  }
  function updateAkBlockState(el) {
    var type = el.dataset.akToggle;
    (akState.blocks || []).forEach(function (b) { if (b.type === type) b.enabled = el.checked; });
    updateAkPreview();
  }
  function akAddBlock(type) {
    if (!AK_BLOCKS[type]) return;
    if ((akState.blocks || []).some(function (b) { return b.type === type; })) return toast('Ese bloque ya está en la página.', 'warn');
    akState.blocks = (akState.blocks || []).concat([{ type: type, enabled: true }]);
    renderAkBlockList();
    updateAkPreview();
  }
  function akRemoveBlock(type) {
    akState.blocks = (akState.blocks || []).filter(function (b) { return b.type !== type; });
    renderAkBlockList();
    updateAkPreview();
  }
  function akApplyTemplate(template) {
    akState.blocks = akDefaultBlocks(template);
    var form = $('form[data-form="ak-save"]');
    if (form) {
      $$('.ak-template', form).forEach(function (b) { b.classList.toggle('active', b.dataset.template === template); });
      if (form.elements.template) form.elements.template.value = template;
    }
    renderAkBlockList();
    updateAkPreview();
  }
  function akReadForm() {
    var form = $('form[data-form="ak-save"]');
    if (!form || !akState.projectId) return null;
    var project = DB.aurakitProjects.filter(function (p) { return p.id === akState.projectId; })[0];
    if (!project) return null;
    var val = function (n) { return form.elements[n] ? String(form.elements[n].value || '').trim() : ''; };
    var lines = function (n) { return val(n).split('\n').map(function (l) { return l.trim(); }).filter(Boolean); };
    var services = lines('services').map(function (l) {
      var a = l.split('|').map(function (x) { return x.trim(); });
      return { name: a[0] || 'Servicio', price: Number(String(a[1] || '').replace(/[^\d]/g, '')) || 0, desc: a[2] || '' };
    });
    var books = lines('books').map(function (l) {
      var a = l.split('|').map(function (x) { return x.trim(); });
      return { title: a[0] || 'Ebook', price: Number(String(a[1] || '').replace(/[^\d]/g, '')) || 0, desc: a[2] || '', url: a[3] || '' };
    });
    var testimonials = lines('testimonials').map(function (l) {
      var a = l.split('|').map(function (x) { return x.trim(); });
      return { name: a[0] || 'Paciente', text: a[1] || '' };
    });
    var out = clone(project);
    out.name = val('name') || project.name;
    out.template = val('template') || project.template;
    out.headline = val('headline') || project.headline;
    out.subheadline = val('subheadline');
    out.about = val('about');
    out.cta = val('cta') || 'Reservar una consulta';
    out.brand = /^#[0-9a-fA-F]{6}$/.test(val('brand')) ? val('brand') : project.brand;
    out.accent = /^#[0-9a-fA-F]{6}$/.test(val('accent')) ? val('accent') : project.accent;
    out.services = services;
    out.books = books;
    out.testimonials = testimonials;
    out.contact = { whatsapp: val('whatsapp').replace(/[^\d]/g, ''), email: val('email'), address: val('address'), schedule: val('schedule') };
    out.blocks = (akState.blocks || out.blocks || []).map(function (b) { return { type: b.type, enabled: !!b.enabled }; });
    out.updatedAt = new Date().toISOString();
    return out;
  }
  function handleAkSave(form) {
    var p = myPsych();
    if (!p) return formError(form, 'Solo los psicólogos pueden guardar proyectos.');
    var project = akReadForm();
    if (!project) return formError(form, 'No encontramos el proyecto.');
    if (project.name.length < 3) return formError(form, 'Poné un nombre de proyecto.');
    if (project.headline.length < 8) return formError(form, 'El titular es demasiado corto.');
    var idx = DB.aurakitProjects.findIndex(function (x) { return x.id === project.id; });
    if (idx === -1) return formError(form, 'Proyecto inexistente.');
    DB.aurakitProjects[idx] = project;
    save();
    toast('Proyecto guardado. La vista previa ya está actualizada.', 'ok');
    renderAuraKit();
  }
  function updateAkPreview() {
    var frame = $('#akPreview');
    if (!frame) return;
    var project = akReadForm();
    if (!project) return;
    try { frame.srcdoc = akGenerateHtml(project, { preview: true }); } catch (e) { console.error(e); }
  }
  function handleAkNew(template) {
    var p = myPsych();
    if (!p) return;
    var t = AK_TEMPLATES[template] ? template : 'sesiones';
    var project = auraKitBlank((p.name || 'Mi consultorio') + ' · ' + AK_TEMPLATES[t].name, p.id, me());
    project.template = t;
    project.blocks = akDefaultBlocks(t);
    DB.aurakitProjects.push(project);
    save();
    akState.projectId = project.id;
    akState.loadedId = null;
    akState.tab = 'diseno';
    toast('Proyecto creado. Ya podés editar y ver la vista previa.', 'ok');
    renderAuraKit();
  }
  function akApplyAI(text) {
    var p = myPsych();
    if (!p) return;
    text = String(text || '').trim();
    if (text.length < 12) return toast('Contame un poco más (mínimo 12 caracteres).', 'warn');
    if (!akState.projectId) {
      var projects = DB.aurakitProjects.filter(function (x) { return x.psyId === p.id; });
      if (projects.length) akState.projectId = projects[0].id;
      else {
        var np = auraKitBlank((p.name || 'Mi consultorio') + ' · AuraKit', p.id, me());
        DB.aurakitProjects.push(np);
        save();
        akState.projectId = np.id;
        akState.loadedId = null;
      }
    }
    var project = DB.aurakitProjects.filter(function (x) { return x.id === akState.projectId; })[0];
    if (!project) return;
    var low = normalize(text);
    var log = [];
    var template = /tienda|libro|ebook/.test(low) ? 'tienda' : /turno|agenda|reserva/.test(low) ? 'agenda' : /app|android|celular|play store/.test(low) ? 'app' : 'sesiones';
    project.template = template;
    project.blocks = akDefaultBlocks(template);
    var specialty = '';
    ['ansiedad', 'tdah', 'autismo', 'tea', 'pareja', 'duelo', 'depresion', 'adicciones', 'perinatal', 'trauma', 'alimentarios', 'insomnio'].forEach(function (k) {
      if (low.indexOf(k) !== -1 && !specialty) specialty = k;
    });
    if (specialty) {
      var label = specialty === 'tea' ? 'TEA' : specialty.charAt(0).toUpperCase() + specialty.slice(1);
      project.headline = 'Acompañamiento profesional en ' + label;
      project.subheadline = 'Un espacio claro, humano y basado en evidencia para entender qué te pasa y qué hacer. Online y presencial.';
      log.push('Titular y subtítulo adaptados a ' + label + '.');
    } else {
      project.headline = text.length > 90 ? text.slice(0, 90) : text;
      project.subheadline = 'Atención profesional con un plan claro y humano.';
      log.push('Portada creada a partir de tu descripción.');
    }
    project.about = project.about && project.about.length > 80 ? project.about : (p.bio || 'Acompaño procesos con escucha, criterio clínico y objetivos concretos.');
    var priceMatch = text.match(/\$?\s?(\d{2,3}(?:[.\s]\d{3})+|\d{4,7})/);
    if (priceMatch) {
      var price = Number(priceMatch[1].replace(/[^\d]/g, ''));
      if (price > 100) {
        if (!project.services || !project.services.length) project.services = [{ name: 'Consulta', price: price, desc: 'Entrevista y plan de trabajo.' }];
        else project.services[0].price = price;
        log.push('Precio detectado: ' + fmtMoney(price, 'ARS') + '.');
      }
    }
    if (!project.services || !project.services.length) project.services = [{ name: 'Primera consulta', price: 30000, desc: 'Evaluación inicial y plan.' }];
    var days = [];
    ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].forEach(function (d) { if (low.indexOf(d) !== -1) days.push(d); });
    if (days.length) {
      project.contact.schedule = days.join(', ') + ' · consultar horarios';
      log.push('Disponibilidad: ' + days.join(', ') + '.');
    }
    if (/online|videollamada|virtual/.test(low)) { project.subheadline = project.subheadline.replace(/Online y presencial\.?/, 'Online.'); log.push('Modalidad online marcada.'); }
    if (/libro|ebook/.test(low)) {
      if (!project.books || !project.books.length) project.books = [{ title: 'Ebook gratuito', price: 0, desc: 'Material introductorio para empezar.', url: '../ebooks/' }];
      log.push('Bloque de libros activado.');
    }
    project.contact.whatsapp = project.contact.whatsapp || p.whatsapp || (me() || {}).whatsapp || '';
    project.updatedAt = new Date().toISOString();
    var idx = DB.aurakitProjects.findIndex(function (x) { return x.id === project.id; });
    DB.aurakitProjects[idx] = project;
    save();
    akState.aiLog = log.join('\n') || 'Proyecto actualizado.';
    akState.blocks = clone(project.blocks);
    akState.loadedId = project.id;
    akState.tab = 'diseno';
    toast('AuraKit generó una propuesta. Revisala y ajustá lo que quieras.', 'ok');
    renderAuraKit();
  }
  function akVoice() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return toast('Tu navegador no soporta dictado por voz. Escribí la idea en el campo de texto.', 'warn');
    try {
      var rec = new SR();
      rec.lang = 'es-AR';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = function (ev) {
        var txt = ev.results[0][0].transcript;
        var input = $('#akAiText');
        if (input) { input.value = txt; input.focus(); }
        toast('Escuchado: ' + txt, 'ok', 4000);
      };
      rec.onerror = function () { toast('No se pudo escuchar. Revisá el permiso de micrófono.', 'err'); };
      rec.start();
      toast('Escuchando… hablá ahora.', 'ok', 2500);
    } catch (e) { toast('No se pudo iniciar el micrófono.', 'err'); }
  }

  function renderAkAgenda(p) {
    var list = DB.appointments.filter(function (a) { return a.psyId === p.id; }).sort(function (a, b) {
      return (a.date + a.time).localeCompare(b.date + b.time);
    });
    var upcoming = list.filter(function (a) { return a.date >= new Date().toISOString().slice(0, 10) && a.status !== 'cancelled'; });
    var pending = list.filter(function (a) { return a.status === 'pending'; });
    var contacts = DB.contacts.filter(function (c) { return c.psyId === p.id; }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    return '<div class="ak-panel">' +
      '<div class="section-head" style="margin-bottom:14px"><div><h2 style="margin:0">Agenda y CRM</h2><p class="small muted" style="margin:3px 0 0">Turnos, estados y consultas entrantes. Se guarda en este dispositivo.</p></div>' +
        '<button class="btn btn-primary btn-sm" data-act="ak-new-appt">＋ Nuevo turno</button></div>' +
      '<div class="kpi-grid" style="margin-bottom:16px">' +
        '<div class="kpi teal"><strong>' + upcoming.length + '</strong><span>próximos turnos</span></div>' +
        '<div class="kpi gold"><strong>' + pending.length + '</strong><span>por confirmar</span></div>' +
        '<div class="kpi"><strong>' + contacts.filter(function (c) { return c.status === 'pending'; }).length + '</strong><span>consultas nuevas</span></div>' +
        '<div class="kpi"><strong>' + DB.aurakitProjects.filter(function (x) { return x.psyId === p.id; }).length + '</strong><span>proyectos web</span></div>' +
      '</div>' +
      (list.length ? '<div class="table-wrap"><table class="data-table"><thead><tr><th>Paciente</th><th>Fecha</th><th>Hora</th><th>Servicio</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>' +
        list.map(function (a) {
          return '<tr><td><strong>' + esc(a.patientName) + '</strong>' + (a.notes ? '<div class="small muted">' + esc(a.notes) + '</div>' : '') + '</td>' +
            '<td>' + esc(a.date) + '</td><td>' + esc(a.time) + '</td><td>' + esc(a.service || '—') + '</td>' +
            '<td><span class="status ' + (a.status === 'confirmed' ? 'accepted' : a.status === 'cancelled' ? 'declined' : a.status === 'completed' ? 'closed' : 'pending') + '">' + esc(a.status) + '</span></td>' +
            '<td><div class="row-actions">' +
              (a.status !== 'confirmed' ? '<button class="mini-btn" data-act="ak-appt-status" data-id="' + a.id + '" data-status="confirmed">Confirmar</button>' : '') +
              (a.status !== 'completed' ? '<button class="mini-btn" data-act="ak-appt-status" data-id="' + a.id + '" data-status="completed">Completar</button>' : '') +
              '<button class="mini-btn danger" data-act="ak-appt-delete" data-id="' + a.id + '">Eliminar</button>' +
            '</div></td></tr>';
        }).join('') + '</tbody></table></div>' : '<div class="post-empty">No hay turnos cargados todavía. Creá el primero o convertí una consulta en turno.</div>') +
      '<h3 style="font-size:.92rem;margin:22px 0 8px">Consultas entrantes</h3>' +
      (contacts.length ? contacts.map(function (c) {
        var pu = userById(c.patientId);
        return '<div class="row-item"><div class="grow"><p class="title">' + esc(c.subject) + '</p>' +
          '<p class="sub">' + esc(pu ? pu.name : 'Paciente') + ' · ' + fmtDate(c.createdAt) + ' · ' + esc(c.status) + '</p></div>' +
          '<button class="mini-btn" data-act="ak-appt-from-contact" data-id="' + c.id + '">Agendar</button></div>';
      }).join('') : '<p class="small muted">Sin consultas todavía. Las consultas del directorio aparecen acá.</p>') +
      '<div class="ak-note">CRM simple: cuando agendás, el turno queda acá. Para historia clínica completa usá <a href="../lizar/" target="_blank" rel="noopener">Lizar</a>.</div>' +
    '</div>';
  }
  function renderAkPublish(project, psy) {
    var files = akFileList(project);
    var total = files.reduce(function (s, f) { return s + (typeof f.content === 'string' ? f.content.length : 0); }, 0);
    return '<div class="ak-panel">' +
      '<h2 style="margin-top:0">Publicar y descargar</h2>' +
      '<p class="small muted">Generá los archivos y subilos a cualquier hosting estático (Netlify, Vercel, GitHub Pages, cPanel). Para Play Store, AuraKit deja el proyecto Capacitor listo: solo falta compilar y firmar.</p>' +
      '<div class="kpi-grid" style="margin-bottom:16px">' +
        '<div class="kpi teal"><strong>' + files.length + '</strong><span>archivos</span></div>' +
        '<div class="kpi"><strong>' + Math.round(total / 1024) + ' KB</strong><span>peso aprox.</span></div>' +
        '<div class="kpi gold"><strong>' + esc(project.template) + '</strong><span>plantilla</span></div>' +
        '<div class="kpi"><strong>' + (project.publishedUrl ? 'Sí' : 'No') + '</strong><span>publicado</span></div>' +
      '</div>' +
      '<div class="ak-actions" style="margin-top:0">' +
        '<button class="btn btn-primary" data-act="ak-download-html">Descargar index.html</button>' +
        '<button class="btn btn-teal" data-act="ak-download-zip">Descargar ZIP completo</button>' +
        '<button class="btn btn-outline" data-act="ak-copy-html">Copiar HTML</button>' +
        '<button class="btn btn-outline" data-act="ak-open-preview">Abrir vista previa</button>' +
      '</div>' +
      '<h3 style="font-size:.95rem;margin-top:22px">Archivos generados</h3>' +
      '<div class="ak-files">' + files.map(function (f) { return f.name + '  ·  ' + (typeof f.content === 'string' ? f.content.length : f.content.length) + ' bytes'; }).join('\n') + '</div>' +
      '<h3 style="font-size:.95rem;margin-top:22px">¿Ya la publicaste?</h3>' +
      '<form data-form="ak-published" data-id="' + project.id + '" style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end">' +
        '<div class="ak-field" style="flex:1;min-width:240px;margin:0"><label>URL pública (https://…)</label><input class="input" name="publishedUrl" value="' + esc(project.publishedUrl || '') + '" placeholder="https://tusitio.com"></div>' +
        '<button class="btn btn-outline" type="submit">Guardar enlace</button>' +
      '</form>' +
      '<div class="two-col" style="margin-top:20px">' +
        '<div><h3 style="font-size:.9rem">Publicar en la web</h3><ol class="small muted" style="padding-left:18px">' +
          '<li>Descargá el ZIP y descomprimilo.</li><li>Subí todos los archivos a la raíz de tu hosting.</li>' +
          '<li>Activá HTTPS (Netlify/Vercel lo hacen solos).</li><li>Verificá que el manifest y el service worker carguen.</li></ol></div>' +
        '<div><h3 style="font-size:.9rem">Publicar en Play Store</h3><ol class="small muted" style="padding-left:18px">' +
          '<li>Descomprimí el ZIP: ya incluye <code>www/</code>, <code>capacitor.config.json</code> y <code>package.json</code>.</li>' +
          '<li>Ejecutá <code>npm install</code>.</li>' +
          '<li><code>npx cap add android</code> y <code>npx cap sync</code>.</li>' +
          '<li>Abrí Android Studio, generá un AAB firmado y subilo a Play Console.</li></ol></div>' +
      '</div>' +
      '<div class="ak-note">AuraKit no sube archivos a tu servidor ni firma el APK: genera el proyecto y los pasos. La cuenta de Google Play, la firma y la revisión son tuyas. Para apps nativas con cámara, notificaciones o pagos in-app hace falta desarrollo adicional.</div>' +
    '</div>';
  }
  function renderAkHelp() {
    return '<div class="ak-panel">' +
      '<h2 style="margin-top:0">Cómo funciona AuraKit</h2>' +
      '<div class="ak-step"><span class="n">1</span><div class="grow"><strong>Contale a la IA o elegí una plantilla</strong><p>Escribí o dictá qué querés vender y cómo trabajás. AuraKit propone portada, servicios, precios, turnos y bloques.</p></div></div>' +
      '<div class="ak-step"><span class="n">2</span><div class="grow"><strong>Ordená los bloques con el mouse</strong><p>Arrastrá las secciones para cambiar el orden, activá o desactivá cada bloque y mirá la vista previa en vivo.</p></div></div>' +
      '<div class="ak-step"><span class="n">3</span><div class="grow"><strong>Editá textos, precios y contacto</strong><p>Podés cambiar todo a mano. Los servicios y libros aceptan una línea por ítem con el formato indicado.</p></div></div>' +
      '<div class="ak-step"><span class="n">4</span><div class="grow"><strong>Gestioná turnos y consultas</strong><p>La pestaña Agenda/CRM guarda turnos y muestra las consultas recibidas desde el directorio.</p></div></div>' +
      '<div class="ak-step"><span class="n">5</span><div class="grow"><strong>Descargá y publicá</strong><p>El ZIP incluye el sitio, manifest PWA, service worker, icono, configuración de Capacitor y una guía para Play Store.</p></div></div>' +
      '<h3 style="font-size:.95rem;margin-top:20px">Qué incluye el sitio generado</h3>' +
      '<div class="grid grid-3" style="gap:10px">' +
        ['Diseño responsive con tu marca', 'Turnos por WhatsApp o email', 'Tienda de libros/ebooks', 'Asistente de soporte Aura', 'SEO y datos estructurados', 'PWA instalable', 'Proyecto Android Capacitor', 'Modo offline básico', 'Sin PHP ni base de datos'].map(function (x) {
          return '<div class="chip chip-teal">✓ ' + esc(x) + '</div>';
        }).join('') +
      '</div>' +
      '<div class="ak-note" style="margin-top:18px">Límites honestos: AuraKit genera archivos y un asistente de reglas; no es un CRM clínico completo ni compila/firma apps por vos. Para historia clínica, usá Lizar. Para pagos online reales, conectá Mercado Pago/Stripe con tu desarrollo o un servicio externo.</div>' +
    '</div>';
  }
  function openAkAppointment(prefill) {
    var p = myPsych();
    if (!p) return;
    prefill = prefill || {};
    openModal({
      title: prefill.id ? 'Editar turno' : 'Nuevo turno',
      sub: 'AuraKit · agenda local del profesional.',
      body: '<form data-form="ak-appt" data-id="' + (prefill.id || '') + '">' +
        '<div class="form-grid">' +
          '<div class="field"><label>Paciente</label><input class="input" name="patientName" value="' + esc(prefill.patientName || '') + '" required></div>' +
          '<div class="field"><label>Servicio</label><input class="input" name="service" value="' + esc(prefill.service || ((p.services || [])[0] || {}).name || 'Consulta') + '"></div>' +
          '<div class="field"><label>Fecha</label><input class="input" type="date" name="date" value="' + esc(prefill.date || new Date().toISOString().slice(0, 10)) + '" required></div>' +
          '<div class="field"><label>Hora</label><input class="input" type="time" name="time" value="' + esc(prefill.time || '10:00') + '" required></div>' +
          '<div class="field"><label>Estado</label><select class="select" name="status">' +
            ['pending', 'confirmed', 'completed', 'cancelled'].map(function (s) { return '<option value="' + s + '"' + ((prefill.status || 'pending') === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') +
          '</select></div>' +
          '<div class="field span-2"><label>Notas</label><textarea class="textarea" name="notes" rows="2">' + esc(prefill.notes || '') + '</textarea></div>' +
        '</div>' +
        '<div class="form-actions"><button class="btn btn-primary" type="submit">Guardar turno</button><button class="btn btn-outline" type="button" data-act="close-modal">Cancelar</button></div>' +
      '</form>'
    });
  }
  function handleAkAppointment(form) {
    var p = myPsych();
    if (!p) return formError(form, 'Solo profesionales.');
    var id = form.dataset.id;
    var data = {
      patientName: form.elements.patientName.value.trim(),
      service: form.elements.service.value.trim(),
      date: form.elements.date.value,
      time: form.elements.time.value,
      status: form.elements.status.value,
      notes: form.elements.notes.value.trim()
    };
    if (!data.patientName || !data.date || !data.time) return formError(form, 'Completá paciente, fecha y hora.');
    if (id) {
      var appt = DB.appointments.filter(function (a) { return a.id === id && a.psyId === p.id; })[0];
      if (!appt) return formError(form, 'Turno no encontrado.');
      Object.keys(data).forEach(function (k) { appt[k] = data[k]; });
    } else {
      data.id = uid('ap');
      data.psyId = p.id;
      data.patientId = '';
      data.createdAt = new Date().toISOString();
      DB.appointments.push(data);
    }
    save();
    closeModal();
    toast('Agenda actualizada.', 'ok');
    akState.tab = 'agenda';
    renderAuraKit();
  }
  function akApptStatus(id, status) {
    var u = me();
    var p = myPsych();
    if (!u || !p) return;
    var a = DB.appointments.filter(function (x) { return x.id === id && x.psyId === p.id; })[0];
    if (!a) return;
    a.status = status;
    save();
    renderAuraKit();
  }
  function akApptDelete(id) {
    var p = myPsych();
    if (!p) return;
    if (!confirm('¿Eliminar este turno?')) return;
    DB.appointments = DB.appointments.filter(function (x) { return !(x.id === id && x.psyId === p.id); });
    save();
    renderAuraKit();
  }
  function handleAkPublished(form) {
    var p = myPsych();
    if (!p) return formError(form, 'Solo profesionales.');
    var project = DB.aurakitProjects.filter(function (x) { return x.id === form.dataset.id && x.psyId === p.id; })[0];
    if (!project) return formError(form, 'Proyecto no encontrado.');
    var url = form.elements.publishedUrl.value.trim();
    if (url && !safeUrl(url)) return formError(form, 'La URL debe empezar con https://.');
    project.publishedUrl = url;
    project.updatedAt = new Date().toISOString();
    if (url && !p.website) p.website = url;
    save();
    toast('Enlace guardado.', 'ok');
    renderAuraKit();
  }

  /* ---------------- AuraKit · generador de sitio ---------------- */
  function akSlug(s) {
    return String(s || 'sitio').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'sitio';
  }
  function akColor(c, fb) { return /^#[0-9a-f]{6}$/i.test(String(c || '')) ? c : fb; }
  function akInitials(name) {
    var parts = String(name || 'W').replace(/^(Lic\.|Dra\.|Dr\.|Mg\.|Ps\.)\s*/i, '').trim().split(/\s+/);
    return ((parts[0] || 'W')[0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }
  function akGenerateHtml(project, opts) {
    opts = opts || {};
    var p = project;
    var brand = akColor(p.brand, '#0f4a63');
    var accent = akColor(p.accent, '#17a589');
    var psy = psyById(p.psyId);
    var name = p.name || 'Consultorio';
    var headline = p.headline || 'Acompañamiento profesional';
    var sub = p.subheadline || '';
    var contact = p.contact || {};
    var wa = String(contact.whatsapp || '').replace(/[^\d]/g, '');
    var blocks = (p.blocks || []).filter(function (b) { return b.enabled; }).map(function (b) { return b.type; });
    function has(t) { return blocks.indexOf(t) !== -1; }
    var services = (p.services || []).filter(function (s) { return s.name; });
    var books = (p.books || []).filter(function (b) { return b.title; });
    var testimonials = (p.testimonials || []).filter(function (t) { return t.text; });

    var css = `:root{--brand:${brand};--accent:${accent};--ink:#142433;--muted:#5b6b7c;--line:#e3e9f0;--soft:#f6f9fc;--radius:18px}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--ink);background:#fff;line-height:1.65;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}a{color:var(--brand);text-decoration:none}h1,h2,h3{line-height:1.15;letter-spacing:-.02em;margin:0 0 .5em;color:var(--brand)}
h1{font-size:clamp(2.1rem,5vw,3.6rem)}h2{font-size:clamp(1.5rem,3.4vw,2.3rem)}p{margin:0 0 1rem;color:#3b4d60}
.wrap{max-width:1100px;margin:0 auto;padding:0 22px}.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 22px;border-radius:12px;font-weight:800;font-size:.95rem;border:1px solid transparent;cursor:pointer;transition:.15s}
.btn-primary{background:var(--accent);color:#fff}.btn-primary:hover{filter:brightness(.94);transform:translateY(-1px)}.btn-out{background:#fff;border-color:var(--line);color:var(--brand)}.btn-out:hover{border-color:var(--accent)}
.btn-wa{background:#25d366;color:#063d20}.btn-wa:hover{background:#1ebe5a;color:#fff}
header{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.94);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;gap:20px;padding:13px 22px;max-width:1100px;margin:0 auto}
.logo{display:flex;align-items:center;gap:9px;font-weight:900;color:var(--brand);font-size:1rem}.logo .mk{width:34px;height:34px;border-radius:10px;background:var(--brand);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.82rem;font-weight:900}
.nav .links{display:flex;gap:16px;margin-left:auto;flex-wrap:wrap}.nav .links a{font-size:.85rem;font-weight:600;color:var(--muted)}.nav .links a:hover{color:var(--brand)}
.nav .cta{background:var(--accent);color:#fff;padding:9px 16px;border-radius:9px;font-size:.85rem;font-weight:800}
@media(max-width:760px){.nav .links{display:none}.nav .cta{margin-left:auto}}
.hero{background:radial-gradient(900px 420px at 85% -20%,rgba(23,165,137,.34),transparent 60%),linear-gradient(135deg,#081b30,var(--brand) 70%,#123a5c);color:#fff;padding:74px 0 66px}
.hero h1{color:#fff;max-width:820px}.hero .sub{color:rgba(255,255,255,.82);font-size:1.08rem;max-width:650px}.hero .badges{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0 24px}
.hero .badges span{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#dff6f1;border-radius:999px;padding:5px 11px;font-size:.72rem;font-weight:700}
.hero .actions{display:flex;gap:10px;flex-wrap:wrap}.hero .btn-out{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.3);color:#fff}
.hero .meta{display:flex;gap:22px;flex-wrap:wrap;margin-top:26px;padding-top:18px;border-top:1px solid rgba(255,255,255,.18);font-size:.8rem;color:rgba(255,255,255,.75)}
section{padding:62px 0}.soft{background:var(--soft)}.head{max-width:720px;margin-bottom:30px}.head p{color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:18px}
.card{border:1px solid var(--line);border-radius:var(--radius);padding:22px;background:#fff;box-shadow:0 8px 24px rgba(16,32,52,.05)}
.card h3{font-size:1.02rem;margin-bottom:5px}.card p{font-size:.88rem;margin-bottom:10px}.price{font-size:1.25rem;font-weight:900;color:var(--accent);margin:6px 0}
.about{display:grid;grid-template-columns:180px 1fr;gap:26px;align-items:start}@media(max-width:700px){.about{grid-template-columns:1fr}}
.avatar{width:150px;height:150px;border-radius:50%;background:linear-gradient(135deg,var(--brand),var(--accent));color:#fff;display:flex;align-items:center;justify-content:center;font-size:2.4rem;font-weight:900}
.list{list-style:none;padding:0;margin:12px 0}.list li{padding:6px 0;border-bottom:1px dashed var(--line);font-size:.88rem}.list li:last-child{border:0}
.form{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:760px}@media(max-width:640px){.form{grid-template-columns:1fr}}
.form label{font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);display:block;margin-bottom:4px}
.form input,.form select,.form textarea{width:100%;padding:11px 12px;border:1px solid var(--line);border-radius:10px;font:inherit;background:#fff}
.form .full{grid-column:1/-1}
.quote{border-left:3px solid var(--accent);padding-left:14px;font-size:.9rem;color:#3b4d60}
.foot{background:#081b30;color:rgba(255,255,255,.65);padding:34px 0;font-size:.8rem}.foot .wrap{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.foot a{color:rgba(255,255,255,.8)}
.chat-fab{position:fixed;right:18px;bottom:18px;z-index:90;display:flex;flex-direction:column;gap:8px;align-items:flex-end}
.chat-fab .wa{background:#25d366;color:#063d20;border-radius:999px;padding:12px 16px;font-weight:900;font-size:.82rem;box-shadow:0 10px 24px rgba(37,211,102,.35)}
.chat-fab .aura{background:var(--brand);color:#fff;border-radius:999px;padding:12px 16px;font-weight:900;font-size:.82rem;border:0;box-shadow:0 10px 24px rgba(0,0,0,.25)}
.chat-panel{position:fixed;right:18px;bottom:78px;z-index:91;width:min(360px,92vw);background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 24px 60px rgba(16,32,52,.25);overflow:hidden;display:none}
.chat-panel.open{display:block}.chat-panel .ch{padding:12px 14px;background:var(--brand);color:#fff;font-weight:800;font-size:.86rem;display:flex;justify-content:space-between;align-items:center}
.chat-panel .ch button{background:none;border:0;color:#fff;font-size:1rem;cursor:pointer}
.chat-log{padding:12px;height:260px;overflow:auto;display:flex;flex-direction:column;gap:7px;background:#fbfcfe}
.chat-msg{max-width:88%;padding:8px 11px;border-radius:12px;font-size:.8rem;line-height:1.45;white-space:pre-wrap}.chat-msg.bot{background:#eef7f4;color:#173a31;align-self:flex-start}.chat-msg.me{background:var(--brand);color:#fff;align-self:flex-end}
.chat-in{display:flex;gap:6px;padding:9px;border-top:1px solid var(--line)}.chat-in input{flex:1;border:1px solid var(--line);border-radius:9px;padding:8px 10px;font-size:.82rem}.chat-in button{background:var(--accent);border:0;color:#fff;border-radius:9px;padding:8px 12px;font-weight:800;font-size:.8rem}
.notice{font-size:.74rem;color:var(--muted);background:#f7f9fc;border:1px dashed var(--line);border-radius:10px;padding:10px 12px;margin-top:14px}
`;
    var cssSafe = css.replace(/<\/style/gi, '<\\/style');

    var body = '';
    body += '<header><div class="nav"><a class="logo" href="#inicio"><span class="mk">' + esc(akInitials(name)) + '</span>' + esc(name) + '</a>' +
      '<nav class="links"><a href="#servicios">Servicios</a><a href="#sobre">Sobre mí</a><a href="#turnos">Turnos</a><a href="#libros">Libros</a><a href="#contacto">Contacto</a></nav>' +
      '<a class="cta" href="#turnos">' + esc(p.cta || 'Reservar') + '</a></div></header>';
    if (has('hero')) {
      body += '<section class="hero" id="inicio"><div class="wrap"><h1>' + esc(headline) + '</h1><p class="sub">' + esc(sub) + '</p>' +
        '<div class="badges"><span>Profesional matriculado</span><span>' + (psy && (psy.modalities || []).indexOf('online') !== -1 ? 'Online' : 'Presencial') + '</span><span>Respuesta en 24-48 h</span></div>' +
        '<div class="actions"><a class="btn btn-primary" href="#turnos">' + esc(p.cta || 'Reservar una consulta') + '</a>' +
        (wa ? '<a class="btn btn-out" href="https://wa.me/' + esc(wa) + '" target="_blank" rel="noopener">Escribir por WhatsApp</a>' : '') + '</div>' +
        '<div class="meta"><span>📍 ' + esc((psy && psy.city) || contact.address || 'Atención online') + '</span><span>🎓 ' + esc((psy && psy.license) || 'Matrícula profesional') + '</span><span>⭐ ' + esc((psy && psy.years) || 10) + ' años de experiencia</span></div>' +
      '</div></section>';
    }
    if (has('services')) {
      body += '<section id="servicios"><div class="wrap"><div class="head"><h2>Servicios y honorarios</h2><p>Precios orientativos. Si tenés cobertura o necesitás un plan de pagos, escribime y lo vemos.</p></div><div class="grid">' +
        (services.length ? services.map(function (s) {
          return '<div class="card"><h3>' + esc(s.name) + '</h3><p>' + esc(s.desc || '') + '</p><div class="price">' + (Number(s.price) > 0 ? akMoney(s.price) : 'Consultar') + '</div>' +
            (wa ? '<a class="btn btn-out boton-wa" href="https://wa.me/' + esc(wa) + '?text=' + encodeURIComponent('Hola, quiero consultar por ' + s.name) + '" target="_blank" rel="noopener">Consultar</a>' : '') + '</div>';
        }).join('') : '<div class="card"><h3>Consulta</h3><p>Escribime para conocer honorarios y modalidad.</p></div>') +
      '</div></div></section>';
    }
    if (has('about')) {
      body += '<section class="soft" id="sobre"><div class="wrap"><div class="head"><h2>Sobre mí</h2></div><div class="about">' +
        '<div class="avatar">' + esc(akInitials(name)) + '</div><div><h3>' + esc(name) + '</h3><p>' + esc(p.about || '') + '</p>' +
        '<ul class="list">' + (psy && psy.degrees && psy.degrees.length ? psy.degrees.slice(0, 3).map(function (d) { return '<li>🎓 ' + esc(d.title) + (d.institution ? ' · ' + esc(d.institution) : '') + '</li>'; }).join('') : '') +
        (psy && psy.specialties ? psy.specialties.slice(0, 5).map(function (s) { return '<li>✦ ' + esc(s) + '</li>'; }).join('') : '') +
        '<li>🪪 ' + esc((psy && psy.license) || 'Matrícula profesional') + '</li></ul></div></div></div></section>';
    }
    if (has('booking')) {
      body += '<section id="turnos"><div class="wrap"><div class="head"><h2>Reservar un turno</h2><p>Completá tus datos y te llevo a WhatsApp para confirmar día y horario. No se envía nada automáticamente.</p></div>' +
        '<form class="form" id="akBooking"><div><label>Nombre</label><input name="nombre" required placeholder="Tu nombre"></div>' +
        '<div><label>Servicio</label><select name="servicio">' + (services.length ? services.map(function (s) { return '<option>' + esc(s.name) + '</option>'; }).join('') : '<option>Consulta</option>') + '</select></div>' +
        '<div><label>Fecha</label><input type="date" name="fecha" required></div>' +
        '<div><label>Hora</label><input type="time" name="hora" required></div>' +
        '<div class="full"><label>Comentario (opcional)</label><textarea name="nota" rows="2" placeholder="Contá brevemente qué necesitás"></textarea></div>' +
        '<div class="full"><button class="btn btn-primary" type="submit">Solicitar turno</button></div></form>' +
        '<div class="notice">Al enviar se abre una conversación de WhatsApp con los datos del turno. Si no hay WhatsApp configurado, se abre un correo.</div>' +
        (contact.schedule ? '<p style="margin-top:12px"><strong>Horarios:</strong> ' + esc(contact.schedule) + '</p>' : '') +
      '</div></section>';
    }
    if (has('books')) {
      body += '<section class="soft" id="libros"><div class="wrap"><div class="head"><h2>Libros y ebooks</h2><p>Material para empezar a entenderte mejor, sin costo o con pago directo.</p></div><div class="grid">' +
        (books.length ? books.map(function (b) {
          return '<div class="card"><h3>' + esc(b.title) + '</h3><p>' + esc(b.desc || '') + '</p><div class="price">' + (Number(b.price) > 0 ? akMoney(b.price) : 'Gratis') + '</div>' +
            '<a class="btn btn-out" href="' + esc(safeUrl(b.url) || '#') + '" target="_blank" rel="noopener">' + (Number(b.price) > 0 ? 'Comprar' : 'Leer') + '</a></div>';
        }).join('') : '<div class="card"><h3>Próximamente</h3><p>Estamos preparando material para vos.</p></div>') +
      '</div></div></section>';
    }
    if (has('testimonials')) {
      body += '<section id="testimonios"><div class="wrap"><div class="head"><h2>Lo que dicen</h2><p>Testimonios de personas que pasaron por el proceso.</p></div><div class="grid">' +
        (testimonials.length ? testimonials.map(function (t) {
          return '<div class="card"><div class="quote">“' + esc(t.text) + '”</div><p style="margin-top:10px;font-weight:800;color:var(--brand)">' + esc(t.name) + '</p></div>';
        }).join('') : '<div class="card"><div class="quote">“Un espacio claro y humano.”</div></div>') +
      '</div></div></section>';
    }
    if (has('contact')) {
      body += '<section class="soft" id="contacto"><div class="wrap"><div class="head"><h2>Contacto</h2><p>Elegí el canal que te resulte más cómodo.</p></div><div class="grid">' +
        '<div class="card"><h3>WhatsApp</h3><p>' + (wa ? 'Escribime directamente.' : 'Configurá tu número en AuraKit.') + '</p>' + (wa ? '<a class="btn btn-wa" href="https://wa.me/' + esc(wa) + '" target="_blank" rel="noopener">Abrir WhatsApp</a>' : '') + '</div>' +
        '<div class="card"><h3>Email</h3><p>' + esc(contact.email || 'Completá tu email en AuraKit.') + '</p>' + (contact.email ? '<a class="btn btn-out" href="mailto:' + esc(contact.email) + '">Escribir</a>' : '') + '</div>' +
        '<div class="card"><h3>Consultorio</h3><p>' + esc(contact.address || 'Atención online.') + '</p>' + (contact.address ? '<a class="btn btn-out" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(contact.address) + '" target="_blank" rel="noopener">Ver mapa</a>' : '') + '</div>' +
      '</div></div></section>';
    }
    if (has('aura')) {
      body += '<section id="asistente"><div class="wrap"><div class="card" style="display:flex;gap:18px;align-items:center;justify-content:space-between;flex-wrap:wrap">' +
        '<div style="flex:1;min-width:220px"><h3 style="margin-bottom:4px">Asistente Aura</h3><p style="margin:0">Un asistente de orientación y contención disponible en esta web. Responde dudas frecuentes y ofrece ejercicios simples. No reemplaza una consulta ni una urgencia.</p></div>' +
        '<button class="btn btn-primary" onclick="document.querySelector(\'.chat-fab .aura\').click()">Hablar con Aura</button></div></div></section>';
    }
    body += '<footer class="foot"><div class="wrap"><div><strong style="color:#fff">' + esc(name) + '</strong><br>' + esc(contact.address || 'Atención online') + '</div>' +
      '<div>© ' + new Date().getFullYear() + ' · Hecho con AuraKit · <a href="https://winebox.clinic" target="_blank" rel="noopener">WineBox</a><br><span style="font-size:.72rem">La información de este sitio no reemplaza una consulta profesional.</span></div></div></footer>';

    var faq = [];
    faq.push({ k: ['precio', 'cuesta', 'honorario', 'cuanto', 'cuánto', 'valor'], a: 'Los honorarios orientativos son: ' + (services.map(function (s) { return s.name + ' ' + (Number(s.price) > 0 ? akMoney(s.price) : 'a consultar'); }).join(' · ') || 'consultar por WhatsApp') + '. Si necesitás un plan, escribime y lo vemos.' });
    faq.push({ k: ['turno', 'reservar', 'agendar', 'disponible', 'horario'], a: (contact.schedule ? 'Atiendo ' + contact.schedule + '. ' : '') + 'Podés reservar desde la sección Turnos o escribirme por WhatsApp.' });
    faq.push({ k: ['online', 'virtual', 'videollamada'], a: 'Sí, hay atención online por videollamada. Coordinamos el enlace al confirmar el turno.' });
    faq.push({ k: ['donde', 'dónde', 'consultorio', 'direccion', 'dirección'], a: contact.address ? 'El consultorio está en ' + contact.address + '. También atiendo online.' : 'La atención es online, desde donde estés.' });
    faq.push({ k: ['urgencia', 'crisis', 'suicid', 'matar', 'autolesi'], a: 'Si estás en peligro, no esperes: llamá al 135 (CABA), 911 o al servicio de emergencias de tu país. Este asistente no puede contactar servicios de emergencia.' });
    var faqJson = JSON.stringify(faq).replace(/</g, '\\u003c');
    var clientScript = `(function(){
  var AK={whatsapp:${JSON.stringify(wa)},email:${JSON.stringify(contact.email || '')},name:${JSON.stringify(name)}};
  var booking=document.getElementById('akBooking');
  if(booking){booking.addEventListener('submit',function(e){e.preventDefault();var f=new FormData(booking);var msg='Hola, quiero reservar un turno.\\nNombre: '+f.get('nombre')+'\\nServicio: '+f.get('servicio')+'\\nFecha: '+f.get('fecha')+'\\nHora: '+f.get('hora')+(f.get('nota')?'\\nNota: '+f.get('nota'):'');if(AK.whatsapp){window.open('https://wa.me/'+AK.whatsapp+'?text='+encodeURIComponent(msg),'_blank');}else if(AK.email){window.location.href='mailto:'+AK.email+'?subject='+encodeURIComponent('Turno')+'&body='+encodeURIComponent(msg);}else{alert('Este sitio todavía no tiene un canal de contacto configurado.');}});}
  var faq=${faqJson};
  var fab=document.querySelector('.chat-fab .aura'),panel=document.querySelector('.chat-panel'),log=document.getElementById('akChatLog'),input=document.getElementById('akChatInput');
  if(fab){fab.addEventListener('click',function(){panel.classList.toggle('open');if(panel.classList.contains('open'))input.focus();});}
  function add(kind,text){var d=document.createElement('div');d.className='chat-msg '+kind;d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;}
  function reply(t){var n=t.toLowerCase();for(var i=0;i<faq.length;i++){for(var j=0;j<faq[i].k.length;j++){if(n.indexOf(faq[i].k[j])!==-1)return faq[i].a;}}return 'Gracias por escribir. Puedo orientarte sobre precios, turnos, modalidad y ubicación. Para una consulta personal, escribime por WhatsApp o dejá tus datos en Turnos.';}
  var form=document.getElementById('akChatForm');
  if(form){form.addEventListener('submit',function(e){e.preventDefault();var t=input.value.trim();if(!t)return;add('me',t);input.value='';setTimeout(function(){add('bot',reply(t));},350);});}
  if('serviceWorker' in navigator && location.protocol.indexOf('http')===0){navigator.serviceWorker.register('service-worker.js').catch(function(){});}
})();`;
    var widgets = '<div class="chat-fab">' + (wa ? '<a class="wa" href="https://wa.me/' + esc(wa) + '" target="_blank" rel="noopener">WhatsApp</a>' : '') +
      '<button class="aura" type="button">Aura · Asistente</button></div>' +
      '<div class="chat-panel"><div class="ch"><span>AuraKit Assist</span><button type="button" aria-label="Cerrar" onclick="this.closest(\'.chat-panel\').classList.remove(\'open\')">×</button></div>' +
      '<div class="chat-log" id="akChatLog"><div class="chat-msg bot">Hola. Soy Aura, el asistente de ' + esc(name) + '. Puedo responder dudas sobre servicios, precios, turnos y modalidad. ¿Qué necesitás?</div></div>' +
      '<form class="chat-in" id="akChatForm"><input id="akChatInput" placeholder="Escribí tu pregunta…" autocomplete="off"><button type="submit">Enviar</button></form></div>';

    var schema = {
      '@context': 'https://schema.org', '@type': 'Psychologist', name: name,
      description: sub || headline, telephone: wa ? '+' + wa : undefined,
      address: contact.address || undefined, url: p.publishedUrl || undefined,
      areaServed: 'Argentina', priceRange: services.length ? akMoney(services[0].price) : undefined
    };
    return '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      '<title>' + esc(name) + ' · ' + esc(headline) + '</title>\n' +
      '<meta name="description" content="' + esc(sub || p.about || headline).slice(0, 158) + '">\n' +
      '<meta property="og:title" content="' + esc(name) + '">\n<meta property="og:description" content="' + esc(sub).slice(0, 158) + '">\n<meta property="og:type" content="website">\n' +
      '<meta name="theme-color" content="' + brand + '">\n<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" href="icon.svg" type="image/svg+xml">\n' +
      '<script type="application/ld+json">' + JSON.stringify(schema).replace(/</g, '\\u003c') + '</script>\n' +
      '<style>' + cssSafe + '</style>\n</head>\n<body>\n' + body + widgets +
      '<script>' + clientScript.replace(/<\/script/gi, '<\\/script') + '</script>\n</body>\n</html>';
  }
  function akMoney(n) {
    try { return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(n) || 0); }
    catch (e) { return '$' + Number(n || 0); }
  }
  function akGenerateManifest(project) {
    var slug = akSlug(project.name);
    return JSON.stringify({
      name: project.name, short_name: project.name.slice(0, 18), description: project.subheadline || project.headline,
      start_url: './', scope: './', display: 'standalone', orientation: 'portrait',
      background_color: '#ffffff', theme_color: akColor(project.brand, '#0f4a63'), lang: 'es-AR',
      icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      categories: ['health', 'medical', 'lifestyle'], id: '/' + slug
    }, null, 2);
  }
  function akGenerateIcon(project) {
    var brand = akColor(project.brand, '#0f4a63'), accent = akColor(project.accent, '#17a589');
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + brand + '"/><stop offset="1" stop-color="' + accent + '"/></linearGradient></defs><rect width="512" height="512" rx="96" fill="url(#g)"/><circle cx="256" cy="256" r="132" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="28"/><circle cx="256" cy="256" r="40" fill="#fff"/><text x="256" y="470" text-anchor="middle" fill="#fff" font-family="Arial" font-size="42" font-weight="700">' + esc(akInitials(project.name)) + '</text></svg>';
  }
  function akGenerateSW(project) {
    var slug = akSlug(project.name);
    return "const CACHE='ak-" + slug + "-v1';\nconst ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg'];\nself.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});\nself.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});\nself.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});return res;}).catch(()=>caches.match('./index.html'))));});\n";
  }
  function akGenerateCapacitor(project) {
    var slug = akSlug(project.name).replace(/-/g, '');
    if (!/^[a-z]/.test(slug)) slug = 'app' + slug;
    return JSON.stringify({
      appId: 'clinic.winebox.' + (slug || 'app'),
      appName: project.name,
      webDir: 'www',
      bundledWebRuntime: false,
      server: { androidScheme: 'https' }
    }, null, 2);
  }
  function akGeneratePackage(project) {
    var slug = akSlug(project.name);
    return JSON.stringify({
      name: 'winebox-' + slug, version: '1.0.0', private: true, description: project.name + ' · generado con AuraKit',
      scripts: { 'sync': 'cap sync', 'android': 'cap open android', 'add:android': 'cap add android' },
      dependencies: { '@capacitor/core': '^6.0.0', '@capacitor/android': '^6.0.0' },
      devDependencies: { '@capacitor/cli': '^6.0.0' }
    }, null, 2);
  }
  function akGenerateReadme(project) {
    return '# ' + project.name + ' · generado con AuraKit\n\n' +
      'Sitio web + PWA + proyecto Android (Capacitor) generado desde WineBOX.Clinic.\n\n' +
      '## Publicar en la web\n1. Subí `index.html`, `manifest.webmanifest`, `service-worker.js` e `icon.svg` a la raíz de tu hosting.\n2. Serví por HTTPS para que el service worker y la instalación PWA funcionen.\n3. Verificá el formulario de turnos y el número de WhatsApp.\n\n' +
      '## Publicar en Play Store (Android)\n1. El ZIP ya incluye la carpeta `www/` con el sitio; no hace falta copiar nada.\n2. Abrí una terminal en esta carpeta y ejecutá `npm install`.\n3. `npx cap add android`\n4. `npx cap sync`\n5. `npx cap open android` (requiere Android Studio)\n6. En Android Studio: Build > Generate Signed Bundle / APK > Android App Bundle (AAB).\n7. Subí el AAB a Google Play Console, completá la ficha y enviá a revisión.\n\n' +
      '> AuraKit no compila ni firma el AAB por vos, y no sube nada a Google Play. Necesitás una cuenta de desarrollador, una política de privacidad y cumplir las políticas de Play (salud, datos, pagos).\n\n' +
      '## Archivos\n- `index.html` (sitio autónomo, sin PHP)\n- `manifest.webmanifest` (PWA)\n- `service-worker.js` (offline básico)\n- `icon.svg`\n- `capacitor.config.json`\n- `package.json`\n- `www/` (copia lista para Capacitor)\n\n## Contacto\n' + (project.contact && project.contact.whatsapp ? 'WhatsApp: ' + project.contact.whatsapp + '\n' : '') + (project.contact && project.contact.email ? 'Email: ' + project.contact.email + '\n' : '') +
      '\nGenerado el ' + new Date().toLocaleDateString('es-AR') + '.';
  }
  function akFileList(project) {
    var html = akGenerateHtml(project, {});
    var manifest = akGenerateManifest(project);
    var sw = akGenerateSW(project);
    var icon = akGenerateIcon(project);
    return [
      { name: 'index.html', content: html },
      { name: 'manifest.webmanifest', content: manifest },
      { name: 'service-worker.js', content: sw },
      { name: 'icon.svg', content: icon },
      { name: 'capacitor.config.json', content: akGenerateCapacitor(project) },
      { name: 'package.json', content: akGeneratePackage(project) },
      { name: 'README-PUBLICAR.md', content: akGenerateReadme(project) },
      { name: 'www/index.html', content: html },
      { name: 'www/manifest.webmanifest', content: manifest },
      { name: 'www/service-worker.js', content: sw },
      { name: 'www/icon.svg', content: icon }
    ];
  }
  function akCrc32(bytes) {
    var c, crc = 0xFFFFFFFF, i, j;
    if (!akCrc32.table) {
      akCrc32.table = [];
      for (i = 0; i < 256; i++) {
        c = i;
        for (j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        akCrc32.table[i] = c >>> 0;
      }
    }
    for (i = 0; i < bytes.length; i++) crc = (crc >>> 8) ^ akCrc32.table[(crc ^ bytes[i]) & 0xFF];
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }
  function akZip(files) {
    var enc = new TextEncoder();
    var local = [], central = [], offset = 0;
    files.forEach(function (f) {
      var name = enc.encode(f.name);
      var data = typeof f.content === 'string' ? enc.encode(f.content) : f.content;
      var crc = akCrc32(data);
      var lh = new Uint8Array(30 + name.length);
      var dv = new DataView(lh.buffer);
      dv.setUint32(0, 0x04034b50, true);
      dv.setUint16(4, 20, true);
      dv.setUint16(6, 0x0800, true);
      dv.setUint16(8, 0, true);
      dv.setUint16(10, 0, true);
      dv.setUint16(12, 0, true);
      dv.setUint32(14, crc, true);
      dv.setUint32(18, data.length, true);
      dv.setUint32(22, data.length, true);
      dv.setUint16(26, name.length, true);
      dv.setUint16(28, 0, true);
      lh.set(name, 30);
      local.push(lh, data);
      var ch = new Uint8Array(46 + name.length);
      var cv = new DataView(ch.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, 0, true);
      cv.setUint16(14, 0, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, data.length, true);
      cv.setUint32(24, data.length, true);
      cv.setUint16(28, name.length, true);
      cv.setUint16(30, 0, true);
      cv.setUint16(32, 0, true);
      cv.setUint16(34, 0, true);
      cv.setUint16(36, 0, true);
      cv.setUint32(38, 0, true);
      cv.setUint32(42, offset, true);
      ch.set(name, 46);
      central.push(ch);
      offset += lh.length + data.length;
    });
    var centralSize = central.reduce(function (s, c) { return s + c.length; }, 0);
    var end = new Uint8Array(22);
    var ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true); ev.setUint16(6, 0, true);
    ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true);
    ev.setUint32(12, centralSize, true); ev.setUint32(16, offset, true);
    ev.setUint16(20, 0, true);
    var total = offset + centralSize + end.length;
    var out = new Uint8Array(total), pos = 0;
    local.concat(central, [end]).forEach(function (part) { out.set(part, pos); pos += part.length; });
    return out;
  }
  function akProjectSnapshot() {
    var form = $('form[data-form="ak-save"]');
    if (form) return akReadForm();
    return DB.aurakitProjects.filter(function (p) { return p.id === akState.projectId; })[0] || null;
  }
  function akDownloadHtml() {
    var p = akProjectSnapshot();
    if (!p) return toast('Primero creá un proyecto.', 'warn');
    downloadBlob(new Blob([akGenerateHtml(p, {})], { type: 'text/html;charset=utf-8' }), akSlug(p.name) + '.html');
    toast('HTML descargado.', 'ok');
  }
  function akDownloadZip() {
    var p = akProjectSnapshot();
    if (!p) return toast('Primero creá un proyecto.', 'warn');
    var bytes = akZip(akFileList(p));
    downloadBlob(new Blob([bytes], { type: 'application/zip' }), akSlug(p.name) + '-aurakit.zip');
    toast('ZIP generado con todos los archivos.', 'ok');
  }
  function akCopyHtml() {
    var p = akProjectSnapshot();
    if (!p) return;
    var html = akGenerateHtml(p, {});
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(html).then(function () { toast('HTML copiado al portapapeles.', 'ok'); }, function () { toast('No se pudo copiar. Usá Descargar HTML.', 'err'); });
    } else toast('Usá Descargar HTML en este navegador.', 'warn');
  }
  function akOpenPreview() {
    var p = akProjectSnapshot();
    if (!p) return;
    var w = window.open('', '_blank');
    if (w) { w.document.write(akGenerateHtml(p, {})); w.document.close(); }
    else toast('El navegador bloqueó la pestaña. Permití las ventanas emergentes.', 'warn');
  }
  var akDragType = null;
  function akDragStart(e) {
    var block = e.target.closest && e.target.closest('.ak-block');
    if (!block) return;
    akDragType = block.dataset.akType;
    block.classList.add('dragging');
    try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', akDragType); } catch (err) {}
  }
  function akDragOver(e) {
    var block = e.target.closest && e.target.closest('.ak-block');
    if (!block || !akDragType) return;
    e.preventDefault();
    $$('.ak-block.drag-over').forEach(function (b) { b.classList.remove('drag-over'); });
    block.classList.add('drag-over');
  }
  function akDrop(e) {
    var block = e.target.closest && e.target.closest('.ak-block');
    if (!block || !akDragType) return;
    e.preventDefault();
    var targetType = block.dataset.akType;
    var blocks = (akState.blocks || []).slice();
    var from = blocks.findIndex(function (b) { return b.type === akDragType; });
    var to = blocks.findIndex(function (b) { return b.type === targetType; });
    if (from === -1 || to === -1 || from === to) return;
    var moved = blocks.splice(from, 1)[0];
    blocks.splice(to, 0, moved);
    akState.blocks = blocks;
    akDragType = null;
    renderAkBlockList();
    updateAkPreview();
  }
  function akDragEnd() {
    akDragType = null;
    $$('.ak-block.dragging,.ak-block.drag-over').forEach(function (b) { b.classList.remove('dragging', 'drag-over'); });
  }
  function exportData() {
    try {
      var blob = new Blob([JSON.stringify(DB, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'winebox-comunidad-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      toast('Datos exportados.', 'ok');
    } catch (e) { toast('No se pudo exportar en este navegador.', 'err'); }
  }
  function importData(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(String(reader.result));
        if (!data || !Array.isArray(data.users) || !Array.isArray(data.psychs)) throw new Error('Formato inválido');
        if (!confirm('¿Reemplazar todos los datos actuales por los del archivo? Esta acción no se puede deshacer.')) return;
        DB = data;
        if (!DB.config) DB.config = clone(SEED.config);
        migrate();
        SESSION = null;
        saveSession();
        toast('Datos importados.', 'ok');
        navigate('#/');
        renderRoute();
      } catch (e) { toast('El archivo no es válido: ' + e.message, 'err'); }
    };
    reader.readAsText(file);
  }
  function resetDemo() {
    if (!confirm('Se borrarán todos los cambios y se restaurarán los datos de demostración. ¿Continuar?')) return;
    try {
      localStorage.removeItem(DB_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
    location.reload();
  }

  /* ---------------- Formularios / acciones ---------------- */
  function onClick(e) {
    var nav = e.target.closest('a[href^="#/"]');
    if (nav) closeMenu();
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.dataset.act, id = el.dataset.id;
    switch (act) {
      case 'close-modal': closeModal(); break;
      case 'close-utilities': closeModal(); break;
      case 'open-utilities': renderUtilities(); break;
      case 'open-login': openLogin(); break;
      case 'logout': logout(); break;
      case 'demo-login': {
        var res = doLogin(el.dataset.email, el.dataset.pass);
        if (res.ok) { closeModal(); toast('Bienvenido/a, ' + res.user.name + '.', 'ok'); afterLoginRoute(res.user); }
        else toast(res.msg, 'err');
        break;
      }
      case 'feed-filter': {
        feedFilter = el.dataset.filter || 'all';
        $$('#feedChips [data-act="feed-filter"]').forEach(function (b) { b.classList.toggle('active', b.dataset.filter === feedFilter); });
        renderFeedList();
        break;
      }
      case 'home-specialty': {
        dirState.specialty = el.dataset.cat || '';
        dirState.q = '';
        navigate('#/directorio');
        break;
      }
      case 'home-advanced': navigate('#/directorio'); break;
      case 'submit-composer': {
        var ta = document.querySelector('.wb-composer-ta');
        if (!ta || !ta.value.trim()) return toast('Escribí algo antes de publicar.', 'warn');
        var u = me();
        if (!u) return openLogin('Iniciá sesión para publicar.');
        var body = ta.value.trim().slice(0, 2000);
        var newPost = {
          id: 'post-' + Date.now(),
          authorId: u.id,
          createdAt: new Date().toISOString(),
          body: body,
          imageUrl: '', videoUrl: '', linkUrl: '',
          likes: [], comments: []
        };
        DB.posts.push(newPost);
        if (u.role === 'psy' || u.role === 'admin' || u.role === 'root') {
          award(u.id, 'post', 15);
        }
        save();
        ta.value = '';
        ta.style.height = 'auto';
        renderRoute();
        toast('Publicación creada. Sumaste 15 puntos.', 'ok');
        break;
      }
      case 'add-video': {
        var url = prompt(' pegá la URL de YouTube:');
        if (url && url.trim()) {
          var ta2 = document.querySelector('.wb-composer-ta');
          if (ta2) ta2.value += (ta2.value ? '\n' : '') + url.trim();
        }
        break;
      }
      case 'add-image': {
        var imgInput = document.createElement('input');
        imgInput.type = 'file'; imgInput.accept = 'image/*';
        imgInput.onchange = function() {
          if (!this.files || !this.files[0]) return;
          var reader = new FileReader();
          reader.onload = function(e) {
            var ta3 = document.querySelector('.wb-composer-ta');
            if (ta3) ta3.value += (ta3.value ? '\n' : '') + '[Imagen adjunta]';
          };
          reader.readAsDataURL(this.files[0]);
        };
        imgInput.click();
        break;
      }
      case 'add-doc': {
        var docInput = document.createElement('input');
        docInput.type = 'file'; docInput.accept = '.pdf,.doc,.docx,.txt';
        docInput.onchange = function() {
          if (!this.files || !this.files[0]) return;
          var ta4 = document.querySelector('.wb-composer-ta');
          if (ta4) ta4.value += (ta4.value ? '\n' : '') + '[Documento: ' + this.files[0].name + ']';
        };
        docInput.click();
        break;
      }
      case 'add-link': {
        var linkUrl = prompt('Ingresá la URL del enlace:');
        if (linkUrl && linkUrl.trim()) {
          var ta5 = document.querySelector('.wb-composer-ta');
          if (ta5) ta5.value += (ta5.value ? '\n' : '') + linkUrl.trim();
        }
        break;
      }
      case 'carousel-dot': {
        playTick();
        var rail3 = $('#' + (el.dataset.target||'proCarousel'));
        if (rail3) rail3.scrollTo({ left: Number(el.dataset.page) * rail3.clientWidth, behavior: 'smooth' });
        break;
      }
      case 'carousel-prev': {
        playTick();
        var t1 = $('#' + (el.dataset.target||'proCarousel'));
        if (t1) carouselStep(t1, -1);
        break;
      }
      case 'carousel-next': {
        playTick();
        var t2 = $('#' + (el.dataset.target||'proCarousel'));
        if (t2) carouselStep(t2, 1);
        break;
      }
      case 'schedule-preset': {
        var preset = el.dataset.preset;
        var form = el.closest('form');
        if (!form) break;
        WEEK_DAYS.forEach(function (d, i) {
          var en = form.elements['day' + i + 'Enabled'];
          var from = form.elements['day' + i + 'From'];
          var to = form.elements['day' + i + 'To'];
          if (!en || !from || !to) return;
          if (preset === 'week') {
            en.checked = i < 5; from.value = '09:00'; to.value = '19:00';
          } else if (preset === 'long') {
            en.checked = i < 6; from.value = '10:00'; to.value = '20:00';
          } else if (preset === 'clear') {
            en.checked = false;
          }
          var row = en.closest('.schedule-row');
          if (row) row.classList.toggle('on', en.checked);
        });
        break;
      }
      case 'feed-focus': {
        if (parseRoute().name !== 'home') navigate('#/');
        else { feedFilter = 'all'; renderHome(); }
        break;
      }
      case 'post-like': togglePostLike(id); break;
      case 'post-delete': deletePost(id); break;
      case 'comment-delete': deleteComment(el.dataset.post, id); break;
      case 'post-comment-focus': {
        var card = el.closest('[data-post]');
        var ci = card ? card.querySelector('.comment-form input') : null;
        if (ci) ci.focus();
        break;
      }
      case 'post-share': sharePost(id); break;
      case 'forum-topic': forumState.category = el.dataset.cat || ''; navigate('#/comunidad'); break;
      case 'patient-review-open': {
        var pat = userById(id);
        if (!pat) break;
        if (!canReviewPatient(id)) { toast('No podés reseñar este paciente ahora.','warn'); break; }
        openModal('<h2 style="margin-top:0">Reseña de paciente</h2>' +
          '<p class="small muted">Solo visible para profesionales. Ayuda a la comunidad a conocer al paciente.</p>' +
          '<form data-form="patient-review" data-id="'+id+'" class="modal-form">' +
            '<div class="field"><label>Calificación</label>' +
              '<select class="select" name="rating"><option value="">Elegí…</option>' +
                '<option value="5">⭐⭐⭐⭐⭐ Excelente paciente</option>' +
                '<option value="4">⭐⭐⭐⭐ Muy buen paciente</option>' +
                '<option value="3">⭐⭐⭐ Normal</option>' +
                '<option value="2">⭐⭐ Paciente difícil</option>' +
                '<option value="1">⭐ No recomendado</option>' +
              '</select></div>' +
            '<div class="field"><label>Comentario (privado)</label>' +
              '<textarea class="textarea" name="comment" rows="3" placeholder="Describí la experiencia de trabajo…" minlength="10"></textarea></div>' +
            '<div class="form-actions"><button class="btn btn-primary" type="submit">Guardar reseña</button>' +
              '<button type="button" class="btn btn-ghost" data-act="close-modal">Cancelar</button></div>' +
          '</form>');
        break;
      }
      case 'chat-open':

        if (!me()) return openLogin('Ingresá para enviar mensajes directos.');
        navigate('#/mensajes/' + id);
        break;
      case 'chat-dock-toggle':
        if (!me()) return openLogin('Ingresá para usar el chat.');
        dockState.open = !dockState.open;
        if (!dockState.open) { dockState.partner = null; dockState.max = false; }
        renderAuraDock();
        break;
      case 'chat-dock-open':
        if (!me()) return openLogin('Ingresá para usar el chat.');
        dockState.open = true;
        dockState.partner = id;
        markConversationRead(id);
        renderAuraDock();
        break;
      case 'chat-dock-back':
        dockState.partner = null;
        renderAuraDock();
        break;
      case 'chat-dock-close':
        dockState.open = false; dockState.partner = null; dockState.max = false;
        renderAuraDock();
        break;
      case 'chat-dock-max':
        dockState.max = !dockState.max;
        renderAuraDock();
        break;
      case 'new-message': openNewMessage(); break;
      case 'root-edit': openRootUserForm(id); break;
      case 'root-new': openRootUserForm(''); break;
      case 'root-pass': openRootPassword(id); break;
      case 'root-verify': rootToggleVerify(id); break;
      case 'root-block': rootToggleBlock(id); break;
      case 'root-delete': deleteUserCascade(id); break;
      case 'root-clear': rootState = { q: '', role: 'all' }; renderRoot(); break;
      case 'ak-select': akState.projectId = id; akState.loadedId = null; akState.tab = 'diseno'; renderAuraKit(); break;
      case 'ak-new': handleAkNew(el.dataset.template || 'sesiones'); break;
      case 'ak-tab': akState.tab = el.dataset.tab || 'diseno'; renderAuraKit(); break;
      case 'ak-ai': {
        var aiInput = $('#akAiText');
        akApplyAI(aiInput ? aiInput.value : '');
        break;
      }
      case 'ak-voice': akVoice(); break;
      case 'ak-template': akApplyTemplate(el.dataset.template || 'sesiones'); break;
      case 'ak-add-block': akAddBlock(el.dataset.type); break;
      case 'ak-remove-block': akRemoveBlock(el.dataset.type); break;
      case 'ak-preview': updateAkPreview(); toast('Vista previa actualizada.', 'ok', 2000); break;
      case 'ak-download-html': akDownloadHtml(); break;
      case 'ak-download-zip': akDownloadZip(); break;
      case 'ak-copy-html': akCopyHtml(); break;
      case 'ak-open-preview': akOpenPreview(); break;
      case 'ak-new-appt': openAkAppointment({}); break;
      case 'ak-appt-status': akApptStatus(id, el.dataset.status); break;
      case 'ak-appt-delete': akApptDelete(id); break;
      case 'ak-appt-from-contact': {
        var contact = DB.contacts.filter(function (c) { return c.id === id; })[0];
        if (!contact) break;
        var cu = userById(contact.patientId);
        openAkAppointment({ patientName: cu ? cu.name : 'Paciente', service: contact.subject, notes: contact.message.slice(0, 140) });
        break;
      }
      case 'contact': openContact(id); break;
      case 'review': openReview(id); break;
      case 'ask': openAsk(); break;
      case 'vote':
        if (!me()) return openLogin('Ingresá como paciente para votar respuestas.');
        voteAnswer(id, el.dataset.q);
        break;
      case 'accept': acceptAnswer(id, el.dataset.q); break;
      case 'publish': openPublish(); break;
      case 'open-pub': openPublication(id); break;
      case 'like-pub': likePublication(id); break;
      case 'copy-link': copyLink(); break;
      case 'report': openReport(el.dataset.type, id); break;
      case 'panel-tab': panelTab = el.dataset.tab; renderPanel(); break;
      case 'forum-cat': forumState.category = el.dataset.cat || ''; renderForum(); break;
      case 'pub-type': pubState.type = el.dataset.type || 'all'; renderPublications(); break;
      case 'clear-dir':
        dirState = { q: '', specialty: '', modality: '', province: '', maxPrice: '', sort: 'points', accepting: false };
        renderDirectory();
        break;
      case 'reg-tab': navigate('#/registro/' + el.dataset.role); break;
      case 'export': exportData(); break;
      case 'import': {
        var inp = document.querySelector('input[data-import]');
        if (inp) inp.click();
        break;
      }
      case 'reset': resetDemo(); break;
      case 'breath': openBreath(); break;
      case 'breath-start': startBreath(); break;
      case 'grounding': openGrounding(); break;
      case 'crisis': openCrisis(); break;
      case 'chat-suggest': sendChat(el.dataset.text || el.textContent); break;
      case 'aura-btn': sendChat(el.dataset.q || el.textContent); break;
      case 'aura-guide': sendChat('¿Cómo puedo navegar por el sitio?'); break;
      case 'aura-instructions': sendChat('¿Cómo publico, busco profesionales y uso las funciones?'); break;
      case 'aura-questionnaire': sendChat('Quiero hacer el cuestionario de bienestar'); break;
      case 'aura-chat': sendChat('Quiero charlar'); break;
      case 'contact-status': setContactStatus(id, el.dataset.status); break;
      case 'verify': toggleVerify(id); break;
      case 'resolve-report': resolveReport(id); break;
      default: break;
    }
  }

  function onInput(e) {
    var el = e.target;
    // auto-resize composer textarea
    if (el.classList.contains('wb-composer-ta')) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }
    if (el.dataset.filter === 'dir-q') { dirState.q = el.value; debounce(renderDirResults, 180); }
    else if (el.dataset.filter === 'forum-q') { forumState.q = el.value; debounce(renderForumList, 180); }
    else if (el.dataset.filter === 'pub-q') { pubState.q = el.value; debounce(renderPubGrid, 180); }
    else if (el.dataset.filter === 'root-q') { rootState.q = el.value; debounce(renderRootUsers, 160); }
    else if (el.closest && el.closest('form[data-form="ak-save"]')) { debounce(updateAkPreview, 260); }
  }
  function onChange(e) {
    var el = e.target;
    if (el.dataset.filter === 'dir-specialty') { dirState.specialty = el.value; renderDirResults(); }
    else if (el.dataset.filter === 'dir-modality') { dirState.modality = el.value; renderDirResults(); }
    else if (el.dataset.filter === 'dir-province') { dirState.province = el.value; renderDirResults(); }
    else if (el.dataset.filter === 'dir-price') { dirState.maxPrice = el.value; renderDirResults(); }
    else if (el.dataset.filter === 'dir-sort') { dirState.sort = el.value; renderDirResults(); }
    else if (el.dataset.filter === 'dir-accepting') { dirState.accepting = el.checked; renderDirResults(); }
    else if (el.dataset.filter === 'forum-status') { forumState.status = el.value; renderForumList(); }
    else if (el.dataset.filter === 'forum-sort') { forumState.sort = el.value; renderForumList(); }
    else if (el.dataset.filter === 'pub-cat') { pubState.category = el.value; renderPubGrid(); }
    else if (el.dataset.filter === 'root-role') { rootState.role = el.value; renderRootUsers(); }
    else if (el.matches && el.matches('input[data-image]')) {
      readImageFile(el, el.closest('form'));
    } else if (el.matches && el.matches('[data-ak-toggle]')) {
      if (typeof updateAkBlockState === 'function') updateAkBlockState(el);
    } else if (el.matches && el.matches('input[data-import]')) {
      if (el.files && el.files[0]) importData(el.files[0]);
    }
  }

  function onSubmit(e) {
    var form = e.target.closest('form[data-form]');
    if (!form) return;
    e.preventDefault();
    clearError(form);
    var kind = form.dataset.form, id = form.dataset.id;
    try {
      if (kind === 'login') return handleLogin(form);
      if (kind === 'register') return handleRegister(form);
      if (kind === 'hero-search') return handleHeroSearch(form);
      if (kind === 'home-search') return handleHomeSearch(form);
      if (kind === 'ask') return handleAsk(form);
      if (kind === 'answer') return handleAnswer(form, id);
      if (kind === 'contact') return handleContact(form, id);
      if (kind === 'review') return handleReview(form, id);
      if (kind === 'report') return handleReport(form, form.dataset.type, id);
      if (kind === 'psy-profile') return handlePsyProfile(form, id);
      if (kind === 'publish') return handlePublish(form);
      if (kind === 'patient-profile') return handlePatientProfile(form);
      if (kind === 'post') return handlePost(form);
      if (kind === 'comment') return handleComment(form, id);
      if (kind === 'patient-review') return handlePatientReview(form, id);
      if (kind === 'chat') return handleChatSend(form, id);
      if (kind === 'chat-dock') return handleChatDockSend(form, id);
      if (kind === 'new-message') {
        var target = form.elements.userId.value;
        closeModal();
        navigate('#/mensajes/' + target);
        return;
      }
      if (kind === 'root-login') return handleRootLogin(form);
      if (kind === 'root-user') return handleRootUser(form);
      if (kind === 'root-pass') return handleRootPassword(form);
      if (kind === 'ak-save') return handleAkSave(form);
      if (kind === 'ak-appt') return handleAkAppointment(form);
      if (kind === 'ak-published') return handleAkPublished(form);
      if (kind === 'chat-aura') {
        var input = form.querySelector('input[name=msg]');
        var text = input ? input.value : '';
        if (input) input.value = '';
        sendChat(text);
        return;
      }
    } catch (err) {
      console.error(err);
      formError(form, 'Ocurrió un error inesperado. Intentá de nuevo.');
    }
  }

  /* ---------------- Acciones de red social / chat ---------------- */
  function handlePost(form) {
    var u = me();
    if (!u) return formError(form, 'Ingresá para publicar.');
    var body = String(form.elements.body.value || '').trim();
    var imageUrl = String(form.elements.imageUrl.value || '').trim();
    if (body.length < 2) return formError(form, 'Escribí algo para publicar.');
    if (body.length > 2000) return formError(form, 'El texto supera los 2000 caracteres.');
    if (imageUrl && !safeUrl(imageUrl)) return formError(form, 'La imagen debe ser una URL válida o un archivo subido.');
    DB.posts.push({ id: uid('post'), authorId: u.id, body: body, imageUrl: imageUrl, likes: [], comments: [], createdAt: new Date().toISOString() });
    save();
    toast('Publicación creada.', 'ok');
    if (parseRoute().name === 'home') renderHome();
    else renderRoute();
  }
  function handleComment(form, postId) {
    var u = me();
    if (!u) return formError(form, 'Ingresá para comentar.');
    var post = DB.posts.filter(function (p) { return p.id === postId; })[0];
    if (!post) return formError(form, 'La publicación ya no existe.');
    var body = String(form.elements.body.value || '').trim();
    if (body.length < 1) return formError(form, 'Escribí un comentario.');
    post.comments = post.comments || [];
    post.comments.push({ id: uid('pc'), authorId: u.id, body: body.slice(0, 500), createdAt: new Date().toISOString() });
    save();
    if (parseRoute().name === 'home') renderFeedList();
    else renderRoute();
  }
  function togglePostLike(postId) {
    var u = me();
    if (!u) return openLogin('Ingresá para reaccionar a las publicaciones.');
    var post = DB.posts.filter(function (p) { return p.id === postId; })[0];
    if (!post) return;
    post.likes = post.likes || [];
    var i = post.likes.indexOf(u.id);
    if (i === -1) post.likes.push(u.id); else post.likes.splice(i, 1);
    save();
    if (parseRoute().name === 'home') renderFeedList();
    else renderRoute();
  }
  function deletePost(postId) {
    var u = me();
    var post = DB.posts.filter(function (p) { return p.id === postId; })[0];
    if (!post) return;
    if (!u || (u.id !== post.authorId && u.role !== 'root' && u.role !== 'admin')) return toast('No tenés permiso para eliminar esta publicación.', 'warn');
    if (!confirm('¿Eliminar esta publicación y sus comentarios?')) return;
    DB.posts = DB.posts.filter(function (p) { return p.id !== postId; });
    save();
    toast('Publicación eliminada.', 'ok');
    if (parseRoute().name === 'home') renderHome(); else renderRoute();
  }
  function deleteComment(postId, commentId) {
    var u = me();
    var post = DB.posts.filter(function (p) { return p.id === postId; })[0];
    if (!post) return;
    var c = (post.comments || []).filter(function (x) { return x.id === commentId; })[0];
    if (!c) return;
    if (!u || (u.id !== c.authorId && u.role !== 'root' && u.role !== 'admin')) return toast('No tenés permiso.', 'warn');
    post.comments = post.comments.filter(function (x) { return x.id !== commentId; });
    save();
    if (parseRoute().name === 'home') renderFeedList(); else renderRoute();
  }
  function sharePost(postId) {
    var post = DB.posts.filter(function (p) { return p.id === postId; })[0];
    if (!post) return;
    var url = location.origin + location.pathname + '#/post/' + postId;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { toast('Enlace de la publicación copiado.', 'ok'); }, function () { toast('Copiá el enlace: ' + url, 'warn', 7000); });
    } else toast('Enlace: ' + url, 'warn', 7000);
  }
  function renderPostPage(id) {
    var post = DB.posts.filter(function (p) { return p.id === id; })[0];
    if (!post) return renderNotFound();
    VIEW.innerHTML = '<div class="container page" style="max-width:720px">' +
      '<p class="small" style="margin-bottom:12px"><a href="#/">Inicio</a> / Publicación</p>' +
      postCardHtml(post) +
      '<div class="panel" style="margin-top:16px"><h2 style="margin-top:0;font-size:1rem">Comentarios</h2>' +
        '<p class="small muted">Los comentarios están dentro de la publicación. Podés responder ahí mismo.</p>' +
        '<a class="btn btn-outline btn-sm" href="#/">Volver al feed</a></div>' +
    '</div>';
  }
  function handleChatSend(form, partnerId) {
    var u = me();
    if (!u) return formError(form, 'Ingresá para enviar mensajes.');
    var partner = userById(partnerId);
    if (!partner || partner.id === u.id) return formError(form, 'Conversación no válida.');
    var body = String(form.elements.body.value || '').trim();
    if (!body) return formError(form, 'Escribí un mensaje.');
    if (body.length > 2000) return formError(form, 'El mensaje es demasiado largo.');

    // Verificar permiso para chatear
    var canChat = false;
    if (window.ICQChat) {
      canChat = window.ICQChat.canChat(partner.id, u.id);
    } else {
      var DB = window.WBApp ? window.WBApp.db() : null;
      if (DB) {
        if (u.id === 'u-root' || partner.id === 'u-root') canChat = true;
        if (!canChat && DB.contacts) {
          canChat = DB.contacts.some(function(c) {
            return c.status === 'accepted' &&
                   ((c.psyId === partner.id && c.patientId === u.id) ||
                    (c.psyId === u.id && c.patientId === partner.id));
          });
        }
      }
    }

    if (!canChat) {
      return formError(form, 'No tenés permiso para chatear con este usuario. Necesitás tener un contacto aceptado.');
    }

    // Enviar mensaje ICQ (no se guarda en BD principal)
    if (window.ICQChat) {
      window.ICQChat.send(partner.id, body).catch(function(err) {
        console.error('[ICQ] Error:', err);
      });
    }

    // Actualizar timestamps
    u.lastSeen = new Date().toISOString();
    u.online = true;
    save();

    renderMessages(partner.id);
  }
  function handleRootLogin(form) {
    var email = form.elements.email.value.trim();
    var pass = form.elements.password.value;
    var res = doLogin(email, pass);
    if (!res.ok) return formError(form, res.msg);
    if (res.user.role !== 'root') {
      SESSION = null; saveSession(); renderHeader();
      return formError(form, 'Esa cuenta no tiene permisos de root.');
    }
    toast('Consola root desbloqueada.', 'warn');
    navigate('#/root');
    renderRoot();
  }
  function handleLogin(form) {
    var email = form.elements.email.value.trim();
    var pass = form.elements.password.value;
    if (!email || !pass) return formError(form, 'Completá email y contraseña.');
    var res = doLogin(email, pass);
    if (!res.ok) return formError(form, res.msg);
    closeModal();
    toast('Bienvenido/a, ' + res.user.name + '.', 'ok');
    afterLoginRoute(res.user);
    // Actualizar widget de Aura
    setTimeout(function() {
      if (window.Aura) window.Aura.reset();
      auraHistory = [];
      renderAuraDock();
    }, 300);
  }
  function afterLoginRoute(user) {
    // Siempre ir al home después del login
    location.hash = '#/';
    // Forzar renderizado
    setTimeout(function() {
      renderRoute();
      renderHeader();
      renderAuraDock();
    }, 50);
  }

  function handleRegister(form) {
    var role = form.dataset.role === 'psy' ? 'psy' : 'patient';
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var city = form.elements.city.value.trim();
    var pass = form.elements.password.value;
    var pass2 = form.elements.password2.value;
    var license = role === 'psy' ? form.elements.license.value.trim() : '';
    if (name.length < 3) return formError(form, 'Ingresá tu nombre completo.');
    if (pass.length < 8) return formError(form, 'La contraseña debe tener al menos 8 caracteres.');
    if (pass !== pass2) return formError(form, 'Las contraseñas no coinciden.');
    if (role === 'psy' && license.length < 3) return formError(form, 'Ingresá tu matrícula profesional.');
    if (!form.elements.terms.checked) return formError(form, 'Tenés que aceptar las normas de la comunidad.');

    // Usar API del servidor si está disponible
    if (window.WBAPI) {
      return window.WBAPI.register({ name: name, email: email, password: pass, role: role, city: city })
        .then(function (resp) {
          SESSION = { userId: resp.user.id, token: resp.token, ts: Date.now() };
          saveSession();
          touchPresence();
          renderHeader();
          closeModal();
          toast(role === 'psy' ? 'Perfil creado. Completalo para aparecer mejor rankeado.' : 'Cuenta creada. Ya podés contactar psicólogos y preguntar.', 'ok');
          navigate('#/');
          renderRoute();
          if (role === 'psy') setTimeout(function () { panelTab = 'perfil'; renderPanel(); toast('Completá tu perfil: presentación, especialidades, honorarios y formación.', 'warn', 6500); }, 120);
        })
        .catch(function (e) {
          formError(form, e.error || 'Error al crear la cuenta. Intentá de nuevo.');
        });
    }

    // Fallback local
    if (DB.users.some(function (u) { return normalize(u.email) === normalize(email); })) return formError(form, 'Ya existe una cuenta con ese email. Probá ingresar.');
    var uidv = uid(role === 'psy' ? 'u-psy' : 'u-pat');
    var salt = uid('s');
    var user = {
      id: uidv, role: role, name: name, email: email, city: city, salt: salt,
      passHash: hashPass(pass, salt), createdAt: new Date().toISOString(),
      color: colorFor(name), avatarUrl: '', website: '', whatsapp: '', bio: '', headline: '',
      online: true, lastSeen: new Date().toISOString(), blocked: false
    };
    DB.users.push(user);
    if (role === 'psy') {
      var newPsy = {
        id: uid('psy'), userId: uidv, name: name, headline: '', bio: '',
        specialties: [], approaches: [], modalities: ['online'], city: city,
        province: '', country: 'Argentina', address: '', mapQuery: city,
        languages: ['Español'], license: license, years: 0, degrees: [],
        certifications: [], services: [], currency: 'ARS', paymentMethods: [],
        coverage: [], availability: [], whatsapp: '', website: '',
        acceptingNew: true, verified: false, responseTime: '1 a 2 días',
        photoUrl: '', createdAt: new Date().toISOString()
      };
      DB.psychs.push(newPsy);
      DB.aurakitProjects.push(auraKitBlank(name + ' · AuraKit', newPsy.id, user));
    }
    save();
    SESSION = { userId: uidv, ts: Date.now() };
    saveSession();
    renderHeader();
    closeModal();
    toast(role === 'psy' ? 'Perfil creado. Completalo para aparecer mejor rankeado.' : 'Cuenta creada. Ya podés contactar psicólogos y preguntar.', 'ok');
    navigate('#/');
    renderRoute();
    if (role === 'psy') setTimeout(function () { panelTab = 'perfil'; renderPanel(); toast('Completá tu perfil: presentación, especialidades, honorarios y formación.', 'warn', 6500); }, 120);
  }

  function handleHeroSearch(form) {
    dirState.q = (form.elements.q || {}).value ? form.elements.q.value.trim() : '';
    dirState.specialty = (form.elements.specialty || {}).value ? form.elements.specialty.value : '';
    dirState.sort = 'points';
    navigate('#/directorio');
  }
  function handleHomeSearch(form) {
    dirState.q = (form.elements.q || {}).value ? form.elements.q.value.trim() : '';
    dirState.specialty = (form.elements.specialty || {}).value ? form.elements.specialty.value : '';
    dirState.modality = (form.elements.modality || {}).value ? form.elements.modality.value : '';
    dirState.sort = 'points';
    navigate('#/directorio');
  }

  function handlePatientProfile(form) {
    var u = me();
    if (!u) return;
    var name = form.elements.name.value.trim();
    if (name.length < 3) return formError(form, 'Ingresá un nombre válido.');
    var website = form.elements.website.value.trim();
    if (website && !safeUrl(website)) return formError(form, 'El sitio web debe empezar con https:// (o dejar vacío).');
    var avatarUrl = form.elements.avatarUrl.value.trim();
    if (avatarUrl && !safeUrl(avatarUrl)) return formError(form, 'La foto debe ser una URL válida o una imagen subida.');
    u.name = name;
    u.city = form.elements.city.value.trim();
    u.headline = form.elements.headline.value.trim();
    u.bio = form.elements.bio.value.trim();
    u.website = website;
    u.whatsapp = form.elements.whatsapp.value.replace(/[^\d]/g, '');
    u.avatarUrl = avatarUrl;
    save();
    renderHeader();
    toast('Perfil actualizado.', 'ok');
    renderAccount();
  }

  function handleAsk(form) {
    var u = me();
    if (!u || u.role !== 'patient') return formError(form, 'Solo los pacientes registrados pueden abrir preguntas.');
    var title = form.elements.title.value.trim();
    var body = form.elements.body.value.trim();
    var category = form.elements.category.value;
    var tags = form.elements.tags.value.split(',').map(function (t) { return t.trim(); }).filter(Boolean).slice(0, 5);
    if (title.length < 12) return formError(form, 'Escribí un título más descriptivo (mínimo 12 caracteres).');
    if (body.length < 40) return formError(form, 'Contá un poco más (mínimo 40 caracteres) para que puedan orientarte.');
    var q = {
      id: uid('q'), authorId: u.id, category: category, title: title, body: body,
      tags: tags, createdAt: new Date().toISOString(), views: 0, status: 'open', answers: []
    };
    DB.questions.push(q);
    DB.posts.push({
      id: uid('post'), authorId: u.id, body: 'Nueva consulta en la comunidad: ' + title + '\n\n' + body.slice(0, 220) + (body.length > 220 ? '…' : ''),
      imageUrl: '', likes: [], comments: [], questionId: q.id, createdAt: new Date().toISOString()
    });
    save();
    closeModal();
    toast('Pregunta publicada. Los psicólogos de la comunidad pueden responderla.', 'ok');
    navigate('#/pregunta/' + q.id);
    renderRoute();
  }

  function handleAnswer(form, qid) {
    var u = me();
    if (!u || u.role !== 'psy') return formError(form, 'Solo los psicólogos pueden responder.');
    var p = myPsych();
    if (!p) return formError(form, 'No encontramos tu perfil profesional.');
    var q = DB.questions.filter(function (x) { return x.id === qid; })[0];
    if (!q) return formError(form, 'La pregunta ya no existe.');
    if (q.answers.some(function (a) { return a.psyId === p.id; })) return formError(form, 'Ya respondiste esta pregunta.');
    var body = form.elements.body.value.trim();
    if (body.length < 40) return formError(form, 'La respuesta es demasiado corta (mínimo 40 caracteres).');
    var answer = {
      id: uid('a'), psyId: p.id, body: body, createdAt: new Date().toISOString(),
      upvotes: [], accepted: false
    };
    q.answers.push(answer);
    q.status = 'answered';
    award(p.id, 'answer', 10, 'Respuesta publicada: "' + q.title.slice(0, 60) + '"', q.id);
    save();
    toast('Respuesta publicada. Sumaste +10 puntos.', 'ok');
    renderQuestion(qid);
  }

  function handleContact(form, psyId) {
    var u = me();
    if (!u || u.role !== 'patient') return formError(form, 'Necesitás una cuenta de paciente para contactar.');
    var p = psyById(psyId);
    if (!p) return formError(form, 'Profesional no encontrado.');
    var subject = form.elements.subject.value.trim();
    var message = form.elements.message.value.trim();
    if (subject.length < 4) return formError(form, 'Indicá un motivo breve.');
    if (message.length < 20) return formError(form, 'Contá un poco más (mínimo 20 caracteres).');
    if (DB.contacts.some(function (c) { return c.psyId === psyId && c.patientId === u.id && c.status === 'pending'; })) {
      return formError(form, 'Ya tenés una consulta pendiente con este profesional.');
    }
    DB.contacts.push({
      id: uid('c'), psyId: psyId, patientId: u.id, subject: subject,
      message: message, createdAt: new Date().toISOString(), status: 'pending'
    });
    save();
    closeModal();
    toast('Consulta enviada a ' + p.name + '. Podés seguirla desde Mi cuenta.', 'ok');
    navigate('#/cuenta');
    renderRoute();
  }

  function canReviewPsy(psyId) {
    var u = me();
    if (!u || u.role !== 'patient') return false;
    var accepted = DB.contacts.some(function (c) { return c.psyId === psyId && c.patientId === u.id && c.status === 'accepted'; });
    var exists = DB.reviews.some(function (r) { return r.psyId === psyId && r.patientId === u.id; });
    return accepted && !exists;
  }
  function handleReview(form, psyId) {
    var u = me();
    if (!u || u.role !== 'patient') return formError(form, 'Solo los pacientes pueden dejar reseñas.');
    if (!canReviewPsy(psyId)) return formError(form, 'Para reseñar necesitás una consulta aceptada y no haber reseñado antes.');
    var p = psyById(psyId);
    var rating = Number(form.elements.rating.value);
    var comment = form.elements.comment.value.trim();
    if (!rating || rating < 1 || rating > 5) return formError(form, 'Elegí una calificación de 1 a 5 estrellas.');
    if (comment.length < 15) return formError(form, 'Escribí un comentario de al menos 15 caracteres.');
    DB.reviews.push({
      id: uid('r'), psyId: psyId, patientId: u.id, rating: rating,
      comment: comment, createdAt: new Date().toISOString()
    });
    var delta = reviewDelta(rating);
    if (delta !== 0) award(psyId, 'review', delta, 'Reseña de ' + rating + ' estrella' + (rating === 1 ? '' : 's') + ' de un paciente', psyId);
    save();
    closeModal();
    toast('Gracias por tu reseña. ' + (rating <= 2 ? 'El puntaje del profesional se ajustó.' : 'Tu experiencia ayuda a otros pacientes.'), rating <= 2 ? 'warn' : 'ok');
    renderPsychProfile(psyId);
    if (p) { /* placeholder */ }
  }

  function handleReport(form, type, id) {
    var u = me();
    if (!u) return formError(form, 'Ingresá para reportar contenido.');
    var reason = form.elements.reason.value.trim();
    if (reason.length < 8) return formError(form, 'Contanos brevemente el motivo.');
    DB.reports.push({
      id: uid('rep'), targetType: type, targetId: id, reporterId: u.id,
      reason: reason, createdAt: new Date().toISOString(), status: 'open'
    });
    save();
    closeModal();
    toast('Reporte enviado. El equipo lo va a revisar.', 'ok');
    renderRoute();
  }

  function handlePsyProfile(form, psyId) {
    var u = me();
    var p = psyById(psyId);
    if (!u || u.role !== 'psy' || !p || p.userId !== u.id) return formError(form, 'No tenés permiso para editar este perfil.');
    var v = function (name) { var el = form.elements[name]; return el ? el.value.trim() : ''; };
    var checks = function (name) { return $$('input[name="' + name + '"]:checked', form).map(function (x) { return x.value; }); };
    var lines = function (name) { return v(name).split('\n').map(function (l) { return l.trim(); }).filter(Boolean); };
    if (v('bio').length < 40) return formError(form, 'La presentación es demasiado corta.');
    p.headline = v('headline');
    p.bio = v('bio');
    p.license = v('license');
    p.years = Number(v('years')) || 0;
    p.city = v('city');
    p.province = v('province');
    p.address = v('address');
    p.mapQuery = v('address') || v('city');
    p.languages = v('languages').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    p.whatsapp = v('whatsapp').replace(/[^\d]/g, '');
    p.website = v('website');
    p.currency = v('currency') || 'ARS';
    p.responseTime = v('responseTime');
    p.acceptingNew = !!form.elements.acceptingNew.checked;
    p.modalities = checks('modalities');
    p.specialties = checks('specialties');
    p.approaches = checks('approaches');
    p.services = lines('services').map(function (l) {
      var parts = l.split('|').map(function (x) { return x.trim(); });
      return { name: parts[0] || '', price: Number(parts[1]) || 0, duration: Number(parts[2]) || 0, note: parts[3] || '' };
    }).filter(function (s) { return s.name; });
    p.degrees = lines('degrees').map(function (l) {
      var parts = l.split('|').map(function (x) { return x.trim(); });
      return { title: parts[0] || '', institution: parts[1] || '', year: parts[2] || '' };
    }).filter(function (d) { return d.title; });
    p.certifications = lines('certifications');
    p.schedule = WEEK_DAYS.map(function (day, i) {
      var en = form.elements['day' + i + 'Enabled'];
      var from = form.elements['day' + i + 'From'];
      var to = form.elements['day' + i + 'To'];
      return {
        day: day,
        enabled: !!(en && en.checked),
        from: (from && from.value) || '09:00',
        to: (to && to.value) || '19:00'
      };
    });
    p.availability = p.schedule.filter(function (s) { return s.enabled; }).map(function (s) {
      return { days: s.day, hours: s.from + ' a ' + s.to };
    });
    p.paymentMethods = v('paymentMethods').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    p.coverage = v('coverage').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    p.name = v('name') || u.name;
    p.photoUrl = v('photoUrl');
    p.coverUrl = v('coverUrl');
    p.gallery = lines('gallery').filter(function (u) { return safeUrl(u); });
    if (p.photoUrl && !safeUrl(p.photoUrl)) return formError(form, 'La foto debe ser una URL válida o una imagen subida.');
    if (p.coverUrl && !safeUrl(p.coverUrl)) return formError(form, 'La portada debe ser una URL válida o una imagen subida.');
    if (p.website && !safeUrl(p.website)) return formError(form, 'El sitio web debe empezar con https:// (o dejarlo vacío).');
    var pu = userById(p.userId);
    if (pu) {
      pu.name = p.name;
      pu.avatarUrl = p.photoUrl || pu.avatarUrl;
      pu.whatsapp = p.whatsapp;
      pu.website = p.website;
      pu.city = p.city;
      pu.headline = p.headline;
      pu.bio = p.bio;
    }
    if (!p.modalities.length) p.modalities = ['online'];
    save();
    if (profileCompletion(p) === 100 && !DB.pointEvents.some(function (e) { return e.psyId === p.id && e.type === 'profile'; })) {
      award(p.id, 'profile', 10, 'Perfil profesional completo', p.id);
      toast('¡Perfil completo! Sumaste +10 puntos.', 'ok');
    } else {
      toast('Perfil actualizado.', 'ok');
    }
    renderPanel();
  }


  function handleAsk(form) {
    var u = me();
    if (!u || u.role !== 'patient') return formError(form, 'Solo los pacientes registrados pueden abrir preguntas.');
    var title = form.elements.title.value.trim();
    var body = form.elements.body.value.trim();
    var category = form.elements.category.value;
    var tags = form.elements.tags.value.split(',').map(function (t) { return t.trim(); }).filter(Boolean).slice(0, 5);
    if (title.length < 12) return formError(form, 'Escribí un título más descriptivo (mínimo 12 caracteres).');
    if (body.length < 40) return formError(form, 'Contá un poco más (mínimo 40 caracteres) para que puedan orientarte.');
    var q = {
      id: uid('q'), authorId: u.id, category: category, title: title, body: body,
      tags: tags, createdAt: new Date().toISOString(), views: 0, status: 'open', answers: []
    };
    DB.questions.push(q);
    DB.posts.push({
      id: uid('post'), authorId: u.id, body: 'Nueva consulta en la comunidad: ' + title + '\n\n' + body.slice(0, 220) + (body.length > 220 ? '…' : ''),
      imageUrl: '', likes: [], comments: [], questionId: q.id, createdAt: new Date().toISOString()
    });
    save();
    closeModal();
    toast('Pregunta publicada. Los psicólogos de la comunidad pueden responderla.', 'ok');
    navigate('#/pregunta/' + q.id);
    renderRoute();
  }

  function handleAnswer(form, qid) {
    var u = me();
    if (!u || u.role !== 'psy') return formError(form, 'Solo los psicólogos pueden responder.');
    var p = myPsych();
    if (!p) return formError(form, 'No encontramos tu perfil profesional.');
    var q = DB.questions.filter(function (x) { return x.id === qid; })[0];
    if (!q) return formError(form, 'La pregunta ya no existe.');
    if (q.answers.some(function (a) { return a.psyId === p.id; })) return formError(form, 'Ya respondiste esta pregunta.');
    var body = form.elements.body.value.trim();
    if (body.length < 40) return formError(form, 'La respuesta es demasiado corta (mínimo 40 caracteres).');
    var answer = {
      id: uid('a'), psyId: p.id, body: body, createdAt: new Date().toISOString(),
      upvotes: [], accepted: false
    };
    q.answers.push(answer);
    q.status = 'answered';
    award(p.id, 'answer', 10, 'Respuesta publicada: "' + q.title.slice(0, 60) + '"', q.id);
    save();
    toast('Respuesta publicada. Sumaste +10 puntos.', 'ok');
    renderQuestion(qid);
  }

  function handleContact(form, psyId) {
    var u = me();
    if (!u || u.role !== 'patient') return formError(form, 'Necesitás una cuenta de paciente para contactar.');
    var p = psyById(psyId);
    if (!p) return formError(form, 'Profesional no encontrado.');
    var subject = form.elements.subject.value.trim();
    var message = form.elements.message.value.trim();
    if (subject.length < 4) return formError(form, 'Indicá un motivo breve.');
    if (message.length < 20) return formError(form, 'Contá un poco más (mínimo 20 caracteres).');
    if (DB.contacts.some(function (c) { return c.psyId === psyId && c.patientId === u.id && c.status === 'pending'; })) {
      return formError(form, 'Ya tenés una consulta pendiente con este profesional.');
    }
    DB.contacts.push({
      id: uid('c'), psyId: psyId, patientId: u.id, subject: subject,
      message: message, createdAt: new Date().toISOString(), status: 'pending'
    });
    save();
    closeModal();
    toast('Consulta enviada a ' + p.name + '. Podés seguirla desde Mi cuenta.', 'ok');
    navigate('#/cuenta');
    renderRoute();
  }

  function canReviewPsy(psyId) {
    var u = me();
    if (!u || u.role !== 'patient') return false;
    var accepted = DB.contacts.some(function (c) { return c.psyId === psyId && c.patientId === u.id && c.status === 'accepted'; });
    var exists = DB.reviews.some(function (r) { return r.psyId === psyId && r.patientId === u.id; });
    return accepted && !exists;
  }
  function handleReview(form, psyId) {
    var u = me();
    if (!u || u.role !== 'patient') return formError(form, 'Solo los pacientes pueden dejar reseñas.');
    if (!canReviewPsy(psyId)) return formError(form, 'Para reseñar necesitás una consulta aceptada y no haber reseñado antes.');
    var p = psyById(psyId);
    var rating = Number(form.elements.rating.value);
    var comment = form.elements.comment.value.trim();
    if (!rating || rating < 1 || rating > 5) return formError(form, 'Elegí una calificación de 1 a 5 estrellas.');
    if (comment.length < 15) return formError(form, 'Escribí un comentario de al menos 15 caracteres.');
    DB.reviews.push({
      id: uid('r'), psyId: psyId, patientId: u.id, rating: rating,
      comment: comment, createdAt: new Date().toISOString()
    });
    var delta = reviewDelta(rating);
    if (delta !== 0) award(psyId, 'review', delta, 'Reseña de ' + rating + ' estrella' + (rating === 1 ? '' : 's') + ' de un paciente', psyId);
    save();
    closeModal();
    toast('Gracias por tu reseña. ' + (rating <= 2 ? 'El puntaje del profesional se ajustó.' : 'Tu experiencia ayuda a otros pacientes.'), rating <= 2 ? 'warn' : 'ok');
    renderPsychProfile(psyId);
    if (p) { /* placeholder */ }
  }

  function handleReport(form, type, id) {
    var u = me();
    if (!u) return formError(form, 'Ingresá para reportar contenido.');
    var reason = form.elements.reason.value.trim();
    if (reason.length < 8) return formError(form, 'Contanos brevemente el motivo.');
    DB.reports.push({
      id: uid('rep'), targetType: type, targetId: id, reporterId: u.id,
      reason: reason, createdAt: new Date().toISOString(), status: 'open'
    });
    save();
    closeModal();
    toast('Reporte enviado. El equipo lo va a revisar.', 'ok');
    renderRoute();
  }

  function handlePsyProfile(form, psyId) {
    var u = me();
    var p = psyById(psyId);
    if (!u || u.role !== 'psy' || !p || p.userId !== u.id) return formError(form, 'No tenés permiso para editar este perfil.');
    var v = function (name) { var el = form.elements[name]; return el ? el.value.trim() : ''; };
    var checks = function (name) { return $$('input[name="' + name + '"]:checked', form).map(function (x) { return x.value; }); };
    var lines = function (name) { return v(name).split('\n').map(function (l) { return l.trim(); }).filter(Boolean); };
    if (v('bio').length < 40) return formError(form, 'La presentación es demasiado corta.');
    p.headline = v('headline');
    p.bio = v('bio');
    p.license = v('license');
    p.years = Number(v('years')) || 0;
    p.city = v('city');
    p.province = v('province');
    p.address = v('address');
    p.mapQuery = v('address') || v('city');
    p.languages = v('languages').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    p.whatsapp = v('whatsapp').replace(/[^\d]/g, '');
    p.website = v('website');
    p.currency = v('currency') || 'ARS';
    p.responseTime = v('responseTime');
    p.acceptingNew = !!form.elements.acceptingNew.checked;
    p.modalities = checks('modalities');
    p.specialties = checks('specialties');
    p.approaches = checks('approaches');
    p.services = lines('services').map(function (l) {
      var parts = l.split('|').map(function (x) { return x.trim(); });
      return { name: parts[0] || '', price: Number(parts[1]) || 0, duration: Number(parts[2]) || 0, note: parts[3] || '' };
    }).filter(function (s) { return s.name; });
    p.degrees = lines('degrees').map(function (l) {
      var parts = l.split('|').map(function (x) { return x.trim(); });
      return { title: parts[0] || '', institution: parts[1] || '', year: parts[2] || '' };
    }).filter(function (d) { return d.title; });
    p.certifications = lines('certifications');
    p.schedule = WEEK_DAYS.map(function (day, i) {
      var en = form.elements['day' + i + 'Enabled'];
      var from = form.elements['day' + i + 'From'];
      var to = form.elements['day' + i + 'To'];
      return {
        day: day,
        enabled: !!(en && en.checked),
        from: (from && from.value) || '09:00',
        to: (to && to.value) || '19:00'
      };
    });
    p.availability = p.schedule.filter(function (s) { return s.enabled; }).map(function (s) {
      return { days: s.day, hours: s.from + ' a ' + s.to };
    });
    p.paymentMethods = v('paymentMethods').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    p.coverage = v('coverage').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    p.name = v('name') || u.name;
    p.photoUrl = v('photoUrl');
    p.coverUrl = v('coverUrl');
    p.gallery = lines('gallery').filter(function (u) { return safeUrl(u); });
    if (p.photoUrl && !safeUrl(p.photoUrl)) return formError(form, 'La foto debe ser una URL válida o una imagen subida.');
    if (p.coverUrl && !safeUrl(p.coverUrl)) return formError(form, 'La portada debe ser una URL válida o una imagen subida.');
    if (p.website && !safeUrl(p.website)) return formError(form, 'El sitio web debe empezar con https:// (o dejarlo vacío).');
    var pu = userById(p.userId);
    if (pu) {
      pu.name = p.name;
      pu.avatarUrl = p.photoUrl || pu.avatarUrl;
      pu.whatsapp = p.whatsapp;
      pu.website = p.website;
      pu.city = p.city;
      pu.headline = p.headline;
      pu.bio = p.bio;
    }
    if (!p.modalities.length) p.modalities = ['online'];
    save();
    if (profileCompletion(p) === 100 && !DB.pointEvents.some(function (e) { return e.psyId === p.id && e.type === 'profile'; })) {
      award(p.id, 'profile', 10, 'Perfil profesional completo', p.id);
      toast('¡Perfil completo! Sumaste +10 puntos.', 'ok');
    } else {
      toast('Perfil actualizado.', 'ok');
    }
    renderPanel();
  }

  function handlePublish(form) {
    var u = me();
    if (!u || u.role !== 'psy') return formError(form, 'Solo los psicólogos pueden publicar.');
    var p = myPsych();
    if (!p) return formError(form, 'No encontramos tu perfil.');
    var type = form.elements.type.value;
    var title = form.elements.title.value.trim();
    var summary = form.elements.summary.value.trim();
    var category = form.elements.category.value;
    var body = form.elements.body.value.trim();
    var url = form.elements.url.value.trim();
    if (title.length < 10) return formError(form, 'El título es demasiado corto.');
    if (summary.length < 30) return formError(form, 'Escribí un resumen de al menos 30 caracteres.');
    if (body.length < 120) return formError(form, 'El contenido debe tener al menos 120 caracteres.');
    var pub = {
      id: uid('pub'), psyId: p.id, type: type, category: category, title: title,
      summary: summary, body: body, createdAt: new Date().toISOString(),
      likes: [], url: url
    };
    DB.publications.push(pub);
    award(p.id, type === 'ebook' ? 'ebook' : 'article', type === 'ebook' ? 40 : 20,
      (type === 'ebook' ? 'Ebook publicado: ' : 'Artículo publicado: ') + title.slice(0, 60), pub.id);
    save();
    closeModal();
    toast('Publicación creada. Sumaste +' + (type === 'ebook' ? 40 : 20) + ' puntos.', 'ok');
    if (parseRoute().name === 'panel') {
      panelTab = 'publicaciones';
      renderPanel();
    } else {
      navigate('#/publicaciones');
      renderRoute();
    }
  }

  function handleChat(form) { /* compat: el chat de Aura usa sendChat */ }

  /* ---------------- Acciones puntuales ---------------- */
  function openContact(psyId) {
    var u = me();
    var p = psyById(psyId);
    if (!p) return;
    if (!u) return openLogin('Para contactar a un psicólogo necesitás una cuenta de paciente (gratis).');
    if (u.role !== 'patient') return toast('Solo las cuentas de paciente pueden iniciar consultas.', 'warn');
    var existing = DB.contacts.some(function (c) { return c.psyId === psyId && c.patientId === u.id && c.status === 'pending'; });
    if (existing) return toast('Ya enviaste una consulta a este profesional. Revisá Mi cuenta.', 'warn');
    openModal({
      title: 'Contactar a ' + p.name,
      sub: 'La consulta es privada: solo la ve el profesional.',
      body:
        '<form data-form="contact" data-id="' + p.id + '">' +
          '<div class="field" style="margin-bottom:12px"><label for="contactSubject">Motivo</label>' +
            '<input class="input" id="contactSubject" name="subject" required placeholder="Ej: Primera consulta por ansiedad"></div>' +
          '<div class="field" style="margin-bottom:12px"><label for="contactMessage">Mensaje</label>' +
            '<textarea class="textarea" id="contactMessage" name="message" required placeholder="Contá brevemente qué te pasa y qué modalidad preferís. No incluyas datos sensibles innecesarios."></textarea></div>' +
          '<p class="help-text">Este es un primer contacto, no una consulta clínica. Si es una urgencia, llamá al 135 o al 911.</p>' +
          '<div class="form-actions"><button class="btn btn-primary" type="submit">Enviar consulta</button>' +
            '<button class="btn btn-outline" type="button" data-act="close-modal">Cancelar</button></div>' +
        '</form>'
    });
  }

  function openReview(psyId) {
    var p = psyById(psyId);
    if (!p) return;
    if (!me()) return openLogin('Ingresá como paciente para dejar una reseña.');
    if (!canReviewPsy(psyId)) return toast('Para reseñar necesitás una consulta aceptada por este profesional y no haber reseñado antes.', 'warn');
    var stars = [5, 4, 3, 2, 1].map(function (n) {
      return '<label class="checkline" style="gap:10px;padding:8px 10px;border:1px solid var(--line);border-radius:9px;margin-bottom:6px">' +
        '<input type="radio" name="rating" value="' + n + '"' + (n === 5 ? ' checked' : '') + '> ' + starsHtml(n) +
        ' <span class="small">' + ({ 5: 'Excelente', 4: 'Muy bueno', 3: 'Correcto', 2: 'Me faltó algo', 1: 'No me sentí bien' }[n]) + '</span></label>';
    }).join('');
    openModal({
      title: 'Reseñar a ' + p.name,
      sub: 'Tu experiencia ayuda a otros pacientes. Las reseñas negativas también restan puntos.',
      body:
        '<form data-form="review" data-id="' + p.id + '">' +
          '<div class="field" style="margin-bottom:10px"><label>Calificación</label>' + stars + '</div>' +
          '<div class="field" style="margin-bottom:12px"><label for="reviewComment">Comentario</label>' +
            '<textarea class="textarea" id="reviewComment" name="comment" required placeholder="¿Cómo fue tu experiencia? Sé respetuoso/a y concreto/a."></textarea></div>' +
          '<p class="help-text">No incluyas datos personales de terceros. Las reseñas son públicas con tu nombre de perfil.</p>' +
          '<div class="form-actions"><button class="btn btn-primary" type="submit">Publicar reseña</button>' +
            '<button class="btn btn-outline" type="button" data-act="close-modal">Cancelar</button></div>' +
        '</form>'
    });
  }

  function openAsk() {
    var u = me();
    if (!u) return openLogin('Para preguntar en la comunidad necesitás una cuenta de paciente (gratis).');
    if (u.role !== 'patient') return toast('Las preguntas las abren los pacientes. Los profesionales responden.', 'warn');
    var cats = DB.config.categories.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('');
    openModal({
      title: 'Hacer una pregunta',
      sub: 'Contá lo que te pasa. Solo psicólogos matriculados podrán responder.',
      body:
        '<form data-form="ask">' +
          '<div class="field" style="margin-bottom:12px"><label for="askTitle">Título</label>' +
            '<input class="input" id="askTitle" name="title" required minlength="12" placeholder="Ej: ¿Cómo sé si mi ansiedad necesita tratamiento?"></div>' +
          '<div class="field" style="margin-bottom:12px"><label for="askCat">Categoría</label>' +
            '<select class="select" id="askCat" name="category">' + cats + '</select></div>' +
          '<div class="field" style="margin-bottom:12px"><label for="askBody">Tu pregunta</label>' +
            '<textarea class="textarea" id="askBody" name="body" required minlength="40" rows="6" placeholder="Contá desde cuándo, cómo te afecta y qué probaste. No incluyas datos que te identifiquen."></textarea></div>' +
          '<div class="field" style="margin-bottom:12px"><label for="askTags">Etiquetas (opcional, separadas por coma)</label>' +
            '<input class="input" id="askTags" name="tags" placeholder="ansiedad, sueño, trabajo"></div>' +
          '<p class="help-text">Las respuestas son orientativas y no reemplazan una consulta. Si es urgente, llamá al 135 o al 911.</p>' +
          '<div class="form-actions"><button class="btn btn-primary" type="submit">Publicar pregunta</button>' +
            '<button class="btn btn-outline" type="button" data-act="close-modal">Cancelar</button></div>' +
        '</form>'
    });
  }

  function openPublish() {
    var u = me();
    if (!u || u.role !== 'psy') return toast('Solo los psicólogos pueden publicar.', 'warn');
    var cats = DB.config.categories.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('');
    openModal({
      title: 'Publicar artículo o ebook',
      sub: 'Un artículo suma +20 puntos; un ebook o guía, +40.',
      size: 'wide',
      body:
        '<form data-form="publish">' +
          '<div class="form-grid">' +
            '<div class="field"><label for="pubType">Tipo</label><select class="select" id="pubType" name="type"><option value="article">Artículo</option><option value="ebook">Ebook / guía</option></select></div>' +
            '<div class="field"><label for="pubCategory">Categoría</label><select class="select" id="pubCategory" name="category">' + cats + '</select></div>' +
            '<div class="field span-2"><label for="pubTitle">Título</label><input class="input" id="pubTitle" name="title" required minlength="10"></div>' +
            '<div class="field span-2"><label for="pubSummary">Resumen</label><textarea class="textarea" id="pubSummary" name="summary" rows="2" required minlength="30" placeholder="Qué va a encontrar quien lo lea."></textarea></div>' +
            '<div class="field span-2"><label for="pubBody">Contenido</label><textarea class="textarea" id="pubBody" name="body" rows="8" required minlength="120" placeholder="Escribí tu artículo o la introducción del ebook. Podés usar párrafos separados por líneas en blanco."></textarea></div>' +
            '<div class="field span-2"><label for="pubUrl">Enlace al ebook o recurso (opcional)</label><input class="input" id="pubUrl" name="url" placeholder="../ebooks/ o https://…"></div>' +
          '</div>' +
          '<p class="help-text">El contenido es público y debe ser respetuoso, sin datos de pacientes. La publicación suma puntos automáticamente.</p>' +
          '<div class="form-actions"><button class="btn btn-primary" type="submit">Publicar</button>' +
            '<button class="btn btn-outline" type="button" data-act="close-modal">Cancelar</button></div>' +
        '</form>'
    });
  }

  function openReport(type, id) {
    if (!me()) return openLogin('Ingresá para reportar contenido.');
    openModal({
      title: 'Reportar contenido',
      sub: 'Revisamos los reportes por privacidad, agresividad o información falsa.',
      size: 'narrow',
      body:
        '<form data-form="report" data-type="' + esc(type) + '" data-id="' + esc(id) + '">' +
          '<div class="field" style="margin-bottom:12px"><label for="reportReason">Motivo</label>' +
            '<textarea class="textarea" id="reportReason" name="reason" required minlength="8" placeholder="Contanos qué pasa con este contenido."></textarea></div>' +
          '<div class="form-actions"><button class="btn btn-danger" type="submit">Enviar reporte</button>' +
            '<button class="btn btn-outline" type="button" data-act="close-modal">Cancelar</button></div>' +
        '</form>'
    });
  }

  function voteAnswer(answerId, qid) {
    var u = me();
    if (!u) return openLogin('Ingresá como paciente para votar.');
    if (u.role !== 'patient') return toast('Solo los pacientes pueden votar respuestas.', 'warn');
    var q = DB.questions.filter(function (x) { return x.id === qid; })[0];
    if (!q) return;
    var a = q.answers.filter(function (x) { return x.id === answerId; })[0];
    if (!a) return;
    var idx = a.upvotes.indexOf(u.id);
    if (idx === -1) {
      a.upvotes.push(u.id);
      award(a.psyId, 'upvote', 3, 'Voto positivo de un paciente en la comunidad', q.id);
      toast('Voto registrado. El profesional sumó +3 puntos.', 'ok', 2600);
    } else {
      a.upvotes.splice(idx, 1);
      award(a.psyId, 'upvote', -3, 'Voto retirado por un paciente', q.id);
      toast('Voto retirado.', 'ok', 2200);
    }
    save();
    renderQuestion(qid);
  }

  function acceptAnswer(answerId, qid) {
    var u = me();
    if (!u) return openLogin('Ingresá para elegir la mejor respuesta.');
    var q = DB.questions.filter(function (x) { return x.id === qid; })[0];
    if (!q || q.authorId !== u.id) return toast('Solo quien hizo la pregunta puede elegir la mejor respuesta.', 'warn');
    if (q.answers.some(function (a) { return a.accepted; })) return toast('Ya elegiste una mejor respuesta para esta pregunta.', 'warn');
    var a = q.answers.filter(function (x) { return x.id === answerId; })[0];
    if (!a) return;
    a.accepted = true;
    q.status = 'answered';
    award(a.psyId, 'accepted', 25, 'Respuesta elegida como mejor: "' + q.title.slice(0, 60) + '"', q.id);
    save();
    toast('Elegiste la mejor respuesta. El profesional sumó +25 puntos.', 'ok');
    renderQuestion(qid);
  }

  function likePublication(id) {
    var u = me();
    if (!u) return openLogin('Ingresá para guardar y valorar publicaciones.');
    var p = DB.publications.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var idx = p.likes.indexOf(u.id);
    if (idx === -1) {
      p.likes.push(u.id);
      if (u.role === 'patient') award(p.psyId, 'like', 2, 'Me gusta en una publicación', p.id);
    } else {
      p.likes.splice(idx, 1);
      if (u.role === 'patient') award(p.psyId, 'like', -2, 'Me gusta retirado', p.id);
    }
    save();
    var modalOpen = $('#modalRoot .modal');
    if (modalOpen) openPublication(id);
    else if ($('#pubGrid')) renderPubGrid();
    else openPublication(id);
  }

  function copyLink() {
    var url = location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { toast('Enlace copiado.', 'ok'); }, function () { toast('Copiá el enlace desde la barra del navegador.', 'warn'); });
    } else {
      toast('Copiá el enlace desde la barra del navegador.', 'warn');
    }
  }

  function setContactStatus(id, status) {
    var u = me();
    if (!u) return;
    var c = DB.contacts.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    var p = psyById(c.psyId);
    if (!p || p.userId !== u.id) return toast('No tenés permiso.', 'warn');
    c.status = status;
    save();

    // Establecer amistad P2P cuando se acepta
    if (status === 'accepted' && window.P2PChat) {
      window.P2PChat.establishFriendship(c.psyId, c.patientId);
      toast('Consulta aceptada. El paciente ya puede chatear contigo.', 'ok');
    } else {
      toast(status === 'accepted' ? 'Consulta aceptada. El paciente ya puede dejarte una reseña.' : 'Consulta rechazada.', 'ok');
    }
    renderPanel();
  }
  function toggleVerify(id) {
    var u = me();
    if (!u || u.role !== 'admin') return;
    var p = psyById(id);
    if (p) { p.verified = !p.verified; save(); toast(p.verified ? 'Perfil verificado.' : 'Verificación retirada.', 'ok'); renderAdmin(); }
  }
  function resolveReport(id) {
    var u = me();
    if (!u || (u.role !== 'admin' && u.role !== 'root')) return;
    var r = DB.reports.filter(function (x) { return x.id === id; })[0];
    if (r) { r.status = 'resolved'; save(); toast('Reporte resuelto.', 'ok'); if (u.role === 'root') renderRoot(); else renderAdmin(); }
  }

  /* ---------------- Autotest / init ---------------- */
  function runSelfTest() {
    testing = true;
    var results = [];
    function t(name, fn) { try { fn(); results.push('PASS ' + name); } catch (e) { results.push('FAIL ' + name + ': ' + e.message); } }
    t('datos cargados', function () { if (!DB.psychs.length) throw new Error('sin psicólogos'); });
    t('puntos psy-2 = 600', function () { if (pointsOf('psy-2') !== 600) throw new Error('obtuvo ' + pointsOf('psy-2')); });
    t('ranking top = psy-2', function () { if (ranking()[0].id !== 'psy-2') throw new Error('top ' + ranking()[0].id); });
    t('filtro ansiedad', function () {
      dirState.specialty = 'Ansiedad y pánico';
      var list = filteredPsychs();
      dirState.specialty = '';
      if (!list.length) throw new Error('vacío');
    });
    t('login demo', function () {
      var r = doLogin('paciente@demo.com', 'demo1234');
      if (!r.ok) throw new Error(r.msg);
      SESSION = null; saveSession(); renderHeader();
    });
    t('cuenta root', function () {
      if (!DB.users.some(function (u) { return u.role === 'root'; })) throw new Error('sin root');
    });
    t('login psicólogo', function () {
      var r = doLogin('psicologo@demo.com', 'demo1234');
      if (!r.ok) throw new Error(r.msg);
    });
    var routes = ['#/', '#/directorio', '#/comunidad', '#/foro', '#/pregunta/q-1', '#/psicologo/psy-1', '#/publicaciones', '#/meritocracia', '#/aura', '#/cuenta', '#/registro', '#/mensajes', '#/mensajes/u-pat-1', '#/usuario/u-pat-1', '#/post/post-1', '#/aurakit', '#/acceso-lizar'];
    routes.forEach(function (h) {
      try {
        location.hash = h;
        renderRoute();
        if (!VIEW.innerHTML.trim()) throw new Error('vacío');
        results.push('PASS ruta ' + h);
      } catch (e) { results.push('FAIL ruta ' + h + ': ' + e.message); }
    });
    t('proyecto AuraKit', function () {
      if (!DB.aurakitProjects.length) throw new Error('sin proyectos');
      var html = akGenerateHtml(DB.aurakitProjects[0], {});
      if (html.indexOf('<!DOCTYPE html>') !== 0) throw new Error('html inválido');
      if (html.indexOf('chat-panel') === -1) throw new Error('sin asistente');
    });
    t('ZIP AuraKit', function () {
      var files = akFileList(DB.aurakitProjects[0]);
      var bytes = akZip(files);
      if (!bytes.length || bytes[0] !== 0x50 || bytes[1] !== 0x4b) throw new Error('zip inválido');
    });
    t('login root', function () {
      var r = doLogin('root@winebox.clinic', 'Root2026!');
      if (!r.ok || r.user.role !== 'root') throw new Error('root no loguea');
      location.hash = '#/root'; renderRoute();
      if (VIEW.innerHTML.indexOf('Usuarios') === -1) throw new Error('consola root vacía');
      SESSION = null; saveSession(); renderHeader();
    });
    var pre = document.createElement('pre');
    pre.id = 'selftest';
    pre.style.cssText = 'position:fixed;inset:auto 0 0 0;max-height:40vh;overflow:auto;background:#111;color:#0f0;font:12px monospace;padding:12px;z-index:99999;white-space:pre-wrap';
    pre.textContent = results.join('\n');
    document.body.appendChild(pre);
    document.title = results.some(function (r) { return r.indexOf('FAIL') === 0; }) ? 'FAIL' : 'PASS';
  }

  function init() {
    document.getElementById('year').textContent = new Date().getFullYear();
    document.addEventListener('click', onClick);
    document.addEventListener('input', onInput);
    document.addEventListener('change', onChange);
    document.addEventListener('submit', onSubmit);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

    document.addEventListener('dragstart', akDragStart);
    document.addEventListener('dragover', akDragOver);
    document.addEventListener('drop', akDrop);
    document.addEventListener('dragend', akDragEnd);
    var menu = $('#menuToggle');
    if (menu) menu.addEventListener('click', toggleMenu);
    window.addEventListener('hashchange', function () { if (!testing) renderRoute(); });
    window.addEventListener('online', function () {
      _isOnline = true;
      var b = $('#offlineBanner'); if (b) b.hidden = true;
      if (window.WBAPI) window.WBAPI.reconnectWS();
    });
    window.addEventListener('offline', function () {
      _isOnline = false;
      var b = $('#offlineBanner'); if (b) b.hidden = false;
    });
    window.addEventListener('pagehide', function () {
      var u = me();
      if (u) { u.online = false; u.lastSeen = new Date().toISOString(); save(); }
      if (window.WBAPI) window.WBAPI.closeWS();
    });
    // Sincronización periódica con el servidor
    setInterval(function () {
      if (me() && window.WBAPI && window.WBAPI.wsReady) {
        window.WBAPI.wsSend({ type: 'ping' });
      }
    }, 25000);
    if (!navigator.onLine) { var b = $('#offlineBanner'); if (b) b.hidden = false; }
    if (/[?&]selftest=1/.test(location.search)) setTimeout(runSelfTest, 150);
    window.WBApp = {
      db: function () { return DB; }, pointsOf: pointsOf, ratingOf: ratingOf, ranking: ranking,
      save: save, login: doLogin, generateSite: akGenerateHtml, files: akFileList, zip: akZip,
      isOnline: isOnline, unread: unreadTotal, wsReady: function() { return window.WBAPI ? window.WBAPI.wsReady : false; }
    };
    // Iniciar carga de datos
    load();

    // Renderizar Aura después de cargar
    setTimeout(function() {
      renderAuraDock();
    }, 200);
  }
  // Exponer para sincronización asíncrona con servidor
  window.WBReload = function() {
    if (window.WBAPI) {
      window.WBAPI.fetchData().then(function(data) {
        if (data && data.users) {
          DB = data;
          migrate();
          renderHeader();
          renderRoute();
        }
      });
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
