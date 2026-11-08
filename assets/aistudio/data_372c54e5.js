/* ============================================================
   WineBOX Comunidad · Datos semilla (100% estático, sin PHP)
   Se cargan una sola vez en localStorage y luego el usuario
   puede editar todo desde la interfaz.
   Contraseña de todas las cuentas demo: demo1234
   ============================================================ */
window.WINEBOX_SEED = {
  version: 2,
  createdAt: '2026-10-26T03:00:00.000Z',

  users: [
    // Root del sistema
    { id: 'u-root', role: 'root', name: 'Root WineBOX', email: 'root@winebox.clinic', password: 'Spiderman1447#', city: 'CABA', createdAt: '2024-01-01T10:00:00.000Z', color: '#111827', avatarUrl: '', website: '', whatsapp: '', bio: 'Administración general de WineBOX Comunidad.', online: false, lastSeen: null, blocked: false },

    // DUEÑO REAL (no cambiar)
    { id: 'u-owner', role: 'root', name: 'Lic. Emanuel Chanampa', email: 'mrwad300@gmail.com', password: 'Freedos999#', city: 'CABA', createdAt: '2023-02-01T12:00:00.000Z', color: '#002045', avatarUrl: '', website: 'https://winebox.clinic', whatsapp: '5491166116631', bio: 'Director de WineBOX Clinic. Neuropsicólogo clínico.', online: false, lastSeen: null, blocked: false },

    // Demo pacientes (ficticios)
    { id: 'u-pat-1', role: 'patient', name: 'Sofía Martínez', email: 'sofia.martinez@example.com', password: 'Paciente1!', city: 'Buenos Aires', createdAt: '2025-03-11T12:00:00.000Z', color: '#7c5aa6', avatarUrl: '', website: '', whatsapp: '', bio: 'Estudiante de psicología buscando orientación.', headline: 'Estudiante', online: false, lastSeen: null, blocked: false },
    { id: 'u-pat-2', role: 'patient', name: 'Javier González', email: 'javier.gonzalez@example.com', password: 'Paciente2!', city: 'Rosario', createdAt: '2025-06-02T12:00:00.000Z', color: '#2e8b57', avatarUrl: '', website: '', whatsapp: '', bio: 'Padre buscando terapia para su hijo.', headline: 'Padre y trabajador', online: false, lastSeen: null, blocked: false },
    { id: 'u-pat-3', role: 'patient', name: 'Camila Torres', email: 'camila.torres@example.com', password: 'Paciente3!', city: 'Córdoba', createdAt: '2025-09-18T12:00:00.000Z', color: '#c0392b', avatarUrl: '', website: '', whatsapp: '', bio: 'Profesional buscando manejo de ansiedad.', headline: 'Abogada', online: false, lastSeen: null, blocked: false },
    { id: 'u-pat-4', role: 'patient', name: 'Nicolás López', email: 'nicolas.lopez@example.com', password: 'Paciente4!', city: 'Mendoza', createdAt: '2026-01-20T12:00:00.000Z', color: '#d4a017', avatarUrl: '', website: '', whatsapp: '', bio: 'Músico buscando apoyo en proceso creativo.', headline: 'Músico', online: false, lastSeen: null, blocked: false },

    // Demo psicólogos (ficticios)
    { id: 'u-psy-1', role: 'psy', name: 'Dra. Valentina Ríos', email: 'valentina.rios@example.com', password: 'Psy1234!', city: 'CABA', createdAt: '2023-05-10T12:00:00.000Z', color: '#17a589', avatarUrl: '', website: '', whatsapp: '5491155551234', bio: 'Ansiedad y pánico. TCC con base científica.', headline: 'Ansiedad · TCC', online: false, lastSeen: null, blocked: false },
    { id: 'u-psy-2', role: 'psy', name: 'Lic. Martín Suárez', email: 'martin.suarez@example.com', password: 'Psy1234!', city: 'Córdoba', createdAt: '2023-09-14T12:00:00.000Z', color: '#7c5aa6', avatarUrl: '', website: '', whatsapp: '5493515557788', bio: 'Infancia, adolescencia, autismo y TDAH.', headline: 'Infancia y adolescencia · TEA', online: false, lastSeen: null, blocked: false },
    { id: 'u-psy-3', role: 'psy', name: 'Dra. Carolina Díaz', email: 'carolina.diaz@example.com', password: 'Psy1234!', city: 'Rosario', createdAt: '2024-02-19T12:00:00.000Z', color: '#2e7d32', avatarUrl: '', website: '', whatsapp: '5493415552020', bio: 'Pareja y vínculos. Terapia sistémica.', headline: 'Pareja y vínculos', online: false, lastSeen: null, blocked: false },
    { id: 'u-psy-4', role: 'psy', name: 'Lic. Diego Herrera', email: 'diego.herrera@example.com', password: 'Psy1234!', city: 'La Plata', createdAt: '2024-04-03T12:00:00.000Z', color: '#c0392b', avatarUrl: '', website: '', whatsapp: '5492215559911', bio: 'Duelo, trauma y TEPT. EMDR.', headline: 'Duelo y trauma', online: false, lastSeen: null, blocked: false },
    { id: 'u-psy-5', role: 'psy', name: 'Lic. Andrea Molina', email: 'andrea.molina@example.com', password: 'Psy1234!', city: 'Mendoza', createdAt: '2024-08-22T12:00:00.000Z', color: '#f28705', avatarUrl: '', website: '', whatsapp: '5492615558899', bio: 'Trastornos alimentarios e imagen corporal.', headline: 'Trastornos alimentarios', online: false, lastSeen: null, blocked: false }
  ],

  psychs: [
    {
      id: 'psy-2', userId: 'u-owner', name: 'Lic. Emanuel Chanampa',
      headline: 'Neuropsicología clínica · TDAH, TEA y ansiedad en niños, adolescentes y adultos',
      bio: 'Soy neuropsicólogo clínico y director de WineBOX Clinic. Trabajo con evaluación neurocognitiva y entrenamiento de funciones ejecutivas usando estimulación de baja fidelidad visual: menos estímulo, más aprendizaje. Acompaño a personas con TDAH, TEA, ansiedad y fatiga mental, y a sus familias, con un plan claro y medible. Mi enfoque combina ciencia, tecnología y contención humana; cada proceso empieza con escuchar qué necesitás y termina con objetivos concretos para tu vida diaria.',
      specialties: ['TDAH', 'TEA / Autismo', 'Neuropsicología', 'Ansiedad y pánico'],
      approaches: ['Terapia Cognitivo-Conductual (TCC)', 'Neuropsicología', 'Estimulación cognitiva', 'Mindfulness'],
      modalities: ['presencial', 'online'],
      city: 'CABA', province: 'Ciudad de Buenos Aires', country: 'Argentina',
      address: 'Av. Corrientes 1386, Piso 8, CABA',
      mapQuery: 'Av. Corrientes 1386, Ciudad de Buenos Aires',
      languages: ['Español', 'Inglés'],
      license: 'MN 56.716 · MP 84.132',
      years: 15,
      degrees: [
        { title: 'Licenciatura en Psicología', institution: 'Universidad de Buenos Aires (UBA)', year: 2010 },
        { title: 'Especialización en Neuropsicología Clínica', institution: 'Hospital Italiano de Buenos Aires', year: 2014 },
        { title: 'Maestría en Neurociencias Cognitivas', institution: 'Universidad Favaloro', year: 2017 }
      ],
      certifications: [
        'Evaluación neuropsicológica infantil y de adultos (2016)',
        'Terapia Cognitivo-Conductual para TDAH (2018)',
        'Intervención en TEA desde un enfoque de derechos (2021)',
        'Formación en estimulación cognitiva de baja fidelidad visual (2022)'
      ],
      services: [
        { name: 'Evaluación neuropsicológica integral', price: 180000, duration: 90, note: 'Incluye entrevista, pruebas, informe y devolución' },
        { name: 'Consulta de orientación', price: 45000, duration: 50, note: 'Primera entrevista y plan de trabajo' },
        { name: 'Sesión de entrenamiento cognitivo', price: 38000, duration: 45 },
        { name: 'Sesión online', price: 38000, duration: 45, note: 'Misma modalidad, por videollamada' }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Mercado Pago', 'Tarjeta de débito'],
      coverage: ['OSDE', 'Swiss Medical', 'IOMA', 'Particular'],
      availability: [
        { days: 'Lunes a jueves', hours: '9:00 a 19:00' },
        { days: 'Viernes', hours: '9:00 a 14:00' },
        { days: 'Sábados', hours: 'Consultar disponibilidad' }
      ],
      whatsapp: '5491166116631',
      website: 'https://winebox.clinic',
      acceptingNew: true,
      verified: true,
      responseTime: 'menos de 24 h',
      createdAt: '2023-02-01T12:00:00.000Z'
    },
    {
      id: 'psy-1', userId: 'u-psy-1', name: 'Dra. Valentina Ríos',
      headline: 'Ansiedad, pánico y estrés · TCC con base científica, presencial en CABA y online',
      bio: 'Acompaño a personas que sienten que la ansiedad les está ordenando la vida: preocupación constante, ataques de pánico, miedo a salir o a quedarse sin control. Trabajo con Terapia Cognitivo-Conductual y exposición gradual, con tareas concretas entre sesiones y mucho espacio para lo que te pasa. Mi objetivo no es que dejes de sentir, sino que recuperes la capacidad de decidir. Atiendo adultos y adolescentes desde los 16 años.',
      specialties: ['Ansiedad y pánico', 'Estrés y burnout', 'Fobias'],
      approaches: ['Terapia Cognitivo-Conductual (TCC)', 'Terapia de exposición', 'Mindfulness', 'Terapia breve'],
      modalities: ['online', 'presencial'],
      city: 'CABA', province: 'Ciudad de Buenos Aires', country: 'Argentina',
      address: 'Av. Callao 1234, Piso 6, Recoleta, CABA',
      mapQuery: 'Av. Callao 1234, Ciudad de Buenos Aires',
      languages: ['Español', 'Inglés', 'Portugués'],
      license: 'MN 45.678',
      years: 12,
      degrees: [
        { title: 'Licenciatura en Psicología', institution: 'Universidad de Buenos Aires (UBA)', year: 2014 },
        { title: 'Especialización en Terapia Cognitivo-Conductual', institution: 'AATC', year: 2018 }
      ],
      certifications: [
        'Terapia de exposición y prevención de respuesta (2020)',
        'Mindfulness Based Stress Reduction (MBSR, 2021)',
        'Primeros auxilios psicológicos (2023)'
      ],
      services: [
        { name: 'Primera consulta de orientación', price: 32000, duration: 50 },
        { name: 'Sesión de psicoterapia', price: 30000, duration: 50 },
        { name: 'Sesión online', price: 28000, duration: 50 }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Mercado Pago', 'Efectivo'],
      coverage: ['OSDE', 'Swiss Medical', 'Particular'],
      availability: [
        { days: 'Lunes a jueves', hours: '9:00 a 20:00' },
        { days: 'Viernes', hours: '9:00 a 15:00' }
      ],
      whatsapp: '5491155551234',
      website: '',
      acceptingNew: true,
      verified: true,
      responseTime: 'menos de 24 h',
      createdAt: '2023-05-10T12:00:00.000Z'
    },
    {
      id: 'psy-3', userId: 'u-psy-2', name: 'Lic. Sofía Herrera',
      headline: 'Infancia y adolescencia · TEA y TDAH · Acompañamiento a familias',
      bio: 'Trabajo con niños, niñas y adolescentes, y sobre todo con sus familias. Me especializo en autismo y TDAH desde un enfoque de derechos: entender cómo funciona cada chico, adaptar el entorno y construir estrategias que se sostengan en casa y en la escuela. También acompaño procesos de diagnóstico y duelo por diagnósticos. Atiendo en Córdoba capital y por videollamada a todo el país.',
      specialties: ['TEA / Autismo', 'TDAH', 'Infancia y adolescencia', 'Orientación a familias'],
      approaches: ['Terapia Cognitivo-Conductual (TCC)', 'Modelo DIR/Floortime', 'Psicoeducación', 'Terapia sistémica'],
      modalities: ['presencial', 'online'],
      city: 'Córdoba', province: 'Córdoba', country: 'Argentina',
      address: 'Av. Hipólito Yrigoyen 456, Nueva Córdoba',
      mapQuery: 'Av. Hipólito Yrigoyen 456, Córdoba',
      languages: ['Español'],
      license: 'MP 12.345',
      years: 9,
      degrees: [
        { title: 'Licenciatura en Psicología', institution: 'Universidad Nacional de Córdoba', year: 2017 },
        { title: 'Especialización en Psicología del Desarrollo', institution: 'UNC', year: 2020 }
      ],
      certifications: [
        'Autismo y comunicación aumentativa (2021)',
        'Intervención conductual positiva en TDAH (2022)'
      ],
      services: [
        { name: 'Entrevista inicial con familia', price: 26000, duration: 60 },
        { name: 'Sesión con niño/as', price: 24000, duration: 45 },
        { name: 'Sesión online de orientación familiar', price: 22000, duration: 50 }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Mercado Pago'],
      coverage: ['Particular', 'Apross'],
      availability: [
        { days: 'Martes a viernes', hours: '10:00 a 18:00' },
        { days: 'Sábados', hours: '9:00 a 12:00' }
      ],
      whatsapp: '5493515557788',
      website: '',
      acceptingNew: true,
      verified: true,
      responseTime: '1 a 2 días',
      createdAt: '2023-09-14T12:00:00.000Z'
    },
    {
      id: 'psy-5', userId: 'u-psy-4', name: 'Lic. Camila Duarte',
      headline: 'Duelo, trauma y TEPT · EMDR · Presencial en La Plata y online',
      bio: 'Acompaño procesos de duelo, pérdidas y experiencias traumáticas. Sé que no hay recetas ni tiempos iguales: mi trabajo es construir un espacio seguro para que puedas acercarte a lo que duele sin desbordarte. Trabajo con EMDR y terapia centrada en trauma, y con una mirada de género. Atiendo adultos y adolescentes, también en modalidad online.',
      specialties: ['Duelo', 'Trauma y TEPT', 'Ansiedad y pánico'],
      approaches: ['EMDR', 'Terapia centrada en trauma', 'Terapia sistémica', 'Mindfulness'],
      modalities: ['presencial', 'online'],
      city: 'La Plata', province: 'Buenos Aires', country: 'Argentina',
      address: 'Calle 48 N° 567, La Plata',
      mapQuery: 'Calle 48 567, La Plata',
      languages: ['Español', 'Inglés'],
      license: 'MP 23.456',
      years: 8,
      degrees: [
        { title: 'Licenciatura en Psicología', institution: 'Universidad Nacional de La Plata', year: 2018 },
        { title: 'Posgrado en Psicotraumatología', institution: 'Asociación EMDR Argentina', year: 2021 }
      ],
      certifications: [
        'EMDR nivel II (2022)',
        'Duelo y pérdidas: abordaje clínico (2023)'
      ],
      services: [
        { name: 'Entrevista inicial', price: 25000, duration: 60 },
        { name: 'Sesión de psicoterapia', price: 23000, duration: 50 },
        { name: 'Sesión online', price: 22000, duration: 50 }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Mercado Pago', 'Efectivo'],
      coverage: ['IOMA', 'Particular'],
      availability: [
        { days: 'Lunes, miércoles y viernes', hours: '9:00 a 19:00' },
        { days: 'Martes y jueves', hours: '14:00 a 20:00' }
      ],
      whatsapp: '5492215559911',
      website: '',
      acceptingNew: true,
      verified: true,
      responseTime: 'menos de 48 h',
      createdAt: '2024-04-03T12:00:00.000Z'
    },
    {
      id: 'psy-4', userId: 'u-psy-3', name: 'Mg. Martín Salas',
      headline: 'Pareja y vínculos · Terapia sistémica · Rosario y online',
      bio: 'Atiendo parejas y personas que quieren entender sus vínculos. No busco culpables: busco patrones que se repiten y formas de salir de ellos. Trabajo con terapia sistémica y comunicación no violenta, en sesiones conjuntas e individuales. También acompaño decisiones de separación y recomposición familiar, con honestidad y sin apuro.',
      specialties: ['Pareja y vínculos', 'Sexualidad', 'Ansiedad y pánico'],
      approaches: ['Terapia sistémica', 'Comunicación no violenta', 'Terapia Cognitivo-Conductual (TCC)'],
      modalities: ['presencial', 'online'],
      city: 'Rosario', province: 'Santa Fe', country: 'Argentina',
      address: 'Córdoba 1234, Piso 3, Rosario',
      mapQuery: 'Córdoba 1234, Rosario',
      languages: ['Español', 'Inglés'],
      license: 'MP 34.567',
      years: 14,
      degrees: [
        { title: 'Licenciatura en Psicología', institution: 'Universidad Nacional de Rosario', year: 2010 },
        { title: 'Maestría en Terapia Familiar Sistémica', institution: 'UNR', year: 2016 }
      ],
      certifications: ['Terapia de pareja centrada en emociones (2020)', 'Comunicación no violenta (2021)'],
      services: [
        { name: 'Primera consulta de pareja', price: 42000, duration: 60 },
        { name: 'Sesión de pareja', price: 38000, duration: 60 },
        { name: 'Sesión individual online', price: 28000, duration: 50 }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Mercado Pago'],
      coverage: ['Particular'],
      availability: [
        { days: 'Lunes a jueves', hours: '13:00 a 21:00' },
        { days: 'Viernes', hours: '9:00 a 14:00' }
      ],
      whatsapp: '5493415552020',
      website: '',
      acceptingNew: true,
      verified: true,
      responseTime: '1 a 2 días',
      createdAt: '2024-02-19T12:00:00.000Z'
    },
    {
      id: 'psy-6', userId: 'u-psy-6', name: 'Lic. Joaquín Pereyra',
      headline: 'Adicciones y consumo problemático · Entrevista motivacional · Lanús y online',
      bio: 'Trabajo con personas que quieren cambiar su relación con el alcohol, la marihuana, la cocaína o las apuestas, y con sus familias. No moralizo: acompaño. Uso entrevista motivacional y prevención de recaídas, respetando el ritmo de cada proceso y articulando con grupos de apoyo cuando suma. Atiendo adolescentes y adultos, con confidencialidad absoluta.',
      specialties: ['Adicciones', 'Ansiedad y pánico', 'Infancia y adolescencia'],
      approaches: ['Entrevista motivacional', 'Prevención de recaídas', 'Terapia Cognitivo-Conductual (TCC)'],
      modalities: ['presencial', 'online'],
      city: 'Lanús', province: 'Buenos Aires', country: 'Argentina',
      address: 'Av. Hipólito Yrigoyen 2345, Lanús',
      mapQuery: 'Av. Hipólito Yrigoyen 2345, Lanús',
      languages: ['Español'],
      license: 'MP 45.678',
      years: 11,
      degrees: [
        { title: 'Licenciatura en Psicología', institution: 'Universidad de Buenos Aires (UBA)', year: 2013 },
        { title: 'Especialización en Consumo Problemático', institution: 'UBA', year: 2018 }
      ],
      certifications: ['Entrevista motivacional (2019)', 'Prevención de recaídas (2020)'],
      services: [
        { name: 'Entrevista inicial', price: 22000, duration: 50 },
        { name: 'Sesión de seguimiento', price: 20000, duration: 50 },
        { name: 'Orientación a familias', price: 20000, duration: 50 }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Efectivo'],
      coverage: ['Particular', 'Programa municipal'],
      availability: [
        { days: 'Lunes a viernes', hours: '14:00 a 21:00' },
        { days: 'Sábados', hours: '9:00 a 13:00' }
      ],
      whatsapp: '5491155553344',
      website: '',
      acceptingNew: false,
      verified: true,
      responseTime: '1 a 3 días',
      createdAt: '2024-08-22T12:00:00.000Z'
    },
    {
      id: 'psy-7', userId: 'u-psy-7', name: 'Dra. Renata Álvarez',
      headline: 'Trastornos alimentarios e imagen corporal · Mendoza y online',
      bio: 'Acompaño a personas con anorexia, bulimia, atracones y malestar con su imagen corporal, y a sus familias. Trabajo en red con nutrición y medicina, con un enfoque que no pone el cuerpo en el centro del problema. Mi prioridad es que recuperes una relación más amable con vos y con la comida, a tu ritmo y sin juicios.',
      specialties: ['Trastornos alimentarios', 'Depresión', 'Ansiedad y pánico'],
      approaches: ['Terapia Cognitivo-Conductual (TCC)', 'Terapia Dialéctico Conductual (DBT)', 'Psicoeducación'],
      modalities: ['presencial', 'online'],
      city: 'Mendoza', province: 'Mendoza', country: 'Argentina',
      address: 'Av. San Martín 789, Mendoza',
      mapQuery: 'Av. San Martín 789, Mendoza',
      languages: ['Español', 'Inglés'],
      license: 'MP 56.789',
      years: 10,
      degrees: [
        { title: 'Licenciatura en Psicología', institution: 'Universidad Nacional de Cuyo', year: 2015 },
        { title: 'Especialización en Trastornos de la Conducta Alimentaria', institution: 'UNCuyo', year: 2019 }
      ],
      certifications: ['DBT para trastornos alimentarios (2021)', 'Terapia basada en la familia (FBT, 2022)'],
      services: [
        { name: 'Entrevista inicial', price: 28000, duration: 60 },
        { name: 'Sesión de psicoterapia', price: 26000, duration: 50 },
        { name: 'Sesión online', price: 24000, duration: 50 }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Mercado Pago'],
      coverage: ['OSDE', 'Particular'],
      availability: [
        { days: 'Lunes a jueves', hours: '10:00 a 19:00' },
        { days: 'Viernes', hours: '10:00 a 14:00' }
      ],
      whatsapp: '5492615558899',
      website: '',
      acceptingNew: true,
      verified: true,
      responseTime: 'menos de 48 h',
      createdAt: '2024-11-09T12:00:00.000Z'
    },
    {
      id: 'psy-8', userId: 'u-psy-8', name: 'Lic. Tomás Ibarra',
      headline: 'Depresión y activación conductual · ACT · Online a todo el país',
      bio: 'Acompaño a personas que sienten que todo pesa, que perdieron el interés o la energía. Trabajo con activación conductual y Terapia de Aceptación y Compromiso: pequeños pasos, valores personales y menos exigencia. Atiendo solo online, lo que permite sostener el proceso desde donde estés, con horarios flexibles.',
      specialties: ['Depresión', 'Estrés y burnout', 'Ansiedad y pánico'],
      approaches: ['Terapia de Aceptación y Compromiso (ACT)', 'Activación conductual', 'Mindfulness'],
      modalities: ['online'],
      city: 'Mar del Plata', province: 'Buenos Aires', country: 'Argentina',
      address: 'Solo modalidad online (base en Mar del Plata)',
      mapQuery: 'Mar del Plata, Buenos Aires',
      languages: ['Español'],
      license: 'MP 67.890',
      years: 6,
      degrees: [
        { title: 'Licenciatura en Psicología', institution: 'Universidad Nacional de Mar del Plata', year: 2019 },
        { title: 'Formación en Terapia de Aceptación y Compromiso', institution: 'ACBS Argentina', year: 2022 }
      ],
      certifications: ['Activación conductual para depresión (2021)', 'ACT aplicada a ansiedad y depresión (2023)'],
      services: [
        { name: 'Primera consulta online', price: 18000, duration: 50 },
        { name: 'Sesión online', price: 16000, duration: 50 }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Mercado Pago'],
      coverage: ['Particular'],
      availability: [
        { days: 'Lunes a viernes', hours: '10:00 a 20:00' },
        { days: 'Sábados', hours: '10:00 a 13:00' }
      ],
      whatsapp: '5492235551122',
      website: '',
      acceptingNew: true,
      verified: true,
      responseTime: 'menos de 24 h',
      createdAt: '2025-07-15T12:00:00.000Z'
    },
    {
      id: 'psy-9', userId: 'u-psy-9', name: 'Lic. Agustina López',
      headline: 'Psicología perinatal · Maternidad, paternidad y puerperio · CABA y online',
      bio: 'Acompaño el camino hacia la maternidad y la paternidad, el embarazo, el puerperio y también las pérdidas gestacionales. Es una etapa que suele idealizarse y que muchas veces duele, asusta o agota. Ofrezco un espacio para hablar de lo que no se dice, con información y sin juicio, coordinando con obstetricia y pediatría cuando hace falta.',
      specialties: ['Perinatal', 'Depresión', 'Duelo'],
      approaches: ['Terapia Cognitivo-Conductual (TCC)', 'Psicoeducación', 'Terapia centrada en trauma'],
      modalities: ['presencial', 'online'],
      city: 'CABA', province: 'Ciudad de Buenos Aires', country: 'Argentina',
      address: 'Av. Santa Fe 2345, Piso 4, CABA',
      mapQuery: 'Av. Santa Fe 2345, Ciudad de Buenos Aires',
      languages: ['Español', 'Inglés'],
      license: 'MN 78.901',
      years: 4,
      degrees: [
        { title: 'Licenciatura en Psicología', institution: 'Universidad de Buenos Aires (UBA)', year: 2021 },
        { title: 'Posgrado en Psicología Perinatal', institution: 'Universidad de Buenos Aires', year: 2024 }
      ],
      certifications: ['Psicología perinatal y puerperio (2024)', 'Duelo gestacional y perinatal (2025)'],
      services: [
        { name: 'Primera consulta', price: 24000, duration: 50 },
        { name: 'Sesión de psicoterapia', price: 24000, duration: 50 },
        { name: 'Sesión online', price: 22000, duration: 50 }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Mercado Pago'],
      coverage: ['Particular'],
      availability: [
        { days: 'Martes y jueves', hours: '9:00 a 18:00' },
        { days: 'Miércoles', hours: '14:00 a 20:00' }
      ],
      whatsapp: '5491155557788',
      website: '',
      acceptingNew: true,
      verified: true,
      responseTime: 'menos de 48 h',
      createdAt: '2026-02-01T12:00:00.000Z'
    }
  ],

  questions: [
    {
      id: 'q-1', authorId: 'u-pat-1', category: 'Ansiedad',
      title: '¿Cómo sé si mi ansiedad necesita tratamiento o es solo estrés?',
      body: 'Hace meses que me despierto con el pecho apretado y pienso en todo lo que puede salir mal. Funciono en el trabajo, pero vivo cansada y evito juntadas. No sé si exagero o si debería consultar. ¿Cómo se distingue el estrés normal de un cuadro de ansiedad que necesita ayuda?',
      tags: ['ansiedad', 'estrés', 'diagnóstico'],
      createdAt: '2026-10-12T14:20:00.000Z',
      views: 214, status: 'answered',
      answers: [
        {
          id: 'a-1', psyId: 'psy-1',
          body: 'Lo que describís merece atención, no porque "exageres", sino porque ya está afectando tu descanso, tu energía y tus vínculos. La diferencia práctica entre estrés y ansiedad clínica no es la intensidad de un día, sino la duración (semanas o meses), la interferencia en la vida diaria y la evitación: cuando empezás a dejar de hacer cosas para no sentir malestar.\n\nTres señales que suelen justificar una consulta: el cuerpo se activa sin un peligro real (pecho apretado, insomnio, contracturas), la preocupación es difícil de frenar aunque sepas que no ayuda, y la evitación crece. No hace falta estar "al límite" para pedir ayuda. Una primera entrevista sirve justamente para eso: ordenar lo que pasa y decidir juntos si es un acompañamiento breve o un tratamiento.',
          createdAt: '2026-10-12T18:05:00.000Z', upvotes: ['u-pat-2', 'u-pat-3', 'u-pat-4'], accepted: true
        },
        {
          id: 'a-2', psyId: 'psy-4',
          body: 'Sumo una idea: la ansiedad no se mide solo por lo que sentís, sino por cuánto espacio ocupa. Si organizás el día alrededor de evitar la angustia, ya hay un dato importante. Consultar temprano suele ahorrar sufrimiento y tiempo.',
          createdAt: '2026-10-13T11:00:00.000Z', upvotes: ['u-pat-1'], accepted: false
        }
      ]
    },
    {
      id: 'q-2', authorId: 'u-pat-2', category: 'TDAH',
      title: 'Mi hijo de 9 años no puede quedarse quieto en clase. ¿Es TDAH o es inmadurez?',
      body: 'La maestra dice que se distrae, se para, interrumpe y pierde los útiles. En casa también le cuesta terminar la tarea. Un pediatra nos dijo que "ya va a madurar", pero nosotros vemos que sufre. ¿Qué evaluación conviene hacer y a qué edad se puede diagnosticar?',
      tags: ['TDAH', 'infancia', 'escuela'],
      createdAt: '2026-10-10T10:00:00.000Z',
      views: 389, status: 'answered',
      answers: [
        {
          id: 'a-3', psyId: 'psy-2',
          body: 'A los 9 años ya se puede hacer una evaluación seria. La clave no es un cuestionario aislado, sino un proceso: entrevista con ustedes, información de la escuela, observación clínica y pruebas que midan atención, memoria de trabajo e impulsividad. También hay que descartar otras causas (sueño, audición, ansiedad, dificultades de aprendizaje), porque no todo lo que parece TDAH lo es.\n\nEl diagnóstico no busca etiquetar, busca explicar para poder ayudar. Si se confirma, el abordaje combina pautas concretas en casa y escuela, entrenamiento de funciones ejecutivas y, cuando hace falta, evaluación médica. No esperen a que "madure" si hay sufrimiento: una consulta no compromete a nada y ordena el panorama.',
          createdAt: '2026-10-10T15:30:00.000Z', upvotes: ['u-pat-1', 'u-pat-3', 'u-pat-4'], accepted: true
        },
        {
          id: 'a-4', psyId: 'psy-3',
          body: 'Agrego que la escuela suele necesitar orientaciones concretas: ubicación en el aula, consignas cortas, tiempos de movimiento planificados. Eso se puede trabajar junto con la familia y el equipo escolar, incluso antes de tener el diagnóstico cerrado.',
          createdAt: '2026-10-11T09:15:00.000Z', upvotes: ['u-pat-2'], accepted: false
        }
      ]
    },
    {
      id: 'q-3', authorId: 'u-pat-3', category: 'TEA / Autismo',
      title: 'Me diagnosticaron autismo a los 34 años y no sé cómo seguir',
      body: 'Después de años de sentirme "rara", una evaluación me dio el diagnóstico de TEA nivel 1. Siento alivio, pero también enojo y tristeza por todo lo que sufrí sin entender. No sé si buscar terapia, un grupo o simplemente leer. ¿Qué suele ayudar en el posdiagnóstico en adultos?',
      tags: ['autismo', 'adultos', 'posdiagnóstico'],
      createdAt: '2026-10-08T20:00:00.000Z',
      views: 512, status: 'answered',
      answers: [
        {
          id: 'a-5', psyId: 'psy-3',
          body: 'Lo que sentís es muy común y válido: el diagnóstico en la adultez suele traer alivio y duelo a la vez. El posdiagnóstico no es un manual único; es reconstruir tu historia con otra lectura. Suele ayudar: psicoeducación sobre autismo (para entender energía, sobrecarga y masking), un espacio terapéutico para procesar el pasado y estrategias concretas de regulación y comunicación.\n\nTambién ayuda mucho la comunidad: grupos de personas autistas adultas, no solo de familias. Y algo importante: no tenés que "entrenarte" para parecer neurotípico. El objetivo es que tu vida sea más habitable, no más disimulada. Si querés, puedo orientarte sobre cómo elegir el enfoque terapéutico.',
          createdAt: '2026-10-09T12:40:00.000Z', upvotes: ['u-pat-1', 'u-pat-2', 'u-pat-4'], accepted: true
        }
      ]
    },
    {
      id: 'q-4', authorId: 'u-pat-1', category: 'Depresión',
      title: 'Perdí las ganas de todo y me cuesta levantarme. ¿Es depresión?',
      body: 'Hace dos meses no disfruto nada, duermo mal, como poco y me siento culpable por no rendir. A veces pienso que sería más fácil desaparecer, aunque no tengo un plan. ¿Cómo empiezo? Me da vergüenza contar esto.',
      tags: ['depresión', 'desánimo'],
      createdAt: '2026-10-14T08:00:00.000Z',
      views: 167, status: 'answered',
      answers: [
        {
          id: 'a-6', psyId: 'psy-8',
          body: 'Gracias por animarte a escribirlo. Lo que contás encaja con síntomas depresivos y, sobre todo, con un nivel de sufrimiento que merece acompañamiento. La vergüenza es parte del cuadro, no una prueba de que exagerás. Empezar puede ser tan simple como una consulta: no tenés que tener todo claro ni contar todo de una vez.\n\nImportante: si en algún momento aparece la idea de lastimarte o de desaparecer, busá ayuda inmediata (guardia, línea de crisis 135 en CABA o 911). No estás solo/a. Con tratamiento, la depresión es una de las condiciones con mejor respuesta; la activación conductual, por ejemplo, propone pasos muy pequeños y sostenibles.',
          createdAt: '2026-10-14T13:10:00.000Z', upvotes: ['u-pat-2', 'u-pat-3'], accepted: false
        }
      ]
    },
    {
      id: 'q-5', authorId: 'u-pat-4', category: 'Duelo',
      title: 'Murió mi mamá hace 3 meses y siento que debería estar mejor',
      body: 'Todos me dicen que la vida sigue, que tengo que ser fuerte por mi familia. Extraño su voz todos los días y me enoja que el mundo siga. ¿Cuánto dura un duelo? ¿Cuándo conviene pedir ayuda?',
      tags: ['duelo', 'pérdida', 'familia'],
      createdAt: '2026-10-05T16:30:00.000Z',
      views: 298, status: 'answered',
      answers: [
        {
          id: 'a-7', psyId: 'psy-5',
          body: 'No hay un plazo estándar y la frase "deberías estar mejor" no ayuda. El duelo no es una línea recta: hay días en que el dolor vuelve con fuerza y eso no significa retroceder. A los tres meses es esperable extrañar, enojarse y sentir que el mundo no tiene sentido.\n\nConviene consultar si el dolor te impide sostener lo básico (dormir, comer, trabajar), si aparece aislamiento prolongado, culpa intensa, o si sentís que no podés acercarte a nada de lo que vivieron. No hace falta esperar a "tocar fondo". Un espacio de duelo no borra la pérdida: te acompaña a que tenga un lugar sin que te desarme.',
          createdAt: '2026-10-06T10:00:00.000Z', upvotes: ['u-pat-1', 'u-pat-2'], accepted: true
        }
      ]
    },
    {
      id: 'q-6', authorId: 'u-pat-2', category: 'Pareja',
      title: 'Discutimos siempre por lo mismo y ya no sé si es la relación o nosotros',
      body: 'Con mi pareja tenemos peleas que empiezan por cualquier cosa y terminan en silencio. Nos queremos, pero estamos cansados. ¿La terapia de pareja sirve si uno de los dos está más dispuesto que el otro?',
      tags: ['pareja', 'comunicación', 'conflicto'],
      createdAt: '2026-10-11T19:00:00.000Z',
      views: 145, status: 'answered',
      answers: [
        {
          id: 'a-8', psyId: 'psy-4',
          body: 'Sí, sirve, aunque conviene hablar de expectativas: la terapia no "arregla" a la otra persona. Trabaja con el patrón que se arma entre los dos: quién persigue, quién se cierra, qué se dice sin decir. Con que ambos puedan sostener las sesiones y estén dispuestos a mirar su parte, ya hay margen.\n\nSi uno no quiere ir, una consulta individual también ayuda a ordenar qué necesitás y cómo plantear el tema sin que suene a ultimátum. La pelea repetida suele ser una puerta de entrada a algo más de fondo; no es fracaso, es información.',
          createdAt: '2026-10-12T09:30:00.000Z', upvotes: ['u-pat-3'], accepted: false
        }
      ]
    },
    {
      id: 'q-7', authorId: 'u-pat-3', category: 'Ansiedad',
      title: 'Me da terror hablar en público y lo evito siempre. ¿Tiene tratamiento?',
      body: 'En reuniones o exposiciones siento que me voy a desmayar, me tiembla la voz y me quedo en blanco. Ya rechacé dos ascensos por miedo. Quiero trabajarlo, pero no sé si la terapia alcanza.',
      tags: ['fobia social', 'ansiedad', 'trabajo'],
      createdAt: '2026-10-18T11:00:00.000Z',
      views: 96, status: 'open',
      answers: []
    },
    {
      id: 'q-8', authorId: 'u-pat-4', category: 'Orientación',
      title: '¿Cómo elijo psicólogo sin gastar una fortuna en pruebas?',
      body: 'Veo perfiles muy distintos y no sé cómo comparar. ¿Conviene mirar la orientación teórica, los años, el precio? ¿Cuántas sesiones debería darle antes de decidir si me sirve?',
      tags: ['elegir terapeuta', 'honorarios'],
      createdAt: '2026-10-16T10:00:00.000Z',
      views: 231, status: 'answered',
      answers: [
        {
          id: 'a-9', psyId: 'psy-1',
          body: 'Mi recomendación práctica: elegí por problema y modalidad, no por "prestigio". Mirá si el perfil trabaja con lo que te pasa, si atiende online o presencial como necesitás, y si el precio es sostenible en el tiempo. La orientación teórica importa menos al inicio que la sensación de que podés hablar sin ser juzgado.\n\nSobre cuánto esperar: una primera entrevista ya te dice mucho. Si después de 3 o 4 sesiones no sentís rumbo ni confianza, es válido plantearlo o cambiar. Un buen profesional no se ofende: el proceso es tuyo. Y si el dinero es un límite, preguntá por honorarios diferenciales o instituciones con servicio social antes de descartar la ayuda.',
          createdAt: '2026-10-16T15:20:00.000Z', upvotes: ['u-pat-1', 'u-pat-2'], accepted: true
        }
      ]
    },
    {
      id: 'q-9', authorId: 'u-pat-1', category: 'Ansiedad',
      title: 'Insomnio desde que empecé un trabajo nuevo: ¿pastillas o terapia?',
      body: 'Me acuesto y la cabeza no para. Duermo 4 horas y rindo mal. Un conocido me recomendó melatonina y otro, ansiolíticos. ¿Qué es lo primero que debería hacer?',
      tags: ['insomnio', 'trabajo', 'ansiedad'],
      createdAt: '2026-10-19T22:00:00.000Z',
      views: 74, status: 'answered',
      answers: [
        {
          id: 'a-10', psyId: 'psy-2',
          body: 'La melatonina no es un ansiolítico y los ansiolíticos requieren indicación médica: no los tomes por recomendación de conocidos. Antes de medicar, conviene ordenar el sueño: horarios estables, luz y pantallas, cafeína, y sobre todo bajar la activación mental al acostarte (respiración, escritura de pendientes).\n\nSi el insomnio se sostiene más de tres semanas y afecta tu día, una consulta con psicología (terapia cognitivo-conductual para insomnio, que es el tratamiento de primera línea) y, si hace falta, con medicina del sueño. La ansiedad y el insomnio suelen retroalimentarse; tratarlos juntos ahorra tiempo.',
          createdAt: '2026-10-20T09:00:00.000Z', upvotes: ['u-pat-3'], accepted: false
        }
      ]
    },
    {
      id: 'q-10', authorId: 'u-pat-2', category: 'Infancia y adolescencia',
      title: 'Mi hija de 13 años está siendo hostigada en el colegio. ¿Cómo la ayudo?',
      body: 'Se aísla, no quiere ir a clases y llora de noche. La escuela dice que "son cosas de chicos". Quiero hacer algo sin empeorar la situación. ¿Qué puedo hacer como madre/padre y cuándo buscar ayuda profesional?',
      tags: ['bullying', 'adolescencia', 'escuela'],
      createdAt: '2026-10-20T18:00:00.000Z',
      views: 58, status: 'open',
      answers: []
    },
    {
      id: 'q-11', authorId: 'u-pat-3', category: 'Trauma y TEPT',
      title: 'Después de un asalto no puedo dormir ni salir sola. ¿Es TEPT?',
      body: 'Fue hace dos meses. Evito el lugar, me sobresalto con cualquier ruido y revivo la escena. Sé que no es "normal", pero me da miedo que me digan que exagero. ¿Cómo es un tratamiento para trauma?',
      tags: ['trauma', 'TEPT', 'miedo'],
      createdAt: '2026-10-09T22:00:00.000Z',
      views: 203, status: 'answered',
      answers: [
        {
          id: 'a-11', psyId: 'psy-5',
          body: 'Lo que describís es consistente con una reacción de estrés postraumático: reexperimentación, evitación e hipervigilancia. No exagerás; tu cuerpo está intentando protegerte. Lo importante es que tiene tratamiento y que no hace falta esperar a que "pase solo".\n\nLos abordajes con más evidencia (TCC centrada en trauma, EMDR) trabajan de forma gradual y segura, sin obligarte a revivir todo de golpe. Si te da miedo empezar, se puede iniciar con estabilización y regulación antes de procesar el recuerdo. Buscá un profesional con formación específica en trauma; si podés, contale esto tal cual lo escribiste acá.',
          createdAt: '2026-10-10T11:30:00.000Z', upvotes: ['u-pat-1', 'u-pat-4'], accepted: true
        }
      ]
    },
    {
      id: 'q-12', authorId: 'u-pat-4', category: 'Orientación',
      title: '¿La terapia online funciona igual que la presencial?',
      body: 'Vivo en una ciudad chica y me da miedo que me vean yendo al psicólogo. La verdad es que me resultaría mucho más fácil hacerlo por videollamada, pero no sé si sirve de verdad.',
      tags: ['terapia online', 'privacidad'],
      createdAt: '2026-10-02T12:00:00.000Z',
      views: 176, status: 'answered',
      answers: [
        {
          id: 'a-12', psyId: 'psy-8',
          body: 'Sí, para una amplia variedad de problemas la terapia online tiene resultados comparables a la presencial. Funciona mejor cuando hay un encuadre claro: mismo día y horario, lugar privado, buena conexión y un acuerdo sobre qué hacer si la llamada se corta.\n\nLa privacidad es una ventaja concreta en tu caso. También te permite elegir profesionales de otras ciudades. Lo que no reemplaza es la urgencia o ciertas evaluaciones que requieren presencia. Si te da miedo "que te vean", eso mismo se puede hablar en la primera sesión: la confidencialidad es parte del trabajo.',
          createdAt: '2026-10-03T10:00:00.000Z', upvotes: ['u-pat-1', 'u-pat-2', 'u-pat-3'], accepted: true
        }
      ]
    }
  ],

  reviews: [
    { id: 'r-1', psyId: 'psy-1', patientId: 'u-pat-1', rating: 5, comment: 'Valentina me dio herramientas concretas desde la primera sesión. Sentí que me escuchaba de verdad y que el plan tenía sentido. Me cambió la relación con la ansiedad.', createdAt: '2026-08-14T12:00:00.000Z' },
    { id: 'r-2', psyId: 'psy-1', patientId: 'u-pat-2', rating: 5, comment: 'Muy clara explicando, puntual y cálida. La modalidad online funcionó perfecto.', createdAt: '2026-07-02T12:00:00.000Z' },
    { id: 'r-3', psyId: 'psy-1', patientId: 'u-pat-4', rating: 4, comment: 'Excelente profesional. A veces las sesiones se pasan rápido, pero el acompañamiento es muy bueno.', createdAt: '2026-05-20T12:00:00.000Z' },
    { id: 'r-4', psyId: 'psy-2', patientId: 'u-pat-2', rating: 5, comment: 'La evaluación de mi hijo fue muy completa y la devolución fue clara, sin tecnicismos. El plan de estimulación nos ordenó la casa.', createdAt: '2026-09-03T12:00:00.000Z' },
    { id: 'r-5', psyId: 'psy-2', patientId: 'u-pat-3', rating: 5, comment: 'Después de años de diagnósticos a medias, acá entendí qué me pasaba. Trato humano y riguroso.', createdAt: '2026-06-18T12:00:00.000Z' },
    { id: 'r-6', psyId: 'psy-2', patientId: 'u-pat-1', rating: 5, comment: 'Las sesiones online son muy dinámicas. Recomiendo especialmente para TDAH adulto.', createdAt: '2026-04-11T12:00:00.000Z' },
    { id: 'r-7', psyId: 'psy-2', patientId: 'u-pat-4', rating: 4, comment: 'Muy buen profesional. La espera para el turno fue de dos semanas, pero valió la pena.', createdAt: '2026-03-02T12:00:00.000Z' },
    { id: 'r-8', psyId: 'psy-3', patientId: 'u-pat-2', rating: 5, comment: 'Sofía acompañó a mi hija y a toda la familia. Nos dio estrategias para la escuela que realmente funcionaron.', createdAt: '2026-08-22T12:00:00.000Z' },
    { id: 'r-9', psyId: 'psy-3', patientId: 'u-pat-3', rating: 5, comment: 'Un espacio seguro y sin juicios. Muy recomendable.', createdAt: '2026-05-09T12:00:00.000Z' },
    { id: 'r-10', psyId: 'psy-3', patientId: 'u-pat-4', rating: 4, comment: 'Muy buena escucha. Solo online, la conexión a veces falló, pero lo resolvimos.', createdAt: '2026-02-27T12:00:00.000Z' },
    { id: 'r-11', psyId: 'psy-4', patientId: 'u-pat-2', rating: 5, comment: 'Nos ayudó a salir de la pelea repetida. Las herramientas de comunicación nos cambiaron la semana.', createdAt: '2026-07-30T12:00:00.000Z' },
    { id: 'r-12', psyId: 'psy-4', patientId: 'u-pat-4', rating: 5, comment: 'Directo, honesto y muy respetuoso. Recomendado para terapia de pareja.', createdAt: '2026-06-05T12:00:00.000Z' },
    { id: 'r-13', psyId: 'psy-4', patientId: 'u-pat-1', rating: 3, comment: 'Buen profesional, aunque el enfoque no era lo que yo buscaba. Me derivó con criterio.', createdAt: '2026-03-19T12:00:00.000Z' },
    { id: 'r-14', psyId: 'psy-5', patientId: 'u-pat-4', rating: 5, comment: 'Camila me acompañó en el duelo por mi mamá con una sensibilidad enorme. No me apuró nunca.', createdAt: '2026-08-01T12:00:00.000Z' },
    { id: 'r-15', psyId: 'psy-5', patientId: 'u-pat-3', rating: 5, comment: 'El trabajo con EMDR me ayudó a dormir después del asalto. Muy agradecida.', createdAt: '2026-05-14T12:00:00.000Z' },
    { id: 'r-16', psyId: 'psy-5', patientId: 'u-pat-1', rating: 2, comment: 'La profesional es cálida, pero no me sentí cómoda con la modalidad online y la frecuencia de sesiones.', createdAt: '2026-01-22T12:00:00.000Z' },
    { id: 'r-17', psyId: 'psy-6', patientId: 'u-pat-3', rating: 5, comment: 'Joaquín me acompañó sin juzgarme. La entrevista motivacional me ayudó a decidir por mí, no por presión.', createdAt: '2026-06-12T12:00:00.000Z' },
    { id: 'r-18', psyId: 'psy-6', patientId: 'u-pat-4', rating: 5, comment: 'Muy claro con los límites y con la familia. Gracias.', createdAt: '2026-04-02T12:00:00.000Z' },
    { id: 'r-19', psyId: 'psy-6', patientId: 'u-pat-2', rating: 2, comment: 'No logramos coordinar horarios y las sesiones se suspendieron varias veces. La atención humana estuvo bien.', createdAt: '2026-02-10T12:00:00.000Z' },
    { id: 'r-20', psyId: 'psy-7', patientId: 'u-pat-1', rating: 5, comment: 'Renata es muy profesional y cuidadosa. El trabajo en red con la nutricionista fue clave.', createdAt: '2026-07-08T12:00:00.000Z' },
    { id: 'r-21', psyId: 'psy-7', patientId: 'u-pat-2', rating: 1, comment: 'No fue lo que esperaba: sentí que la sesión se centró en el peso y no en lo que yo necesitaba. No volvería.', createdAt: '2026-03-27T12:00:00.000Z' },
    { id: 'r-22', psyId: 'psy-8', patientId: 'u-pat-1', rating: 4, comment: 'Tomás es muy respetuoso y las sesiones online son cómodas. Me ayudó a retomar pequeñas rutinas.', createdAt: '2026-09-16T12:00:00.000Z' },
    { id: 'r-23', psyId: 'psy-9', patientId: 'u-pat-3', rating: 5, comment: 'Me acompañó en el posparto con mucha calidez y información clara. Muy recomendable.', createdAt: '2026-10-01T12:00:00.000Z' }
  ],

  publications: [
    {
      id: 'pub-1', psyId: 'psy-2', type: 'article', category: 'TDAH',
      title: 'Estimulación de baja fidelidad visual: por qué menos estímulo es más',
      summary: 'Qué es la baja fidelidad visual, por qué ayuda en TDAH y TEA, y cómo se usa clínicamente sin convertirlo en una moda.',
      body: 'La expresión "baja fidelidad visual" no significa baja calidad: significa reducir la cantidad de estímulos irrelevantes que compiten por la atención. En pantallas saturadas, el cerebro con TDAH gasta energía filtrando ruido antes de poder concentrarse en la tarea.\n\nEn WineBOX trabajamos con juegos clásicos y consolas de interfaz simple. La evidencia no viene del juego en sí, sino del encuadre: objetivos claros, sesiones cortas, dificultad progresiva y un adulto que observa y registra. El juego es el contexto; el entrenamiento es la intención.\n\nTres criterios para que funcione: (1) el estímulo debe ser predecible y visualmente limpio; (2) la sesión debe tener inicio y fin, con una duración acordada; (3) debe haber una devolución, no solo tiempo de pantalla. Sin esos tres elementos, cualquier juego es solo entretenimiento.\n\nLa estimulación no reemplaza el tratamiento integral ni la medicación cuando está indicada. Es una herramienta más, y como toda herramienta, funciona cuando hay un plan.',
      createdAt: '2026-09-02T12:00:00.000Z', likes: ['u-pat-1', 'u-pat-2', 'u-pat-3'], url: ''
    },
    {
      id: 'pub-2', psyId: 'psy-2', type: 'ebook', category: 'Ansiedad',
      title: 'El arte de la calma: protocolo breve para crisis de ansiedad',
      summary: 'Un ebook gratuito con el protocolo de 5 pasos para atravesar una crisis de ansiedad y regular el cuerpo.',
      body: 'Este ebook reúne el protocolo que usamos en consultorio para las crisis de ansiedad: reconocer lo que pasa, bajar la activación fisiológica, anclar la atención y planificar el después. Está escrito para leer en cualquier momento, incluso durante una crisis, con lenguaje simple y ejercicios de pocos minutos.',
      createdAt: '2026-08-10T12:00:00.000Z', likes: ['u-pat-1', 'u-pat-4'], url: '../calma/'
    },
    {
      id: 'pub-3', psyId: 'psy-1', type: 'article', category: 'Ansiedad',
      title: 'Ansiedad: cómo distinguirla de la preocupación cotidiana',
      summary: 'Cinco señales que ayudan a decidir cuándo consultar, sin alarmismo ni minimización.',
      body: 'Preocuparse es normal y hasta útil. La ansiedad se vuelve un problema cuando la preocupación es difícil de controlar, dura semanas y empieza a ordenar tus decisiones: qué evitás, a dónde no vas, cuánto dormís.\n\nCinco señales para consultar: el cuerpo se activa sin peligro real; el sueño se rompe; la evitación crece; la preocupación consume más de una hora por día; y aparece la sensación de que "no podés sola/o".\n\nNo hace falta tener un diagnóstico para empezar terapia. Una primera entrevista es un espacio para ordenar, no una prueba que hay que aprobar.',
      createdAt: '2026-09-20T12:00:00.000Z', likes: ['u-pat-2', 'u-pat-3'], url: ''
    },
    {
      id: 'pub-4', psyId: 'psy-3', type: 'ebook', category: 'TEA / Autismo',
      title: 'Guía para familias: acompañar a un hijo o hija autista',
      summary: 'Pautas cotidianas para casa y escuela, desde un enfoque de derechos y sin recetas mágicas.',
      body: 'Una guía pensada para familias que reciben un diagnóstico y no saben por dónde empezar. Explica qué es el autismo sin mitos, cómo leer la conducta como comunicación, cómo adaptar rutinas y cómo dialogar con la escuela. Incluye un apartado sobre el cuidado de los cuidadores.',
      createdAt: '2026-07-15T12:00:00.000Z', likes: ['u-pat-2', 'u-pat-4'], url: '../kids/'
    },
    {
      id: 'pub-5', psyId: 'psy-5', type: 'ebook', category: 'Duelo',
      title: 'Duelo sin recetas: lo que nadie te dice sobre perder a alguien',
      summary: 'Sobre los tiempos del duelo, las frases que no ayudan y cuándo pedir acompañamiento.',
      body: 'El duelo no sigue etapas ordenadas. Este ebook propone una mirada honesta: hay días mejores y peores, culpa, enojo y momentos de calma que también confunden. Incluye ejercicios de escritura y criterios para buscar ayuda profesional.',
      createdAt: '2026-06-01T12:00:00.000Z', likes: ['u-pat-4', 'u-pat-1'], url: '../duelo/'
    },
    {
      id: 'pub-6', psyId: 'psy-4', type: 'article', category: 'Pareja',
      title: 'Discutir mejor: cuatro reglas para una pelea útil',
      summary: 'Cómo salir del reproche y la defensa, y convertir la pelea en información sobre el vínculo.',
      body: 'Una pelea útil tiene reglas: hablar de una situación concreta, no de "siempre"; describir el impacto en uno, no el defecto del otro; pedir un cambio posible y acordar una pausa antes de que la escalada rompa la conversación.\n\nEl objetivo no es ganar. Es entender qué necesita cada uno y qué acuerdo es sostenible. Si la pelea se repite sin cambios durante meses, la terapia de pareja puede ayudar a ver el patrón que ambos sostienen sin querer.',
      createdAt: '2026-08-25T12:00:00.000Z', likes: ['u-pat-2'], url: ''
    },
    {
      id: 'pub-7', psyId: 'psy-7', type: 'article', category: 'Trastornos alimentarios',
      title: 'Cuando la comida ocupa todo: señales de alerta',
      summary: 'Qué mirar más allá del cuerpo y por qué el abordaje tiene que ser interdisciplinario.',
      body: 'Las señales de un trastorno alimentario no son solo el peso: son la rigidez con la comida, el aislamiento en las comidas, la culpa, el ejercicio compensatorio y la preocupación constante por la imagen.\n\nEl tratamiento eficaz es interdisciplinario: psicología, nutrición y medicina, con la familia incluida cuando es posible. Cuanto antes se consulta, mejor pronóstico. No hace falta "estar muy mal" para pedir ayuda.',
      createdAt: '2026-09-28T12:00:00.000Z', likes: ['u-pat-1'], url: ''
    },
    {
      id: 'pub-8', psyId: 'psy-2', type: 'ebook', category: 'TDAH',
      title: 'TDAH en adultos: la guía que me hubiera gustado tener',
      summary: 'Sobre el diagnóstico tardío, la vergüenza, la organización y el derecho a pedir adaptaciones.',
      body: 'Muchos adultos llegan al diagnóstico después de años de sentirse "vagos" o "desordenados". Este ebook ordena el proceso: qué evalúa una consulta, qué no es TDAH, cómo funcionan la medicación y el entrenamiento de funciones ejecutivas, y qué adaptaciones pedir en el trabajo y el estudio.',
      createdAt: '2026-05-18T12:00:00.000Z', likes: ['u-pat-1', 'u-pat-3'], url: '../procastinar/'
    },
    {
      id: 'pub-9', psyId: 'psy-6', type: 'article', category: 'Adicciones',
      title: 'Consumo problemático: por qué la motivación no es un interruptor',
      summary: 'La entrevista motivacional explicada para familias que esperan que "toque fondo".',
      body: 'La motivación para cambiar no aparece de golpe ni por insistencia. Se construye en una relación donde la persona puede hablar sin sentirse juzgada. La entrevista motivacional trabaja con la ambivalencia: reconocer que hay una parte que quiere seguir y otra que quiere parar.\n\nPara las familias: los ultimátums suelen aumentar la defensa. Los límites claros y amorosos, junto con un espacio propio de apoyo, sostienen mejor el proceso.',
      createdAt: '2026-07-05T12:00:00.000Z', likes: ['u-pat-3'], url: ''
    },
    {
      id: 'pub-10', psyId: 'psy-9', type: 'article', category: 'Perinatal',
      title: 'Posparto: cuando el amor y el agotamiento conviven',
      summary: 'Qué es la depresión posparto, qué no lo es y cómo pedir ayuda sin culpa.',
      body: 'El posparto no es una foto: es una etapa con cambios de sueño, hormonas, identidad y vínculos. Sentir ambivalencia no te hace mala madre ni mal padre. La depresión posparto se distingue por persistencia, intensidad y afectación del funcionamiento.\n\nPedir ayuda temprano es un acto de cuidado hacia tu hijo/a y hacia vos. La terapia perinatal puede incluir psicoeducación, regulación emocional y coordinación con obstetricia y pediatría.',
      createdAt: '2026-09-10T12:00:00.000Z', likes: ['u-pat-3'], url: ''
    },
    {
      id: 'pub-11', psyId: 'psy-8', type: 'article', category: 'Depresión',
      title: 'Activación conductual: cuando las ganas llegan después de empezar',
      summary: 'Por qué esperar motivación para hacer cosas puede mantener la depresión.',
      body: 'En la depresión, el círculo suele ser: no tengo ganas, no hago, me siento peor. La activación conductual propone lo inverso: empezar con acciones muy pequeñas, planificadas y posibles, para que la motivación aparezca después.\n\nNo se trata de "poner voluntad". Se trata de acordar pasos mínimos, medibles y amables, y de registrar lo que pasa. Un plan de activación se construye con un profesional, no a base de exigencias.',
      createdAt: '2026-08-02T12:00:00.000Z', likes: ['u-pat-1'], url: ''
    },
    {
      id: 'pub-12', psyId: 'psy-2', type: 'article', category: 'Neuropsicología',
      title: '¿Qué evalúa una evaluación neuropsicológica (y qué no)?',
      summary: 'Diferencias entre diagnóstico, evaluación cognitiva y búsqueda de respuestas.',
      body: 'Una evaluación neuropsicológica mide atención, memoria, funciones ejecutivas, lenguaje, visoespacialidad y estado emocional, y las compara con lo esperable para la edad y la educación de la persona. No es un examen que se aprueba o se reprueba: es un mapa.\n\nNo reemplaza a la neurología ni a la psiquiatría, y no sirve para "etiquetar" a alguien. Sirve para entender fortalezas y dificultades, y para armar un plan de apoyo concreto. El informe debe ser comprensible para la persona y para su familia.',
      createdAt: '2026-04-20T12:00:00.000Z', likes: ['u-pat-2', 'u-pat-3'], url: ''
    },
    // Ebooks adicionales para completar la biblioteca de 14
    {
      id: 'pub-13', psyId: 'psy-3', type: 'ebook', category: 'Ansiedad',
      title: 'Respirar para volver: técnicas de regulación emocional',
      summary: 'Ejercicios prácticos de respiración y grounding para momentos de alta activación.',
      body: 'Este ebook recopila técnicas validadas de regulación emocional: respiración diafragmática, grounding 5-4-3-2-1, relajación muscular progresiva y anclajes sensoriales. Cada ejercicio viene con instrucciones paso a paso y sugerencias de práctica diaria.',
      createdAt: '2026-09-05T12:00:00.000Z', likes: ['u-pat-1', 'u-pat-2'], url: '../respirar/'
    },
    {
      id: 'pub-14', psyId: 'psy-4', type: 'ebook', category: 'Pareja',
      title: 'Comunicación no violenta en la pareja',
      summary: 'Herramientas para expresar necesidades sin culpa ni agresión.',
      body: 'La comunicación no violenta propone observar sin juzgar, expresar sentimientos y necesidades, y pedir cosas concretas. Este ebook entrega ejercicios para cada paso, con ejemplos reales de parejas que practican el método.',
      createdAt: '2026-08-15T12:00:00.000Z', likes: ['u-pat-3'], url: '../cnv/'
    },
    {
      id: 'pub-15', psyId: 'psy-5', type: 'ebook', category: 'Duelo',
      title: 'El cuerpo recuerda: duelo y somatización',
      summary: 'Cómo el dolor emocional se expresa a través del cuerpo y qué hacer al respecto.',
      body: 'El duelo no solo afecta la mente: puede generar dolores de cabeza, tensión muscular, problemas digestivos y fatiga crónica. Este ebook explica la conexión mente-cuerpo en el proceso de pérdida y ofrece técnicas de liberación corporal.',
      createdAt: '2026-07-20T12:00:00.000Z', likes: ['u-pat-4', 'u-pat-1'], url: '../cuerpo/'
    },
    {
      id: 'pub-16', psyId: 'psy-6', type: 'ebook', category: 'Autoestima',
      title: 'Hablarle como le hablarías a un amigo',
      summary: 'Trabajo interno para reducir la autocrítica destructiva.',
      body: 'La voz interior severa no es neutral: moldea nuestras decisiones y nuestra salud mental. Este ebook guía un proceso de 4 semanas para transformar el diálogo interno desde la compasión, con diarios de práctica y ejercicios de auto-observación.',
      createdAt: '2026-06-10T12:00:00.000Z', likes: ['u-pat-2', 'u-pat-3'], url: '../amigo/'
    },
    {
      id: 'pub-17', psyId: 'psy-7', type: 'ebook', category: 'Adicciones',
      title: 'Antídotos: guía para familias de personas con adicciones',
      summary: 'Cómo acompañar sin caer en la codependencia.',
      body: 'Cuidar a alguien con un trastorno por uso de sustancias requiere límites claros, amor sin habilitación y autocuidado del cuidador. Este ebook entrega herramientas para establecer rutinas familiares saludables mientras se acompaña el proceso de recuperación.',
      createdAt: '2026-05-25T12:00:00.000Z', likes: ['u-pat-1'], url: '../antidotos/'
    },
    {
      id: 'pub-18', psyId: 'psy-8', type: 'ebook', category: 'Infancia',
      title: 'Emociones en crecimiento: guía para padres de 3 a 8 años',
      summary: 'Cómo nombrar, validar y regular las emociones infantiles.',
      body: 'Los niños necesitan aprender a nombrar lo que sienten antes de poder regularlo. Este ebook ofrece actividades por edad, señales de alerta emocional y estrategias de regulación adaptadas al desarrollo infantil.',
      createdAt: '2026-04-15T12:00:00.000Z', likes: ['u-pat-4', 'u-pat-2'], url: '../crecer/'
    },
    {
      id: 'pub-19', psyId: 'psy-9', type: 'ebook', category: 'Depresión',
      title: 'Pequeños pasos: plan de activación conductual',
      summary: 'Diseñar rutinas posibles cuando la depresión pesa.',
      body: 'La depresión hace que hasta las tareas simples parezcan imposibles. Este ebook entrega un sistema de micro-hábitos que construye momentum sin exigir perfección, con plantillas descargables para organizar días difíciles.',
      createdAt: '2026-03-20T12:00:00.000Z', likes: ['u-pat-3'], url: '../pasos/'
    },
    {
      id: 'pub-20', psyId: 'psy-2', type: 'ebook', category: 'TDAH',
      title: 'Organización sin culpa: sistema anti-procrastinación',
      summary: 'Herramientas concretas para personas con TDAH que luchan con la gestión del tiempo.',
      body: 'El TDAH no es falta de voluntad: es un tema de regulación atencional. Este ebook propone métodos de Externalización de memoria, time blocking adaptado y recompensas inmediatas que funcionan con el cerebro TDAH, no contra él.',
      createdAt: '2026-02-10T12:00:00.000Z', likes: ['u-pat-1', 'u-pat-4'], url: '../organizar/'
    },
    {
      id: 'pub-21', psyId: 'psy-1', type: 'ebook', category: 'Ansiedad',
      title: 'El miedo útil: cuándo la ansiedad protege y cuándo sobra',
      summary: 'Distinguir entre ansiedad adaptativa y patológica.',
      body: 'No toda ansiedad es mala: algunas formas son protecciones necesarias. Este ebook enseña a identificar cuándo la ansiedad sirve y cuándo se ha convertido en un mecanismo disfuncional, con criterios de evaluación y protocolos de intervención.',
      createdAt: '2026-01-15T12:00:00.000Z', likes: ['u-pat-2'], url: '../miedo/'
    },
    {
      id: 'pub-22', psyId: 'psy-3', type: 'ebook', category: 'LGBTQ+',
      title: 'Salud mental affirming: Guía para personas trans y NO Binarias',
      summary: 'Acompañamiento psicológico respetuoso de la diversidad de género.',
      body: 'Este ebook ofrece marcos conceptuales para entender la disforia de género, el proceso de afirmación y los desafíos específicos de salud mental en personas trans y NO Binarias. Incluye glosario, recursos legales y protocolos de atención afirmativa.',
      createdAt: '2025-12-20T12:00:00.000Z', likes: ['u-pat-1', 'u-pat-3'], url: '../affirming/'
    },
    {
      id: 'pub-23', psyId: 'psy-5', type: 'ebook', category: 'Trauma',
      title: 'El cuerpo no olvida: introducción al trauma complejo',
      summary: 'Entender cómo el trauma persiste más allá del recuerdo consciente.',
      body: 'El trauma complejo deja huellas en el sistema nervioso incluso cuando no recordamos los hechos. Este ebook explica los síntomas disociativos, la hipervigilancia y la desconexión emocional, con referencias al modelo de Pat Ogden y terapie somáticas.',
      createdAt: '2025-11-10T12:00:00.000Z', likes: ['u-pat-4'], url: '../trauma/'
    },
    {
      id: 'pub-24', psyId: 'psy-7', type: 'ebook', category: 'Maternidad',
      title: 'Ser madre sin perfección: desmintiendo el mito de la mamá ideal',
      summary: 'Aceptación y autocuidado en la primera infancia.',
      body: 'La cultural de la maternidad perfecta genera culpa innecesaria. Este ebook invita a repensar los estándares irreales, ofrecer estrategias de autocuidado realista y construir redes de apoyo comunitario para nuevas madres.',
      createdAt: '2025-10-05T12:00:00.000Z', likes: ['u-pat-2', 'u-pat-1'], url: '../madre/'
    }
  ],

  contacts: [
    { id: 'c-1', psyId: 'psy-1', patientId: 'u-pat-1', subject: 'Consulta por ansiedad', message: 'Hola Valentina, quisiera una primera entrevista. Preferiría online por la tarde.', createdAt: '2026-08-01T10:00:00.000Z', status: 'accepted' },
    { id: 'c-2', psyId: 'psy-2', patientId: 'u-pat-2', subject: 'Evaluación de mi hijo', message: 'Necesitamos una evaluación por TDAH. Tenemos derivación del pediatra.', createdAt: '2026-08-28T10:00:00.000Z', status: 'accepted' },
    { id: 'c-3', psyId: 'psy-5', patientId: 'u-pat-4', subject: 'Duelo', message: 'Perdí a mi mamá hace dos meses y quisiera empezar terapia.', createdAt: '2026-07-25T10:00:00.000Z', status: 'accepted' },
    { id: 'c-4', psyId: 'psy-8', patientId: 'u-pat-1', subject: 'Terapia online', message: 'Quisiera consultar por sesiones online para depresión.', createdAt: '2026-10-15T10:00:00.000Z', status: 'pending' },
    { id: 'c-5', psyId: 'psy-3', patientId: 'u-pat-2', subject: 'Orientación familiar', message: 'Quisiera una entrevista para orientarnos con nuestra hija.', createdAt: '2026-08-15T10:00:00.000Z', status: 'accepted' },
    { id: 'c-6', psyId: 'psy-6', patientId: 'u-pat-3', subject: 'Consumo', message: 'Quiero consultar por mi relación con el alcohol. Es confidencial, ¿no?', createdAt: '2026-09-01T10:00:00.000Z', status: 'declined' },
    { id: 'c-7', psyId: 'psy-7', patientId: 'u-pat-4', subject: 'Consulta', message: 'Quisiera una primera consulta online.', createdAt: '2026-10-18T10:00:00.000Z', status: 'pending' }
  ],

  /* Historial de puntos (agregado, para que el ranking arranque con historia).
     Los eventos nuevos se suman uno por acción desde la interfaz. */
  pointEvents: [
    { id: 'pe-1', psyId: 'psy-2', type: 'answer', delta: 160, label: '16 respuestas publicadas en el foro', createdAt: '2026-06-01T10:00:00.000Z' },
    { id: 'pe-2', psyId: 'psy-2', type: 'accepted', delta: 175, label: '7 respuestas elegidas como mejores', createdAt: '2026-06-15T10:00:00.000Z' },
    { id: 'pe-3', psyId: 'psy-2', type: 'upvote', delta: 72, label: '24 votos positivos de pacientes', createdAt: '2026-07-01T10:00:00.000Z' },
    { id: 'pe-4', psyId: 'psy-2', type: 'article', delta: 60, label: '3 artículos publicados', createdAt: '2026-07-20T10:00:00.000Z' },
    { id: 'pe-5', psyId: 'psy-2', type: 'ebook', delta: 80, label: '2 ebooks publicados', createdAt: '2026-08-10T10:00:00.000Z' },
    { id: 'pe-6', psyId: 'psy-2', type: 'review', delta: 53, label: 'Calificaciones recibidas (4×5★, 1×4★)', createdAt: '2026-09-03T10:00:00.000Z' },

    { id: 'pe-7', psyId: 'psy-1', type: 'answer', delta: 110, label: '11 respuestas publicadas en el foro', createdAt: '2026-06-01T10:00:00.000Z' },
    { id: 'pe-8', psyId: 'psy-1', type: 'accepted', delta: 100, label: '4 respuestas elegidas como mejores', createdAt: '2026-06-20T10:00:00.000Z' },
    { id: 'pe-9', psyId: 'psy-1', type: 'upvote', delta: 54, label: '18 votos positivos de pacientes', createdAt: '2026-07-05T10:00:00.000Z' },
    { id: 'pe-10', psyId: 'psy-1', type: 'article', delta: 40, label: '2 artículos publicados', createdAt: '2026-08-01T10:00:00.000Z' },
    { id: 'pe-11', psyId: 'psy-1', type: 'ebook', delta: 40, label: '1 ebook publicado', createdAt: '2026-08-20T10:00:00.000Z' },
    { id: 'pe-12', psyId: 'psy-1', type: 'review', delta: 38, label: 'Calificaciones recibidas (2×5★, 1×4★)', createdAt: '2026-09-10T10:00:00.000Z' },

    { id: 'pe-13', psyId: 'psy-3', type: 'answer', delta: 90, label: '9 respuestas publicadas en el foro', createdAt: '2026-06-10T10:00:00.000Z' },
    { id: 'pe-14', psyId: 'psy-3', type: 'accepted', delta: 75, label: '3 respuestas elegidas como mejores', createdAt: '2026-07-01T10:00:00.000Z' },
    { id: 'pe-15', psyId: 'psy-3', type: 'upvote', delta: 36, label: '12 votos positivos de pacientes', createdAt: '2026-07-25T10:00:00.000Z' },
    { id: 'pe-16', psyId: 'psy-3', type: 'article', delta: 20, label: '1 artículo publicado', createdAt: '2026-08-18T10:00:00.000Z' },
    { id: 'pe-17', psyId: 'psy-3', type: 'ebook', delta: 40, label: '1 ebook publicado', createdAt: '2026-08-30T10:00:00.000Z' },
    { id: 'pe-18', psyId: 'psy-3', type: 'review', delta: 38, label: 'Calificaciones recibidas (2×5★, 1×4★)', createdAt: '2026-09-12T10:00:00.000Z' },

    { id: 'pe-19', psyId: 'psy-4', type: 'answer', delta: 80, label: '8 respuestas publicadas en el foro', createdAt: '2026-06-05T10:00:00.000Z' },
    { id: 'pe-20', psyId: 'psy-4', type: 'accepted', delta: 50, label: '2 respuestas elegidas como mejores', createdAt: '2026-07-10T10:00:00.000Z' },
    { id: 'pe-21', psyId: 'psy-4', type: 'upvote', delta: 30, label: '10 votos positivos de pacientes', createdAt: '2026-08-01T10:00:00.000Z' },
    { id: 'pe-22', psyId: 'psy-4', type: 'article', delta: 20, label: '1 artículo publicado', createdAt: '2026-08-25T10:00:00.000Z' },
    { id: 'pe-23', psyId: 'psy-4', type: 'review', delta: 30, label: 'Calificaciones recibidas (2×5★, 1×3★)', createdAt: '2026-09-15T10:00:00.000Z' },

    { id: 'pe-24', psyId: 'psy-5', type: 'answer', delta: 70, label: '7 respuestas publicadas en el foro', createdAt: '2026-06-08T10:00:00.000Z' },
    { id: 'pe-25', psyId: 'psy-5', type: 'accepted', delta: 50, label: '2 respuestas elegidas como mejores', createdAt: '2026-07-12T10:00:00.000Z' },
    { id: 'pe-26', psyId: 'psy-5', type: 'upvote', delta: 24, label: '8 votos positivos de pacientes', createdAt: '2026-08-05T10:00:00.000Z' },
    { id: 'pe-27', psyId: 'psy-5', type: 'ebook', delta: 40, label: '1 ebook publicado', createdAt: '2026-08-28T10:00:00.000Z' },
    { id: 'pe-28', psyId: 'psy-5', type: 'review', delta: 15, label: 'Calificaciones recibidas (2×5★, 1×2★)', createdAt: '2026-09-20T10:00:00.000Z' },

    { id: 'pe-29', psyId: 'psy-6', type: 'answer', delta: 50, label: '5 respuestas publicadas en el foro', createdAt: '2026-06-12T10:00:00.000Z' },
    { id: 'pe-30', psyId: 'psy-6', type: 'accepted', delta: 25, label: '1 respuesta elegida como mejor', createdAt: '2026-07-15T10:00:00.000Z' },
    { id: 'pe-31', psyId: 'psy-6', type: 'upvote', delta: 18, label: '6 votos positivos de pacientes', createdAt: '2026-08-10T10:00:00.000Z' },
    { id: 'pe-32', psyId: 'psy-6', type: 'article', delta: 20, label: '1 artículo publicado', createdAt: '2026-09-02T10:00:00.000Z' },
    { id: 'pe-33', psyId: 'psy-6', type: 'review', delta: 15, label: 'Calificaciones recibidas (2×5★, 1×2★)', createdAt: '2026-09-22T10:00:00.000Z' },

    { id: 'pe-34', psyId: 'psy-7', type: 'answer', delta: 40, label: '4 respuestas publicadas en el foro', createdAt: '2026-06-18T10:00:00.000Z' },
    { id: 'pe-35', psyId: 'psy-7', type: 'accepted', delta: 25, label: '1 respuesta elegida como mejor', createdAt: '2026-07-20T10:00:00.000Z' },
    { id: 'pe-36', psyId: 'psy-7', type: 'upvote', delta: 9, label: '3 votos positivos de pacientes', createdAt: '2026-08-12T10:00:00.000Z' },
    { id: 'pe-37', psyId: 'psy-7', type: 'article', delta: 20, label: '1 artículo publicado', createdAt: '2026-09-05T10:00:00.000Z' },
    { id: 'pe-38', psyId: 'psy-7', type: 'review', delta: -15, label: 'Calificaciones recibidas (1×5★, 1×1★)', createdAt: '2026-09-25T10:00:00.000Z' },

    { id: 'pe-39', psyId: 'psy-8', type: 'answer', delta: 20, label: '2 respuestas publicadas en el foro', createdAt: '2026-07-01T10:00:00.000Z' },
    { id: 'pe-40', psyId: 'psy-8', type: 'accepted', delta: 25, label: '1 respuesta elegida como mejor', createdAt: '2026-08-01T10:00:00.000Z' },
    { id: 'pe-41', psyId: 'psy-8', type: 'upvote', delta: 3, label: '1 voto positivo de paciente', createdAt: '2026-09-01T10:00:00.000Z' },
    { id: 'pe-42', psyId: 'psy-8', type: 'review', delta: 8, label: 'Calificación de 4 estrellas', createdAt: '2026-09-16T10:00:00.000Z' },

    { id: 'pe-43', psyId: 'psy-9', type: 'answer', delta: 20, label: '2 respuestas publicadas en el foro', createdAt: '2026-08-01T10:00:00.000Z' },
    { id: 'pe-44', psyId: 'psy-9', type: 'upvote', delta: 6, label: '2 votos positivos de pacientes', createdAt: '2026-09-01T10:00:00.000Z' },
    { id: 'pe-45', psyId: 'psy-9', type: 'review', delta: 15, label: 'Calificación de 5 estrellas', createdAt: '2026-10-01T10:00:00.000Z' }
  ],

  reports: [
    { id: 'rep-1', targetType: 'question', targetId: 'q-7', reporterId: 'u-pat-2', reason: 'Datos personales en el título', createdAt: '2026-10-19T10:00:00.000Z', status: 'open' }
  ],

  posts: [
    {
      id: 'post-1', authorId: 'u-psy-1', createdAt: '2026-10-23T10:30:00.000Z',
      body: 'Una cosa que repito mucho en consulta: la ansiedad no se combate con "pensá positivo". Se trabaja entendiendo qué la activa, qué la mantiene y qué pequeñas acciones te devuelven control. Si estás postergando una consulta por miedo a que te digan que exagerás, ese miedo también es parte de lo que podemos mirar juntos.',
      imageUrl: '', likes: ['u-pat-1', 'u-pat-2', 'u-pat-3', 'u-pat-4'], comments: [
        { id: 'pc-1', authorId: 'u-pat-1', body: 'Me costó mucho animarme, pero leer esto ayuda.', createdAt: '2026-10-23T10:44:00.000Z' },
        { id: 'pc-2', authorId: 'u-psy-2', body: 'Totalmente. La evitación es el mejor indicador de que algo merece atención.', createdAt: '2026-10-23T11:02:00.000Z' }
      ]
    },
    {
      id: 'post-2', authorId: 'u-psy-2', createdAt: '2026-10-23T09:10:00.000Z',
      body: 'Estamos probando la nueva consola de estimulación de baja fidelidad visual con pacientes adultos con TDAH. La clave no es el juego: es el encuadre (objetivo, tiempo acotado y registro). Menos estímulo, más aprendizaje. Si querés probarla, está abierta y es gratuita.',
      imageUrl: '', likes: ['u-pat-1', 'u-pat-2', 'u-psy-1', 'u-psy-3', 'u-pat-3'], comments: [
        { id: 'pc-3', authorId: 'u-pat-2', body: '¿Sirve para niños de 9 años?', createdAt: '2026-10-23T09:30:00.000Z' },
        { id: 'pc-4', authorId: 'u-psy-2', body: 'Sí, con supervisión y sesiones cortas. La evaluación primero.', createdAt: '2026-10-23T09:41:00.000Z' }
      ]
    },
    {
      id: 'post-3', authorId: 'u-psy-3', createdAt: '2026-10-22T18:20:00.000Z',
      body: 'Cuando un chico autista se tapa los oídos no está "haciendo berrinche": está regulando un sistema nervioso que recibe demasiado. Antes de pedir que se adapte, preguntemos qué del entorno podemos cambiar. Adaptar no es malcriar: es enseñar en condiciones posibles.',
      imageUrl: '', likes: ['u-pat-3', 'u-pat-2', 'u-psy-1', 'u-psy-2', 'u-pat-1'], comments: [
        { id: 'pc-5', authorId: 'u-pat-3', body: 'Gracias por decirlo así. Ojalá lo hubiera leído de chica.', createdAt: '2026-10-22T18:40:00.000Z' }
      ]
    },
    {
      id: 'post-4', authorId: 'u-pat-1', createdAt: '2026-10-22T16:00:00.000Z',
      body: 'Hoy fui a mi primera entrevista después de meses de pensarlo. No fue tan terrible como lo imaginaba. Si estás en esa duda, te entiendo: pedir ayuda también da vergüenza. Pero se puede.',
      imageUrl: '', likes: ['u-psy-1', 'u-psy-2', 'u-pat-2', 'u-pat-3'], comments: [
        { id: 'pc-6', authorId: 'u-psy-1', body: 'Qué bueno leerte. El primer paso suele ser el más costoso.', createdAt: '2026-10-22T16:15:00.000Z' }
      ]
    },
    {
      id: 'post-5', authorId: 'u-psy-5', createdAt: '2026-10-22T12:40:00.000Z',
      body: 'El duelo no sigue etapas ordenadas. Hay días de enojo, días de calma que dan culpa y días en que la ausencia pesa todo. No hay un plazo correcto. Si te dicen "ya deberías estar mejor", recordá que el tiempo del otro no es tu tiempo.',
      imageUrl: '', likes: ['u-pat-4', 'u-pat-1', 'u-pat-2'], comments: []
    },
    {
      id: 'post-6', authorId: 'u-pat-3', createdAt: '2026-10-21T20:10:00.000Z',
      body: 'Descubrir que soy autista a los 34 explicó muchas cosas y abrió otras. Estoy armando un pequeño grupo de lectura sobre autismo en adultos. Si te interesa, escribime por chat.',
      imageUrl: '', likes: ['u-psy-3', 'u-pat-1'], comments: [
        { id: 'pc-7', authorId: 'u-psy-3', body: 'Qué lindo que circule. Los grupos de pares hacen mucho.', createdAt: '2026-10-21T20:30:00.000Z' }
      ]
    },
    {
      id: 'post-7', authorId: 'u-psy-4', createdAt: '2026-10-21T11:00:00.000Z',
      body: 'Una pelea repetida no siempre significa que la relación esté mal: a veces es la puerta de entrada a algo que ninguno de los dos se anima a nombrar. Antes de decidir, vale la pena preguntarse: ¿qué necesita cada uno detrás del reproche?',
      imageUrl: '', likes: ['u-pat-2', 'u-pat-4'], comments: []
    },
    {
      id: 'post-8', authorId: 'u-psy-9', createdAt: '2026-10-20T17:30:00.000Z',
      body: 'Posparto: no todo es amor instantáneo. También hay cansancio, ambivalencia, culpa y miedo. Sentir eso no te hace mala madre ni mal padre. Si la tristeza se sostiene, pedir ayuda es un acto de cuidado, no una falla.',
      imageUrl: '', likes: ['u-pat-1', 'u-pat-3', 'u-psy-1'], comments: []
    },
    {
      id: 'post-9', authorId: 'u-psy-8', createdAt: '2026-10-20T10:15:00.000Z',
      body: 'En depresión, esperar las ganas para empezar suele mantener el círculo. La activación conductual propone lo contrario: un paso mínimo, concreto y posible. No es "poner voluntad": es bajar la exigencia hasta que algo se mueva.',
      imageUrl: '', likes: ['u-pat-1', 'u-pat-4'], comments: []
    },
    {
      id: 'post-10', authorId: 'u-pat-2', createdAt: '2026-10-19T22:00:00.000Z',
      body: 'Consejo de papá aprendido a los golpes: cuando mi hijo está desregulado, hablar más fuerte no funciona. Bajar el tono, acercarme y esperar unos segundos hace más que veinte explicaciones. Me costó años entenderlo.',
      imageUrl: '', likes: ['u-psy-3', 'u-psy-2', 'u-pat-1'], comments: [
        { id: 'pc-8', authorId: 'u-psy-3', body: 'Co-regular primero, razonar después. Muy bien dicho.', createdAt: '2026-10-20T08:00:00.000Z' }
      ]
    },
    {
      id: 'post-11', authorId: 'u-pat-3', createdAt: '2026-10-18T11:05:00.000Z', questionId: 'q-7',
      body: 'Publiqué una pregunta en el foro: me da terror hablar en público y lo evito siempre. Si te pasó algo parecido o sos profesional, te leo. A veces saber que a otros les pasa ayuda a animarse.',
      imageUrl: '', likes: ['u-pat-1', 'u-pat-2'], comments: []
    }
  ],

  messages: [
    { id: 'msg-1', fromId: 'u-pat-1', toId: 'u-psy-1', body: 'Hola Valentina, ¿te queda algún turno esta semana? Preferiría online por la tarde.', createdAt: '2026-10-22T15:10:00.000Z', readAt: '2026-10-22T15:20:00.000Z' },
    { id: 'msg-2', fromId: 'u-psy-1', toId: 'u-pat-1', body: 'Hola Lucía, sí. Tengo jueves 18:00 y viernes 17:00. ¿Cuál te sirve?', createdAt: '2026-10-22T15:22:00.000Z', readAt: '2026-10-22T15:30:00.000Z' },
    { id: 'msg-3', fromId: 'u-pat-1', toId: 'u-psy-1', body: 'Jueves 18 me viene bien. ¿Cómo hacemos con el pago?', createdAt: '2026-10-22T15:32:00.000Z', readAt: '2026-10-22T15:40:00.000Z' },
    { id: 'msg-4', fromId: 'u-psy-1', toId: 'u-pat-1', body: 'Te paso el alias por privado y te reservo el jueves. Cualquier cosa antes, escribime por acá.', createdAt: '2026-10-23T09:05:00.000Z', readAt: null },

    { id: 'msg-5', fromId: 'u-pat-1', toId: 'u-psy-2', body: 'Hola Emanuel, gracias por la charla del otro día. Quería saber si la evaluación incluye informe.', createdAt: '2026-10-21T18:00:00.000Z', readAt: '2026-10-21T18:30:00.000Z' },
    { id: 'msg-6', fromId: 'u-psy-2', toId: 'u-pat-1', body: 'Sí, incluye entrevista, pruebas, informe y una devolución. Si querés te mando el detalle por mail.', createdAt: '2026-10-21T18:35:00.000Z', readAt: '2026-10-21T18:40:00.000Z' },

    { id: 'msg-7', fromId: 'u-pat-2', toId: 'u-psy-3', body: 'Sofía, ¿cómo podemos preparar la primera entrevista con nuestra hija?', createdAt: '2026-10-22T10:00:00.000Z', readAt: '2026-10-22T10:20:00.000Z' },
    { id: 'msg-8', fromId: 'u-psy-3', toId: 'u-pat-2', body: 'Con que vengan los dos y traigan informes de la escuela alcanza. No necesitan preparar nada especial.', createdAt: '2026-10-22T10:25:00.000Z', readAt: null },

    { id: 'msg-9', fromId: 'u-pat-3', toId: 'u-psy-2', body: 'Hola, quería consultar por evaluación en adultos para TEA. ¿Tenés lista de espera?', createdAt: '2026-10-20T09:30:00.000Z', readAt: '2026-10-20T10:00:00.000Z' },
    { id: 'msg-10', fromId: 'u-psy-2', toId: 'u-pat-3', body: 'Hola Marina, tengo lugar en dos semanas. Te paso los pasos y honorarios por mensaje privado.', createdAt: '2026-10-20T10:05:00.000Z', readAt: '2026-10-20T10:10:00.000Z' },
    { id: 'msg-11', fromId: 'u-pat-3', toId: 'u-psy-2', body: 'Perfecto, quedo atenta. Gracias.', createdAt: '2026-10-20T10:12:00.000Z', readAt: '2026-10-20T10:15:00.000Z' },

    { id: 'msg-12', fromId: 'u-pat-4', toId: 'u-psy-9', body: 'Hola Agustina, te escribo por una consulta perinatal para mi pareja. ¿Atendés online?', createdAt: '2026-10-19T16:00:00.000Z', readAt: '2026-10-19T16:20:00.000Z' },
    { id: 'msg-13', fromId: 'u-psy-9', toId: 'u-pat-4', body: 'Hola Ramiro, sí, atiendo online y presencial en CABA. Contame un poco más y vemos.', createdAt: '2026-10-19T16:25:00.000Z', readAt: null },

    { id: 'msg-14', fromId: 'u-pat-2', toId: 'u-psy-1', body: 'Valentina, ¿sabés de algún colega para terapia de pareja en Rosario?', createdAt: '2026-10-18T11:00:00.000Z', readAt: '2026-10-18T11:30:00.000Z' },
    { id: 'msg-15', fromId: 'u-psy-1', toId: 'u-pat-2', body: 'Sí, Martín Salas trabaja ahí y es muy recomendable. Te dejo su perfil.', createdAt: '2026-10-18T11:35:00.000Z', readAt: '2026-10-18T11:40:00.000Z' }
  ],

  appointments: [
    { id: 'ap-1', psyId: 'psy-2', patientId: 'u-pat-1', patientName: 'Lucía Fernández', date: '2026-10-27', time: '15:00', service: 'Consulta de orientación', status: 'confirmed', notes: 'Primera entrevista. Trae informe previo.', createdAt: '2026-10-22T12:00:00.000Z' },
    { id: 'ap-2', psyId: 'psy-2', patientId: 'u-pat-3', patientName: 'Marina Ortiz', date: '2026-10-28', time: '10:30', service: 'Evaluación neuropsicológica', status: 'pending', notes: 'Confirmar por WhatsApp.', createdAt: '2026-10-21T12:00:00.000Z' },
    { id: 'ap-3', psyId: 'psy-2', patientId: 'u-pat-2', patientName: 'Diego Sosa', date: '2026-11-03', time: '17:00', service: 'Devolución de informe', status: 'confirmed', notes: '', createdAt: '2026-10-20T12:00:00.000Z' },
    { id: 'ap-4', psyId: 'psy-1', patientId: 'u-pat-1', patientName: 'Lucía Fernández', date: '2026-10-24', time: '18:00', service: 'Sesión online', status: 'confirmed', notes: 'Enviar enlace 10 min antes.', createdAt: '2026-10-22T12:00:00.000Z' },
    { id: 'ap-5', psyId: 'psy-3', patientId: 'u-pat-2', patientName: 'Familia Sosa', date: '2026-10-30', time: '09:00', service: 'Entrevista familiar', status: 'pending', notes: 'Traer informes escolares.', createdAt: '2026-10-21T12:00:00.000Z' }
  ],

  aurakitProjects: [
    {
      id: 'akp-1', psyId: 'psy-2', name: 'WineBOX Neuropsicología',
      template: 'sesiones', brand: '#0f4a63', accent: '#17a589',
      headline: 'Evaluación y entrenamiento neurocognitivo con plan claro',
      subheadline: 'TDAH, TEA y ansiedad en niños, adolescentes y adultos. Presencial en CABA y online a todo el país.',
      about: 'Soy el Lic. Emanuel Chanampa, neuropsicólogo clínico. Trabajo con evaluación neurocognitiva y entrenamiento de funciones ejecutivas, con un enfoque claro, medible y humano. Cada proceso empieza con escuchar qué necesitás.',
      cta: 'Reservar una consulta',
      services: [
        { name: 'Consulta de orientación', price: 45000, desc: 'Primera entrevista y plan de trabajo.' },
        { name: 'Evaluación neuropsicológica', price: 180000, desc: 'Entrevista, pruebas, informe y devolución.' },
        { name: 'Entrenamiento cognitivo', price: 38000, desc: 'Sesiones de 45 minutos, online o presencial.' }
      ],
      books: [
        { title: 'El arte de la calma', price: 0, desc: 'Protocolo breve para crisis de ansiedad.', url: '../calma/' },
        { title: 'TDAH en adultos', price: 0, desc: 'Guía para el diagnóstico tardío y la organización.', url: '../procastinar/' }
      ],
      testimonials: [
        { name: 'Lucía F.', text: 'La devolución fue clara y el plan me ordenó la semana.' },
        { name: 'Diego S.', text: 'Sentí que por primera vez alguien escuchó a mi hijo de verdad.' }
      ],
      contact: { whatsapp: '5491166116631', email: 'hola@winebox.clinic', address: 'Av. Corrientes 1386, CABA', schedule: 'Lunes a viernes de 9 a 19 h' },
      blocks: [
        { type: 'hero', enabled: true }, { type: 'services', enabled: true }, { type: 'about', enabled: true },
        { type: 'booking', enabled: true }, { type: 'books', enabled: true }, { type: 'testimonials', enabled: true },
        { type: 'contact', enabled: true }, { type: 'aura', enabled: true }
      ],
      publishedUrl: '', createdAt: '2026-10-15T12:00:00.000Z', updatedAt: '2026-10-22T12:00:00.000Z'
    },
    {
      id: 'akp-2', psyId: 'psy-1', name: 'Consultorio Valentina Ríos',
      template: 'landing', brand: '#3b2a5a', accent: '#c99a12',
      headline: 'Recuperá el control de tu ansiedad',
      subheadline: 'Terapia cognitivo-conductual para ansiedad, pánico y estrés. Online y presencial en CABA.',
      about: 'Soy la Dra. Valentina Ríos, psicóloga clínica. Trabajo con TCC y exposición gradual, con tareas concretas entre sesiones. Mi objetivo no es que dejes de sentir, sino que recuperes la capacidad de decidir.',
      cta: 'Pedir mi primera entrevista',
      services: [{ name: 'Primera consulta', price: 32000, desc: 'Evaluación inicial y plan.' }, { name: 'Sesión online', price: 28000, desc: '50 minutos por videollamada.' }],
      books: [{ title: 'Ansiedad: guía breve', price: 0, desc: 'Cinco señales para decidir cuándo consultar.', url: '../calma/' }],
      testimonials: [{ name: 'Paciente', text: 'Me dio herramientas concretas desde la primera sesión.' }],
      contact: { whatsapp: '5491155551234', email: 'valentina@demo.com', address: 'Av. Callao 1234, CABA', schedule: 'Lunes a jueves de 9 a 20 h' },
      blocks: [
        { type: 'hero', enabled: true }, { type: 'services', enabled: true }, { type: 'about', enabled: true },
        { type: 'booking', enabled: true }, { type: 'books', enabled: false }, { type: 'testimonials', enabled: true },
        { type: 'contact', enabled: true }, { type: 'aura', enabled: true }
      ],
      publishedUrl: '', createdAt: '2026-10-18T12:00:00.000Z', updatedAt: '2026-10-21T12:00:00.000Z'
    }
  ],

  config: {
    specialties: [
      'Ansiedad y pánico', 'Depresión', 'TDAH', 'TEA / Autismo', 'Duelo',
      'Pareja y vínculos', 'Infancia y adolescencia', 'Trauma y TEPT', 'Adicciones',
      'Trastornos alimentarios', 'Neuropsicología', 'Perinatal', 'Estrés y burnout',
      'Fobias', 'Sexualidad', 'Orientación vocacional', 'Orientación'
    ],
    categories: ['Ansiedad', 'Depresión', 'TDAH', 'TEA / Autismo', 'Duelo', 'Pareja', 'Infancia y adolescencia', 'Trauma y TEPT', 'Adicciones', 'Trastornos alimentarios', 'Perinatal', 'Neuropsicología', 'Orientación'],
    approaches: [
      'Terapia Cognitivo-Conductual (TCC)', 'Terapia de Aceptación y Compromiso (ACT)',
      'EMDR', 'Terapia sistémica', 'Psicoanálisis', 'Terapia Dialéctico Conductual (DBT)',
      'Terapia breve', 'Mindfulness', 'Neuropsicología', 'Estimulación cognitiva',
      'Entrevista motivacional', 'Terapia centrada en trauma', 'Modelo DIR/Floortime'
    ],
    modalities: [
      { id: 'presencial', label: 'Presencial' },
      { id: 'online', label: 'Online' }
    ],
    tiers: [
      { id: 'bronce', name: 'Bronce', min: 0, color: '#a9714b' },
      { id: 'plata', name: 'Plata', min: 100, color: '#8a99a8' },
      { id: 'oro', name: 'Oro', min: 250, color: '#c99a12' },
      { id: 'platino', name: 'Platino', min: 450, color: '#4a7c8c' },
      { id: 'diamante', name: 'Diamante', min: 750, color: '#2f6fb3' }
    ],
    pointRules: [
      { id: 'answer', label: 'Responder una pregunta en el foro', delta: 10, icon: '💬' },
      { id: 'accepted', label: 'Que un paciente elija tu respuesta como la mejor', delta: 25, icon: '✅' },
      { id: 'upvote', label: 'Cada voto positivo de un paciente a tu respuesta', delta: 3, icon: '👍' },
      { id: 'article', label: 'Publicar un artículo clínico', delta: 20, icon: '📝' },
      { id: 'ebook', label: 'Publicar un ebook o guía descargable', delta: 40, icon: '📚' },
      { id: 'profile', label: 'Completar el perfil profesional (una vez)', delta: 10, icon: '🪪' },
      { id: 'like', label: 'Me gusta de un paciente en una publicación', delta: 2, icon: '❤️' },
      { id: 'review5', label: 'Reseña de 5 estrellas de un paciente', delta: 15, icon: '⭐' },
      { id: 'review4', label: 'Reseña de 4 estrellas', delta: 8, icon: '⭐' },
      { id: 'review3', label: 'Reseña de 3 estrellas', delta: 0, icon: '•' },
      { id: 'review2', label: 'Reseña de 2 estrellas', delta: -15, icon: '⚠️' },
      { id: 'review1', label: 'Reseña de 1 estrella', delta: -30, icon: '⚠️' }
    ]
  }
};
