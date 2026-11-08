# Guía de Configuración Turso para WineBOX.Clinic

## Paso 1: Crear cuenta en Turso

1. Ir a https://turso.tech
2. Click en "Sign Up" (gratis, sin tarjeta)
3. Iniciar sesión con GitHub

## Paso 2: Crear la base de datos

1. En el dashboard de Turso, click en "Create Database"
2. Nombre: `winebox-clinic`
3. Region: `na-central` (o la más cercana)
4. Click en "Create Database"

## Paso 3: Crear un teammate (usuario de acceso)

1. Ir a tu base de datos → "Access API" o "Teammates"
2. Click en "Generate Token"
3. Copia el **auth token** (empieza con `turso_xxxxx`)

## Paso 4: Configurar la app

### Opción A: Modificar index.html

Abrir `foro/index.html` y descomentar/ajustar:

```html
<script>
  window.TURSO_CONFIG = {
    url: 'https://tu-base.libsql.example.com',
    authToken: 'turso_xxxxx'
  };
</script>
```

Reemplazar:
- `url`: La URL de tu base de datos (la ves en Turso dashboard)
- `authToken`: El token que generaste

### Opción B: Variables de entorno (para desarrollo local)

```bash
export TURSO_DB_URL="https://tu-base.libsql.example.com"
export TURSO_AUTH_TOKEN="turso_xxxxx"
```

## Paso 5: Ejecutar el setup

Hay dos formas de cargar los datos iniciales:

### Forma 1: Desde el navegador (recomendado)
1. Abrir `http://localhost/foro/turso-setup.html` (sirve el archivo HTML de setup)
2. O abrir la app y ejecutar en consola:
```javascript
window.runTursoSetup();
```

### Forma 2: Desde terminal (si tienes Node.js)
```bash
# Instalar CLI de Turso
npm install -g @libsql/cli

# Crear database local
turso db create winebox-clinic

# Ejecutar el setup
node foro/turso-setup-cli.js
```

## Paso 6: Subir a GitHub

```bash
git add .
git commit -m "Add Turso integration"
git push origin main

# Activar GitHub Pages
# Settings → Pages → Source: main, Folder: /foro
```

## Limitaciones del plan gratis de Turso

| Recurso | Límite gratis |
|---------|--------------|
| Base de datos | 1 |
| Storage | 5 GB |
| Lecturas/mes | 500 millones |
| Escrituras/mes | 10 millones |
| Registros | ~50,000 usuarios |

Para la comunidad de WineBOX.Clinic, esto es más que suficiente para empezar.

## Notas importantes

- Los datos se guardan en Turso (nube) PERO también se cachearán en localStorage
- Si Turso falla, la app funciona igual con datos locales
- Para producción real, considerar migrar a Postgres si creces mucho
- Los tokens son sensibles: NO los commits al repositorio público

## Solución de problemas

### Error "turso_not_configured"
Verificar que `window.TURSO_CONFIG` esté definido antes de cargar `turso.js`

### Error "http_401"
El token es incorrecto o expiró. Generar uno nuevo en Turso dashboard.

### Error "http_404"
La URL de la base de datos es incorrecta. Verificar en Turso dashboard.

### Datos no aparecen
Ejecutar el setup: abrir la app en consola y escribir `window.runTursoSetup()`
