# 🧠 WineBOX.Clinic — Red Social de Psicología

**Plataforma completa de salud mental comunitaria con base de datos real en el edge.**

---

## 🔐 Cuentas de Acceso

### Dueño/Administrador (TÚ)
| Campo | Valor |
|-------|-------|
| Email | `mrwad300@gmail.com` |
| Contraseña | `Freedos999#` |
| Rol | Root |

### Root del sistema
| Campo | Valor |
|-------|-------|
| Email | `root@winebox.clinic` |
| Contraseña | `Spiderman1447#` |
| Rol | Root |

### Pacientes demo (ficticios)
| Email | Contraseña | Nombre |
|-------|-----------|--------|
| `sofia.martinez@example.com` | `Paciente1!` | Sofía Martínez |
| `javier.gonzalez@example.com` | `Paciente2!` | Javier González |
| `camila.torres@example.com` | `Paciente3!` | Camila Torres |
| `nicolas.lopez@example.com` | `Paciente4!` | Nicolás López |

### Psicólogos demo (ficticios)
| Email | Contraseña | Nombre |
|-------|-----------|--------|
| `valentina.rios@example.com` | `Psy1234!` | Dra. Valentina Ríos |
| `martin.suarez@example.com` | `Psy1234!` | Lic. Martín Suárez |
| `carolina.diaz@example.com` | `Psy1234!` | Dra. Carolina Díaz |
| `diego.herrera@example.com` | `Psy1234!` | Lic. Diego Herrera |
| `andrea.molina@example.com` | `Psy1234!` | Lic. Andrea Molina |

---

## 🚀 Despliegue en GitHub Pages

### Paso 1: Configurar Turso
1. Ir a https://turso.tech
2. Crear cuenta con GitHub (gratis, sin tarjeta)
3. Crear base de datos → copiar **URL** y **Auth Token**
4. Actualizar `foro/config.js` con tus credenciales

### Paso 2: Subir a GitHub
```bash
git init
git add .
git commit -m "WineBOX.Clinic - Red social de psicología"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/winebox-clinic.git
git push -u origin main
```

### Paso 3: Activar GitHub Pages (OPCIÓN A - con subcarpeta)

1. En GitHub: **Settings → Pages**
2. Source: **main branch**
3. Folder: **/foro**
4. Save
5. La app estará en: `https://tu-usuario.github.io/winebox-clinic/foro/`

**O OPCIÓN B - Desde la raíz:**
1. Mover todos los archivos de `foro/` a la raíz del repositorio
2. En GitHub: **Settings → Pages → Folder: /(root)**
3. La app estará en: `https://tu-usuario.github.io/winebox-clinic/`

> **Nota:** La página raíz (`index.html`) ya incluye redirección automática a `/foro/`.

### Paso 4: Cargar datos iniciales
1. Abrir `tu-repo/foro/turso-setup.html` (o `turso-setup.html` si usas opción B)
2. Click en "Ejecutar Setup"
3. Esperar mensaje "Base de datos creada exitosamente"

---

## 📁 Estructura del proyecto

```
clinic/
├── index.html          ← Página principal
├── app.js              ← Lógica principal (342 KB)
├── api.js              ← Capa de datos local/servidor
├── turso.js            ← Cliente Turso Edge SQLite
├── turso-setup.js      ← Setup inicial de BD
├── turso-setup.html    ← Interfaz visual de setup
├── data.js             ← Seed de datos (14 ebooks)
├── styles.css          ← Estilos
├── config.js           ← Credenciales (NO SUBIR A GIT)
├── server.js           ← Servidor Node.js (opcional)
├── test.html           ← Verificador de funcionamiento
├── .gitignore          ← Excluye config.js, node_modules
├── package.json        ← Dependencias del servidor
├── iniciar.bat         ← Script de inicio
└── README.md           ← Este archivo
```

---

## ✨ Funcionalidades

### Para pacientes
- ✅ Buscar psicólogos por especialidad, ciudad, precio
- ✅ Ver perfiles completos con valoraciones
- ✅ Hacer preguntas en la comunidad
- ✅ Chatear con profesionales
- ✅ Leer 14 ebooks gratuitos
- ✅ Aura (compañero terapéutico 24/7)

### Para psicólogos
- ✅ Panel profesional con estadísticas
- ✅ Responder preguntas de la comunidad
- ✅ Publicar artículos y ebooks
- ✅ Gestionar turnos y horarios
- ✅ Crear web con AuraKit
- ✅ Acceso a oficina online

### Para administración
- ✅ Gestionar usuarios y perfiles
- ✅ Verificar matrículas
- ✅ Moderar contenido
- ✅ Ver ranking y métricas

---

## 🎯 Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript vanilla |
| Base de datos | Turso (SQLite edge) |
| Autenticación | JWT + localStorage |
| Hosting | GitHub Pages (frontend) + Turso (backend) |
| Sin PHP, sin Node.js en producción |

---

## 📊 Límites Turso (Plan Gratis)

| Recurso | Límite | Estado |
|---------|--------|--------|
| Base de datos | 1 | ✅ |
| Storage | 5 GB | ✅ |
| Lecturas/mes | 500M | ✅ |
| Escrituras/mes | 10M | ✅ |
| **Costo** | **$0** | ✅ |

Para crecimiento mayor: $25/mes en Turso.

---

## ⚠️ Notas importantes

1. **NUNCA subas `config.js` a GitHub** — contiene tu token de base de datos
2. Los datos se sincronizan automáticamente entre localStorage y Turso
3. Si Turso falla, la app funciona igual con datos locales
4. Las contraseñas se almacenan con hash simple (suficiente para demo)

---

## 🔧 Troubleshooting

### Error: "turso_not_configured"
Verificar que `config.js` exista y tenga las credenciales correctas.

### Error: "http_401"
El token de Turso es incorrecto o expiró. Generar uno nuevo en el dashboard.

### Error: "http_404"
La URL de la base de datos es incorrecta. Verificar en Turso dashboard.

### Datos no aparecen
1. Verificar conexión en consola: `window.TURSO.getConfig()`
2. Ejecutar setup: abrir `turso-setup.html`
3. Recargar página

---

## 📄 Licencia

Proyecto de demostración educativa. Todos los datos son ficticios excepto los del dueño.
