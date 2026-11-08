/* ============================================================
   WineBOX.Clinic · Configuración del servidor
   ESTE ARCHIVO NO DEBE SUBIRSE A GIT (está en .gitignore)
   Contiene credenciales sensibles
   ============================================================ */
window.WB_CONFIG = {
  // Turso Edge Database
  turso: {
    url: 'https://winebox-clinic-mrwad.aws-sa-east-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwNjExMzAsImlkIjoiMDFhMTdhYzUtMjUwMS03OGZkLTg0YjEtNWVkYWE4NTgyZWY2Iiwia2lkIjoiSGpqYjE1N2ExUkZXSy0wN1hkWk1FUlY4TGhXSVBFNWpnRXhfT1M5RHd6MCIsInJpZCI6ImUxZTc3ZTliLTE0N2MtNGY4ZC1iNmVmLWM3NjFmNDgyYmUxNiJ9.X5N_smoFh1_81H39-WW_4aJ5N32GGKC8Af8PT9pOQ0Y3FhErK6X3VgIU-GSnemghuXUPcGADXrBb-TzhEwdLBQ'
  },
  // Servidor backend (opcional, para WebSocket y API REST)
  api: {
    url: null  // Dejar null si solo se usa Turso
  }
};

// Cuentas de acceso
window.WB_ACCOUNTS = {
  // Dueño/admin
  owner: {
    email: 'mrwad300@gmail.com',
    password: 'Freedos999#',
    name: 'Lic. Emanuel Chanampa',
    role: 'root',
    verified: true
  },
  // Root system (no cambiar)
  root: {
    email: 'root@winebox.clinic',
    password: 'Spiderman1447#',
    name: 'Root WineBOX',
    role: 'root'
  }
};
