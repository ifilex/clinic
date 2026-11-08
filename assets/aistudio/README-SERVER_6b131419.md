# WineBOX.Clinic · Guía del Servidor

## 🚀 Inicio rápido

### Modo completo (con servidor)
```bash
# Instalar dependencias (solo la primera vez)
npm install

# Iniciar servidor
node foro/server.js
# o doble clic en iniciar.bat
```

El servidor corre en `http://localhost:3000` con:
- **API REST** para todas las operaciones
- **WebSocket** para presencia real y mensajería en tiempo real
- **Base de datos** persistente en `foro/db.json`

### Modo fallback (sin servidor)
Si el servidor no está disponible, la app usa localStorage automáticamente.

---

## 📡 Endpoints de la API

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/login` | Iniciar sesión `{email, password}` |
| POST | `/api/logout` | Cerrar sesión (requiere auth) |
| POST | `/api/register` | Crear cuenta `{name, email, password, role, city}` |
| GET | `/api/session` | Verificar sesión actual |

### Datos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del servidor |
| GET | `/api/data` | Base de datos completa (público si no hay auth) |
| GET | `/api/ranking` | Ranking de psicólogos por puntos |

### Psicólogos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/psychs` | Lista de psicólogos |
| GET | `/api/psychs/:id` | Perfil de un psicólogo |
| PUT | `/api/psychs/:id` | Actualizar perfil (requiere auth) |

### Publicaciones (Posts)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/posts?limit=N` | Listar publicaciones |
| POST | `/api/posts` | Crear publicación |
| POST | `/api/posts/:id/like` | Like/unlike |
| POST | `/api/posts/:id/comments` | Agregar comentario |
| DELETE | `/api/posts/:id` | Eliminar publicación |

### Preguntas (Forum)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/questions` | Listar preguntas |
| POST | `/api/questions` | Crear pregunta |
| POST | `/api/questions/:id/answers` | Responder (solo psy/admin) |
| POST | `/api/questions/:id/answers/:aid/accept` | Aceptar respuesta (solo autor) |
| POST | `/api/questions/:id/views` | Registrar vista |

### Mensajes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/messages` | Lista de conversaciones |
| POST | `/api/messages` | Enviar mensaje |
| POST | `/api/messages/:id/read` | Marcar como leído |

### Reseñas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/reviews/:psyId` | Reseñas de un psicólogo |
| POST | `/api/reviews` | Crear reseña |

### Usuarios (Admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Lista de usuarios (admin/root) |
| GET | `/api/users/:id` | Perfil de usuario |
| PUT | `/api/users/:id` | Actualizar usuario (admin/root) |

---

## 🔌 WebSocket

Conexión: `ws://localhost:3000`

### Mensajes del cliente → servidor
| Type | Datos | Descripción |
|------|-------|-------------|
| `auth` | `{token}` | Autenticar conexión |
| `ping` | — | Keepalive |
| `message` | `{toId, body}` | Enviar mensaje en tiempo real |
| `typing` | `{toId, typing}` | Indicador de escritura |

### Mensajes del servidor → cliente
| Type | Datos | Descripción |
|------|-------|-------------|
| `connected` | `{userId}` | Auth exitoso |
| `pong` | — | Respuesta al ping |
| `presence:update` | `{userId, online, count}` | Usuario cambió estado |
| `message:new` | `{messageId, from, body}` | Mensaje recibido |
| `message:sent` | `{messageId}` | Confirmación enviada |
| `post:create` | `{post}` | Nueva publicación |
| `question:create` | `{question}` | Nueva pregunta |
| `answer:create` | `{questionId, answer}` | Nueva respuesta |

---

## 👤 Cuentas demo

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `root@winebox.clinic` | `Root2026!` | Root |
| `admin@winebox.clinic` | `demo1234` | Admin |
| `psicologo@demo.com` | `demo1234` | Psicólogo |
| `paciente@demo.com` | `demo1234` | Paciente |

---

## 📁 Estructura de archivos

```
clinic/
├── foro/
│   ├── server.js      ← Servidor Express + WebSocket
│   ├── api.js         ← Cliente API (carga en el navegador)
│   ├── app.js         ← Aplicación principal
│   ├── data.js        ← Datos semilla
│   ├── db-seed.js     ← Seed para el servidor (CommonJS)
│   ├── db.json        ← Base de datos persistente
│   ├── styles.css     ← Estilos
│   └── index.html     ← HTML principal
├── server-static.js   ← Servidor fallback sin dependencias
├── iniciar.bat        ← Script de inicio rápido
├── package.json       ← Dependencias del servidor
└── README-SERVER.md   ← Este archivo
```

---

## 🔧 Desarrollo

### Cambiar puerto
```bash
PORT=8080 node foro/server.js
```

### Generar nuevo secret JWT
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Luego: JWT_SECRET=tu_secret node foro/server.js
```

### Reiniciar con datos limpios
```bash
del foro\db.json
node foro/server.js
```
