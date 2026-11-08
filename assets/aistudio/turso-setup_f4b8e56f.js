/* ============================================================
   WineBOX.Clinic · Setup Turso (primera vez)
   Ejecutar una sola vez para crear la base de datos
   ============================================================ */
(async function() {
  // Usar config de config.js
  const CONFIG = window.WB_CONFIG || {};
  const DB_URL = CONFIG.turso?.url || '';
  const AUTH_TOKEN = CONFIG.turso?.authToken || '';
  const SEED = window.WINEBOX_SEED;

  if (!DB_URL || !AUTH_TOKEN) {
    console.error('[Setup] Falta configuración Turso. Verificar config.js');
    return;
  }

  function exec(sql, params) {
    const headers = {
      'Authorization': 'Bearer ' + AUTH_TOKEN,
      'Content-Type': 'application/json'
    };
    return fetch(DB_URL + '/v2/persist/exec', {
      method: 'POST',
      headers,
      body: JSON.stringify({ sql, params: params || [] })
    }).then(r => r.json());
  }

  function query(sql, params) {
    const headers = {
      'Authorization': 'Bearer ' + AUTH_TOKEN,
      'Content-Type': 'application/json'
    };
    return fetch(DB_URL + '/v2/persist/query', {
      method: 'POST',
      headers,
      body: JSON.stringify({ sql, params: params || [] })
    }).then(r => r.json());
  }

  console.log('[Setup] Creando tablas...');

  // Tablas
  await exec(`
    CREATE TABLE IF NOT EXISTS wb_users (
      id TEXT PRIMARY KEY, role TEXT, name TEXT, email TEXT UNIQUE,
      passHash TEXT, salt TEXT, city TEXT, headline TEXT, bio TEXT,
      website TEXT, whatsapp TEXT, avatarUrl TEXT, color TEXT,
      online INTEGER DEFAULT 0, lastSeen TEXT, blocked INTEGER DEFAULT 0,
      createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS wb_psychs (
      id TEXT PRIMARY KEY, userId TEXT, name TEXT, headline TEXT, bio TEXT,
      photoUrl TEXT, coverUrl TEXT, city TEXT, province TEXT, country TEXT,
      address TEXT, mapQuery TEXT, languages TEXT, license TEXT, years INTEGER,
      specialties TEXT, approaches TEXT, degrees TEXT, certifications TEXT,
      services TEXT, currency TEXT, paymentMethods TEXT, coverage TEXT,
      availability TEXT, modalities TEXT, acceptingNew INTEGER DEFAULT 1,
      verified INTEGER DEFAULT 0, responseTime TEXT, contact INTEGER DEFAULT 0,
      createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS wb_posts (
      id TEXT PRIMARY KEY, authorId TEXT, body TEXT,
      imageUrl TEXT, videoUrl TEXT, linkUrl TEXT, questionId TEXT,
      createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS wb_post_likes (postId TEXT, userId TEXT, PRIMARY KEY (postId, userId));
    CREATE TABLE IF NOT EXISTS wb_comments (
      id TEXT PRIMARY KEY, postId TEXT, authorId TEXT, body TEXT, createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS wb_questions (
      id TEXT PRIMARY KEY, authorId TEXT, title TEXT, body TEXT,
      category TEXT, tags TEXT, views INTEGER DEFAULT 0, createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS wb_answers (
      id TEXT PRIMARY KEY, questionId TEXT, authorId TEXT, psyId TEXT,
      body TEXT, upvotes TEXT, accepted INTEGER DEFAULT 0, createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS wb_messages (
      id TEXT PRIMARY KEY, fromId TEXT, toId TEXT, body TEXT,
      readAt TEXT, createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS wb_reviews (
      id TEXT PRIMARY KEY, psyId TEXT, patientId TEXT, rating INTEGER,
      comment TEXT, createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS wb_publications (
      id TEXT PRIMARY KEY, psyId TEXT, type TEXT, title TEXT,
      summary TEXT, body TEXT, category TEXT, url TEXT, likes TEXT, createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS wb_point_events (
      id TEXT PRIMARY KEY, psyId TEXT, type TEXT, delta INTEGER,
      label TEXT, refId TEXT, createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS wb_appointments (
      id TEXT PRIMARY KEY, psyId TEXT, patientId TEXT, date TEXT,
      time TEXT, status TEXT, notes TEXT, createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS wb_aurakit_projects (
      id TEXT PRIMARY KEY, psyId TEXT, name TEXT, template TEXT,
      headline TEXT, subheadline TEXT, about TEXT, cta TEXT, brand TEXT,
      accent TEXT, blocks TEXT, contact TEXT, services TEXT, books TEXT,
      testimonials TEXT, publishedUrl TEXT, createdAt TEXT, updatedAt TEXT
    );
    CREATE TABLE IF NOT EXISTS wb_reports (
      id TEXT PRIMARY KEY, targetType TEXT, targetId TEXT,
      reporterId TEXT, reason TEXT, status TEXT, createdAt TEXT
    );
  `);
  console.log('[Setup] ✓ Tablas creadas');

  // Índices
  await exec(`
    CREATE INDEX IF NOT EXISTS idx_posts_author ON wb_posts(authorId);
    CREATE INDEX IF NOT EXISTS idx_posts_created ON wb_posts(createdAt);
    CREATE INDEX IF NOT EXISTS idx_questions_author ON wb_questions(authorId);
    CREATE INDEX IF NOT EXISTS idx_messages_users ON wb_messages(fromId, toId);
    CREATE INDEX IF NOT EXISTS idx_reviews_psy ON wb_reviews(psyId);
    CREATE INDEX IF NOT EXISTS idx_point_events_psy ON wb_point_events(psyId);
  `);
  console.log('[Setup] ✓ Índices creados');

  // Insertar seed (usuarios)
  console.log('[Setup] Inserando usuarios...');
  for (const u of (SEED.users || [])) {
    await exec(`
      INSERT OR IGNORE INTO wb_users
      (id, role, name, email, passHash, salt, city, headline, bio, website, whatsapp, avatarUrl, color, online, lastSeen, blocked, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      u.id, u.role, u.name, u.email, u.passHash, u.salt,
      u.city || '', u.headline || '', u.bio || '', u.website || '',
      u.whatsapp || '', u.avatarUrl || '', u.color || '#1877f2',
      u.online ? 1 : 0, u.lastSeen || null, u.blocked ? 1 : 0,
      u.createdAt || new Date().toISOString()
    ]);
  }
  console.log('[Setup] ✓ Usuarios insertados:', (SEED.users || []).length);

  // Psicólogos
  console.log('[Setup] Inserando psicólogos...');
  for (const p of (SEED.psychs || [])) {
    await exec(`
      INSERT OR IGNORE INTO wb_psychs
      (id, userId, name, headline, bio, photoUrl, coverUrl, city, province, country,
       address, mapQuery, languages, license, years, specialties, approaches,
       degrees, certifications, services, currency, paymentMethods, coverage,
       availability, modalities, acceptingNew, verified, responseTime, contact, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      p.id, p.userId, p.name, p.headline, p.bio,
      p.photoUrl || '', p.coverUrl || '', p.city || '', p.province || '', p.country || 'Argentina',
      p.address || '', p.mapQuery || p.city || '', JSON.stringify(p.languages || ['Español']),
      p.license || '', p.years || 0, JSON.stringify(p.specialties || []),
      JSON.stringify(p.approaches || []), JSON.stringify(p.degrees || []),
      JSON.stringify(p.certifications || []), JSON.stringify(p.services || []),
      p.currency || 'ARS', JSON.stringify(p.paymentMethods || []),
      JSON.stringify(p.coverage || []), JSON.stringify(p.availability || []),
      JSON.stringify(p.modalities || ['online']), p.acceptingNew ? 1 : 0,
      p.verified ? 1 : 0, p.responseTime || '', p.contact || 0, p.createdAt || new Date().toISOString()
    ]);
  }
  console.log('[Setup] ✓ Psicólogos insertados:', (SEED.psychs || []).length);

  // Posts
  console.log('[Setup] Inserando posts...');
  for (const post of (SEED.posts || [])) {
    await exec(`
      INSERT OR IGNORE INTO wb_posts (id, authorId, body, imageUrl, videoUrl, linkUrl, questionId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [post.id, post.authorId, post.body, post.imageUrl || '', post.videoUrl || '', post.linkUrl || '', post.questionId || '', post.createdAt]);
  }
  console.log('[Setup] ✓ Posts insertados:', (SEED.posts || []).length);

  // Preguntas
  console.log('[Setup] Inserando preguntas...');
  for (const q of (SEED.questions || [])) {
    await exec(`
      INSERT OR IGNORE INTO wb_questions (id, authorId, title, body, category, tags, views, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [q.id, q.authorId, q.title, q.body, q.category, JSON.stringify(q.tags || []), q.views || 0, q.createdAt]);
    // Answers
    for (const a of (q.answers || [])) {
      await exec(`
        INSERT OR IGNORE INTO wb_answers (id, questionId, authorId, psyId, body, upvotes, accepted, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [a.id, q.id, a.authorId, a.psyId || '', a.body, JSON.stringify(a.upvotes || []), a.accepted ? 1 : 0, a.createdAt]);
    }
  }
  console.log('[Setup] ✓ Preguntas insertadas:', (SEED.questions || []).length);

  // Publications (ebooks)
  console.log('[Setup] Inserando publicaciones...');
  for (const pub of (SEED.publications || [])) {
    await exec(`
      INSERT OR IGNORE INTO wb_publications (id, psyId, type, title, summary, body, category, url, likes, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [pub.id, pub.psyId, pub.type, pub.title, pub.summary || '', pub.body || '', pub.category, pub.url || '', '[]', pub.createdAt]);
  }
  console.log('[Setup] ✓ Publicaciones insertadas:', (SEED.publications || []).length);

  // Point events
  console.log('[Setup] Inserando eventos de puntos...');
  for (const pe of (SEED.pointEvents || [])) {
    await exec(`
      INSERT OR IGNORE INTO wb_point_events (id, psyId, type, delta, label, refId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [pe.id, pe.psyId, pe.type, pe.delta, pe.label, '', pe.createdAt]);
  }
  console.log('[Setup] ✓ Eventos de puntos insertados:', (SEED.pointEvents || []).length);

  // Reviews
  console.log('[Setup] Inserando reseñas...');
  for (const r of (SEED.reviews || [])) {
    await exec(`
      INSERT OR IGNORE INTO wb_reviews (id, psyId, patientId, rating, comment, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [r.id, r.psyId, r.patientId, r.rating, r.comment, r.createdAt]);
  }
  console.log('[Setup] ✓ Reseñas insertadas:', (SEED.reviews || []).length);

  // Mensajes
  console.log('[Setup] Inserando mensajes...');
  for (const m of (SEED.messages || [])) {
    await exec(`
      INSERT OR IGNORE INTO wb_messages (id, fromId, toId, body, readAt, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [m.id, m.fromId, m.toId, m.body, m.readAt || null, m.createdAt]);
  }
  console.log('[Setup] ✓ Mensajes insertados:', (SEED.messages || []).length);

  // Contar todo
  const counts = await query('SELECT COUNT(*) as c FROM wb_users');
  console.log('\n[Setup] ✓ Base de datos creada exitosamente!');
  console.log('[Setup] Usuarios:', counts.results?.[0]?.rows?.[0]?.c || 0);
  console.log('[Setup] URL:', DB_URL);
})();
