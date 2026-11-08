/* ============================================================
   WineBOX.Clinic · Test de conexión Turso AWS
   ============================================================ */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Leer config
let config = { url: '', token: '' };
try {
  const configContent = fs.readFileSync(path.join(__dirname, 'config.js'), 'utf8');
  const urlMatch = configContent.match(/url:\s*'([^']+)'/);
  const tokenMatch = configContent.match(/authToken:\s*'([^']+)'/);
  if (urlMatch) config.url = urlMatch[1];
  if (tokenMatch) config.token = tokenMatch[1];
} catch (e) {
  console.error('❌ Error leyendo config.js:', e.message);
  process.exit(1);
}

console.log('🔍 Configuración Turso AWS:');
console.log('   URL:', config.url);
console.log('   Token:', config.token ? '✓ presente' : '✗ faltante');
console.log('');

// Para AWS, probar diferentes rutas
const tests = [
  { path: '/.libsql', method: 'GET', desc: 'Health check' },
  { path: '/admin', method: 'GET', desc: 'Admin panel' },
  { path: '/v2/database', method: 'GET', desc: 'List databases' },
];

async function testPath(test) {
  return new Promise((resolve) => {
    const options = {
      hostname: new URL(config.url).hostname,
      path: test.path,
      method: test.method,
      headers: {
        'Authorization': 'Bearer ' + config.token,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ ...test, status: res.statusCode, body: data.substring(0, 200) });
      });
    });

    req.on('error', e => resolve({ ...test, status: 0, error: e.message }));
    req.end();
  });
}

async function main() {
  console.log('📡 Probing AWS endpoints...\n');
  
  for (const test of tests) {
    const result = await testPath(test);
    console.log(`${test.desc}:`);
    console.log(`   Path: ${test.path}`);
    console.log(`   Status: ${result.status}`);
    if (result.body) console.log(`   Body: ${result.body}`);
    if (result.error) console.log(`   Error: ${result.error}`);
    console.log('');
  }

  console.log('💡 Nota: Las bases de datos Turso en AWS usan un formato de API diferente.');
  console.log('   Recomendación: Crear una nueva base de datos en la región "Global" (no AWS)');
  console.log('   o usar el CLI de Turso para interactuar directamente.');
  console.log('');
  console.log('📋 Pasos alternativos:');
  console.log('   1. Instalar CLI: npm install -g @turso/cli');
  console.log('   2. Login: turso db list');
  console.log('   3. Usar libsql:// URL directa');
}

main().catch(console.error);
