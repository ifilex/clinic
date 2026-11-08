# 🚀 Guía Completa: Configurar Firebase para WineBOX.Clinic

Firebase es **100% gratis** para tu proyecto. Esta guía te explica paso a paso.

---

## ✅ Plan Gratuito de Firebase (Spark)

| Recurso | Límite Gratis |
|---------|--------------|
| **Firestore** | 1GB storage, 50K lecturas/día, 20K escrituras/día |
| **Authentication** | Ilimitado (email/password, Google, GitHub, etc.) |
| **Hosting** | 10GB storage, 360MB/día transfer |
| **Storage** | 5GB storage |
| **Functions** | 2M invocaciones/mes |
| **Costo** | **$0** |

---

## Paso 1: Crear Proyecto Firebase

1. Ir a https://console.firebase.google.com
2. Click en **"Agregar proyecto"**
3. Nombre: `winebox-clinic`
4. Desactivar Google Analytics (opcional)
5. Click en **"Crear proyecto"**

---

## Paso 2: Configurar Firestore Database

1. En el sidebar, click en **"Firestore Database"**
2. Click en **"Crear base de datos"**
3. Modo de inicio: **"Modo estándar"** (requiere reglas de seguridad)
   - Luego configuramos las reglas (ver Paso 8)
4. Ubicación: **`us-central1`** (o la más cercana)
5. Click en **"Habilitar"**

---

## Paso 3: Obtener Credenciales

1. Click en el engranaje ⚙️ → **"Configuración del proyecto"**
2. Scroll hasta "Tus apps"
3. Click en el ícono web `</>`
4. Nombre de la app: `WineBOX.Clinic`
5. Desactivar "Configurar también Firebase Hosting" (no necesario ahora)
6. Click en **"Registrar app"**
7. Copiar el objeto `firebaseConfig`:

```javascript
var firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "winebox-clinic.firebaseapp.com",
  projectId: "winebox-clinic",
  storageBucket: "winebox-clinic.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

---

## Paso 4: Configurar Authentication

1. En el sidebar, click en **"Compilación" → "Authentication"**
2. Click en **"Comenzar"**
3. Pestaña **"Proveedores"**
4. Habilitar **"Correo electrónico/contraseña"**
5. Click en **"Guardar"**

---

## Paso 5: Actualizar Config de Firebase

Reemplazar `firebase-config.js` con tus credenciales:

```javascript
window.FIREBASE_CONFIG = {
  apiKey: "TU_API_KEY",
  authDomain: "winebox-clinic.firebaseapp.com",
  projectId: "winebox-clinic",
  storageBucket: "winebox-clinic.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

---

## Paso 6: Ejecutar Setup Inicial

Crear un archivo `setup-firebase.html` temporal con este código:

```html
<!DOCTYPE html>
<html>
<head><title>Firebase Setup</title></head>
<body>
  <h2>Cargar datos iniciales en Firebase</h2>
  <pre id="log"></pre>
  
  <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
  <script src="data.js"></script>
  <script src="firebase-config.js"></script>
  <script>
    var config = window.FIREBASE_CONFIG;
    firebase.initializeApp(config);
    var db = firebase.firestore();
    var seed = window.WINEBOX_SEED;
    
    async function setup() {
      var log = document.getElementById('log');
      log.textContent = 'Iniciando...\n';
      
      // Users
      for (var u of (seed.users || [])) {
        await db.collection('users').doc(u.id).set(u);
        log.textContent += '✓ User: ' + u.name + '\n';
      }
      
      // Psychs
      for (var p of (seed.psychs || [])) {
        await db.collection('psychs').doc(p.id).set(p);
        log.textContent += '✓ Psych: ' + p.name + '\n';
      }
      
      // Posts
      for (var post of (seed.posts || [])) {
        await db.collection('posts').doc(post.id).set(post);
      }
      log.textContent += '✓ Posts: ' + seed.posts.length + '\n';
      
      // Questions
      for (var q of (seed.questions || [])) {
        await db.collection('questions').doc(q.id).set(q);
        for (var a of (q.answers || [])) {
          await db.collection('answers').doc(a.id).set(a);
        }
      }
      log.textContent += '✓ Questions: ' + seed.questions.length + '\n';
      
      // Publications
      for (var pub of (seed.publications || [])) {
        await db.collection('publications').doc(pub.id).set(pub);
      }
      log.textContent += '✓ Publications: ' + seed.publications.length + '\n';
      
      // Point events
      for (var pe of (seed.pointEvents || [])) {
        await db.collection('pointEvents').doc(pe.id).set(pe);
      }
      log.textContent += '✓ Point Events: ' + seed.pointEvents.length + '\n';
      
      // Reviews
      for (var r of (seed.reviews || [])) {
        await db.collection('reviews').doc(r.id).set(r);
      }
      log.textContent += '✓ Reviews: ' + seed.reviews.length + '\n';
      
      // Messages
      for (var m of (seed.messages || [])) {
        await db.collection('messages').doc(m.id).set(m);
      }
      log.textContent += '✓ Messages: ' + seed.messages.length + '\n';
      
      log.textContent += '\n✅ ¡Setup completado!';
    }
    
    setup().catch(function(err) {
      document.getElementById('log').textContent = '❌ Error: ' + err.message;
    });
  </script>
</body>
</html>
```

Abrir este archivo en el navegador y ejecutar el setup.

---

## Paso 7: Activar en la App

En `index.html`, cambiar:

```html
<!-- COMENTAR TURSO -->
<!-- <script src="config.js"></script> -->
<!-- <script src="turso.js"></script> -->

<!-- ACTIVAR FIREBASE -->
<script src="firebase-config.js"></script>
<script src="firebase.js"></script>
```

---

## Paso 8: Configurar Reglas de Seguridad

**Importante:** Como seleccionaste "Modo estándar", necesitás configurar reglas.

1. Ir a Firestore → pestaña **"Reglas"**
2. Reemplazar todo el contenido con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regla temporal para desarrollo (RESTRINGIR EN PRODUCCIÓN)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Después de probar**, actualizar con reglas más seguras (ver abajo).

---

### Reglas finales recomendadas (para producción):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users: solo el dueño puede editar
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && (request.auth.uid == userId || get(/databases/(database)/documents/users/$(request.auth.uid)).data.role in ['root', 'admin']);
    }
    
    // Psychs: lectura pública, escritura solo admin
    match /psychs/{psychId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/(database)/documents/users/$(request.auth.uid)).data.role in ['root', 'admin'];
    }
    
    // Posts: lectura pública, escritura solo autenticados
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && (resource.data.authorId == request.auth.uid || get(/databases/(database)/documents/users/$(request.auth.uid)).data.role in ['root', 'admin']);
    }
    
    // Questions: lectura pública
    match /questions/{questionId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    
    // Answers: lectura pública
    match /answers/{answerId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    
    // Messages: solo participantes pueden leer/escribir
    match /messages/{messageId} {
      allow read, write: if request.auth != null && (resource.data.fromId == request.auth.uid || resource.data.toId == request.auth.uid);
    }
    
    // Publications: lectura pública
    match /publications/{pubId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    
    // Reviews: lectura pública
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    
    // Point events: solo admin
    match /pointEvents/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/(database)/documents/users/$(request.auth.uid)).data.role in ['root', 'admin'];
    }
  }
}
```

---

## Costo Estimado

Para una comunidad de ~100 usuarios activos diarios:

| Recurso | Uso estimado | Costo |
|---------|-------------|-------|
| Firestore reads | ~10K/día | $0 |
| Firestore writes | ~2K/día | $0 |
| Authentication | ~100 usuarios | $0 |
| Hosting | ~1GB/mes | $0 |
| **Total** | | **$0** |

Firebase solo cobra cuando superás los límites del plan Spark (gratis).

---

## Ventajas de Firebase vs Turso

| Característica | Firebase | Turso |
|---------------|----------|-------|
| **Gratis** | ✅ Sí | ✅ Sí |
| **Autenticación** | ✅ Incluida | ❌ No |
| **Realtime** | ✅ Nativo | ❌ No |
| **Facilidad** | ✅ Muy fácil | ⚠️ Medio |
| **Backend** | ✅ Serverless | ❌ Requiere CLI |
| **SDK JS** | ✅ Excelente | ⚠️ Básico |

**Recomendación:** Usar Firebase para autenticación + Firestore para datos. Es más completo y fácil de usar.
