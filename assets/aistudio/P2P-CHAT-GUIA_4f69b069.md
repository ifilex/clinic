# 🔐 Chat P2P WebRTC - WineBOX.Clinic

## Arquitectura

```
Usuario A ──WebRTC──► Usuario B
     │                   │
     └──► Firebase ◄─────┘
        (señalización)
```

- **Mensajes**: Van directo entre usuarios (P2P), NO se guardan en BD
- **Señalización**: Firebase solo usa para intercambiar info de conexión
- **Amistad**: Se establece cuando un contacto es aceptado

---

## Reglas de Amistad

Un usuario puede chatear P2P con otro si cumple AL MENOS UNA:

| Regla | Descripción |
|-------|-------------|
| **Contacto aceptado** | Paciente ↔ Profesional con `status: 'accepted'` |
| **Mensajes previos** | Han tenido conversación por mensajería del sistema |
| **Interacción social** | Mismo rol + han comentado publicaciones entre sí |
| **Root** | Usuario root puede chatear con todos |

---

## Flujo de uso

### 1. Paciente contacta profesional
```
Paciente → envía consulta → status: 'pending'
Profesional → ve consulta → acepta → status: 'accepted'
→ ¡AMISTAD ESTABLECIDA!
```

### 2. Profesional acepta contacto
```javascript
// En setContactStatus() cuando status = 'accepted'
window.P2PChat.establishFriendship(psyId, patientId);
```

### 3. Chat P2P iniciado
```
Paciente → click "Mensaje" → abre chat P2P
Profesional → recibe signal → establece conexión WebRTC
→ Mensajes fluyen directo entre ambos
```

---

## Características de seguridad

| Aspecto | Implementación |
|---------|---------------|
| **Privacidad** | Mensajes NO se guardan en servidor |
| **Encriptación** | WebRTC usa DTLS/SRTP por defecto |
| **Autenticación** | Solo usuarios logueados pueden chatear |
| **Autorización** | Solo amigos pueden iniciar chat P2P |
| **Señalización** | Firebase solo para conectar, no para mensajes |

---

## Testing

### Preparación
1. Tener Firebase configurado y activo
2. Datos cargados en Firestore
3. Dos cuentas de prueba:
   - Paciente: `sofia.martinez@example.com` / `Paciente1!`
   - Psicólogo: `valentina.rios@example.com` / `Psy1234!`

### Pasos
1. **Paciente** contacta a **Valentina** desde su perfil
2. **Valentina** acepta la consulta desde Mi cuenta
3. **Paciente** va a Mensajes → Nuevo mensaje → Valentina
4. **Valentina** abre el mismo chat
5. Ambos deben ver los mensajes instantáneamente

### Verificación en consola
```
[P2P] Inicializado para usuario: u-pat-1
[P2P] Conexión abierta con: u-psy-1
[P2P] Mensaje enviado a u-psy-1
```

---

## Limitaciones técnicas

| Limitación | Causa | Solución |
|-----------|-------|----------|
| **Mismo red/NAT** | WebRTC puede fallar tras múltiples routers | Usar TURN server (configurar en rtcConfig) |
| **Ambos offline** | P2P requiere ambos conectados | Mensaje queda en cola, se envía al conectar |
| **Movimiento entre dispositivos** | Conexión P2P es por sesión | Reiniciar chat al cambiar dispositivo |

---

## Configuración avanzada

### Agregar servidor TURN (para NAT complejos)
```javascript
// En p2p-chat.js, rtcConfig:
var rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:turn.example.com:3478', username: 'user', credential: 'pass' }
  ]
};
```

### Deshabilitar P2P (fallback a localStorage)
Comentar la línea en index.html:
```html
<!-- <script src="p2p-chat.js"></script> -->
```

---

## Migración de datos

Los mensajes P2P NO migran entre sesiones. Si se necesita historial:
1. Exportar conversación desde Firebase (colección `signals`)
2. Guardar en localStorage del usuario
3. Restaurar al iniciar sesión
