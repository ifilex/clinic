# 🚀 Guía de Publicación WineBOX.Clinic

## Paso 1: Verificar Configuración Local

Antes de subir a GitHub, asegúrate de que todo funcione localmente:

```bash
# Iniciar servidor local (opcional, para probar)
node foro/server.js
```

O simplemente abrir `foro/index.html` en el navegador.

**Verificar que config.js existe:**
- Debe estar en `foro/config.js`
- **NO debe subirse a GitHub** (está en .gitignore)

## Paso 2: Cargar Datos en Turso

1. Abrir `http://localhost/foro/turso-setup.html` (o subir primero a GitHub Pages)
2. Ingresar URL y token de Turso (ya están en config.js)
3. Click en "Ejecutar Setup"
4. Esperar a que termine (creará tablas y cargará datos)

**O alternativamente**, ejecutar en la consola del navegador:
```javascript
window.runTursoSetup()
```

## Paso 3: Subir a GitHub

```bash
# Inicializar repositorio si no está
git init
git add .
git commit -m "WineBOX.Clinic - Red social de psicología con Turso"

# Crear remote en GitHub (desde la web)
# Luego:
git remote add origin https://github.com/TU_USUARIO/winebox-clinic.git
git branch -M main
git push -u origin main
```

## Paso 4: Activar GitHub Pages

1. Ir a tu repositorio en GitHub
2. **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: **main**
5. Folder: **/foro**
6. Click **Save**

La app estará en: `https://tu-usuario.github.io/winebox-clinic/`

## Paso 5: Verificar Funcionamiento

1. Abrir `https://tu-usuario.github.io/winebox-clinic/foro/test.html`
2. Ejecutar las pruebas
3. Todas deben pasar (verde)

## Cuentas de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Dueño | mrwad300@gmail.com | Freedos999# |
| Root | root@winebox.clinic | Root2026! |
| Paciente | sofia.martinez@example.com | Paciente1! |
| Psicólogo | valentina.rios@example.com | Psy1234! |

## Problemas Comunes

### Error "turso_not_configured"
- Verificar que `config.js` existe en la carpeta `foro/`
- Verificar que tiene `window.WB_CONFIG` definido

### Error "http_401"
- El token de Turso es incorrecto o expiró
- Generar uno nuevo en https://turso.tech/dashboard

### Error "http_404"
- La URL de la base de datos es incorrecta
- Verificar en Turso dashboard

### Datos no aparecen
1. Ejecutar el setup: abrir `turso-setup.html`
2. O en consola: `window.runTursoSetup()`
3. Recargar la página

## Estructura de Archivos para GitHub

```
_repo/
├── foro/
│   ├── index.html      ✅ Subir
│   ├── app.js          ✅ Subir
│   ├── api.js          ✅ Subir
│   ├── turso.js        ✅ Subir
│   ├── turso-setup.js  ✅ Subir
│   ├── turso-setup.html ✅ Subir
│   ├── data.js         ✅ Subir
│   ├── styles.css      ✅ Subir
│   ├── config.js       ❌ NO subir (en .gitignore)
│   ├── server.js       ⚠️ Opcional (solo para desarrollo)
│   └── test.html       ✅ Subir
├── .gitignore          ✅ Subir
├── package.json        ⚠️ Opcional
└── README.md           ✅ Subir
```

## Costos

| Servicio | Costo | Notas |
|----------|-------|-------|
| GitHub Pages | $0 | Hosting estático |
| Turso | $0 | 5GB DB, 500M lecturas/mes |
| **Total** | **$0** | Gratis para empezar |

## Siguientes Pasos

1. Probar la app localmente
2. Subir a GitHub
3. Activar GitHub Pages
4. Ejecutar setup de Turso
5. Verificar con test.html
6. ¡Listo! Compartir el enlace
