# 🔥 Chat ICQ - Configuración Final

## Sistema de Chat Implementado

El chat usa **Firebase como relay** (no guarda en la BD principal de la app).

### Arquitectura
```
Usuario A ──► Firebase (icq_chat) ──► Usuario B
     │                                    │
     └───── Mensaje en tiempo real ───────┘
```

### Colecciones de Firebase necesarias
- `icq_chat` - Mensajes de chat (no se guardan en BD principal)
- `signals` - Señalización P2P (opcional)

---

## Pasos para configurar

### 1. Reglas de Firestore

Ir a **Firebase Console → Firestore Database → Reglas** y agregar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Chat ICQ - Cualquier usuario autenticado puede leer/escribir
    match /icq_chat/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Señalización P2P
    match /signals/{signalId} {
      allow read, write: if request.auth != null;
    }
    
    //其余 colecciones existentes...
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 2. Cargar datos en Firebase

Si aún no cargaste los datos:
```
Abrir setup-simple.html → Ejecutar Setup
```

### 3. Probar el chat

1. **PC 1**: Abrir la app, login como paciente
2. **PC 2**: Abrir la app, login como psicólogo
3. **PC 1**: Ir a `/mensajes` → Nuevo mensaje → Elegir psicólogo
4. **PC 2**: Ver mensaje llegar en tiempo real

---

## Reglas de Amistad

| Condición | Permiso de chat |
|-----------|-----------------|
| Root | Sí, con todos |
| Contacto aceptado | Sí |
| Mensajes previos | Sí |
| Otro | No |

---

## Diferencia: Chat vs Mensajería

| Característica | Chat ICQ | Mensajería del sistema |
|---------------|----------|----------------------|
| **¿Se guarda?** | NO (solo relay) | SÍ |
| **Entre PCs** | SÍ | SÍ |
| **Historial** | No persiste | Persiste |
| **Privacidad** | Alta | Media |

---

## Problemas comunes

### "No tenés permiso para chatear"
- Verificar que el contacto esté `accepted`
- O que hayan tenido mensajes previos

### Mensaje no llega
- Verificar conexión a Firebase
- Revisar consola (F12) para errores `[ICQ]`

### Error de reglas
- Actualizar reglas de Firestore como se indica arriba
