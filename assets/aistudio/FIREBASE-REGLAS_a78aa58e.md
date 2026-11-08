# 🔧 Reglas de Seguridad para Firebase Firestore

## Problema
El setup conecta pero no escribe datos porque las reglas de seguridad bloquean las escrituras.

## Solución: Configurar Reglas

### Paso 1: Ir a Firestore
1. Ir a https://console.firebase.google.com
2. Tu proyecto: **winebox-clinic**
3. Sidebar → **"Firestore Database"**
4. Pestaña **"Reglas"** (al lado de "Datos")

### Paso 2: Copiar estas reglas
Borrar todo lo que hay y pegar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regla temporal para desarrollo (permite todo a autenticados)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
  }
}
```

### Paso 3: Publicar reglas
1. Click en **"Publicar"** (arriba a la derecha)
2. Esperar a que diga "Reglas actualizadas"

### Paso 4: Ejecutar Setup de nuevo
1. Volver a `setup-firebase.html`
2. Click en **"Ejecutar Setup"**
3. Ahora debería escribir los datos

---

## Reglas más seguras (para producción)

Después de probar, podés usar estas reglas más específicas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuarios: lectura pública, escritura solo dueño/admin
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['root', 'admin']);
    }
    
    // Psicólogos: lectura pública, escritura solo admin
    match /psychs/{psychId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['root', 'admin'];
    }
    
    // Posts: lectura pública, escritura autenticado
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.authorId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['root', 'admin']);
    }
    
    // Preguntas: lectura pública, escritura autenticado
    match /questions/{questionId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    
    // Respuestas: lectura pública, escritura autenticado
    match /answers/{answerId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    
    // Mensajes: solo participantes pueden leer/escribir
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (resource.data.fromId == request.auth.uid || 
         resource.data.toId == request.auth.uid);
    }
    
    // Publicaciones: lectura pública
    match /publications/{pubId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    
    // Reseñas: lectura pública, escritura autenticado
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    
    // Eventos de puntos: solo admin
    match /pointEvents/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['root', 'admin'];
    }
  }
}
```

---

## Verificar que funciona

Después de actualizar las reglas:

1. Ejecutar `setup-firebase.html` → "Ejecutar Setup"
2. Ir a Firestore → Datos
3. Deberías ver las colecciones con documentos

---

## Notas importantes

- **Modo prueba** NO está disponible en el plan gratuito actual
- Las reglas temporales (`allow read, write: if request.auth != null`) permiten que cualquier usuario autenticado escriba
- Para producción, usar las reglas específicas de arriba
- Si un usuario intenta escribir sin estar autenticado, Firebase devolverá error 403
