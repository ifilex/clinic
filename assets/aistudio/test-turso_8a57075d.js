/* ============================================================
   WineBOX.Clinic · Prueba de conexión Turso
   Ejecutar: node test-turso.js
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

console.log('🔍 Verificando configuración:');
console.log('   URL:', config.url);
console.log('   Token:', config.token ? config.token.substring(0, 20) + '...' : 'NO DEFINIDO');
console.log('');

if (!config.token) {
  console.error('❌ No hay token en config.js');
  console.error('   Generá uno nuevo en: https://turso.tech');
  process.exit(1);
}

// Probar conexión
console.log('📡 Probando conexión...');

const postData = JSON.stringify({ sql: 'SELECT 1 as test' });

const options = {
  hostname: new URL(config.url).hostname,
  path: '/v2/persist/query',
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
    console.log('   Status:', res.statusCode);
    console.log('   Response:', data);
    
    if (res.statusCode === 200) {
      console.log('');
      console.log('✅ ¡Conexión exitosa!');
      console.log('   Tu token es válido y la base de datos es accesible.');
      console.log('');
      console.log('📋 Ahora ejecutá el setup:');
      console.log('   node setup-turso-dynamic.js');
    } else if (res.statusCode === 401) {
      console.log('');
      console.log('❌ Token inválido o expirado');
      console.log('   Solución:');
      console.log('   1. Ir a https://turso.tech');
      console.log('   2. Ir a tu base de datos: winebox-clinic');
      console.log('   3. Access API → Generate Token');
      console.log('   4. Copiar el nuevo token');
      console.log('   5. Actualizar config.js');
    } else {
      console.log('');
      console.log('⚠️  Error diferente. Verifica la URL y el token.');
    }
  });
});

req.on('error', e => {
  console.error('❌ Error de red:', e.message);
  console.error('   Verifica que la URL sea correcta:');
  console.error('   Formato: https://nombre-base.libsql.example.com');
});

req.write(postData);
req.end();
