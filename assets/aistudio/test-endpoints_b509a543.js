/* ============================================================
   WineBOX.Clinic · Prueba de conexión Turso - Múltiples endpoints
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

console.log('🔍 Configuración:');
console.log('   URL:', config.url);
console.log('   Token:', config.token ? '✓' : '✗');
console.log('');

const endpoints = [
  '/v2/persist/query',
  '/v1/query',
  '/query',
  '/db/query'
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ sql: 'SELECT 1 as test' });
    
    const options = {
      hostname: new URL(config.url).hostname,
      path: endpoint,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + config.token,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ endpoint, status: res.statusCode, body: data });
      });
    });

    req.on('error', e => resolve({ endpoint, status: 0, error: e.message }));
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('📡 Probando endpoints...\n');
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    const statusIcon = result.status === 200 ? '✅' : '❌';
    console.log(`${statusIcon} ${endpoint}`);
    console.log(`   Status: ${result.status}`);
    if (result.status !== 200) {
      console.log(`   Error: ${result.body?.substring(0, 80) || result.error}`);
    } else {
      console.log(`   Response: ${result.body}`);
    }
    console.log('');
    
    if (result.status === 200) {
      console.log('🎯 ¡Endpoint correcto encontrado!');
      console.log(`   Usar: ${endpoint}`);
      console.log('');
      console.log('✅ Tu base de datos es accesible.');
      console.log('   Ahora ejecutá: node setup-turso-dynamic.js');
      return;
    }
  }
  
  console.log('❌ Ningún endpoint funcionó.');
  console.log('');
  console.log('Posibles causas:');
  console.log('1. El token expiró → Generar nuevo en turso.tech');
  console.log('2. La URL es incorrecta → Verificar en dashboard de Turso');
  console.log('3. La base de datos no existe → Crearla primero');
}

main().catch(console.error);
