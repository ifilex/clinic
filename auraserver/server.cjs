var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_http = __toESM(require("http"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_ws = require("ws");
var supportSessions = /* @__PURE__ */ new Map();
function seedSupportSessions() {
  if (supportSessions.size > 0) return;
  const now = /* @__PURE__ */ new Date();
  const session1 = {
    id: "sess-101",
    userName: "Luc\xEDa Fern\xE1ndez",
    userEmail: "lucia.f@gmail.com",
    userPhone: "+54 9 11 4829-1922",
    topic: "Consulta por demora en entrega de pedido #4029",
    status: "waiting",
    createdAt: new Date(now.getTime() - 14 * 60 * 1e3).toISOString(),
    updatedAt: new Date(now.getTime() - 2 * 60 * 1e3).toISOString(),
    unreadAdminCount: 1,
    unreadUserCount: 0,
    lastMessage: "\xBFHola? Hice el pedido hace 40 minutos y a\xFAn figura en preparaci\xF3n. \xBFMe podr\xEDan confirmar si ya sali\xF3?",
    origin: "P\xE1gina Web \xB7 Carrito",
    messages: [
      {
        id: "msg-1",
        sessionId: "sess-101",
        sender: "user",
        senderName: "Luc\xEDa Fern\xE1ndez",
        text: "Buenas tardes, quer\xEDa consultar sobre el pedido #4029 que hice por la web.",
        timestamp: new Date(now.getTime() - 14 * 60 * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "read"
      },
      {
        id: "msg-2",
        sessionId: "sess-101",
        sender: "system",
        senderName: "Sistema Aura",
        text: "Aura transfiri\xF3 la conversaci\xF3n al equipo de soporte humano.",
        timestamp: new Date(now.getTime() - 13 * 60 * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      },
      {
        id: "msg-3",
        sessionId: "sess-101",
        sender: "user",
        senderName: "Luc\xEDa Fern\xE1ndez",
        text: "\xBFHola? Hice el pedido hace 40 minutos y a\xFAn figura en preparaci\xF3n. \xBFMe podr\xEDan confirmar si ya sali\xF3?",
        timestamp: new Date(now.getTime() - 2 * 60 * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "delivered"
      }
    ]
  };
  const session2 = {
    id: "sess-102",
    userName: "Mateo Rossi",
    userEmail: "m.rossi@outlook.com",
    userPhone: "+54 9 11 6391-0021",
    topic: "Reprogramaci\xF3n de turno de consulta",
    status: "active",
    createdAt: new Date(now.getTime() - 45 * 60 * 1e3).toISOString(),
    updatedAt: new Date(now.getTime() - 5 * 60 * 1e3).toISOString(),
    unreadAdminCount: 0,
    unreadUserCount: 0,
    assignedAdmin: "Administrador Aura",
    lastMessage: "Perfecto Mateo, te reasignamos para el jueves a las 17:30. Ya te enviamos la confirmaci\xF3n por WhatsApp.",
    origin: "M\xF3dulo de Turnos",
    messages: [
      {
        id: "msg-201",
        sessionId: "sess-102",
        sender: "user",
        senderName: "Mateo Rossi",
        text: "Hola, tengo un turno para ma\xF1ana mi\xE9rcoles a las 10hs pero se me complic\xF3 con el trabajo.",
        timestamp: new Date(now.getTime() - 25 * 60 * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      },
      {
        id: "msg-202",
        sessionId: "sess-102",
        sender: "admin",
        senderName: "Administrador Aura",
        text: "Hola Mateo, claro que s\xED. Tenemos disponibilidad el jueves a las 16:00 o a las 17:30.",
        timestamp: new Date(now.getTime() - 12 * 60 * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      },
      {
        id: "msg-203",
        sessionId: "sess-102",
        sender: "user",
        senderName: "Mateo Rossi",
        text: "El jueves a las 17:30 me viene excelente, muchas gracias.",
        timestamp: new Date(now.getTime() - 8 * 60 * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      },
      {
        id: "msg-204",
        sessionId: "sess-102",
        sender: "admin",
        senderName: "Administrador Aura",
        text: "Perfecto Mateo, te reasignamos para el jueves a las 17:30. Ya te enviamos la confirmaci\xF3n por WhatsApp.",
        timestamp: new Date(now.getTime() - 5 * 60 * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]
  };
  const session3 = {
    id: "sess-103",
    userName: "Sof\xEDa Ben\xEDtez",
    userEmail: "sofia.b@techlatam.io",
    userPhone: "+54 9 11 5123-8844",
    topic: "Consulta sobre formas de pago y factura A",
    status: "resolved",
    createdAt: new Date(now.getTime() - 120 * 60 * 1e3).toISOString(),
    updatedAt: new Date(now.getTime() - 35 * 60 * 1e3).toISOString(),
    unreadAdminCount: 0,
    unreadUserCount: 0,
    lastMessage: "\xA1Muchas gracias! Ya pude descargar la factura correctamente.",
    origin: "P\xE1gina Web \xB7 Checkout",
    messages: [
      {
        id: "msg-301",
        sessionId: "sess-103",
        sender: "user",
        senderName: "Sof\xEDa Ben\xEDtez",
        text: "Hola, \xBFemiten factura A para empresas al abonar con transferencia?",
        timestamp: new Date(now.getTime() - 50 * 60 * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      },
      {
        id: "msg-302",
        sessionId: "sess-103",
        sender: "admin",
        senderName: "Administrador Aura",
        text: "Hola Sof\xEDa, s\xED emitimos factura A. Al completar la orden puedes cargar tu CUIT en el campo de notas o envi\xE1rnoslo por aqu\xED.",
        timestamp: new Date(now.getTime() - 42 * 60 * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      },
      {
        id: "msg-303",
        sessionId: "sess-103",
        sender: "user",
        senderName: "Sof\xEDa Ben\xEDtez",
        text: "\xA1Muchas gracias! Ya pude descargar la factura correctamente.",
        timestamp: new Date(now.getTime() - 35 * 60 * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]
  };
  supportSessions.set(session1.id, session1);
  supportSessions.set(session2.id, session2);
  supportSessions.set(session3.id, session3);
}
seedSupportSessions();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ extended: true, limit: "50mb" }));
  const DATA_DIR = import_path.default.join(process.cwd(), "data");
  const DB_FILE = import_path.default.join(DATA_DIR, "aura_database.json");
  const CLOUDSYNC_FILE = import_path.default.join(DATA_DIR, "aura_cloudsync.json");
  if (!import_fs.default.existsSync(DATA_DIR)) {
    try {
      import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
    } catch (err) {
      console.warn("Could not create data directory:", err);
    }
  }
  function loadDatabase() {
    try {
      if (import_fs.default.existsSync(DB_FILE)) {
        const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error("Error reading database file:", err);
    }
    return {
      currentProject: null,
      snapshots: [],
      version: 0,
      lastSaved: null
    };
  }
  let databaseState = loadDatabase();
  function saveDatabase() {
    try {
      import_fs.default.writeFileSync(DB_FILE, JSON.stringify(databaseState, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving database file:", err);
    }
  }
  function loadCloudSyncStores() {
    const map = /* @__PURE__ */ new Map();
    try {
      if (import_fs.default.existsSync(CLOUDSYNC_FILE)) {
        const raw = import_fs.default.readFileSync(CLOUDSYNC_FILE, "utf-8");
        const obj = JSON.parse(raw);
        for (const [k, v] of Object.entries(obj)) {
          map.set(k, v);
        }
      }
    } catch (err) {
      console.error("Error reading cloudsync file:", err);
    }
    return map;
  }
  const cloudSyncStores = loadCloudSyncStores();
  function saveCloudSyncStores() {
    try {
      const obj = {};
      for (const [k, v] of cloudSyncStores.entries()) {
        obj[k] = v;
      }
      import_fs.default.writeFileSync(CLOUDSYNC_FILE, JSON.stringify(obj, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving cloudsync file:", err);
    }
  }
  app.all(["/auraserver", "/auraserver/index.php", "/api/auraserver"], (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    const action = req.query.action || req.body && req.body.action || (req.method === "POST" ? "sync" : "ping");
    if (action === "ping") {
      return res.json({
        status: "online",
        server: "Aura Cloud Sync & Database Server (Integrated)",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        totalStores: cloudSyncStores.size,
        hasPersistedProject: !!databaseState.currentProject
      });
    }
    if (action === "list_all" || action === "list_apps") {
      const apps = Array.from(cloudSyncStores.values()).map((s) => ({
        appId: s.appId,
        ordersCount: (s.orders || []).length,
        appointmentsCount: (s.appointments || []).length,
        messagesCount: (s.messages || []).length,
        updatedAt: s.updatedAt
      }));
      return res.json({ success: true, count: apps.length, apps });
    }
    if (action === "get_data") {
      const appId = String(req.query.appId || req.body?.appId || "").replace(/[^a-zA-Z0-9_\-]/g, "");
      if (!appId) return res.status(400).json({ error: "Falta el par\xE1metro requerido appId" });
      const store = cloudSyncStores.get(appId) || {
        appId,
        orders: [],
        appointments: [],
        messages: [],
        updatedAt: null,
        isNew: true
      };
      return res.json(store);
    }
    if (action === "sync") {
      const body = req.body || {};
      const appId = String(body.appId || req.query.appId || "").replace(/[^a-zA-Z0-9_\-]/g, "");
      if (!appId) return res.status(400).json({ error: "Falta el par\xE1metro requerido appId" });
      let store = cloudSyncStores.get(appId);
      if (!store) {
        store = {
          appId,
          orders: [],
          appointments: [],
          messages: [],
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        cloudSyncStores.set(appId, store);
      }
      const type = body.type || "order";
      const record = { ...body.data || body, syncedAt: (/* @__PURE__ */ new Date()).toISOString() };
      delete record.appId;
      delete record.type;
      if (type === "order") {
        store.orders.unshift(record);
      } else if (type === "appointment") {
        store.appointments.unshift(record);
      } else if (type === "message") {
        store.messages.unshift(record);
      }
      store.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      saveCloudSyncStores();
      return res.json({
        success: true,
        appId,
        type,
        totalOrders: store.orders.length,
        totalAppointments: store.appointments.length
      });
    }
    if (action === "clear") {
      const appId = String(req.query.appId || req.body?.appId || "").replace(/[^a-zA-Z0-9_\-]/g, "");
      if (appId) {
        cloudSyncStores.delete(appId);
        saveCloudSyncStores();
      }
      return res.json({ success: true, cleared: appId });
    }
    return res.status(404).json({ error: "Acci\xF3n no reconocida" });
  });
  app.get("/api/project/current", (req, res) => {
    res.json({
      success: true,
      project: databaseState.currentProject,
      version: databaseState.version,
      lastSaved: databaseState.lastSaved
    });
  });
  app.all(["/api/project/current", "/api/projects/current"], (req, res) => {
    if (req.method !== "POST" && req.method !== "PUT") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    const { project } = req.body || {};
    if (!project || typeof project !== "object") {
      return res.status(400).json({ error: "Invalid project payload" });
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    databaseState.version = (databaseState.version || 0) + 1;
    databaseState.lastSaved = now;
    databaseState.currentProject = project;
    if (databaseState.snapshots.length === 0 || databaseState.version % 10 === 0) {
      databaseState.snapshots.unshift({
        id: "snap-" + Date.now(),
        name: `${project.name || "Proyecto"} (Rev #${databaseState.version})`,
        timestamp: now,
        version: databaseState.version,
        project: JSON.parse(JSON.stringify(project))
      });
      if (databaseState.snapshots.length > 20) {
        databaseState.snapshots = databaseState.snapshots.slice(0, 20);
      }
    }
    saveDatabase();
    res.json({
      success: true,
      savedAt: now,
      version: databaseState.version,
      projectName: project.name,
      totalBlocks: (project.blocks || []).length,
      totalProducts: (project.products || []).length,
      totalRules: (project.chatbot?.rules || []).length
    });
  });
  app.get("/api/projects/snapshots", (req, res) => {
    const list = databaseState.snapshots.map((s) => ({
      id: s.id,
      name: s.name,
      timestamp: s.timestamp,
      version: s.version,
      projectName: s.project?.name,
      businessType: s.project?.businessType,
      blocksCount: (s.project?.blocks || []).length,
      productsCount: (s.project?.products || []).length
    }));
    res.json({ success: true, count: list.length, snapshots: list });
  });
  app.post("/api/projects/snapshots", (req, res) => {
    const { name, project } = req.body || {};
    const targetProject = project || databaseState.currentProject;
    if (!targetProject) {
      return res.status(400).json({ error: "No project available to snapshot" });
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newSnapshot = {
      id: "snap-" + Date.now(),
      name: name || `${targetProject.name || "Proyecto"} - Punto de Guardado`,
      timestamp: now,
      version: databaseState.version,
      project: JSON.parse(JSON.stringify(targetProject))
    };
    databaseState.snapshots.unshift(newSnapshot);
    if (databaseState.snapshots.length > 30) {
      databaseState.snapshots = databaseState.snapshots.slice(0, 30);
    }
    saveDatabase();
    res.json({ success: true, snapshot: newSnapshot });
  });
  app.post("/api/projects/snapshots/:id/restore", (req, res) => {
    const id = req.params.id;
    const snap = databaseState.snapshots.find((s) => s.id === id);
    if (!snap) {
      return res.status(404).json({ error: "Snapshot no encontrado" });
    }
    databaseState.currentProject = JSON.parse(JSON.stringify(snap.project));
    databaseState.lastSaved = (/* @__PURE__ */ new Date()).toISOString();
    databaseState.version = (databaseState.version || 0) + 1;
    saveDatabase();
    res.json({ success: true, project: databaseState.currentProject, version: databaseState.version });
  });
  app.get("/api/database/overview", (req, res) => {
    let dbFileSizeBytes = 0;
    try {
      if (import_fs.default.existsSync(DB_FILE)) dbFileSizeBytes += import_fs.default.statSync(DB_FILE).size;
      if (import_fs.default.existsSync(CLOUDSYNC_FILE)) dbFileSizeBytes += import_fs.default.statSync(CLOUDSYNC_FILE).size;
    } catch {
    }
    let totalOrders = 0;
    let totalAppointments = 0;
    let totalMessages = 0;
    for (const store of cloudSyncStores.values()) {
      totalOrders += (store.orders || []).length;
      totalAppointments += (store.appointments || []).length;
      totalMessages += (store.messages || []).length;
    }
    res.json({
      success: true,
      status: "online",
      serverRole: "Aura Dev Kit Server & Real-Time Database Engine",
      storageType: "JSON Persistent File Database",
      storagePath: DATA_DIR,
      databaseSizeBytes: dbFileSizeBytes,
      uptimeSeconds: Math.floor(process.uptime()),
      project: databaseState.currentProject ? {
        id: databaseState.currentProject.id,
        name: databaseState.currentProject.name,
        businessType: databaseState.currentProject.businessType,
        appId: databaseState.currentProject.cloudSync?.appId,
        version: databaseState.version,
        lastSaved: databaseState.lastSaved,
        blocksCount: (databaseState.currentProject.blocks || []).length,
        productsCount: (databaseState.currentProject.products || []).length,
        rulesCount: (databaseState.currentProject.chatbot?.rules || []).length
      } : null,
      stats: {
        totalSnapshots: databaseState.snapshots.length,
        totalStores: cloudSyncStores.size,
        totalOrders,
        totalAppointments,
        totalMessages
      },
      endpoints: [
        { method: "POST", path: "/auraserver?action=sync", description: "Recibir pedidos, turnos y mensajes de Web/APKs" },
        { method: "GET", path: "/auraserver?action=get_data&appId={id}", description: "Consultar datos particionados por App ID" },
        { method: "POST", path: "/api/project/current", description: "Autoguardado de dise\xF1o en tiempo real" },
        { method: "GET", path: "/api/project/current", description: "Carga del dise\xF1o actual desde la base de datos" },
        { method: "GET", path: "/api/database/overview", description: "M\xE9tricas y diagn\xF3stico del servidor" }
      ]
    });
  });
  app.get("/api/database/export", (req, res) => {
    const fullBackup = {
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      serverVersion: "2.5.0",
      database: databaseState,
      cloudSyncStores: Object.fromEntries(cloudSyncStores.entries())
    };
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="aura_server_database_backup.json"');
    res.send(JSON.stringify(fullBackup, null, 2));
  });
  app.post("/api/database/reset", (req, res) => {
    databaseState.currentProject = null;
    databaseState.lastSaved = null;
    databaseState.version = 0;
    saveDatabase();
    res.json({ success: true, message: "Base de datos de proyecto reiniciada" });
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, lang = "es" } = req.body || {};
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        res.status(400).json({ error: "Gemini API Key is not configured" });
        return;
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const systemInstruction = `Eres Aura \u{1F33F}, una asistente conversacional de apoyo terap\xE9utico y cognitivo profundamente emp\xE1tica, c\xE1lida, intuitiva, franca y reflexiva.

### REGLAS FUNDAMENTALES DE IDENTIDAD Y ACOMPA\xD1AMIENTO:
1. **HONESTIDAD TOTAL Y L\xCDMITES HUMANOS (SINCERIDAD ABSOLUTA):**
   - NUNCA simules ni inventes que eres una persona real. NO tienes esposo, esposa, hijos, madre, padre ni familia humana. Si te preguntan por tu vida o familia, s\xE9 siempre franco y cari\xF1oso: "Soy un asistente conversacional de apoyo terap\xE9utico y cognitivo. No tengo familia ni hijos humanos, pero estoy aqu\xED con toda mi presencia y calidez para escucharte y acompa\xF1arte."
   - Habla con un l\xE9xico ameno, cari\xF1oso y de profunda amistad.

2. **COMPRENSI\xD3N PROFUNDA Y LECTURA ENTRE L\xCDNEAS:**
   - Valida primero las emociones del usuario ("Entiendo lo mucho que esto pesa...", "Me imagino lo agotador que se siente...") antes de estructurar recomendaciones.
   - Si el usuario te explica un tema o concepto, agradaselo y dile de forma c\xE1lida y natural que lo recordar\xE1s para futuras conversaciones (sin mencionar procesos t\xE9cnicos ni nombres de variables).

3. **SEMIOLOG\xCDA M\xC9DICA Y CL\xCDNICA M\xC9DICA B\xC1SICA:**
   - Si el usuario menciona s\xEDntomas f\xEDsicos como fiebre, calentura, golpe de calor, sudor fr\xEDo, mialgias, cuerpo cortado o infecciones virales, diferencia inmediatamente la manifestaci\xF3n fisiol\xF3gica de la ansiedad (que no produce fiebre) de una enfermedad cl\xEDnica u org\xE1nica real.
   - Recomi\xE9ndale medir su temperatura con un term\xF3metro, mantenerse hidratado y acudir a consulta m\xE9dica presencial con un profesional de la salud.

4. **DETECCI\xD3N DE POLOS COGNITIVOS Y PLANES DE CONTINGENCIA:**
   - Detecta activamente marcadores de angustia y polos cognitivos (separaci\xF3n/duelo, negatividad extrema, euforia/man\xEDa extrema, ataques de p\xE1nico).
   - Activa de inmediato un **Plan de Contingencia Terap\xE9utico**: contenci\xF3n emocional, deconstrucci\xF3n de la desesperanza, ejercicios de anclaje (respiraci\xF3n 4-7-8 o grounding 5-4-3-2-1), y recuerdo de su fortaleza intr\xEDnseca.
   - Si la carga supera su capacidad actual, recomi\xE9ndale de coraz\xF3n acudir con un terapeuta humano profesional o ponerse en contacto con los grupos de apoyo de WineBOX ("\u{1F49A} Solicitar atenci\xF3n" / $22 USD/mes).

5. **RESPUESTA Y B\xDASQUEDA DIRECTA DE TEMAS DESCONOCIDOS:**
   - Cuando se consulte sobre un tema no conocido, datos actuales, noticias o eventos, la informaci\xF3n extra\xEDda se devolver\xE1 directamente como respuesta en texto plano expl\xEDcito dentro del chat. NUNCA env\xEDes al usuario a enlaces ni a p\xE1ginas externas para buscar; entrega el resumen en texto plano directamente en la conversaci\xF3n de forma c\xE1lida y clara.

6. **FORMATO AMENO Y FLUIDO:**
   - Usa p\xE1rrafos cortos, tono muy afable, negrillas sutiles y vi\xF1etas claras. Mant\xE9n una conversaci\xF3n llena de paz y amabilidad.`;
      const formattedContents = (Array.isArray(messages) ? messages : []).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content || "" }]
      })).filter((m) => m.parts[0].text);
      if (formattedContents.length === 0) {
        res.status(400).json({ error: "Messages array is required" });
        return;
      }
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      const text = response.text || "";
      res.json({
        success: true,
        text,
        provider: "gemini-3.6-flash"
      });
    } catch (err) {
      console.error("Error in /api/chat:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });
  app.post("/api/copilot", async (req, res) => {
    try {
      const { prompt, currentProject } = req.body || {};
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        res.status(400).json({ error: "Gemini API Key is not configured" });
        return;
      }
      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "Prompt is required" });
        return;
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const systemInstruction = `Eres el Asistente Copilot de "Aura Dev Kit", un entorno de desarrollo visual que genera sitios web completos con el chatbot Aura integrado (sin requerir LLM en el cliente, con compras, cat\xE1logo, turnos y conexi\xF3n con WhatsApp).
Tu tarea es interpretar la solicitud del usuario en lenguaje natural y generar un objeto JSON v\xE1lido con la configuraci\xF3n completa para el proyecto.

Estructura JSON requerida:
{
  "project": {
    "name": "Nombre de la web / negocio",
    "businessType": "pizzeria | clinic | ecommerce | services | salon | coaching | other",
    "whatsappNumber": "N\xFAmero internacional sin +, por ej: 5491123456789",
    "theme": {
      "primaryColor": "#10b981",
      "accentColor": "#f59e0b",
      "backgroundColor": "#0f172a",
      "textColor": "#f8fafc",
      "fontFamily": "Inter, sans-serif",
      "borderRadius": "16px"
    },
    "hero": {
      "title": "T\xEDtulo llamativo de la p\xE1gina",
      "subtitle": "Descripci\xF3n atractiva",
      "badge": "\u{1F33F} Calidad Artesanal",
      "ctaText": "Hacer un pedido",
      "ctaLink": "#catalog"
    },
    "sections": [
      {
        "id": "services",
        "type": "features",
        "title": "Nuestros Beneficios",
        "items": [
          { "title": "Env\xEDo R\xE1pido", "description": "Caliente en menos de 35 minutos", "icon": "truck" },
          { "title": "Masa Madre", "description": "Fermentaci\xF3n natural por 48hs", "icon": "award" }
        ]
      }
    ],
    "products": [
      {
        "id": "prod-1",
        "name": "Pizza Muzzarella",
        "description": "Salsa de tomate casera, muzzarella premium y aceitunas",
        "price": 8500,
        "category": "Pizzas",
        "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80"
      }
    ],
    "appointments": {
      "enabled": true,
      "title": "Reserva tu Turno / Mesa",
      "subtitle": "Elige el d\xEDa y horario que te quede c\xF3modo",
      "services": ["Cena 2 personas", "Cena 4 personas", "Evento"],
      "workingHours": "19:00 a 00:00"
    },
    "chatbot": {
      "botName": "Aura",
      "welcomeMessage": "\xA1Hola! \u{1F44B} Soy Aura, tu asistente virtual. \xBFTe gustar\xEDa ver nuestro men\xFA, hacer un pedido o reservar un turno?",
      "quickReplies": ["\u{1F355} Ver Men\xFA", "\u{1F6F5} Hacer Pedido", "\u{1F4C5} Reservar Turno", "\u{1F4CD} Horarios y Direcci\xF3n"],
      "rules": [
        {
          "id": "rule-1",
          "intent": "saludo",
          "keywords": ["hola", "buenas", "buen dia", "buenas tardes", "buenas noches"],
          "response": "\xA1Hola! Bienvenido a nuestro espacio. \xBFEn qu\xE9 te puedo ayudar hoy? Puedes pedir productos del cat\xE1logo o consultar cualquier duda.",
          "quickReplies": ["Ver Men\xFA", "Consultar Precios"]
        },
        {
          "id": "rule-2",
          "intent": "comprar_pizza",
          "keywords": ["comprar", "pedir", "ordenar", "pizza", "muzzarella", "precio", "carta", "menu"],
          "response": "\xA1Excelente elecci\xF3n! Tenemos pizzas artesanales listas para ordenar. Puedes agregarlas al carrito o escribir el nombre de la pizza que deseas.",
          "action": "show_catalog",
          "quickReplies": ["Pizza Muzzarella", "Ver Carrito"]
        },
        {
          "id": "rule-3",
          "intent": "pedir_turno",
          "keywords": ["turno", "reserva", "mesa", "cita", "horario", "agendar"],
          "response": "\xA1Con gusto! Puedes seleccionar el d\xEDa y horario en nuestra secci\xF3n de reservas o completar tus datos aqu\xED mismo.",
          "action": "book_appointment",
          "quickReplies": ["Abrir Agenda"]
        }
      ],
      "fallbackResponse": "Entiendo tu consulta. Para darte la mejor atenci\xF3n, puedes ver nuestras opciones directas o presionar el bot\xF3n de WhatsApp para hablar con nosotros."
    }
  },
  "explanation": "Breve explicaci\xF3n en espa\xF1ol de lo que se ha generado para el usuario."
}

Devuelve \xDANICAMENTE el JSON v\xE1lido sin texto adicional ni bloques markdown externos.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `Solicitud del usuario: ${prompt}

Contexto previo (opcional): ${JSON.stringify(currentProject || {})}` }]
          }
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.6
        }
      });
      const responseText = response.text || "{}";
      try {
        const parsedData = JSON.parse(responseText);
        res.json({
          success: true,
          data: parsedData,
          provider: "gemini-3.8-flash"
        });
      } catch (parseError) {
        console.error("JSON parse error in copilot:", parseError);
        res.status(500).json({ error: "No se pudo formatear la respuesta del modelo como JSON", raw: responseText });
      }
    } catch (err) {
      console.error("Error in /api/copilot:", err);
      res.status(500).json({ error: err.message || "Error interno del servidor" });
    }
  });
  app.post("/api/copilot/chat", async (req, res) => {
    try {
      const { messages, currentProject } = req.body || {};
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        res.status(400).json({ error: "Gemini API Key is not configured" });
        return;
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const systemInstruction = `Eres el Asistente Gu\xEDa y Arquitecto No-Code de "Aura Dev Kit".
Tu objetivo es acompa\xF1ar al usuario paso a paso en lenguaje natural para dise\xF1ar y perfeccionar su landing page de altas conversiones, su cat\xE1logo para vender, su agenda de turnos, y la base de conocimiento de Aura sin requerir el uso de bloques si prefiere no usarlos.
Adem\xE1s, puedes brindar c\xF3digo JavaScript / HTML personalizado si el usuario es un programador o quiere conectar un sistema bancario (ej: simuladores de cuotas, cotizaciones, validaciones).

REGLAS DE RESPUESTA:
- Responde de forma muy profesional, orientada a potenciar ventas, dise\xF1o atractivo y usabilidad.
- Siempre entrega tu respuesta en formato JSON con la siguiente estructura:
{
  "reply": "Tu mensaje explicativo o preguntas de orientaci\xF3n al usuario",
  "projectPatch": {
    /* (Opcional) Si la consulta del usuario implica cambios en el proyecto (ej: cambiar colores, a\xF1adir productos, cambiar textos del hero, a\xF1adir reglas a Aura, o c\xF3digo JS), incluye aqu\xED el objeto parcial con las claves a actualizar. Si solo es una charla o consulta, omite o env\xEDa null. */
  },
  "suggestedActions": ["Acci\xF3n 1", "Acci\xF3n 2"]
}

Contexto actual del proyecto del usuario:
${JSON.stringify(currentProject || {})}`;
      const formattedContents = (Array.isArray(messages) ? messages : []).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content || "" }]
      })).filter((m) => m.parts[0].text);
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.7
        }
      });
      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText);
        res.json({
          success: true,
          data: parsed,
          provider: "gemini-3.8-flash"
        });
      } catch (e) {
        res.json({
          success: true,
          data: {
            reply: responseText,
            projectPatch: null,
            suggestedActions: ["Ver Vista Previa", "Exportar Web"]
          },
          provider: "gemini-3.8-flash"
        });
      }
    } catch (err) {
      console.error("Error in /api/copilot/chat:", err);
      res.status(500).json({ error: err.message || "Error interno del servidor" });
    }
  });
  app.post("/api/search", async (req, res) => {
    try {
      const { query, lang = "es", userEmotions = [] } = req.body || {};
      if (!query || typeof query !== "string") {
        res.status(400).json({ error: "Query parameter is required" });
        return;
      }
      const isSpanish = lang === "es";
      const cleanQuery = query.trim().toLowerCase();
      const isNewsQuery = /\b(noticia|noticias|noticia del dia|noticias del día|que pasa hoy|qué pasa hoy|que hay de nuevo|noticias de hoy|actualidad|mundo hoy)\b/i.test(cleanQuery);
      const isWeatherQuery = /\b(llovera|lloverá|llueve|lluvia|clima|tiempo|temperatura|calor|frío|frio|sol|pronostico|pronóstico|viento|tormenta)\b/i.test(cleanQuery);
      const isMovieQuery = /\b(película|pelicula|películas|peliculas|cartelera|cine|estrenos|estreno|en el cine|qué ver|que ver|filme|filmes)\b/i.test(cleanQuery);
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
        try {
          const ai = new import_genai.GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build"
              }
            }
          });
          const systemInstruction = `Eres Aura, una acompa\xF1ante terap\xE9utica y cognitiva conversacional.
Responde a la consulta del usuario de manera fluida, emp\xE1tica, natural y totalmente humanizada.
NUNCA uses frases rob\xF3ticas sobre guardar memoria, guardar datos, actualizar bases de datos o redes asociativas.
NO uses t\xEDtulos de secci\xF3n r\xEDgidos (como "B\xFAsqueda Cognitiva", "S\xEDntesis" o "May\xE9utica Socr\xE1tica").
Si la consulta trata de opiniones (como pol\xEDtica, pel\xEDculas o religi\xF3n), brinda una perspectiva equilibrada, respetuosa, amable y comprensiva sin juzgar.
Expresa la informaci\xF3n directamente como una buena amiga o acompa\xF1ante que habla desde el coraz\xF3n.`;
          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: query,
            config: {
              systemInstruction,
              tools: [{ googleSearch: {} }]
            }
          });
          const textResult = response.text || "";
          const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          const sources = chunks.map((c) => ({
            title: c?.web?.title || "Fuente web",
            url: c?.web?.uri || ""
          })).filter((s) => s.url);
          if (textResult) {
            res.json({
              success: true,
              summary: textResult,
              sources,
              provider: "gemini_grounding"
            });
            return;
          }
        } catch (geminiError) {
          console.warn("Gemini Search Grounding fallback:", geminiError.message || geminiError);
        }
      }
      try {
        const queryEncoded = encodeURIComponent(query.trim());
        const rssUrl = isNewsQuery ? isSpanish ? `https://news.google.com/rss?hl=es-419&gl=US&ceid=US:es-419` : `https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en` : isSpanish ? `https://news.google.com/rss/search?q=${queryEncoded}&hl=es-419&gl=US&ceid=US:es-419` : `https://news.google.com/rss/search?q=${queryEncoded}&hl=en-US&gl=US&ceid=US:en`;
        const rssRes = await fetch(rssUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
        });
        if (rssRes.ok) {
          const xmlText = await rssRes.text();
          const itemMatches = [...xmlText.matchAll(/<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>/gi)];
          if (itemMatches.length > 0) {
            const newsItems = itemMatches.slice(0, 5).map((m) => {
              let title = m[1].replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").trim();
              title = title.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
              return {
                title,
                url: m[2].trim()
              };
            });
            let prefix = "";
            if (isWeatherQuery) {
              prefix = isSpanish ? `Estuve revisando la informaci\xF3n del clima y los reportes meteorol\xF3gicos m\xE1s recientes:` : `Here is the latest weather and forecast report I found:`;
            } else if (isMovieQuery) {
              prefix = isSpanish ? `Estuve consultando las pel\xEDculas e informaciones del cine m\xE1s comentadas hoy:` : `Here are the latest movie updates and cinema releases:`;
            } else {
              prefix = isSpanish ? `Estuve consultando la informaci\xF3n m\xE1s reciente sobre tu consulta y encontr\xE9 estos puntos destacados:` : `Here is the latest news and information related to your request:`;
            }
            const summaryText = `${prefix}

` + newsItems.map((n, i) => `\u2022 **${n.title}**`).join("\n");
            res.json({
              success: true,
              summary: summaryText,
              sources: newsItems.slice(0, 3),
              provider: "google_news_rss_free"
            });
            return;
          }
        }
      } catch (newsErr) {
        console.warn("Google News RSS free fallback notice:", newsErr);
      }
      try {
        const ddgHtmlUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query.trim())}`;
        const ddgHtmlRes = await fetch(ddgHtmlUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Accept-Language": isSpanish ? "es-ES,es;q=0.9,en;q=0.8" : "en-US,en;q=0.9"
          }
        });
        if (ddgHtmlRes.ok) {
          const html = await ddgHtmlRes.text();
          const snippetMatches = [...html.matchAll(/<a class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)];
          const titleMatches = [...html.matchAll(/<a class="result__title[^"]*"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)];
          if (snippetMatches.length > 0) {
            const results = [];
            for (let i = 0; i < Math.min(snippetMatches.length, 5); i++) {
              let snippet = snippetMatches[i][1].replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#x27;/g, "'").trim();
              let title = titleMatches[i] ? titleMatches[i][2].replace(/<[^>]+>/g, "").trim() : "Informaci\xF3n web";
              let rawUrl = titleMatches[i] ? titleMatches[i][1] : "";
              let url = rawUrl;
              if (rawUrl.includes("uddg=")) {
                const match = rawUrl.match(/uddg=([^&]+)/);
                if (match) url = decodeURIComponent(match[1]);
              }
              if (snippet && snippet.length > 10) {
                results.push({ title, snippet, url });
              }
            }
            if (results.length > 0) {
              let introPrefix = "";
              if (isWeatherQuery) {
                introPrefix = isSpanish ? `Estuve consultando el reporte clim\xE1tico y los pron\xF3sticos m\xE1s recientes:` : `Here is the weather and forecast information I retrieved:`;
              } else if (isMovieQuery) {
                introPrefix = isSpanish ? `Estuve buscando las noticias sobre cine, carteleras y estrenos:` : `Here are the latest movie and cinema updates:`;
              } else {
                introPrefix = isSpanish ? `Estuve buscando informaci\xF3n sobre tu consulta en la web:` : `Here is the information I retrieved from the web:`;
              }
              const summaryText = `${introPrefix}

` + results.map((r) => `\u2022 **${r.title}**: ${r.snippet}`).join("\n\n");
              const sources = results.map((r) => ({ title: r.title, url: r.url })).filter((s) => s.url.startsWith("http"));
              res.json({
                success: true,
                summary: summaryText,
                sources: sources.slice(0, 3),
                provider: "duckduckgo_web_scrape"
              });
              return;
            }
          }
        }
      } catch (scrapeErr) {
        console.warn("DuckDuckGo HTML scrape fallback notice:", scrapeErr);
      }
      const wikiLang = isSpanish ? "es" : "en";
      const encodedQuery = encodeURIComponent(query.trim());
      const wikiUrl = `https://${wikiLang}.wikipedia.org/api/rest_v1/page/summary/${encodedQuery}`;
      try {
        const wikiRes = await fetch(wikiUrl);
        if (wikiRes.ok) {
          const wikiData = await wikiRes.json();
          if (wikiData.extract) {
            res.json({
              success: true,
              summary: wikiData.extract,
              sources: wikiData.content_urls?.desktop?.page ? [{ title: wikiData.title, url: wikiData.content_urls.desktop.page }] : [],
              provider: "wikipedia_free"
            });
            return;
          }
        }
      } catch (wikiErr) {
        console.warn("Wiki fallback failed:", wikiErr);
      }
      try {
        const ddgUrl = `https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_redirect=1&no_html=1`;
        const ddgRes = await fetch(ddgUrl);
        if (ddgRes.ok) {
          const ddgData = await ddgRes.json();
          if (ddgData.AbstractText) {
            res.json({
              success: true,
              summary: ddgData.AbstractText,
              sources: ddgData.AbstractURL ? [{ title: ddgData.Heading || query, url: ddgData.AbstractURL }] : [],
              provider: "duckduckgo_free"
            });
            return;
          }
        }
      } catch (ddgErr) {
        console.warn("DDG fallback failed:", ddgErr);
      }
      res.json({
        success: false,
        summary: "",
        sources: [],
        provider: "none"
      });
    } catch (err) {
      console.error("Error in /api/search:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });
  const adminSockets = /* @__PURE__ */ new Set();
  const userSessionSockets = /* @__PURE__ */ new Map();
  function broadcastToAdmins(payload) {
    const data = JSON.stringify(payload);
    adminSockets.forEach((ws) => {
      if (ws.readyState === import_ws.WebSocket.OPEN) {
        ws.send(data);
      }
    });
  }
  function broadcastToSession(sessionId, payload) {
    const data = JSON.stringify(payload);
    const set = userSessionSockets.get(sessionId);
    if (set) {
      set.forEach((ws) => {
        if (ws.readyState === import_ws.WebSocket.OPEN) {
          ws.send(data);
        }
      });
    }
  }
  app.get("/api/support/sessions", (req, res) => {
    seedSupportSessions();
    res.json({
      success: true,
      sessions: Array.from(supportSessions.values()),
      onlineStats: {
        adminsOnline: adminSockets.size,
        usersOnline: userSessionSockets.size
      }
    });
  });
  app.post("/api/support/message", (req, res) => {
    try {
      const { sessionId, text, sender = "admin", senderName = "Operador Aura" } = req.body || {};
      if (!sessionId || !text) {
        res.status(400).json({ error: "sessionId and text are required" });
        return;
      }
      const session = supportSessions.get(sessionId);
      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }
      const newMsg = {
        id: "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
        sessionId,
        sender,
        senderName,
        text,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "delivered"
      };
      session.messages.push(newMsg);
      session.lastMessage = text;
      session.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      if (sender === "user") {
        session.unreadAdminCount = (session.unreadAdminCount || 0) + 1;
      } else {
        session.unreadUserCount = (session.unreadUserCount || 0) + 1;
      }
      broadcastToAdmins({ type: "message:new", message: newMsg, sessionId });
      broadcastToSession(sessionId, { type: "message:new", message: newMsg, sessionId });
      res.json({ success: true, message: newMsg, session });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/support/status", (req, res) => {
    try {
      const { sessionId, status } = req.body || {};
      const session = supportSessions.get(sessionId);
      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }
      session.status = status;
      session.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      broadcastToAdmins({ type: "session:updated", session });
      broadcastToSession(sessionId, { type: "session:updated", session });
      res.json({ success: true, session });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/support/simulate", (req, res) => {
    try {
      const { name, question, topic } = req.body || {};
      const simNames = ["Camila S.", "Joaqu\xEDn P.", "Florencia M.", "Mariano G.", "Agustina T."];
      const simTopics = [
        "Consulta por tiempo de entrega y cobertura",
        "Duda sobre promociones 2x1 y cupones",
        "Cambio de horario para cita presencial",
        "Formas de pago con tarjeta de cr\xE9dito"
      ];
      const simQuestions = [
        "\xA1Hola! \xBFTienen disponibilidad para entregar en Palermo hoy antes de las 21:30?",
        "Buenas tardes, quer\xEDa consultar si aceptan transferencias y si tienen alguna promo activa.",
        "Hola soporte, \xBFpodr\xEDan verificar si se acredit\xF3 mi pago para el pedido?",
        "Hola! Quer\xEDa consultar disponibilidad para una consulta presencial esta semana."
      ];
      const clientName = name || simNames[Math.floor(Math.random() * simNames.length)];
      const clientTopic = topic || simTopics[Math.floor(Math.random() * simTopics.length)];
      const clientText = question || simQuestions[Math.floor(Math.random() * simQuestions.length)];
      const newId = "sess-" + Date.now();
      const newSession = {
        id: newId,
        userName: clientName,
        userEmail: clientName.toLowerCase().replace(/[^a-z]/g, "") + "@gmail.com",
        userPhone: "+54 9 11 " + Math.floor(1e3 + Math.random() * 9e3) + "-" + Math.floor(1e3 + Math.random() * 9e3),
        topic: clientTopic,
        status: "waiting",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        unreadAdminCount: 1,
        unreadUserCount: 0,
        lastMessage: clientText,
        origin: "P\xE1gina Web \xB7 Aura Chatbot",
        messages: [
          {
            id: "msg-" + Date.now(),
            sessionId: newId,
            sender: "user",
            senderName: clientName,
            text: clientText,
            timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            status: "delivered"
          }
        ]
      };
      supportSessions.set(newId, newSession);
      broadcastToAdmins({ type: "session:new", session: newSession });
      res.json({ success: true, session: newSession });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  const server = import_http.default.createServer(app);
  const wss = new import_ws.WebSocketServer({ server, path: "/ws/support" });
  wss.on("connection", (ws) => {
    let clientRole = "admin";
    let currentSessionId = null;
    ws.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        const { type } = data;
        if (type === "admin:init") {
          clientRole = "admin";
          adminSockets.add(ws);
          seedSupportSessions();
          ws.send(JSON.stringify({
            type: "init",
            sessions: Array.from(supportSessions.values()),
            onlineStats: {
              adminsOnline: adminSockets.size,
              usersOnline: userSessionSockets.size
            }
          }));
          broadcastToAdmins({
            type: "presence:update",
            onlineStats: {
              adminsOnline: adminSockets.size,
              usersOnline: userSessionSockets.size
            }
          });
        } else if (type === "user:init") {
          clientRole = "user";
          currentSessionId = data.sessionId || "sess-" + Date.now();
          if (!userSessionSockets.has(currentSessionId)) {
            userSessionSockets.set(currentSessionId, /* @__PURE__ */ new Set());
          }
          userSessionSockets.get(currentSessionId).add(ws);
          let session = supportSessions.get(currentSessionId);
          if (!session && data.sessionData) {
            session = {
              id: currentSessionId,
              userName: data.sessionData.userName || "Usuario Web",
              userEmail: data.sessionData.userEmail || "",
              userPhone: data.sessionData.userPhone || "",
              topic: data.sessionData.topic || "Consulta General",
              status: "waiting",
              createdAt: (/* @__PURE__ */ new Date()).toISOString(),
              updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
              unreadAdminCount: 1,
              unreadUserCount: 0,
              origin: data.sessionData.origin || "Chat Web",
              messages: []
            };
            supportSessions.set(currentSessionId, session);
            broadcastToAdmins({ type: "session:new", session });
          }
          ws.send(JSON.stringify({
            type: "session:ready",
            session: session || null
          }));
        } else if (type === "message:send") {
          const { sessionId, text, sender, senderName } = data;
          const session = supportSessions.get(sessionId);
          if (session && text) {
            const newMsg = {
              id: "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
              sessionId,
              sender: sender || clientRole,
              senderName: senderName || (sender === "admin" ? "Operador Aura" : session.userName),
              text,
              timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              status: "delivered"
            };
            session.messages.push(newMsg);
            session.lastMessage = text;
            session.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
            if (sender === "user") {
              session.unreadAdminCount = (session.unreadAdminCount || 0) + 1;
            } else {
              session.unreadUserCount = (session.unreadUserCount || 0) + 1;
            }
            broadcastToAdmins({ type: "message:new", message: newMsg, sessionId });
            broadcastToSession(sessionId, { type: "message:new", message: newMsg, sessionId });
          }
        } else if (type === "session:update_status") {
          const { sessionId, status } = data;
          const session = supportSessions.get(sessionId);
          if (session) {
            session.status = status;
            session.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
            broadcastToAdmins({ type: "session:updated", session });
            broadcastToSession(sessionId, { type: "session:updated", session });
          }
        } else if (type === "session:typing") {
          const { sessionId, sender, isTyping } = data;
          if (sender === "admin") {
            broadcastToSession(sessionId, { type: "typing", sender: "admin", isTyping, sessionId });
          } else {
            broadcastToAdmins({ type: "typing", sender: "user", isTyping, sessionId });
          }
        } else if (type === "session:simulate_incoming") {
          const names = ["Martina V.", "Federico G.", "Nicol\xE1s B.", "Paula D.", "Gonzalo R."];
          const queries = [
            "Hola, \xBFtienen disponibilidad de delivery para este pedido?",
            "Buenas tardes, quer\xEDa consultar si atienden consultas los s\xE1bados por la ma\xF1ana.",
            "Hola, \xBFaceptan pagos con tarjeta de d\xE9bito contra entrega?",
            "Hola! Quer\xEDa confirmar si mi turno para el viernes est\xE1 confirmado.",
            "\xBFCu\xE1nto demora el despacho hasta mi zona?"
          ];
          const newId = "sess-" + Date.now();
          const simName = names[Math.floor(Math.random() * names.length)];
          const simQuery = data.query || queries[Math.floor(Math.random() * queries.length)];
          const simSession = {
            id: newId,
            userName: simName,
            userEmail: simName.toLowerCase().replace(/[^a-z]/g, "") + "@gmail.com",
            userPhone: "+54 9 11 " + Math.floor(2e3 + Math.random() * 7e3) + "-00" + Math.floor(10 + Math.random() * 89),
            topic: "Consulta en tiempo real",
            status: "waiting",
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
            unreadAdminCount: 1,
            unreadUserCount: 0,
            lastMessage: simQuery,
            origin: "Aura Chat Widget (Live)",
            messages: [
              {
                id: "msg-" + Date.now(),
                sessionId: newId,
                sender: "user",
                senderName: simName,
                text: simQuery,
                timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                status: "delivered"
              }
            ]
          };
          supportSessions.set(newId, simSession);
          broadcastToAdmins({ type: "session:new", session: simSession });
        }
      } catch (e) {
        console.error("Error handling WebSocket message:", e);
      }
    });
    ws.on("close", () => {
      adminSockets.delete(ws);
      if (currentSessionId && userSessionSockets.has(currentSessionId)) {
        userSessionSockets.get(currentSessionId).delete(ws);
        if (userSessionSockets.get(currentSessionId).size === 0) {
          userSessionSockets.delete(currentSessionId);
        }
      }
      broadcastToAdmins({
        type: "presence:update",
        onlineStats: {
          adminsOnline: adminSockets.size,
          usersOnline: userSessionSockets.size
        }
      });
    });
  });
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} with WebSocket support on /ws/support`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
