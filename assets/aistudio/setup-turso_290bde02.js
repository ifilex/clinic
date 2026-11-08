/* ============================================================
   WineBOX.Clinic · Setup Turso (Node.js - ejecutar en terminal)
   Este script carga los datos en Turso SIN CORS
   ============================================================ */

const fs = require('fs');
const path = require('path');

// Configuración
const DB_URL = 'https://winebox-clinic-mrwad.aws-sa-east-1.turso.io';
// Token de autenticación de Turso
// Para obtener uno nuevo: ir a https://turso.tech → tu base de datos → Access API → Generate Token
const AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwNjExMzAsImlkIjoiMDFhMTdhYzUtMjUwMS03OGZkLTg0YjEtNWVkYWE4NTgyZWY2Iiwia2lkIjoiSGpqYjE1N2ExUkZXSy0wN1hkWk1FUrV4TGhXSVBFNWpnRXhfT1M5RHd6MCIsInJpZCI6ImUxZTc3ZTliLTE0N2MtNGY4ZC1iNmVmLWM3NjFmNDgyYmUxNiJ9.X5N_smoFh1_81H39-WW_4aJ5N32GGKC8Af8PT9pOQ0Y3FhErK6X3VgIU-GSnemghuXUPcGADXrBb-TzhEwdLBQ';

async function tursoRequest(endpoint, body) {
  const url = DB_URL + '/v2/persist/' + endpoint;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + AUTH_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  
  return response.json();
}

async function execSQL(sql, params = []) {
  console.log('  Exec:', sql.substring(0, 60) + '...');
  return tursoRequest('exec', { sql, params });
}

async function querySQL(sql, params = []) {
  return tursoRequest('query', { sql, params });
}

// Schema de tablas
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS wb_users (
    id TEXT PRIMARY KEY, role TEXT, name TEXT, email TEXT UNIQUE,
    passHash TEXT, salt TEXT, city TEXT, headline TEXT, bio TEXT,
    website TEXT, whatsapp TEXT, avatarUrl TEXT, color TEXT,
    online INTEGER DEFAULT 0, lastSeen TEXT, blocked INTEGER DEFAULT 0,
    createdAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS wb_psychs (
    id TEXT PRIMARY KEY, userId TEXT, name TEXT, headline TEXT, bio TEXT,
    photoUrl TEXT, coverUrl TEXT, city TEXT, province TEXT, country TEXT,
    address TEXT, mapQuery TEXT, languages TEXT, license TEXT, years INTEGER,
    specialties TEXT, approaches TEXT, degrees TEXT, certifications TEXT,
    services TEXT, currency TEXT, paymentMethods TEXT, coverage TEXT,
    availability TEXT, modalities TEXT, acceptingNew INTEGER DEFAULT 1,
    verified INTEGER DEFAULT 0, responseTime TEXT, contact INTEGER DEFAULT 0,
    createdAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS wb_posts (
    id TEXT PRIMARY KEY, authorId TEXT, body TEXT,
    imageUrl TEXT, videoUrl TEXT, linkUrl TEXT, questionId TEXT,
    createdAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS wb_post_likes (postId TEXT, userId TEXT, PRIMARY KEY (postId, userId))`,
  `CREATE TABLE IF NOT EXISTS wb_comments (
    id TEXT PRIMARY KEY, postId TEXT, authorId TEXT, body TEXT, createdAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS wb_questions (
    id TEXT PRIMARY KEY, authorId TEXT, title TEXT, body TEXT,
    category TEXT, tags TEXT, views INTEGER DEFAULT 0, createdAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS wb_answers (
    id TEXT PRIMARY KEY, questionId TEXT, authorId TEXT, psyId TEXT,
    body TEXT, upvotes TEXT, accepted INTEGER DEFAULT 0, createdAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS wb_messages (
    id TEXT PRIMARY KEY, fromId TEXT, toId TEXT, body TEXT,
    readAt TEXT, createdAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS wb_reviews (
    id TEXT PRIMARY KEY, psyId TEXT, patientId TEXT, rating INTEGER,
    comment TEXT, createdAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS wb_publications (
    id TEXT PRIMARY KEY, psyId TEXT, type TEXT, title TEXT,
    summary TEXT, body TEXT, category TEXT, url TEXT, likes TEXT, createdAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS wb_point_events (
    id TEXT PRIMARY KEY, psyId TEXT, type TEXT, delta INTEGER,
    label TEXT, refId TEXT, createdAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS wb_appointments (
    id TEXT PRIMARY KEY, psyId TEXT, patientId TEXT, date TEXT,
    time TEXT, status TEXT, notes TEXT, createdAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS wb_aurakit_projects (
    id TEXT PRIMARY KEY, psyId TEXT, name TEXT, template TEXT,
    headline TEXT, subheadline TEXT, about TEXT, cta TEXT, brand TEXT,
    accent TEXT, blocks TEXT, contact TEXT, services TEXT, books TEXT,
    testimonials TEXT, publishedUrl TEXT, createdAt TEXT, updatedAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS wb_reports (
    id TEXT PRIMARY KEY, targetType TEXT, targetId TEXT,
    reporterId TEXT, reason TEXT, status TEXT, createdAt TEXT
  )`
];

// Índices
const INDICES = [
  'CREATE INDEX IF NOT EXISTS idx_posts_author ON wb_posts(authorId)',
  'CREATE INDEX IF NOT EXISTS idx_posts_created ON wb_posts(createdAt)',
  'CREATE INDEX IF NOT EXISTS idx_questions_author ON wb_questions(authorId)',
  'CREATE INDEX IF NOT EXISTS idx_messages_users ON wb_messages(fromId, toId)',
  'CREATE INDEX IF NOT EXISTS idx_reviews_psy ON wb_reviews(psyId)',
  'CREATE INDEX IF NOT EXISTS idx_point_events_psy ON wb_point_events(psyId)'
];

async function main() {
  console.log('🚀 WineBOX.Clinic - Setup Turso');
  console.log('================================');
  console.log('URL:', DB_URL);
  console.log('');
  
  try {
    // 1. Probar conexión
    console.log('1️⃣  Probando conexión...');
    await querySQL('SELECT 1 as test');
    console.log('   ✅ Conexión exitosa\n');
    
    // 2. Crear tablas
    console.log('2️⃣  Creando tablas...');
    for (const sql of SCHEMA) {
      await execSQL(sql);
    }
    console.log('   ✅ Tablas creadas\n');
    
    // 3. Crear índices
    console.log('3️⃣  Creando índices...');
    for (const sql of INDICES) {
      await execSQL(sql);
    }
    console.log('   ✅ Índices creados\n');
    
    // 4. Cargar datos semilla
    console.log('4️⃣  Cargando datos semilla...');
    
    // Cargar data.js
    const dataContent = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
    // Extraer WINEBOX_SEED del contenido
    const match = dataContent.match(/WINEBOX_SEED\s*=\s*(\{[\s\S]*?\n\});/);
    if (!match) {
      console.error('❌ No se pudo extraer WINEBOX_SEED de data.js');
      process.exit(1);
    }
    
    // Evaluar seguro (solo para datos locales)
    const seed = eval('(' + match[1] + ')');
    
    // Insertar usuarios
    console.log('   Inserando usuarios...');
    for (const u of (seed.users || [])) {
      await execSQL(`
        INSERT OR IGNORE INTO wb_users 
        (id, role, name, email, passHash, salt, city, headline, bio, website, whatsapp, avatarUrl, color, online, lastSeen, blocked, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        u.id, u.role, u.name, u.email, u.passHash || '', u.salt || '',
        u.city || '', u.headline || '', u.bio || '', u.website || '',
        u.whatsapp || '', u.avatarUrl || '', u.color || '#1877f2',
        u.online ? 1 : 0, u.lastSeen || null, u.blocked ? 1 : 0,
        u.createdAt || new Date().toISOString()
      ]);
    }
    console.log(`   ✅ ${seed.users?.length || 0} usuarios insertados`);
    
    // Insertar psicólogos
    console.log('   Inserando psicólogos...');
    for (const p of (seed.psychs || [])) {
      await execSQL(`
        INSERT OR IGNORE INTO wb_psychs
        (id, userId, name, headline, bio, photoUrl, coverUrl, city, province, country,
         address, mapQuery, languages, license, years, specialties, approaches,
         degrees, certifications, services, currency, paymentMethods, coverage,
         availability, modalities, acceptingNew, verified, responseTime, contact, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        p.verified ? 1 : 0, p.responseTime || '', p.contact || 0,
        p.createdAt || new Date().toISOString()
      ]);
    }
    console.log(`   ✅ ${seed.psychs?.length || 0} psicólogos insertados`);
    
    // Insertar posts
    console.log('   Inserando posts...');
    for (const post of (seed.posts || [])) {
      await execSQL(`
        INSERT OR IGNORE INTO wb_posts (id, authorId, body, imageUrl, videoUrl, linkUrl, questionId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [post.id, post.authorId, post.body, post.imageUrl || '', post.videoUrl || '', post.linkUrl || '', post.questionId || '', post.createdAt]);
    }
    console.log(`   ✅ ${seed.posts?.length || 0} posts insertados`);
    
    // Insertar preguntas y respuestas
    console.log('   Inserando preguntas...');
    for (const q of (seed.questions || [])) {
      await execSQL(`
        INSERT OR IGNORE INTO wb_questions (id, authorId, title, body, category, tags, views, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [q.id, q.authorId, q.title, q.body, q.category, JSON.stringify(q.tags || []), q.views || 0, q.createdAt]);
      
      for (const a of (q.answers || [])) {
        await execSQL(`
          INSERT OR IGNORE INTO wb_answers (id, questionId, authorId, psyId, body, upvotes, accepted, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [a.id, q.id, a.authorId, a.psyId || '', a.body, '[]', a.accepted ? 1 : 0, a.createdAt]);
      }
    }
    console.log(`   ✅ ${seed.questions?.length || 0} preguntas insertadas`);
    
    // Insertar publicaciones
    console.log('   Inserando publicaciones...');
    for (const pub of (seed.publications || [])) {
      await execSQL(`
        INSERT OR IGNORE INTO wb_publications (id, psyId, type, title, summary, body, category, url, likes, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [pub.id, pub.psyId, pub.type, pub.title, pub.summary || '', pub.body || '', pub.category, pub.url || '', '[]', pub.createdAt]);
    }
    console.log(`   ✅ ${seed.publications?.length || 0} publicaciones insertadas`);
    
    // Insertar eventos de puntos
    console.log('   Inserando eventos de puntos...');
    for (const pe of (seed.pointEvents || [])) {
      await execSQL(`
        INSERT OR IGNORE INTO wb_point_events (id, psyId, type, delta, label, refId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [pe.id, pe.psyId, pe.type, pe.delta, pe.label, '', pe.createdAt]);
    }
    console.log(`   ✅ ${seed.pointEvents?.length || 0} eventos insertados`);
    
    // Insertar reseñas
    console.log('   Inserando reseñas...');
    for (const r of (seed.reviews || [])) {
      await execSQL(`
        INSERT OR IGNORE INTO wb_reviews (id, psyId, patientId, rating, comment, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [r.id, r.psyId, r.patientId, r.rating, r.comment || '', r.createdAt]);
    }
    console.log(`   ✅ ${seed.reviews?.length || 0} reseñas insertadas`);
    
    // Insertar mensajes
    console.log('   Inserando mensajes...');
    for (const m of (seed.messages || [])) {
      await execSQL(`
        INSERT OR IGNORE INTO wb_messages (id, fromId, toId, body, readAt, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [m.id, m.fromId, m.toId, m.body, m.readAt || null, m.createdAt]);
    }
    console.log(`   ✅ ${seed.messages?.length || 0} mensajes insertados`);
    
    // 5. Verificar
    console.log('\n5️⃣  Verificación final...');
    const userCount = await querySQL('SELECT COUNT(*) as c FROM wb_users');
    const psychCount = await querySQL('SELECT COUNT(*) as c FROM wb_psychs');
    const postCount = await querySQL('SELECT COUNT(*) as c FROM wb_posts');
    
    console.log('   Usuarios:', userCount.results?.[0]?.rows?.[0]?.c || 0);
    console.log('   Psicólogos:', psychCount.results?.[0]?.rows?.[0]?.c || 0);
    console.log('   Posts:', postCount.results?.[0]?.rows?.[0]?.c || 0);
    
    console.log('\n✅ ¡Base de datos configurada exitosamente!');
    console.log('\n📍 Tu app está lista en: https://tu-usuario.github.io/winebox-clinic/');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      console.error('\n💡 Esto es un error de red/CORS.');
      console.error('   Solución: Ejecuta este script desde tu computadora (no desde el navegador):');
      console.error('   node setup-turso.js');
    }
    process.exit(1);
  }
}

main();
