/* ============================================================
   WineBOX.Clinic · Setup Turso - Versión con token dinámico
   Ejecutar: node setup-turso-dynamic.js
   ============================================================ */

const fs = require('fs');
const path = require('path');

// Configuración - ACTUALIZAR DESPUÉS DE CORRER EL SCRIPT
let DB_URL = 'https://winebox-clinic-mrwad.aws-sa-east-1.turso.io';
let AUTH_TOKEN = '';

async function tursoRequest(endpoint, body) {
  // Probar diferentes endpoints según la región de Turso
  const endpoints = [
    DB_URL + '/v2/persist/' + endpoint,  // Formato original
    DB_URL + '/v1/' + endpoint,          // Formato v1
    DB_URL + '/' + endpoint              // Sin prefijo
  ];

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + AUTH_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        return response.json();
      }

      const text = await response.text();
      console.log(`   Intentando ${url} -> ${response.status}: ${text.substring(0, 100)}`);
    } catch (e) {
      console.log(`   Error en ${url}: ${e.message}`);
    }
  }

  throw new Error('Ningún endpoint funcionó. Verifica la URL y el token.');
}

async function execSQL(sql, params = []) {
  return tursoRequest('exec', { sql, params });
}

async function querySQL(sql, params = []) {
  return tursoRequest('query', { sql, params });
}

// Schema de tablas
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS wb_users (id TEXT PRIMARY KEY, role TEXT, name TEXT, email TEXT UNIQUE, passHash TEXT, salt TEXT, city TEXT, headline TEXT, bio TEXT, website TEXT, whatsapp TEXT, avatarUrl TEXT, color TEXT, online INTEGER DEFAULT 0, lastSeen TEXT, blocked INTEGER DEFAULT 0, createdAt TEXT)`,
  `CREATE TABLE IF NOT EXISTS wb_psychs (id TEXT PRIMARY KEY, userId TEXT, name TEXT, headline TEXT, bio TEXT, photoUrl TEXT, coverUrl TEXT, city TEXT, province TEXT, country TEXT, address TEXT, mapQuery TEXT, languages TEXT, license TEXT, years INTEGER, specialties TEXT, approaches TEXT, degrees TEXT, certifications TEXT, services TEXT, currency TEXT, paymentMethods TEXT, coverage TEXT, availability TEXT, modalities TEXT, acceptingNew INTEGER DEFAULT 1, verified INTEGER DEFAULT 0, responseTime TEXT, contact INTEGER DEFAULT 0, createdAt TEXT)`,
  `CREATE TABLE IF NOT EXISTS wb_posts (id TEXT PRIMARY KEY, authorId TEXT, body TEXT, imageUrl TEXT, videoUrl TEXT, linkUrl TEXT, questionId TEXT, createdAt TEXT)`,
  `CREATE TABLE IF NOT EXISTS wb_post_likes (postId TEXT, userId TEXT, PRIMARY KEY (postId, userId))`,
  `CREATE TABLE IF NOT EXISTS wb_comments (id TEXT PRIMARY KEY, postId TEXT, authorId TEXT, body TEXT, createdAt TEXT)`,
  `CREATE TABLE IF NOT EXISTS wb_questions (id TEXT PRIMARY KEY, authorId TEXT, title TEXT, body TEXT, category TEXT, tags TEXT, views INTEGER DEFAULT 0, createdAt TEXT)`,
  `CREATE TABLE IF NOT EXISTS wb_answers (id TEXT PRIMARY KEY, questionId TEXT, authorId TEXT, psyId TEXT, body TEXT, upvotes TEXT, accepted INTEGER DEFAULT 0, createdAt TEXT)`,
  `CREATE TABLE IF NOT EXISTS wb_messages (id TEXT PRIMARY KEY, fromId TEXT, toId TEXT, body TEXT, readAt TEXT, createdAt TEXT)`,
  `CREATE TABLE IF NOT EXISTS wb_reviews (id TEXT PRIMARY KEY, psyId TEXT, patientId TEXT, rating INTEGER, comment TEXT, createdAt TEXT)`,
  `CREATE TABLE IF NOT EXISTS wb_publications (id TEXT PRIMARY KEY, psyId TEXT, type TEXT, title TEXT, summary TEXT, body TEXT, category TEXT, url TEXT, likes TEXT, createdAt TEXT)`,
  `CREATE TABLE IF NOT EXISTS wb_point_events (id TEXT PRIMARY KEY, psyId TEXT, type TEXT, delta INTEGER, label TEXT, refId TEXT, createdAt TEXT)`,
  `CREATE TABLE IF NOT EXISTS wb_appointments (id TEXT PRIMARY KEY, psyId TEXT, patientId TEXT, date TEXT, time TEXT, status TEXT, notes TEXT, createdAt TEXT)`,
  `CREATE TABLE IF NOT EXISTS wb_aurakit_projects (id TEXT PRIMARY KEY, psyId TEXT, name TEXT, template TEXT, headline TEXT, subheadline TEXT, about TEXT, cta TEXT, brand TEXT, accent TEXT, blocks TEXT, contact TEXT, services TEXT, books TEXT, testimonials TEXT, publishedUrl TEXT, createdAt TEXT, updatedAt TEXT)`,
  `CREATE TABLE IF NOT EXISTS wb_reports (id TEXT PRIMARY KEY, targetType TEXT, targetId TEXT, reporterId TEXT, reason TEXT, status TEXT, createdAt TEXT)`
];

const INDICES = [
  'CREATE INDEX IF NOT EXISTS idx_posts_author ON wb_posts(authorId)',
  'CREATE INDEX IF NOT EXISTS idx_posts_created ON wb_posts(createdAt)',
  'CREATE INDEX IF NOT EXISTS idx_questions_author ON wb_questions(authorId)',
  'CREATE INDEX IF NOT EXISTS idx_messages_users ON wb_messages(fromId, toId)',
  'CREATE INDEX IF NOT EXISTS idx_reviews_psy ON wb_reviews(psyId)',
  'CREATE INDEX IF NOT EXISTS idx_point_events_psy ON wb_point_events(psyId)'
];

async function main() {
  console.log('🚀 WineBOX.Clinic - Setup Turso Dinámico');
  console.log('=========================================\n');
  
  // Pedir token al usuario
  console.log('📋 Pasos para obtener el token:');
  console.log('   1. Ir a https://turso.tech');
  console.log('   2. Ir a tu base de datos: winebox-clinic');
  console.log('   3. Click en "Access API" o "Teammates"');
  console.log('   4. Click en "Generate Token"');
  console.log('   5. Copiar el token (empieza con eyJ...)');
  console.log('');
  
  // Leer desde config.js si existe
  try {
    const configContent = fs.readFileSync(path.join(__dirname, 'config.js'), 'utf8');
    const tokenMatch = configContent.match(/authToken:\s*'([^']+)'/);
    if (tokenMatch) {
      AUTH_TOKEN = tokenMatch[1];
      console.log('✅ Token encontrado en config.js');
    } else {
      console.log('⚠️  Token no encontrado en config.js');
      console.log('   Por favor ingresa tu token cuando se te pida.\n');
    }
  } catch (e) {
    console.log('⚠️  No se pudo leer config.js\n');
  }
  
  // Probar conexión
  console.log('1️⃣  Probando conexión...');
  try {
    const result = await querySQL('SELECT 1 as test');
    console.log('   ✅ Conexión exitosa!\n');
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    console.log('\n   Si el error dice "Unauthorized", el token es inválido.');
    console.log('   Genera uno nuevo en: https://turso.tech');
    process.exit(1);
  }
  
  // Crear tablas
  console.log('2️⃣  Creando tablas...');
  for (const sql of SCHEMA) {
    await execSQL(sql);
  }
  console.log('   ✅ Tablas creadas\n');
  
  // Crear índices
  console.log('3️⃣  Creando índices...');
  for (const sql of INDICES) {
    await execSQL(sql);
  }
  console.log('   ✅ Índices creados\n');
  
  // Cargar datos
  console.log('4️�  Cargando datos semilla...');
  
  try {
    const dataContent = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
    const match = dataContent.match(/WINEBOX_SEED\s*=\s*(\{[\s\S]*?\n\});/);
    if (!match) {
      console.error('❌ No se pudo extraer WINEBOX_SEED de data.js');
      process.exit(1);
    }
    
    const seed = eval('(' + match[1] + ')');
    
    // Usuarios
    console.log('   Inserando usuarios...');
    for (const u of (seed.users || [])) {
      await execSQL(`INSERT OR IGNORE INTO wb_users (id, role, name, email, passHash, salt, city, headline, bio, website, whatsapp, avatarUrl, color, online, lastSeen, blocked, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.role, u.name, u.email, u.passHash || '', u.salt || '', u.city || '', u.headline || '', u.bio || '', u.website || '', u.whatsapp || '', u.avatarUrl || '', u.color || '#1877f2', u.online ? 1 : 0, u.lastSeen || null, u.blocked ? 1 : 0, u.createdAt || new Date().toISOString()]);
    }
    console.log(`   ✅ ${seed.users?.length || 0} usuarios`);
    
    // Psicólogos
    console.log('   Inserando psicólogos...');
    for (const p of (seed.psychs || [])) {
      await execSQL(`INSERT OR IGNORE INTO wb_psychs (id, userId, name, headline, bio, photoUrl, coverUrl, city, province, country, address, mapQuery, languages, license, years, specialties, approaches, degrees, certifications, services, currency, paymentMethods, coverage, availability, modalities, acceptingNew, verified, responseTime, contact, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.id, p.userId, p.name, p.headline, p.bio, p.photoUrl || '', p.coverUrl || '', p.city || '', p.province || '', p.country || 'Argentina', p.address || '', p.mapQuery || p.city || '', JSON.stringify(p.languages || ['Español']), p.license || '', p.years || 0, JSON.stringify(p.specialties || []), JSON.stringify(p.approaches || []), JSON.stringify(p.degrees || []), JSON.stringify(p.certifications || []), JSON.stringify(p.services || []), p.currency || 'ARS', JSON.stringify(p.paymentMethods || []), JSON.stringify(p.coverage || []), JSON.stringify(p.availability || []), JSON.stringify(p.modalities || ['online']), p.acceptingNew ? 1 : 0, p.verified ? 1 : 0, p.responseTime || '', p.contact || 0, p.createdAt || new Date().toISOString()]);
    }
    console.log(`   ✅ ${seed.psychs?.length || 0} psicólogos`);
    
    // Posts
    console.log('   Inserando posts...');
    for (const post of (seed.posts || [])) {
      await execSQL(`INSERT OR IGNORE INTO wb_posts (id, authorId, body, imageUrl, videoUrl, linkUrl, questionId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [post.id, post.authorId, post.body, post.imageUrl || '', post.videoUrl || '', post.linkUrl || '', post.questionId || '', post.createdAt]);
    }
    console.log(`   ✅ ${seed.posts?.length || 0} posts`);
    
    // Preguntas
    console.log('   Inserando preguntas...');
    for (const q of (seed.questions || [])) {
      await execSQL(`INSERT OR IGNORE INTO wb_questions (id, authorId, title, body, category, tags, views, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [q.id, q.authorId, q.title, q.body, q.category, JSON.stringify(q.tags || []), q.views || 0, q.createdAt]);
      for (const a of (q.answers || [])) {
        await execSQL(`INSERT OR IGNORE INTO wb_answers (id, questionId, authorId, psyId, body, upvotes, accepted, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [a.id, q.id, a.authorId, a.psyId || '', a.body, '[]', a.accepted ? 1 : 0, a.createdAt]);
      }
    }
    console.log(`   ✅ ${seed.questions?.length || 0} preguntas`);
    
    // Publicaciones
    console.log('   Inserando publicaciones...');
    for (const pub of (seed.publications || [])) {
      await execSQL(`INSERT OR IGNORE INTO wb_publications (id, psyId, type, title, summary, body, category, url, likes, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [pub.id, pub.psyId, pub.type, pub.title, pub.summary || '', pub.body || '', pub.category, pub.url || '', '[]', pub.createdAt]);
    }
    console.log(`   ✅ ${seed.publications?.length || 0} publicaciones`);
    
    // Eventos de puntos
    console.log('   Inserando eventos de puntos...');
    for (const pe of (seed.pointEvents || [])) {
      await execSQL(`INSERT OR IGNORE INTO wb_point_events (id, psyId, type, delta, label, refId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [pe.id, pe.psyId, pe.type, pe.delta, pe.label, '', pe.createdAt]);
    }
    console.log(`   ✅ ${seed.pointEvents?.length || 0} eventos`);
    
    // Reseñas
    console.log('   Inserando reseñas...');
    for (const r of (seed.reviews || [])) {
      await execSQL(`INSERT OR IGNORE INTO wb_reviews (id, psyId, patientId, rating, comment, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
        [r.id, r.psyId, r.patientId, r.rating, r.comment || '', r.createdAt]);
    }
    console.log(`   ✅ ${seed.reviews?.length || 0} reseñas`);
    
    // Mensajes
    console.log('   Inserando mensajes...');
    for (const m of (seed.messages || [])) {
      await execSQL(`INSERT OR IGNORE INTO wb_messages (id, fromId, toId, body, readAt, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
        [m.id, m.fromId, m.toId, m.body, m.readAt || null, m.createdAt]);
    }
    console.log(`   ✅ ${seed.messages?.length || 0} mensajes`);
    
  } catch (error) {
    console.error('❌ Error cargando datos:', error.message);
    process.exit(1);
  }
  
  // Verificación final
  console.log('\n5️⃣  Verificación...');
  const userCount = await querySQL('SELECT COUNT(*) as c FROM wb_users');
  const psychCount = await querySQL('SELECT COUNT(*) as c FROM wb_psychs');
  
  console.log('   Usuarios:', userCount.results?.[0]?.rows?.[0]?.c || 0);
  console.log('   Psicólogos:', psychCount.results?.[0]?.rows?.[0]?.c || 0);
  
  console.log('\n✅ ¡Base de datos configurada exitosamente!');
  console.log('\n📍 Tu app está lista para usar.');
  console.log('   URL: https://tu-usuario.github.io/winebox-clinic/');
}

main().catch(console.error);
