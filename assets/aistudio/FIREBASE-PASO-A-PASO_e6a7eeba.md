# 🚀 Crear App Web en Firebase - Paso a Paso

## Paso 1: Crear Proyecto (si no lo tenés)

1. Ir a https://console.firebase.google.com
2. Click **"Agregar proyecto"**
3. Nombre: `winebox-clinic`
4. Desactivar Google Analytics (opcional)
5. Click **"Crear proyecto"**

---

## Paso 2: Crear App Web

1. En el dashboard del proyecto, verás un ícono **`</>`** (web)
2. Click en él
3. Nombre de la app: `WineBOX.Clinic`
4. ✅ Desmarcar "Configurar también Firebase Hosting"
5. Click **"Registrar app"**

---

## Paso 3: Copiar Config

Te mostrará un código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "winebox-clinic.firebaseapp.com",
  projectId: "winebox-clinic",
  storageBucket: "winebox-clinic.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

**Copiar solo los valores** y ponerlos en `firebase-config.js`:

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

## Paso 4: Habilitar Firestore

1. En el sidebar izquierdo, click **"Firestore Database"**
2. Click **"Crear base de datos"**
3. Modo: **"Modo estándar"**
4. Ubicación: **`us-central1`** (o la más cercana)
5. Click **"Habilitar"**

---

## Paso 5: Configurar Reglas de Seguridad

1. Ir a Firestore → pestaña **"Reglas"**
2. Borrar todo y pegar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publicar"**

---

## Paso 6: Habilitar Authentication

1. En el sidebar, click **"Compilación" → "Authentication"**
2. Click **"Comenzar"**
3. Pestaña **"Proveedores"**
4. Habilitar **"Correo electrónico/contraseña"**
5. Click **"Guardar"**

---

## Paso 7: Cargar Datos

1. Abrir `setup-firebase.html` en tu navegador
2. Verificar que `firebase-config.js` tenga tus credenciales
3. Click **"Ejecutar Setup"**
4. Esperar mensaje: "✅ Setup completado"

---

## ✅ Listo

Tu app ahora tiene:
- Base de datos en la nube (Firestore)
- Autenticación de usuarios
- Datos sincronizados

Para publicar en GitHub Pages:
```bash
git add .
git commit -m "Add Firebase backend"
git push
```
