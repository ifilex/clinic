// Configuración en tiempo de ejecución (se copia tal cual a dist/).
//
// Si el frontend se publica como sitio estático (GitHub Pages, Netlify, etc.)
// y la API corre en otro servidor, completá la URL:
//
//   window.__WINEBOX_API_URL__ = "https://tu-api.midominio.com";
//
// Dejala vacía si Express sirve el frontend y la API en el mismo origen.
window.__WINEBOX_API_URL__ = window.__WINEBOX_API_URL__ || "";
