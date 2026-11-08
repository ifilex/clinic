# 🌿 Aura Mejorada - Asistente Inteligente para WineBOX.Clinic

## Resumen de Cambios

Se eliminó el sistema de chat en línea (que no funcionaba) y se creó un **Aura mejorada** como asistente inteligente del sitio.

---

## ✅ Lo que hace Aura Mejorada

### 1. **Navegación por el sitio**
- Explicar cada sección (Inicio, Directorio, Comunidad, Publicaciones, etc.)
- Guiar paso a paso sobre cómo usar cada función

### 2. **Instrucciones prácticas**
- Cómo publicar una entrada
- Cómo buscar profesionales en el directorio
- Cómo contactar a un psicólogo
- Cómo descargar ebooks
- Cómo usar el sistema de mensajería

### 3. **Cuestionario de Bienestar**
- 6 preguntas sobre estado de ánimo, ansiedad, sueño, concentración, relaciones y energía
- Resultados personalizados (bajo/medio/alto riesgo)
- Sugerencias según el nivel encontrado

### 4. **FAQ**
- Preguntas frecuentes sobre el sitio
- Respuestas sobre privacidad, precios, funcionamiento

### 5. **Respuestas empáticas**
- Continúa teniendo respuestas compasivas para temas de salud mental
- Siempre deriva a profesionales cuando es necesario

---

## 📁 Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `aura-enhanced.js` | **NUEVO** - Sistema de IA para Aura |
| `app.js` | Actualizado para usar AuraEnhanced |
| `index.html` | Simplificado, solo carga Aura |

## 📁 Archivos eliminados

- `icq-chat.js`
- `setup-icq.js`
- `chat-tabs.js`
- `p2p-chat.js`
- `chat-firebase.js`
- `server-chat.js`
- `ws-chat.js`
- `ws-client.js`

---

## 🧪 Cómo probar

1. Abrir `index.html` en el navegador
2. Ir a `#/aura`
3. Probar las siguientes preguntas:

```
"¿Cómo uso el directorio?"
"¿Cómo publico algo?"
"¿Cómo contacto un psicólogo?"
"Quiero un cuestionario"
"¿Es gratis usar WineBOX?"
"¿Cómo descargo ebooks?"
```

---

## 💡 Flujo del Cuestionario

1. Usuario dice: "quiero un cuestionario"
2. Aura muestra 6 preguntas con opciones 1-4
3. Usuario responde número por número
4. Aura calcula resultado y da recomendaciones
5. Siempre recuerda que NO es un diagnóstico

---

## 🔒 Privacidad

- Los mensajes de Aura **NO se guardan** en ninguna base de datos
- Todo funciona localmente en el navegador
- No hay registro de conversaciones
- Las respuestas son generadas en tiempo real

---

## ⚠️ Límites

- Aura NO es un psicólogo
- NO hace diagnósticos
- NO prescribe medicación
- En caso de crisis, siempre deriva a líneas de emergencia
