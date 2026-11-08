# 🧪 Guía para Probar el Chat en Tiempo Real

## Requisitos Previos
- ✅ Datos cargados en Firebase (ejecutar setup-firebase.html)
- ✅ Reglas de seguridad actualizadas: `allow read, write: if true;`

---

## Pasos para Probar

### 1. Preparar dos ventanas/navegadores

**Ventana A:**
- Abrir la app
- Login como paciente: `sofia.martinez@example.com` / `Paciente1!`

**Ventana B:**
- Abrir otra pestaña/ventana
- Login como psicólogo: `valentina.rios@example.com` / `Psy1234!`

### 2. Iniciar conversación

**Desde la Ventana A (paciente):**
1. Ir a `#/mensajes`
2. Click en "Nuevo mensaje" o elegir conversación existente
3. Seleccionar "Dra. Valentina Ríos"
4. Escribir mensaje: "Hola, quisiera consultar por ansiedad"
5. Click "Enviar"

### 3. Ver en la Ventana B (psicólogo)

1. Ir a `#/mensajes`
2. Deberías ver el mensaje de Sofía
3. Responder: "Hola Sofía, gracias por escribirme. ¿Podrías contarme más sobre lo que sentís?"
4. Click "Enviar"

### 4. Confirmar recepción

**Volver a la Ventana A:**
- El mensaje del psicólogo debería aparecer automáticamente
- Si no aparece, refrescar la página (`F5`)

---

## Funcionalidades Implementadas

| Función | Estado |
|---------|--------|
| Enviar mensaje | ✅ Firebase + localStorage |
| Recibir mensaje en tiempo real | ✅ Firestore listener |
| Marcar como leído | ✅ Actualiza timestamp |
| Conversaciones activas | ✅ Lista de partners |
| Indicador "en línea" | ✅ Actualizado |

---

## Solución de Problemas

### Mensaje no aparece en la otra ventana
1. Verificar consola del navegador (F12) → buscar `[Chat]`
2. Confirmar que ambos usuarios están logueados
3. Verificar que la colección `messages` existe en Firebase

### Error "Firebase no inicializado"
1. Verificar que `firebase-config.js` tenga tus credenciales
2. Ejecutar `setup-simple.html` → "Probar Conexión"

### Reglas de seguridad bloqueando
1. Ir a Firebase Console → Firestore → Reglas
2. Actualizar con: `allow read, write: if true;`
3. Click "Publicar"

---

## Estructura de Datos en Firebase

Colección: `messages`
```javascript
{
  id: "msg_1234567890_abc12",
  conversationId: "conv_u-pat-1_u-psy-1",
  fromId: "u-pat-1",
  toId: "u-psy-1",
  body: "Hola, necesito ayuda...",
  readAt: null,  // o timestamp cuando se lee
  createdAt: { seconds: 1234567890, nanoseconds: 123000000 }
}
```

---

## Para Producción (Seguridad)

Actualizar reglas en Firebase:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read: if request.auth != null && 
        (resource.data.fromId == request.auth.uid || 
         resource.data.toId == request.auth.uid);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        resource.data.toId == request.auth.uid;
    }
  }
}
```
