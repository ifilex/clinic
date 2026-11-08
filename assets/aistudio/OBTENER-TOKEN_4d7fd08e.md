# 🔑 Cómo obtener tu Token de Turso (PASO A PASO)

## Problema
El token actual ya no funciona. Debés generar uno nuevo.

## Pasos para obtener el token:

### 1. Ir a Turso
- Abrí https://turso.tech
- Iniciá sesión con GitHub

### 2. Ir a tu base de datos
- En el dashboard, buscá: **winebox-clinic**
- Click en el nombre de la base de datos

### 3. Generar nuevo token
- Botón **"Access API"** o **"Teammates"** (arriba a la derecha)
- Click en **"Generate Token"**
- Nombre: `winebox-clinic-token`
- Click en **"Create Token"**

### 4. Copiar el token
- Se mostrará UN SOLO VEZ el token
- Copialo completo (empieza con `eyJ...`)
- **NO lo cierres sin copiarlo**

### 5. Actualizar config.js
Abrir `config.js` y reemplazar la línea del token:

```javascript
authToken: 'AQUI_TU_NUEVO_TOKEN'
```

---

## Verificación rápida

Después de actualizar el token, ejecutar:
```bash
node setup-turso-dynamic.js
```

Si funciona verás:
```
✅ Conexión exitosa!
✅ Tablas creadas
✅ Datos insertados
```

---

## ¿Sigue sin funcionar?

1. Verificá que la URL sea correcta:
   ```
   https://winebox-clinic-mrwad.aws-sa-east-1.turso.io
   ```

2. El token debe empezar con `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.`

3. Si el token tiene más de 30 días, podria haber expirado. Regenerar uno nuevo.
