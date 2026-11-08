/* ============================================================
   WineBOX.Clinic · Servidor de API + WebSocket
   Persistencia real en servidor, sesión con JWT, presencia online
   ============================================================ */
const express = require('express');
const http = require('http');
const { Server } = require('ws');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'winebox_clinic_secreto_2026_v1';
const DATA_FILE = path.join(__dirname, 'db.json');

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

// ── Middleware ──
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// ── Base de datos en memoria ──
let DB = null;
function loadDB() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      DB = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      console.log('[DB] Cargada desde db.json:', DB.users?.length || 0, 'usuarios');
    } else {
      // Seed inicial desde db-seed.js (módulo CommonJS)
      try {
        DB = require('./db-seed.js');
      } catch (e2) {
        // Fallback: intentar extraer de data.js
        var dataContent = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
        var match = dataContent.match(/WINEBOX_SEED\s*=\s*(\{[\s\S]*?\n\});/);
        if (match) {
          try { DB = eval('(' + match[1] + ')'); } catch(e3) { throw e2; }
        } else {
          throw e2;
        }
      }
      saveDB();
      console.log('[DB] Creada base de datos inicial desde seed:', DB.users?.length || 0, 'usuarios');
    }
  } catch (e) {
    console.error('[DB] Error cargando:', e.message);
    process.exit(1);
  }
}
function saveDB() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DB, null, 2), 'utf8');
  } catch (e) {
    console.error('[DB] Error guardando:', e.message);
  }
}
loadDB();

// ── Sesiones WebSocket por userId ──
const activeConnections = new Map(); // userId -> WebSocket

// ── JWT helpers ──
function signToken(userId) {
  return jwt.sign({ userId, iat: Date.now() }, JWT_SECRET, { expiresIn: '7d' });
}
function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

// ── Auth middleware ──
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  const payload = verifyToken(token);
  if (payload) req.user = payload;
  next();
}
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No autenticado' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Token inválido' });
  const u = DB.users.find(x => x.id === payload.userId);
  if (!u) return res.status(401).json({ error: 'Usuario no encontrado' });
  req.user = { userId: u.id, role: u.role };
  next();
}

// ═══════════════════════════════════════════════════════════
//  ROUTES
// ═══════════════════════════════════════════════════════════

// ── Health ──
app.get('/api/health', (req, res) => {
  res.json({ ok: true, users: DB.users?.length || 0, psychs: DB.psychs?.length || 0, online: activeConnections.size });
});

// ── Full DB (for initial load) ──
app.get('/api/data', auth, (req, res) => {
  if (req.user) {
    // Return sanitized data (no passwords)
    const safe = cloneDB();
    safe.users.forEach(u => { delete u.password; delete u.salt; delete u.passHash; });
    res.json(safe);
  } else {
    // Guest gets limited data
    const guest = {
      config: DB.config,
      psychs: DB.psychs,
      publications: DB.publications,
      categories: DB.config.categories,
      specialties: DB.config.specialties,
      provinces: DB.config.provinces || []
    };
    res.json(guest);
  }
});

// ── Session ──
app.get('/api/session', auth, (req, res) => {
  if (!req.user) return res.json({ authenticated: false });
  const u = DB.users.find(x => x.id === req.user.userId);
  if (!u) return res.json({ authenticated: false });
  res.json({
    authenticated: true,
    user: sanitizeUser(u),
    token: req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : ''
  });
});

// ── Login ──
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
  const u = DB.users.find(x => x.email.toLowerCase() === email.toLowerCase().trim());
  if (!u) return res.status(401).json({ error: 'Email o contraseña incorrectos' });
  if (u.blocked) return res.status(403).json({ error: 'Cuenta suspendida' });
  const salt = u.salt || ('s_' + u.id);
  const hash = simpleHash(salt + '|' + password);
  if (u.passHash !== hash) return res.status(401).json({ error: 'Email o contraseña incorrectos' });
  const token = signToken(u.id);
  // Mark online
  u.online = true;
  u.lastSeen = new Date().toISOString();
  saveDB();
  res.json({ token, user: sanitizeUser(u) });
});

// ── Logout ──
app.post('/api/logout', requireAuth, (req, res) => {
  const u = DB.users.find(x => x.id === req.user.userId);
  if (u) { u.online = false; u.lastSeen = new Date().toISOString(); saveDB(); }
  res.json({ ok: true });
});

// ── Register ──
app.post('/api/register', (req, res) => {
  const { name, email, password, role, city } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Nombre, email y contraseña requeridos' });
  if (DB.users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
    return res.status(400).json({ error: 'Ese email ya está registrado' });
  }
  const salt = 's_reg_' + Date.now();
  const newUser = {
    id: 'u_' + Date.now(),
    role: role || 'patient',
    name, email: email.trim().toLowerCase(),
    password: password,
    passHash: simpleHash(salt + '|' + password),
    salt,
    city: city || '',
    createdAt: new Date().toISOString(),
    color: randomColor(),
    avatarUrl: '', website: '', whatsapp: '',
    bio: '', headline: '',
    online: false, lastSeen: null, blocked: false
  };
  DB.users.push(newUser);
  saveDB();
  const token = signToken(newUser.id);
  res.json({ token, user: sanitizeUser(newUser) });
});

// ── Users ──
app.get('/api/users', requireAuth, (req, res) => {
  if (req.user.role !== 'root' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No autorizado' });
  }
  res.json(DB.users.map(sanitizeUser));
});
app.get('/api/users/:id', auth, (req, res) => {
  const u = DB.users.find(x => x.id === req.params.id);
  if (!u) return res.status(404).json({ error: 'No encontrado' });
  res.json(sanitizeUser(u));
});
app.put('/api/users/:id', requireAuth, (req, res) => {
  if (req.user.role !== 'root' && req.user.role !== 'admin') return res.status(403).json({ error: 'No autorizado' });
  const u = DB.users.find(x => x.id === req.params.id);
  if (!u) return res.status(404).json({ error: 'No encontrado' });
  const allowed = ['name', 'email', 'role', 'city', 'headline', 'bio', 'avatarUrl', 'website', 'whatsapp', 'blocked'];
  allowed.forEach(k => { if (req.body[k] !== undefined) u[k] = req.body[k]; });
  saveDB();
  res.json(sanitizeUser(u));
});

// ── Psychs ──
app.get('/api/psychs', auth, (req, res) => {
  const list = DB.psychs.map(p => {
    const u = DB.users.find(x => x.id === p.userId);
    return { ...p, online: u ? isUserOnline(u) : false, userName: u?.name };
  });
  res.json(list);
});
app.get('/api/psychs/:id', auth, (req, res) => {
  const p = DB.psychs.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'No encontrado' });
  const u = DB.users.find(x => x.id === p.userId);
  res.json({ ...p, online: u ? isUserOnline(u) : false, userName: u?.name });
});
app.put('/api/psychs/:id', requireAuth, (req, res) => {
  const p = DB.psychs.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'No encontrado' });
  if (req.user.role !== 'root' && req.user.role !== 'admin') {
    const u = DB.users.find(x => x.id === req.user.userId);
    if (!u || u.role !== 'psy' || p.userId !== u.id) return res.status(403).json({ error: 'No autorizado' });
  }
  const allowed = ['name', 'headline', 'bio', 'photoUrl', 'coverUrl', 'city', 'province',
    'specialties', 'approaches', 'degrees', 'certifications', 'services',
    'modalities', 'availability', 'paymentMethods', 'coverage', 'languages',
    'acceptingNew', 'verified', 'responseTime', 'schedule', 'years', 'currency'];
  allowed.forEach(k => { if (req.body[k] !== undefined) p[k] = req.body[k]; });
  saveDB();
  res.json(p);
});

// ── Posts ──
app.get('/api/posts', auth, (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const list = (DB.posts || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
  res.json(list);
});
app.post('/api/posts', requireAuth, (req, res) => {
  const { body, imageUrl, videoUrl, linkUrl, questionId } = req.body || {};
  if (!body || !body.trim()) return res.status(400).json({ error: 'El contenido es obligatorio' });
  const post = {
    id: 'post_' + Date.now(),
    authorId: req.user.userId,
    createdAt: new Date().toISOString(),
    body: body.trim().slice(0, 5000),
    imageUrl: imageUrl || '',
    videoUrl: videoUrl || '',
    linkUrl: linkUrl || '',
    likes: [],
    comments: []
  };
  if (!DB.posts) DB.posts = [];
  DB.posts.push(post);
  // Award points
  awardPoints(req.user.userId, 'post', 15, 'Publicación creada');
  saveDB();
  broadcast('post:create', post);
  res.json(post);
});
app.post('/api/posts/:id/like', requireAuth, (req, res) => {
  const post = (DB.posts || []).find(x => x.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'No encontrado' });
  const idx = post.likes.indexOf(req.user.userId);
  if (idx >= 0) post.likes.splice(idx, 1);
  else post.likes.push(req.user.userId);
  saveDB();
  res.json({ likes: post.likes.length });
});
app.post('/api/posts/:id/comments', requireAuth, (req, res) => {
  const post = (DB.posts || []).find(x => x.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'No encontrado' });
  const { body } = req.body || {};
  if (!body?.trim()) return res.status(400).json({ error: 'Comentario requerido' });
  const comment = {
    id: 'cmt_' + Date.now(),
    authorId: req.user.userId,
    body: body.trim().slice(0, 500),
    createdAt: new Date().toISOString()
  };
  if (!post.comments) post.comments = [];
  post.comments.push(comment);
  saveDB();
  broadcast('comment:create', { postId: post.id, comment });
  res.json(comment);
});
app.delete('/api/posts/:id', requireAuth, (req, res) => {
  const post = (DB.posts || []).find(x => x.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'No encontrado' });
  const u = DB.users.find(x => x.id === req.user.userId);
  if (u.role !== 'root' && u.role !== 'admin' && post.authorId !== req.user.userId) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  DB.posts = DB.posts.filter(x => x.id !== req.params.id);
  saveDB();
  res.json({ ok: true });
});

// ── Questions ──
app.get('/api/questions', auth, (req, res) => {
  const list = (DB.questions || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(list);
});
app.post('/api/questions', requireAuth, (req, res) => {
  const { title, body, category, tags } = req.body || {};
  if (!title?.trim() || !body?.trim()) return res.status(400).json({ error: 'Título y contenido requeridos' });
  const q = {
    id: 'q_' + Date.now(),
    authorId: req.user.userId,
    title: title.trim().slice(0, 200),
    body: body.trim().slice(0, 5000),
    category: category || 'General',
    tags: tags || [],
    answers: [],
    views: 0,
    createdAt: new Date().toISOString()
  };
  if (!DB.questions) DB.questions = [];
  DB.questions.push(q);
  awardPoints(req.user.userId, 'question', 10, 'Pregunta publicada');
  saveDB();
  broadcast('question:create', q);
  res.json(q);
});
app.post('/api/questions/:id/answers', requireAuth, (req, res) => {
  const q = (DB.questions || []).find(x => x.id === req.params.id);
  if (!q) return res.status(404).json({ error: 'No encontrado' });
  const u = DB.users.find(x => x.id === req.user.userId);
  if (u?.role !== 'psy' && u?.role !== 'admin' && u?.role !== 'root') {
    return res.status(403).json({ error: 'Solo psicólogos pueden responder' });
  }
  const { body, psyId } = req.body || {};
  if (!body?.trim()) return res.status(400).json({ error: 'Respuesta requerida' });
  const a = {
    id: 'a_' + Date.now(),
    psyId: psyId || '',
    authorId: req.user.userId,
    body: body.trim().slice(0, 5000),
    upvotes: [],
    accepted: false,
    createdAt: new Date().toISOString()
  };
  if (!q.answers) q.answers = [];
  q.answers.push(a);
  awardPoints(req.user.userId, 'answer', 20, 'Respuesta publicada');
  saveDB();
  broadcast('answer:create', { questionId: q.id, answer: a });
  res.json(a);
});
app.post('/api/questions/:id/answers/:aid/accept', requireAuth, (req, res) => {
  const q = (DB.questions || []).find(x => x.id === req.params.id);
  if (!q || q.authorId !== req.user.userId) return res.status(403).json({ error: 'Solo el autor puede aceptar' });
  const a = (q.answers || []).find(x => x.id === req.params.aid);
  if (!a) return res.status(404).json({ error: 'No encontrado' });
  q.answers.forEach(x => x.accepted = false);
  a.accepted = true;
  awardPoints(a.authorId, 'accepted', 25, 'Respuesta aceptada');
  saveDB();
  res.json({ ok: true });
});
app.post('/api/questions/:id/views', auth, (req, res) => {
  const q = (DB.questions || []).find(x => x.id === req.params.id);
  if (q) { q.views = (q.views || 0) + 1; saveDB(); }
  res.json({ ok: true });
});

// ── Messages ──
app.get('/api/messages', requireAuth, (req, res) => {
  const msgs = (DB.messages || []).filter(m => m.fromId === req.user.userId || m.toId === req.user.userId);
  // Group by partner
  const partners = {};
  msgs.forEach(m => {
    const otherId = m.fromId === req.user.userId ? m.toId : m.fromId;
    if (!partners[otherId] || new Date(m.createdAt) > new Date(partners[otherId].createdAt)) {
      partners[otherId] = m;
    }
  });
  const result = Object.entries(partners).map(([otherId, last]) => {
    const other = DB.users.find(u => u.id === otherId);
    const unread = msgs.filter(m => m.fromId === otherId && m.toId === req.user.userId && !m.readAt).length;
    return { userId: otherId, user: other ? sanitizeUser(other) : null, lastMessage: last, unread };
  }).sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));
  res.json(result);
});
app.post('/api/messages', requireAuth, (req, res) => {
  const { toId, body } = req.body || {};
  if (!toId || !body?.trim()) return res.status(400).json({ error: 'Destinatario y mensaje requeridos' });
  const msg = {
    id: 'msg_' + Date.now(),
    fromId: req.user.userId,
    toId,
    body: body.trim().slice(0, 2000),
    createdAt: new Date().toISOString(),
    readAt: null
  };
  if (!DB.messages) DB.messages = [];
  DB.messages.push(msg);
  saveDB();
  // Notify recipient via WebSocket if online
  broadcast('message:new', { messageId: msg.id, from: sanitizeUser(DB.users.find(u => u.id === req.user.userId)), body: msg.body });
  res.json(msg);
});
app.post('/api/messages/:id/read', requireAuth, (req, res) => {
  (DB.messages || []).forEach(m => {
    if (m.fromId === req.params.id && m.toId === req.user.userId) m.readAt = new Date().toISOString();
  });
  saveDB();
  res.json({ ok: true });
});

// ── Reviews ──
app.get('/api/reviews/:psyId', auth, (req, res) => {
  const reviews = (DB.reviews || []).filter(r => r.psyId === req.params.psyId);
  res.json(reviews);
});
app.post('/api/reviews', requireAuth, (req, res) => {
  const { psyId, rating, comment } = req.body || {};
  if (!psyId || !rating) return res.status(400).json({ error: 'psicólogo y calificación requeridos' });
  const review = {
    id: 'r_' + Date.now(),
    psyId,
    patientId: req.user.userId,
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment: (comment || '').trim().slice(0, 500),
    createdAt: new Date().toISOString()
  };
  if (!DB.reviews) DB.reviews = [];
  DB.reviews.push(review);
  // Award points to psych
  const psy = DB.psychs.find(p => p.id === psyId);
  if (psy) awardPoints(psyId, 'review', review.rating * 5, `Calificación ${review.rating}★`);
  saveDB();
  res.json(review);
});

// ── Publications ──
app.get('/api/publications', auth, (req, res) => {
  const list = (DB.publications || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(list);
});
app.post('/api/publications', requireAuth, (req, res) => {
  const { type, title, summary, body, category, url } = req.body || {};
  if (!type || !title?.trim()) return res.status(400).json({ error: 'Tipo y título requeridos' });
  const pub = {
    id: 'pub_' + Date.now(),
    psyId: req.user.userId,
    type, title: title.trim().slice(0, 200),
    summary: (summary || '').trim().slice(0, 500),
    body: (body || '').trim().slice(0, 10000),
    category: category || 'General',
    url: url || '',
    createdAt: new Date().toISOString(),
    likes: []
  };
  if (!DB.publications) DB.publications = [];
  DB.publications.push(pub);
  const pts = type === 'ebook' ? 40 : 20;
  awardPoints(req.user.userId, type, pts, `${type} publicado`);
  saveDB();
  broadcast('publication:create', pub);
  res.json(pub);
});

// ── Points / Ranking ──
app.get('/api/ranking', auth, (req, res) => {
  const events = DB.pointEvents || [];
  const totals = {};
  events.forEach(e => { totals[e.psyId] = (totals[e.psyId] || 0) + (Number(e.delta) || 0); });
  const ranking = Object.entries(totals).map(([psyId, pts]) => {
    const p = DB.psychs.find(x => x.id === psyId);
    const u = DB.users.find(x => x.id === p?.userId);
    return { psyId, pts, name: p?.name || u?.name || '?', rating: ratingOf(psyId) };
  }).sort((a, b) => b.pts - a.pts);
  res.json(ranking);
});

// ═══════════════════════════════════════════════════════════
//  WEBSOCKET — Presencia real y mensajería en tiempo real
// ═══════════════════════════════════════════════════════════
wss.on('connection', (ws, req) => {
  let userId = null;
  let pingTimer = null;

  function send(obj) {
    if (ws.readyState === 1) ws.send(JSON.stringify(obj));
  }

  function startPing() {
    pingTimer = setInterval(() => {
      if (ws.readyState === 1) ws.send(JSON.stringify({ type: 'ping' }));
      else ws.close();
    }, 30000);
  }

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    switch (msg.type) {
      case 'auth': {
        const payload = verifyToken(msg.token);
        if (!payload) { send({ type: 'error', error: 'Token inválido' }); ws.close(); return; }
        userId = payload.userId;
        activeConnections.set(userId, ws);
        // Mark online
        const u = DB.users.find(x => x.id === userId);
        if (u) { u.online = true; u.lastSeen = new Date().toISOString(); saveDB(); }
        // Broadcast presence
        broadcast('presence:update', { userId, online: true, count: activeConnections.size });
        send({ type: 'connected', userId });
        startPing();
        break;
      }
      case 'ping': {
        send({ type: 'pong' });
        break;
      }
      case 'message': {
        if (!userId) { send({ type: 'error', error: 'No autenticado' }); return; }
        const { toId, body } = msg;
        if (!toId || !body?.trim()) { send({ type: 'error', error: 'Datos incompletos' }); return; }
        const dbMsg = {
          id: 'msg_' + Date.now(),
          fromId: userId, toId,
          body: body.trim().slice(0, 2000),
          createdAt: new Date().toISOString(),
          readAt: null
        };
        if (!DB.messages) DB.messages = [];
        DB.messages.push(dbMsg);
        saveDB();
        // Forward to recipient if online
        const targetWs = activeConnections.get(toId);
        if (targetWs && targetWs.readyState === 1) {
          targetWs.send(JSON.stringify({ type: 'message:new', messageId: dbMsg.id, from: sanitizeUser(DB.users.find(u => u.id === userId)), body: dbMsg.body }));
        }
        send({ type: 'message:sent', messageId: dbMsg.id });
        break;
      }
      case 'typing': {
        if (!userId) return;
        const targetWs = activeConnections.get(msg.toId);
        if (targetWs && targetWs.readyState === 1) {
          targetWs.send(JSON.stringify({ type: 'typing', fromUserId: userId, typing: msg.typing }));
        }
        break;
      }
    }
  });

  ws.on('close', () => {
    if (pingTimer) clearInterval(pingTimer);
    if (userId) {
      activeConnections.delete(userId);
      const u = DB.users.find(x => x.id === userId);
      if (u) { u.online = false; u.lastSeen = new Date().toISOString(); saveDB(); }
      broadcast('presence:update', { userId, online: false, count: activeConnections.size });
    }
  });
});

// ── Broadcast to all connected clients ──
function broadcast(type, data) {
  const payload = JSON.stringify({ type, ...data });
  activeConnections.forEach((ws) => {
    if (ws.readyState === 1) ws.send(payload);
  });
}

// ── Heartbeat: mark offline users ──
setInterval(() => {
  const now = Date.now();
  DB.users.forEach(u => {
    if (u.online && !activeConnections.has(u.id)) {
      const lastSeen = u.lastSeen ? new Date(u.lastSeen).getTime() : 0;
      if (now - lastSeen > 2 * 60 * 1000) {
        u.online = false;
        saveDB();
      }
    }
  });
}, 30000);

// ═══════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════
function sanitizeUser(u) {
  if (!u) return null;
  const { password, salt, passHash, ...rest } = u;
  return rest;
}
function cloneDB() { return JSON.parse(JSON.stringify(DB)); }
function randomColor() {
  const colors = ['#002045', '#17a589', '#7c5aa6', '#c0392b', '#2e8b57', '#b7791f', '#1f4b7a', '#8e44ad', '#2e5266', '#a9714b'];
  return colors[Math.floor(Math.random() * colors.length)];
}
function simpleHash(str) {
  var h1 = 0x811c9dc5, h2 = 0x1000193;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    h1 ^= c; h1 = Math.imul(h1, 16777619) >>> 0;
    h2 = Math.imul(h2 ^ c, 2654435761) >>> 0;
  }
  h1 ^= h1 >>> 13; h1 = Math.imul(h1, 0x5bd1e995) >>> 0; h1 ^= h1 >>> 15;
  h2 ^= h2 >>> 16; h2 = Math.imul(h2, 0x85ebca6b) >>> 0; h2 ^= h2 >>> 13;
  return ((h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0'));
}
function isUserOnline(u) {
  if (!u || u.blocked) return false;
  if (u.online) return true;
  var t = u.lastSeen ? new Date(u.lastSeen).getTime() : 0;
  return !!t && (Date.now() - t) < 5 * 60 * 1000;
}
function ratingOf(psyId) {
  const reviews = (DB.reviews || []).filter(r => r.psyId === psyId);
  if (!reviews.length) return { avg: 0, count: 0 };
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return { avg: Math.round(avg * 10) / 10, count: reviews.length };
}
function awardPoints(psyId, type, delta, label) {
  if (!DB.pointEvents) DB.pointEvents = [];
  DB.pointEvents.push({ id: 'pe_' + Date.now(), psyId, type, delta, label, createdAt: new Date().toISOString() });
}

// ═══════════════════════════════════════════════════════════
//  START
// ═══════════════════════════════════════════════════════════
server.listen(PORT, () => {
  console.log(`[WB] Servidor WineBOX.Clinic corriendo en http://localhost:${PORT}`);
  console.log(`[WB] WebSocket activo en ws://localhost:${PORT}`);
  console.log(`[WB] Usuarios: ${DB.users?.length || 0} | Psicólogos: ${DB.psychs?.length || 0}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[WB] Puerto ${PORT} ocupado. Intentando ${PORT + 1}...`);
    server.listen(PORT + 1);
  } else {
    console.error('[WB] Error:', err.message);
  }
});
