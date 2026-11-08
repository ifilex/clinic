/* ============================================================
   WineBOX Comunidad Â· Datos semilla (100% estÃ¡tico, sin PHP)
   Se cargan una sola vez en localStorage y luego el usuario
   puede editar todo desde la interfaz.
   ContraseÃ±a de todas las cuentas demo: demo1234
   ============================================================ */
module.exports = {
  version: 1,
  createdAt: '2026-10-22T03:00:00.000Z',

  users: [
    { id: 'u-root', role: 'root', name: 'Root WineBOX', email: 'root@winebox.clinic', password: 'Root2026!', city: 'CABA', createdAt: '2024-01-01T10:00:00.000Z', color: '#111827', avatarUrl: '', website: '', whatsapp: '', bio: 'AdministraciÃ³n general de WineBOX Comunidad. Puede editar, suspender y eliminar usuarios.', online: true, lastSeen: '2026-10-23T12:00:00.000Z', blocked: false },
    { id: 'u-admin', role: 'admin', name: 'Equipo WineBOX', email: 'admin@winebox.clinic', password: 'demo1234', city: 'CABA', createdAt: '2024-01-05T10:00:00.000Z', color: '#002045', avatarUrl: '', website: 'https://winebox.clinic', whatsapp: '5491166116631', bio: 'Equipo de moderaciÃ³n y verificaciÃ³n de la comunidad.', online: true, lastSeen: '2026-10-23T12:00:00.000Z', blocked: false },

    { id: 'u-pat-1', role: 'patient', name: 'LucÃ­a FernÃ¡ndez', email: 'paciente@demo.com', password: 'demo1234', city: 'CABA', createdAt: '2025-03-11T12:00:00.000Z', color: '#7c5aa6', avatarUrl: '', website: '', whatsapp: '', bio: 'Escribo, trabajo en diseÃ±o y estoy aprendiendo a cuidar mi cabeza. Me interesa la ansiedad y el sueÃ±o.', headline: 'DiseÃ±adora Â· en proceso de conocerme mejor', online: true, lastSeen: '2026-10-23T12:00:00.000Z', blocked: false },
    { id: 'u-pat-2', role: 'patient', name: 'Diego Sosa', email: 'diego@demo.com', password: 'demo1234', city: 'Rosario', createdAt: '2025-06-02T12:00:00.000Z', color: '#2e8b57', avatarUrl: '', website: '', whatsapp: '', bio: 'PapÃ¡ de dos, docente. AcÃ¡ para entender mejor a mis hijos y a mÃ­.', headline: 'Docente y papÃ¡', online: false, lastSeen: '2026-10-22T20:00:00.000Z', blocked: false },
    { id: 'u-pat-3', role: 'patient', name: 'Marina Ortiz', email: 'marina@demo.com', password: 'demo1234', city: 'CÃ³rdoba', createdAt: '2025-09-18T12:00:00.000Z', color: '#c0392b', avatarUrl: '', website: 'https://marinaortiz.example', whatsapp: '5493515550101', bio: 'Diagnosticada autista a los 34. Comparto lo que aprendo.', headline: 'Autista adulta Â· divulgaciÃ³n', online: false, lastSeen: '2026-10-22T18:30:00.000Z', blocked: false },
    { id: 'u-pat-4', role: 'patient', name: 'Ramiro Vega', email: 'ramiro@demo.com', password: 'demo1234', city: 'La Plata', createdAt: '2026-01-20T12:00:00.000Z', color: '#d4a017', avatarUrl: '', website: '', whatsapp: '', bio: 'MÃºsico. DespuÃ©s de una pÃ©rdida, aprendiendo a sostener la vida.', headline: 'MÃºsico', online: false, lastSeen: '2026-10-21T10:00:00.000Z', blocked: false },

    { id: 'u-psy-1', role: 'psy', name: 'Dra. Valentina RÃ­os', email: 'valentina@demo.com', password: 'demo1234', city: 'CABA', createdAt: '2023-05-10T12:00:00.000Z', color: '#17a589', avatarUrl: '', website: 'https://valentinarios.example', whatsapp: '5491155551234', bio: 'Ansiedad y pÃ¡nico. TCC con base cientÃ­fica, presencial y online.', headline: 'Ansiedad Â· TCC', online: true, lastSeen: '2026-10-23T12:00:00.000Z', blocked: false },
    { id: 'u-psy-2', role: 'psy', name: 'Lic. Emanuel Chanampa', email: 'psicologo@demo.com', password: 'demo1234', city: 'CABA', createdAt: '2023-02-01T12:00:00.000Z', color: '#002045', avatarUrl: '', website: 'https://winebox.clinic', whatsapp: '5491166116631', bio: 'NeuropsicÃ³logo clÃ­nico. TDAH, TEA y ansiedad. Director de WineBOX Clinic.', headline: 'NeuropsicologÃ­a Â· TDAH Â· TEA', online: true, lastSeen: '2026-10-23T12:00:00.000Z', blocked: false },
    { id: 'u-psy-3', role: 'psy', name: 'Lic. SofÃ­a Herrera', email: 'sofia@demo.com', password: 'demo1234', city: 'CÃ³rdoba', createdAt: '2023-09-14T12:00:00.000Z', color: '#7c5aa6', avatarUrl: '', website: '', whatsapp: '5493515557788', bio: 'Infancia, adolescencia, autismo y TDAH. AcompaÃ±o a familias.', headline: 'Infancia y adolescencia Â· TEA', online: true, lastSeen: '2026-10-23T12:00:00.000Z', blocked: false },
    { id: 'u-psy-4', role: 'psy', name: 'Mg. MartÃ­n Salas', email: 'martin@demo.com', password: 'demo1234', city: 'Rosario', createdAt: '2024-02-19T12:00:00.000Z', color: '#2e7d32', avatarUrl: '', website: '', whatsapp: '5493415552020', bio: 'Pareja y vÃ­nculos. Terapia sistÃ©mica, sin culpables.', headline: 'Pareja y vÃ­nculos', online: false, lastSeen: '2026-10-22T22:00:00.000Z', blocked: false },
    { id: 'u-psy-5', role: 'psy', name: 'Lic. Camila Duarte', email: 'camila@demo.com', password: 'demo1234', city: 'La Plata', createdAt: '2024-04-03T12:00:00.000Z', color: '#c0392b', avatarUrl: '', website: '', whatsapp: '5492215559911', bio: 'Duelo, trauma y TEPT. EMDR y una mirada de gÃ©nero.', headline: 'Duelo y trauma', online: false, lastSeen: '2026-10-22T19:00:00.000Z', blocked: false },
    { id: 'u-psy-6', role: 'psy', name: 'Lic. JoaquÃ­n Pereyra', email: 'joaquin@demo.com', password: 'demo1234', city: 'LanÃºs', createdAt: '2024-08-22T12:00:00.000Z', color: '#f28705', avatarUrl: '', website: '', whatsapp: '5491155553344', bio: 'Adicciones y consumo problemÃ¡tico. Entrevista motivacional.', headline: 'Adicciones', online: false, lastSeen: '2026-10-21T16:00:00.000Z', blocked: false },
    { id: 'u-psy-7', role: 'psy', name: 'Dra. Renata Ãlvarez', email: 'renata@demo.com', password: 'demo1234', city: 'Mendoza', createdAt: '2024-11-09T12:00:00.000Z', color: '#d4a017', avatarUrl: '', website: '', whatsapp: '5492615558899', bio: 'Trastornos alimentarios e imagen corporal.', headline: 'Trastornos alimentarios', online: false, lastSeen: '2026-10-20T11:00:00.000Z', blocked: false },
    { id: 'u-psy-8', role: 'psy', name: 'Lic. TomÃ¡s Ibarra', email: 'tomas@demo.com', password: 'demo1234', city: 'Mar del Plata', createdAt: '2025-07-15T12:00:00.000Z', color: '#2e5266', avatarUrl: '', website: '', whatsapp: '5492235551122', bio: 'DepresiÃ³n y activaciÃ³n conductual. Solo online.', headline: 'DepresiÃ³n Â· ACT', online: false, lastSeen: '2026-10-22T09:00:00.000Z', blocked: false },
    { id: 'u-psy-9', role: 'psy', name: 'Lic. Agustina LÃ³pez', email: 'agustina@demo.com', password: 'demo1234', city: 'CABA', createdAt: '2026-02-01T12:00:00.000Z', color: '#8e44ad', avatarUrl: '', website: '', whatsapp: '5491155557788', bio: 'PsicologÃ­a perinatal. Maternidad, puerperio y pÃ©rdidas.', headline: 'Perinatal', online: true, lastSeen: '2026-10-23T12:00:00.000Z', blocked: false }
  ],

  psychs: [
    {
      id: 'psy-2', userId: 'u-psy-2', name: 'Lic. Emanuel Chanampa',
      headline: 'NeuropsicologÃ­a clÃ­nica Â· TDAH, TEA y ansiedad en niÃ±os, adolescentes y adultos',
      bio: 'Soy neuropsicÃ³logo clÃ­nico y director de WineBOX Clinic. Trabajo con evaluaciÃ³n neurocognitiva y entrenamiento de funciones ejecutivas usando estimulaciÃ³n de baja fidelidad visual: menos estÃ­mulo, mÃ¡s aprendizaje. AcompaÃ±o a personas con TDAH, TEA, ansiedad y fatiga mental, y a sus familias, con un plan claro y medible. Mi enfoque combina ciencia, tecnologÃ­a y contenciÃ³n humana; cada proceso empieza con escuchar quÃ© necesitÃ¡s y termina con objetivos concretos para tu vida diaria.',
      specialties: ['TDAH', 'TEA / Autismo', 'NeuropsicologÃ­a', 'Ansiedad y pÃ¡nico'],
      approaches: ['Terapia Cognitivo-Conductual (TCC)', 'NeuropsicologÃ­a', 'EstimulaciÃ³n cognitiva', 'Mindfulness'],
      modalities: ['presencial', 'online'],
      city: 'CABA', province: 'Ciudad de Buenos Aires', country: 'Argentina',
      address: 'Av. Corrientes 1386, Piso 8, CABA',
      mapQuery: 'Av. Corrientes 1386, Ciudad de Buenos Aires',
      languages: ['EspaÃ±ol', 'InglÃ©s'],
      license: 'MN 56.716 Â· MP 84.132',
      years: 15,
      degrees: [
        { title: 'Licenciatura en PsicologÃ­a', institution: 'Universidad de Buenos Aires (UBA)', year: 2010 },
        { title: 'EspecializaciÃ³n en NeuropsicologÃ­a ClÃ­nica', institution: 'Hospital Italiano de Buenos Aires', year: 2014 },
        { title: 'MaestrÃ­a en Neurociencias Cognitivas', institution: 'Universidad Favaloro', year: 2017 }
      ],
      certifications: [
        'EvaluaciÃ³n neuropsicolÃ³gica infantil y de adultos (2016)',
        'Terapia Cognitivo-Conductual para TDAH (2018)',
        'IntervenciÃ³n en TEA desde un enfoque de derechos (2021)',
        'FormaciÃ³n en estimulaciÃ³n cognitiva de baja fidelidad visual (2022)'
      ],
      services: [
        { name: 'EvaluaciÃ³n neuropsicolÃ³gica integral', price: 180000, duration: 90, note: 'Incluye entrevista, pruebas, informe y devoluciÃ³n' },
        { name: 'Consulta de orientaciÃ³n', price: 45000, duration: 50, note: 'Primera entrevista y plan de trabajo' },
        { name: 'SesiÃ³n de entrenamiento cognitivo', price: 38000, duration: 45 },
        { name: 'SesiÃ³n online', price: 38000, duration: 45, note: 'Misma modalidad, por videollamada' }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Mercado Pago', 'Tarjeta de dÃ©bito'],
      coverage: ['OSDE', 'Swiss Medical', 'IOMA', 'Particular'],
      availability: [
        { days: 'Lunes a jueves', hours: '9:00 a 19:00' },
        { days: 'Viernes', hours: '9:00 a 14:00' },
        { days: 'SÃ¡bados', hours: 'Consultar disponibilidad' }
      ],
      whatsapp: '5491166116631',
      website: 'https://winebox.clinic',
      acceptingNew: true,
      verified: true,
      responseTime: 'menos de 24 h',
      createdAt: '2023-02-01T12:00:00.000Z'
    },
    {
      id: 'psy-1', userId: 'u-psy-1', name: 'Dra. Valentina RÃ­os',
      headline: 'Ansiedad, pÃ¡nico y estrÃ©s Â· TCC con base cientÃ­fica, presencial en CABA y online',
      bio: 'AcompaÃ±o a personas que sienten que la ansiedad les estÃ¡ ordenando la vida: preocupaciÃ³n constante, ataques de pÃ¡nico, miedo a salir o a quedarse sin control. Trabajo con Terapia Cognitivo-Conductual y exposiciÃ³n gradual, con tareas concretas entre sesiones y mucho espacio para lo que te pasa. Mi objetivo no es que dejes de sentir, sino que recuperes la capacidad de decidir. Atiendo adultos y adolescentes desde los 16 aÃ±os.',
      specialties: ['Ansiedad y pÃ¡nico', 'EstrÃ©s y burnout', 'Fobias'],
      approaches: ['Terapia Cognitivo-Conductual (TCC)', 'Terapia de exposiciÃ³n', 'Mindfulness', 'Terapia breve'],
      modalities: ['online', 'presencial'],
      city: 'CABA', province: 'Ciudad de Buenos Aires', country: 'Argentina',
      address: 'Av. Callao 1234, Piso 6, Recoleta, CABA',
      mapQuery: 'Av. Callao 1234, Ciudad de Buenos Aires',
      languages: ['EspaÃ±ol', 'InglÃ©s', 'PortuguÃ©s'],
      license: 'MN 45.678',
      years: 12,
      degrees: [
        { title: 'Licenciatura en PsicologÃ­a', institution: 'Universidad de Buenos Aires (UBA)', year: 2014 },
        { title: 'EspecializaciÃ³n en Terapia Cognitivo-Conductual', institution: 'AATC', year: 2018 }
      ],
      certifications: [
        'Terapia de exposiciÃ³n y prevenciÃ³n de respuesta (2020)',
        'Mindfulness Based Stress Reduction (MBSR, 2021)',
        'Primeros auxilios psicolÃ³gicos (2023)'
      ],
      services: [
        { name: 'Primera consulta de orientaciÃ³n', price: 32000, duration: 50 },
        { name: 'SesiÃ³n de psicoterapia', price: 30000, duration: 50 },
        { name: 'SesiÃ³n online', price: 28000, duration: 50 }
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
      id: 'psy-3', userId: 'u-psy-3', name: 'Lic. SofÃ­a Herrera',
      headline: 'Infancia y adolescencia Â· TEA y TDAH Â· AcompaÃ±amiento a familias',
      bio: 'Trabajo con niÃ±os, niÃ±as y adolescentes, y sobre todo con sus familias. Me especializo en autismo y TDAH desde un enfoque de derechos: entender cÃ³mo funciona cada chico, adaptar el entorno y construir estrategias que se sostengan en casa y en la escuela. TambiÃ©n acompaÃ±o procesos de diagnÃ³stico y duelo por diagnÃ³sticos. Atiendo en CÃ³rdoba capital y por videollamada a todo el paÃ­s.',
      specialties: ['TEA / Autismo', 'TDAH', 'Infancia y adolescencia', 'OrientaciÃ³n a familias'],
      approaches: ['Terapia Cognitivo-Conductual (TCC)', 'Modelo DIR/Floortime', 'PsicoeducaciÃ³n', 'Terapia sistÃ©mica'],
      modalities: ['presencial', 'online'],
      city: 'CÃ³rdoba', province: 'CÃ³rdoba', country: 'Argentina',
      address: 'Av. HipÃ³lito Yrigoyen 456, Nueva CÃ³rdoba',
      mapQuery: 'Av. HipÃ³lito Yrigoyen 456, CÃ³rdoba',
      languages: ['EspaÃ±ol'],
      license: 'MP 12.345',
      years: 9,
      degrees: [
        { title: 'Licenciatura en PsicologÃ­a', institution: 'Universidad Nacional de CÃ³rdoba', year: 2017 },
        { title: 'EspecializaciÃ³n en PsicologÃ­a del Desarrollo', institution: 'UNC', year: 2020 }
      ],
      certifications: [
        'Autismo y comunicaciÃ³n aumentativa (2021)',
        'IntervenciÃ³n conductual positiva en TDAH (2022)'
      ],
      services: [
        { name: 'Entrevista inicial con familia', price: 26000, duration: 60 },
        { name: 'SesiÃ³n con niÃ±o/as', price: 24000, duration: 45 },
        { name: 'SesiÃ³n online de orientaciÃ³n familiar', price: 22000, duration: 50 }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Mercado Pago'],
      coverage: ['Particular', 'Apross'],
      availability: [
        { days: 'Martes a viernes', hours: '10:00 a 18:00' },
        { days: 'SÃ¡bados', hours: '9:00 a 12:00' }
      ],
      whatsapp: '5493515557788',
      website: '',
      acceptingNew: true,
      verified: true,
      responseTime: '1 a 2 dÃ­as',
      createdAt: '2023-09-14T12:00:00.000Z'
    },
    {
      id: 'psy-5', userId: 'u-psy-5', name: 'Lic. Camila Duarte',
      headline: 'Duelo, trauma y TEPT Â· EMDR Â· Presencial en La Plata y online',
      bio: 'AcompaÃ±o procesos de duelo, pÃ©rdidas y experiencias traumÃ¡ticas. SÃ© que no hay recetas ni tiempos iguales: mi trabajo es construir un espacio seguro para que puedas acercarte a lo que duele sin desbordarte. Trabajo con EMDR y terapia centrada en trauma, y con una mirada de gÃ©nero. Atiendo adultos y adolescentes, tambiÃ©n en modalidad online.',
      specialties: ['Duelo', 'Trauma y TEPT', 'Ansiedad y pÃ¡nico'],
      approaches: ['EMDR', 'Terapia centrada en trauma', 'Terapia sistÃ©mica', 'Mindfulness'],
      modalities: ['presencial', 'online'],
      city: 'La Plata', province: 'Buenos Aires', country: 'Argentina',
      address: 'Calle 48 NÂ° 567, La Plata',
      mapQuery: 'Calle 48 567, La Plata',
      languages: ['EspaÃ±ol', 'InglÃ©s'],
      license: 'MP 23.456',
      years: 8,
      degrees: [
        { title: 'Licenciatura en PsicologÃ­a', institution: 'Universidad Nacional de La Plata', year: 2018 },
        { title: 'Posgrado en PsicotraumatologÃ­a', institution: 'AsociaciÃ³n EMDR Argentina', year: 2021 }
      ],
      certifications: [
        'EMDR nivel II (2022)',
        'Duelo y pÃ©rdidas: abordaje clÃ­nico (2023)'
      ],
      services: [
        { name: 'Entrevista inicial', price: 25000, duration: 60 },
        { name: 'SesiÃ³n de psicoterapia', price: 23000, duration: 50 },
        { name: 'SesiÃ³n online', price: 22000, duration: 50 }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Mercado Pago', 'Efectivo'],
      coverage: ['IOMA', 'Particular'],
      availability: [
        { days: 'Lunes, miÃ©rcoles y viernes', hours: '9:00 a 19:00' },
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
      id: 'psy-4', userId: 'u-psy-4', name: 'Mg. MartÃ­n Salas',
      headline: 'Pareja y vÃ­nculos Â· Terapia sistÃ©mica Â· Rosario y online',
      bio: 'Atiendo parejas y personas que quieren entender sus vÃ­nculos. No busco culpables: busco patrones que se repiten y formas de salir de ellos. Trabajo con terapia sistÃ©mica y comunicaciÃ³n no violenta, en sesiones conjuntas e individuales. TambiÃ©n acompaÃ±o decisiones de separaciÃ³n y recomposiciÃ³n familiar, con honestidad y sin apuro.',
      specialties: ['Pareja y vÃ­nculos', 'Sexualidad', 'Ansiedad y pÃ¡nico'],
      approaches: ['Terapia sistÃ©mica', 'ComunicaciÃ³n no violenta', 'Terapia Cognitivo-Conductual (TCC)'],
      modalities: ['presencial', 'online'],
      city: 'Rosario', province: 'Santa Fe', country: 'Argentina',
      address: 'CÃ³rdoba 1234, Piso 3, Rosario',
      mapQuery: 'CÃ³rdoba 1234, Rosario',
      languages: ['EspaÃ±ol', 'InglÃ©s'],
      license: 'MP 34.567',
      years: 14,
      degrees: [
        { title: 'Licenciatura en PsicologÃ­a', institution: 'Universidad Nacional de Rosario', year: 2010 },
        { title: 'MaestrÃ­a en Terapia Familiar SistÃ©mica', institution: 'UNR', year: 2016 }
      ],
      certifications: ['Terapia de pareja centrada en emociones (2020)', 'ComunicaciÃ³n no violenta (2021)'],
      services: [
        { name: 'Primera consulta de pareja', price: 42000, duration: 60 },
        { name: 'SesiÃ³n de pareja', price: 38000, duration: 60 },
        { name: 'SesiÃ³n individual online', price: 28000, duration: 50 }
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
      responseTime: '1 a 2 dÃ­as',
      createdAt: '2024-02-19T12:00:00.000Z'
    },
    {
      id: 'psy-6', userId: 'u-psy-6', name: 'Lic. JoaquÃ­n Pereyra',
      headline: 'Adicciones y consumo problemÃ¡tico Â· Entrevista motivacional Â· LanÃºs y online',
      bio: 'Trabajo con personas que quieren cambiar su relaciÃ³n con el alcohol, la marihuana, la cocaÃ­na o las apuestas, y con sus familias. No moralizo: acompaÃ±o. Uso entrevista motivacional y prevenciÃ³n de recaÃ­das, respetando el ritmo de cada proceso y articulando con grupos de apoyo cuando suma. Atiendo adolescentes y adultos, con confidencialidad absoluta.',
      specialties: ['Adicciones', 'Ansiedad y pÃ¡nico', 'Infancia y adolescencia'],
      approaches: ['Entrevista motivacional', 'PrevenciÃ³n de recaÃ­das', 'Terapia Cognitivo-Conductual (TCC)'],
      modalities: ['presencial', 'online'],
      city: 'LanÃºs', province: 'Buenos Aires', country: 'Argentina',
      address: 'Av. HipÃ³lito Yrigoyen 2345, LanÃºs',
      mapQuery: 'Av. HipÃ³lito Yrigoyen 2345, LanÃºs',
      languages: ['EspaÃ±ol'],
      license: 'MP 45.678',
      years: 11,
      degrees: [
        { title: 'Licenciatura en PsicologÃ­a', institution: 'Universidad de Buenos Aires (UBA)', year: 2013 },
        { title: 'EspecializaciÃ³n en Consumo ProblemÃ¡tico', institution: 'UBA', year: 2018 }
      ],
      certifications: ['Entrevista motivacional (2019)', 'PrevenciÃ³n de recaÃ­das (2020)'],
      services: [
        { name: 'Entrevista inicial', price: 22000, duration: 50 },
        { name: 'SesiÃ³n de seguimiento', price: 20000, duration: 50 },
        { name: 'OrientaciÃ³n a familias', price: 20000, duration: 50 }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Efectivo'],
      coverage: ['Particular', 'Programa municipal'],
      availability: [
        { days: 'Lunes a viernes', hours: '14:00 a 21:00' },
        { days: 'SÃ¡bados', hours: '9:00 a 13:00' }
      ],
      whatsapp: '5491155553344',
      website: '',
      acceptingNew: false,
      verified: true,
      responseTime: '1 a 3 dÃ­as',
      createdAt: '2024-08-22T12:00:00.000Z'
    },
    {
      id: 'psy-7', userId: 'u-psy-7', name: 'Dra. Renata Ãlvarez',
      headline: 'Trastornos alimentarios e imagen corporal Â· Mendoza y online',
      bio: 'AcompaÃ±o a personas con anorexia, bulimia, atracones y malestar con su imagen corporal, y a sus familias. Trabajo en red con nutriciÃ³n y medicina, con un enfoque que no pone el cuerpo en el centro del problema. Mi prioridad es que recuperes una relaciÃ³n mÃ¡s amable con vos y con la comida, a tu ritmo y sin juicios.',
      specialties: ['Trastornos alimentarios', 'DepresiÃ³n', 'Ansiedad y pÃ¡nico'],
      approaches: ['Terapia Cognitivo-Conductual (TCC)', 'Terapia DialÃ©ctico Conductual (DBT)', 'PsicoeducaciÃ³n'],
      modalities: ['presencial', 'online'],
      city: 'Mendoza', province: 'Mendoza', country: 'Argentina',
      address: 'Av. San MartÃ­n 789, Mendoza',
      mapQuery: 'Av. San MartÃ­n 789, Mendoza',
      languages: ['EspaÃ±ol', 'InglÃ©s'],
      license: 'MP 56.789',
      years: 10,
      degrees: [
        { title: 'Licenciatura en PsicologÃ­a', institution: 'Universidad Nacional de Cuyo', year: 2015 },
        { title: 'EspecializaciÃ³n en Trastornos de la Conducta Alimentaria', institution: 'UNCuyo', year: 2019 }
      ],
      certifications: ['DBT para trastornos alimentarios (2021)', 'Terapia basada en la familia (FBT, 2022)'],
      services: [
        { name: 'Entrevista inicial', price: 28000, duration: 60 },
        { name: 'SesiÃ³n de psicoterapia', price: 26000, duration: 50 },
        { name: 'SesiÃ³n online', price: 24000, duration: 50 }
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
      id: 'psy-8', userId: 'u-psy-8', name: 'Lic. TomÃ¡s Ibarra',
      headline: 'DepresiÃ³n y activaciÃ³n conductual Â· ACT Â· Online a todo el paÃ­s',
      bio: 'AcompaÃ±o a personas que sienten que todo pesa, que perdieron el interÃ©s o la energÃ­a. Trabajo con activaciÃ³n conductual y Terapia de AceptaciÃ³n y Compromiso: pequeÃ±os pasos, valores personales y menos exigencia. Atiendo solo online, lo que permite sostener el proceso desde donde estÃ©s, con horarios flexibles.',
      specialties: ['DepresiÃ³n', 'EstrÃ©s y burnout', 'Ansiedad y pÃ¡nico'],
      approaches: ['Terapia de AceptaciÃ³n y Compromiso (ACT)', 'ActivaciÃ³n conductual', 'Mindfulness'],
      modalities: ['online'],
      city: 'Mar del Plata', province: 'Buenos Aires', country: 'Argentina',
      address: 'Solo modalidad online (base en Mar del Plata)',
      mapQuery: 'Mar del Plata, Buenos Aires',
      languages: ['EspaÃ±ol'],
      license: 'MP 67.890',
      years: 6,
      degrees: [
        { title: 'Licenciatura en PsicologÃ­a', institution: 'Universidad Nacional de Mar del Plata', year: 2019 },
        { title: 'FormaciÃ³n en Terapia de AceptaciÃ³n y Compromiso', institution: 'ACBS Argentina', year: 2022 }
      ],
      certifications: ['ActivaciÃ³n conductual para depresiÃ³n (2021)', 'ACT aplicada a ansiedad y depresiÃ³n (2023)'],
      services: [
        { name: 'Primera consulta online', price: 18000, duration: 50 },
        { name: 'SesiÃ³n online', price: 16000, duration: 50 }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Mercado Pago'],
      coverage: ['Particular'],
      availability: [
        { days: 'Lunes a viernes', hours: '10:00 a 20:00' },
        { days: 'SÃ¡bados', hours: '10:00 a 13:00' }
      ],
      whatsapp: '5492235551122',
      website: '',
      acceptingNew: true,
      verified: true,
      responseTime: 'menos de 24 h',
      createdAt: '2025-07-15T12:00:00.000Z'
    },
    {
      id: 'psy-9', userId: 'u-psy-9', name: 'Lic. Agustina LÃ³pez',
      headline: 'PsicologÃ­a perinatal Â· Maternidad, paternidad y puerperio Â· CABA y online',
      bio: 'AcompaÃ±o el camino hacia la maternidad y la paternidad, el embarazo, el puerperio y tambiÃ©n las pÃ©rdidas gestacionales. Es una etapa que suele idealizarse y que muchas veces duele, asusta o agota. Ofrezco un espacio para hablar de lo que no se dice, con informaciÃ³n y sin juicio, coordinando con obstetricia y pediatrÃ­a cuando hace falta.',
      specialties: ['Perinatal', 'DepresiÃ³n', 'Duelo'],
      approaches: ['Terapia Cognitivo-Conductual (TCC)', 'PsicoeducaciÃ³n', 'Terapia centrada en trauma'],
      modalities: ['presencial', 'online'],
      city: 'CABA', province: 'Ciudad de Buenos Aires', country: 'Argentina',
      address: 'Av. Santa Fe 2345, Piso 4, CABA',
      mapQuery: 'Av. Santa Fe 2345, Ciudad de Buenos Aires',
      languages: ['EspaÃ±ol', 'InglÃ©s'],
      license: 'MN 78.901',
      years: 4,
      degrees: [
        { title: 'Licenciatura en PsicologÃ­a', institution: 'Universidad de Buenos Aires (UBA)', year: 2021 },
        { title: 'Posgrado en PsicologÃ­a Perinatal', institution: 'Universidad de Buenos Aires', year: 2024 }
      ],
      certifications: ['PsicologÃ­a perinatal y puerperio (2024)', 'Duelo gestacional y perinatal (2025)'],
      services: [
        { name: 'Primera consulta', price: 24000, duration: 50 },
        { name: 'SesiÃ³n de psicoterapia', price: 24000, duration: 50 },
        { name: 'SesiÃ³n online', price: 22000, duration: 50 }
      ],
      currency: 'ARS',
      paymentMethods: ['Transferencia', 'Mercado Pago'],
      coverage: ['Particular'],
      availability: [
        { days: 'Martes y jueves', hours: '9:00 a 18:00' },
        { days: 'MiÃ©rcoles', hours: '14:00 a 20:00' }
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
      title: 'Â¿CÃ³mo sÃ© si mi ansiedad necesita tratamiento o es solo estrÃ©s?',
      body: 'Hace meses que me despierto con el pecho apretado y pienso en todo lo que puede salir mal. Funciono en el trabajo, pero vivo cansada y evito juntadas. No sÃ© si exagero o si deberÃ­a consultar. Â¿CÃ³mo se distingue el estrÃ©s normal de un cuadro de ansiedad que necesita ayuda?',
      tags: ['ansiedad', 'estrÃ©s', 'diagnÃ³stico'],
      createdAt: '2026-10-12T14:20:00.000Z',
      views: 214, status: 'answered',
      answers: [
        {
          id: 'a-1', psyId: 'psy-1',
          body: 'Lo que describÃ­s merece atenciÃ³n, no porque "exageres", sino porque ya estÃ¡ afectando tu descanso, tu energÃ­a y tus vÃ­nculos. La diferencia prÃ¡ctica entre estrÃ©s y ansiedad clÃ­nica no es la intensidad de un dÃ­a, sino la duraciÃ³n (semanas o meses), la interferencia en la vida diaria y la evitaciÃ³n: cuando empezÃ¡s a dejar de hacer cosas para no sentir malestar.\n\nTres seÃ±ales que suelen justificar una consulta: el cuerpo se activa sin un peligro real (pecho apretado, insomnio, contracturas), la preocupaciÃ³n es difÃ­cil de frenar aunque sepas que no ayuda, y la evitaciÃ³n crece. No hace falta estar "al lÃ­mite" para pedir ayuda. Una primera entrevista sirve justamente para eso: ordenar lo que pasa y decidir juntos si es un acompaÃ±amiento breve o un tratamiento.',
          createdAt: '2026-10-12T18:05:00.000Z', upvotes: ['u-pat-2', 'u-pat-3', 'u-pat-4'], accepted: true
        },
        {
          id: 'a-2', psyId: 'psy-4',
          body: 'Sumo una idea: la ansiedad no se mide solo por lo que sentÃ­s, sino por cuÃ¡nto espacio ocupa. Si organizÃ¡s el dÃ­a alrededor de evitar la angustia, ya hay un dato importante. Consultar temprano suele ahorrar sufrimiento y tiempo.',
          createdAt: '2026-10-13T11:00:00.000Z', upvotes: ['u-pat-1'], accepted: false
        }
      ]
    },
    {
      id: 'q-2', authorId: 'u-pat-2', category: 'TDAH',
      title: 'Mi hijo de 9 aÃ±os no puede quedarse quieto en clase. Â¿Es TDAH o es inmadurez?',
      body: 'La maestra dice que se distrae, se para, interrumpe y pierde los Ãºtiles. En casa tambiÃ©n le cuesta terminar la tarea. Un pediatra nos dijo que "ya va a madurar", pero nosotros vemos que sufre. Â¿QuÃ© evaluaciÃ³n conviene hacer y a quÃ© edad se puede diagnosticar?',
      tags: ['TDAH', 'infancia', 'escuela'],
      createdAt: '2026-10-10T10:00:00.000Z',
      views: 389, status: 'answered',
      answers: [
        {
          id: 'a-3', psyId: 'psy-2',
          body: 'A los 9 aÃ±os ya se puede hacer una evaluaciÃ³n seria. La clave no es un cuestionario aislado, sino un proceso: entrevista con ustedes, informaciÃ³n de la escuela, observaciÃ³n clÃ­nica y pruebas que midan atenciÃ³n, memoria de trabajo e impulsividad. TambiÃ©n hay que descartar otras causas (sueÃ±o, audiciÃ³n, ansiedad, dificultades de aprendizaje), porque no todo lo que parece TDAH lo es.\n\nEl diagnÃ³stico no busca etiquetar, busca explicar para poder ayudar. Si se confirma, el abordaje combina pautas concretas en casa y escuela, entrenamiento de funciones ejecutivas y, cuando hace falta, evaluaciÃ³n mÃ©dica. No esperen a que "madure" si hay sufrimiento: una consulta no compromete a nada y ordena el panorama.',
          createdAt: '2026-10-10T15:30:00.000Z', upvotes: ['u-pat-1', 'u-pat-3', 'u-pat-4'], accepted: true
        },
        {
          id: 'a-4', psyId: 'psy-3',
          body: 'Agrego que la escuela suele necesitar orientaciones concretas: ubicaciÃ³n en el aula, consignas cortas, tiempos de movimiento planificados. Eso se puede trabajar junto con la familia y el equipo escolar, incluso antes de tener el diagnÃ³stico cerrado.',
          createdAt: '2026-10-11T09:15:00.000Z', upvotes: ['u-pat-2'], accepted: false
        }
      ]
    },
    {
      id: 'q-3', authorId: 'u-pat-3', category: 'TEA / Autismo',
      title: 'Me diagnosticaron autismo a los 34 aÃ±os y no sÃ© cÃ³mo seguir',
      body: 'DespuÃ©s de aÃ±os de sentirme "rara", una evaluaciÃ³n me dio el diagnÃ³stico de TEA nivel 1. Siento alivio, pero tambiÃ©n enojo y tristeza por todo lo que sufrÃ­ sin entender. No sÃ© si buscar terapia, un grupo o simplemente leer. Â¿QuÃ© suele ayudar en el posdiagnÃ³stico en adultos?',
      tags: ['autismo', 'adultos', 'posdiagnÃ³stico'],
      createdAt: '2026-10-08T20:00:00.000Z',
      views: 512, status: 'answered',
      answers: [
        {
          id: 'a-5', psyId: 'psy-3',
          body: 'Lo que sentÃ­s es muy comÃºn y vÃ¡lido: el diagnÃ³stico en la adultez suele traer alivio y duelo a la vez. El posdiagnÃ³stico no es un manual Ãºnico; es reconstruir tu historia con otra lectura. Suele ayudar: psicoeducaciÃ³n sobre autismo (para entender energÃ­a, sobrecarga y masking), un espacio terapÃ©utico para procesar el pasado y estrategias concretas de regulaciÃ³n y comunicaciÃ³n.\n\nTambiÃ©n ayuda mucho la comunidad: grupos de personas autistas adultas, no solo de familias. Y algo importante: no tenÃ©s que "entrenarte" para parecer neurotÃ­pico. El objetivo es que tu vida sea mÃ¡s habitable, no mÃ¡s disimulada. Si querÃ©s, puedo orientarte sobre cÃ³mo elegir el enfoque terapÃ©utico.',
          createdAt: '2026-10-09T12:40:00.000Z', upvotes: ['u-pat-1', 'u-pat-2', 'u-pat-4'], accepted: true
        }
      ]
    },
    {
      id: 'q-4', authorId: 'u-pat-1', category: 'DepresiÃ³n',
      title: 'PerdÃ­ las ganas de todo y me cuesta levantarme. Â¿Es depresiÃ³n?',
      body: 'Hace dos meses no disfruto nada, duermo mal, como poco y me siento culpable por no rendir. A veces pienso que serÃ­a mÃ¡s fÃ¡cil desaparecer, aunque no tengo un plan. Â¿CÃ³mo empiezo? Me da vergÃ¼enza contar esto.',
      tags: ['depresiÃ³n', 'desÃ¡nimo'],
      createdAt: '2026-10-14T08:00:00.000Z',
      views: 167, status: 'answered',
      answers: [
        {
          id: 'a-6', psyId: 'psy-8',
          body: 'Gracias por animarte a escribirlo. Lo que contÃ¡s encaja con sÃ­ntomas depresivos y, sobre todo, con un nivel de sufrimiento que merece acompaÃ±amiento. La vergÃ¼enza es parte del cuadro, no una prueba de que exagerÃ¡s. Empezar puede ser tan simple como una consulta: no tenÃ©s que tener todo claro ni contar todo de una vez.\n\nImportante: si en algÃºn momento aparece la idea de lastimarte o de desaparecer, busÃ¡ ayuda inmediata (guardia, lÃ­nea de crisis 135 en CABA o 911). No estÃ¡s solo/a. Con tratamiento, la depresiÃ³n es una de las condiciones con mejor respuesta; la activaciÃ³n conductual, por ejemplo, propone pasos muy pequeÃ±os y sostenibles.',
          createdAt: '2026-10-14T13:10:00.000Z', upvotes: ['u-pat-2', 'u-pat-3'], accepted: false
        }
      ]
    },
    {
      id: 'q-5', authorId: 'u-pat-4', category: 'Duelo',
      title: 'MuriÃ³ mi mamÃ¡ hace 3 meses y siento que deberÃ­a estar mejor',
      body: 'Todos me dicen que la vida sigue, que tengo que ser fuerte por mi familia. ExtraÃ±o su voz todos los dÃ­as y me enoja que el mundo siga. Â¿CuÃ¡nto dura un duelo? Â¿CuÃ¡ndo conviene pedir ayuda?',
      tags: ['duelo', 'pÃ©rdida', 'familia'],
      createdAt: '2026-10-05T16:30:00.000Z',
      views: 298, status: 'answered',
      answers: [
        {
          id: 'a-7', psyId: 'psy-5',
          body: 'No hay un plazo estÃ¡ndar y la frase "deberÃ­as estar mejor" no ayuda. El duelo no es una lÃ­nea recta: hay dÃ­as en que el dolor vuelve con fuerza y eso no significa retroceder. A los tres meses es esperable extraÃ±ar, enojarse y sentir que el mundo no tiene sentido.\n\nConviene consultar si el dolor te impide sostener lo bÃ¡sico (dormir, comer, trabajar), si aparece aislamiento prolongado, culpa intensa, o si sentÃ­s que no podÃ©s acercarte a nada de lo que vivieron. No hace falta esperar a "tocar fondo". Un espacio de duelo no borra la pÃ©rdida: te acompaÃ±a a que tenga un lugar sin que te desarme.',
          createdAt: '2026-10-06T10:00:00.000Z', upvotes: ['u-pat-1', 'u-pat-2'], accepted: true
        }
      ]
    },
    {
      id: 'q-6', authorId: 'u-pat-2', category: 'Pareja',
      title: 'Discutimos siempre por lo mismo y ya no sÃ© si es la relaciÃ³n o nosotros',
      body: 'Con mi pareja tenemos peleas que empiezan por cualquier cosa y terminan en silencio. Nos queremos, pero estamos cansados. Â¿La terapia de pareja sirve si uno de los dos estÃ¡ mÃ¡s dispuesto que el otro?',
      tags: ['pareja', 'comunicaciÃ³n', 'conflicto'],
      createdAt: '2026-10-11T19:00:00.000Z',
      views: 145, status: 'answered',
      answers: [
        {
          id: 'a-8', psyId: 'psy-4',
          body: 'SÃ­, sirve, aunque conviene hablar de expectativas: la terapia no "arregla" a la otra persona. Trabaja con el patrÃ³n que se arma entre los dos: quiÃ©n persigue, quiÃ©n se cierra, quÃ© se dice sin decir. Con que ambos puedan sostener las sesiones y estÃ©n dispuestos a mirar su parte, ya hay margen.\n\nSi uno no quiere ir, una consulta individual tambiÃ©n ayuda a ordenar quÃ© necesitÃ¡s y cÃ³mo plantear el tema sin que suene a ultimÃ¡tum. La pelea repetida suele ser una puerta de entrada a algo mÃ¡s de fondo; no es fracaso, es informaciÃ³n.',
          createdAt: '2026-10-12T09:30:00.000Z', upvotes: ['u-pat-3'], accepted: false
        }
      ]
    },
    {
      id: 'q-7', authorId: 'u-pat-3', category: 'Ansiedad',
      title: 'Me da terror hablar en pÃºblico y lo evito siempre. Â¿Tiene tratamiento?',
      body: 'En reuniones o exposiciones siento que me voy a desmayar, me tiembla la voz y me quedo en blanco. Ya rechacÃ© dos ascensos por miedo. Quiero trabajarlo, pero no sÃ© si la terapia alcanza.',
      tags: ['fobia social', 'ansiedad', 'trabajo'],
      createdAt: '2026-10-18T11:00:00.000Z',
      views: 96, status: 'open',
      answers: []
    },
    {
      id: 'q-8', authorId: 'u-pat-4', category: 'OrientaciÃ³n',
      title: 'Â¿CÃ³mo elijo psicÃ³logo sin gastar una fortuna en pruebas?',
      body: 'Veo perfiles muy distintos y no sÃ© cÃ³mo comparar. Â¿Conviene mirar la orientaciÃ³n teÃ³rica, los aÃ±os, el precio? Â¿CuÃ¡ntas sesiones deberÃ­a darle antes de decidir si me sirve?',
      tags: ['elegir terapeuta', 'honorarios'],
      createdAt: '2026-10-16T10:00:00.000Z',
      views: 231, status: 'answered',
      answers: [
        {
          id: 'a-9', psyId: 'psy-1',
          body: 'Mi recomendaciÃ³n prÃ¡ctica: elegÃ­ por problema y modalidad, no por "prestigio". MirÃ¡ si el perfil trabaja con lo que te pasa, si atiende online o presencial como necesitÃ¡s, y si el precio es sostenible en el tiempo. La orientaciÃ³n teÃ³rica importa menos al inicio que la sensaciÃ³n de que podÃ©s hablar sin ser juzgado.\n\nSobre cuÃ¡nto esperar: una primera entrevista ya te dice mucho. Si despuÃ©s de 3 o 4 sesiones no sentÃ­s rumbo ni confianza, es vÃ¡lido plantearlo o cambiar. Un buen profesional no se ofende: el proceso es tuyo. Y si el dinero es un lÃ­mite, preguntÃ¡ por honorarios diferenciales o instituciones con servicio social antes de descartar la ayuda.',
          createdAt: '2026-10-16T15:20:00.000Z', upvotes: ['u-pat-1', 'u-pat-2'], accepted: true
        }
      ]
    },
    {
      id: 'q-9', authorId: 'u-pat-1', category: 'Ansiedad',
      title: 'Insomnio desde que empecÃ© un trabajo nuevo: Â¿pastillas o terapia?',
      body: 'Me acuesto y la cabeza no para. Duermo 4 horas y rindo mal. Un conocido me recomendÃ³ melatonina y otro, ansiolÃ­ticos. Â¿QuÃ© es lo primero que deberÃ­a hacer?',
      tags: ['insomnio', 'trabajo', 'ansiedad'],
      createdAt: '2026-10-19T22:00:00.000Z',
      views: 74, status: 'answered',
      answers: [
        {
          id: 'a-10', psyId: 'psy-2',
          body: 'La melatonina no es un ansiolÃ­tico y los ansiolÃ­ticos requieren indicaciÃ³n mÃ©dica: no los tomes por recomendaciÃ³n de conocidos. Antes de medicar, conviene ordenar el sueÃ±o: horarios estables, luz y pantallas, cafeÃ­na, y sobre todo bajar la activaciÃ³n mental al acostarte (respiraciÃ³n, escritura de pendientes).\n\nSi el insomnio se sostiene mÃ¡s de tres semanas y afecta tu dÃ­a, una consulta con psicologÃ­a (terapia cognitivo-conductual para insomnio, que es el tratamiento de primera lÃ­nea) y, si hace falta, con medicina del sueÃ±o. La ansiedad y el insomnio suelen retroalimentarse; tratarlos juntos ahorra tiempo.',
          createdAt: '2026-10-20T09:00:00.000Z', upvotes: ['u-pat-3'], accepted: false
        }
      ]
    },
    {
      id: 'q-10', authorId: 'u-pat-2', category: 'Infancia y adolescencia',
      title: 'Mi hija de 13 aÃ±os estÃ¡ siendo hostigada en el colegio. Â¿CÃ³mo la ayudo?',
      body: 'Se aÃ­sla, no quiere ir a clases y llora de noche. La escuela dice que "son cosas de chicos". Quiero hacer algo sin empeorar la situaciÃ³n. Â¿QuÃ© puedo hacer como madre/padre y cuÃ¡ndo buscar ayuda profesional?',
      tags: ['bullying', 'adolescencia', 'escuela'],
      createdAt: '2026-10-20T18:00:00.000Z',
      views: 58, status: 'open',
      answers: []
    },
    {
      id: 'q-11', authorId: 'u-pat-3', category: 'Trauma y TEPT',
      title: 'DespuÃ©s de un asalto no puedo dormir ni salir sola. Â¿Es TEPT?',
      body: 'Fue hace dos meses. Evito el lugar, me sobresalto con cualquier ruido y revivo la escena. SÃ© que no es "normal", pero me da miedo que me digan que exagero. Â¿CÃ³mo es un tratamiento para trauma?',
      tags: ['trauma', 'TEPT', 'miedo'],
      createdAt: '2026-10-09T22:00:00.000Z',
      views: 203, status: 'answered',
      answers: [
        {
          id: 'a-11', psyId: 'psy-5',
          body: 'Lo que describÃ­s es consistente con una reacciÃ³n de estrÃ©s postraumÃ¡tico: reexperimentaciÃ³n, evitaciÃ³n e hipervigilancia. No exagerÃ¡s; tu cuerpo estÃ¡ intentando protegerte. Lo importante es que tiene tratamiento y que no hace falta esperar a que "pase solo".\n\nLos abordajes con mÃ¡s evidencia (TCC centrada en trauma, EMDR) trabajan de forma gradual y segura, sin obligarte a revivir todo de golpe. Si te da miedo empezar, se puede iniciar con estabilizaciÃ³n y regulaciÃ³n antes de procesar el recuerdo. BuscÃ¡ un profesional con formaciÃ³n especÃ­fica en trauma; si podÃ©s, contale esto tal cual lo escribiste acÃ¡.',
          createdAt: '2026-10-10T11:30:00.000Z', upvotes: ['u-pat-1', 'u-pat-4'], accepted: true
        }
      ]
    },
    {
      id: 'q-12', authorId: 'u-pat-4', category: 'OrientaciÃ³n',
      title: 'Â¿La terapia online funciona igual que la presencial?',
      body: 'Vivo en una ciudad chica y me da miedo que me vean yendo al psicÃ³logo. La verdad es que me resultarÃ­a mucho mÃ¡s fÃ¡cil hacerlo por videollamada, pero no sÃ© si sirve de verdad.',
      tags: ['terapia online', 'privacidad'],
      createdAt: '2026-10-02T12:00:00.000Z',
      views: 176, status: 'answered',
      answers: [
        {
          id: 'a-12', psyId: 'psy-8',
          body: 'SÃ­, para una amplia variedad de problemas la terapia online tiene resultados comparables a la presencial. Funciona mejor cuando hay un encuadre claro: mismo dÃ­a y horario, lugar privado, buena conexiÃ³n y un acuerdo sobre quÃ© hacer si la llamada se corta.\n\nLa privacidad es una ventaja concreta en tu caso. TambiÃ©n te permite elegir profesionales de otras ciudades. Lo que no reemplaza es la urgencia o ciertas evaluaciones que requieren presencia. Si te da miedo "que te vean", eso mismo se puede hablar en la primera sesiÃ³n: la confidencialidad es parte del trabajo.',
          createdAt: '2026-10-03T10:00:00.000Z', upvotes: ['u-pat-1', 'u-pat-2', 'u-pat-3'], accepted: true
        }
      ]
    }
  ],

  reviews: [
    { id: 'r-1', psyId: 'psy-1', patientId: 'u-pat-1', rating: 5, comment: 'Valentina me dio herramientas concretas desde la primera sesiÃ³n. SentÃ­ que me escuchaba de verdad y que el plan tenÃ­a sentido. Me cambiÃ³ la relaciÃ³n con la ansiedad.', createdAt: '2026-08-14T12:00:00.000Z' },
    { id: 'r-2', psyId: 'psy-1', patientId: 'u-pat-2', rating: 5, comment: 'Muy clara explicando, puntual y cÃ¡lida. La modalidad online funcionÃ³ perfecto.', createdAt: '2026-07-02T12:00:00.000Z' },
    { id: 'r-3', psyId: 'psy-1', patientId: 'u-pat-4', rating: 4, comment: 'Excelente profesional. A veces las sesiones se pasan rÃ¡pido, pero el acompaÃ±amiento es muy bueno.', createdAt: '2026-05-20T12:00:00.000Z' },
    { id: 'r-4', psyId: 'psy-2', patientId: 'u-pat-2', rating: 5, comment: 'La evaluaciÃ³n de mi hijo fue muy completa y la devoluciÃ³n fue clara, sin tecnicismos. El plan de estimulaciÃ³n nos ordenÃ³ la casa.', createdAt: '2026-09-03T12:00:00.000Z' },
    { id: 'r-5', psyId: 'psy-2', patientId: 'u-pat-3', rating: 5, comment: 'DespuÃ©s de aÃ±os de diagnÃ³sticos a medias, acÃ¡ entendÃ­ quÃ© me pasaba. Trato humano y riguroso.', createdAt: '2026-06-18T12:00:00.000Z' },
    { id: 'r-6', psyId: 'psy-2', patientId: 'u-pat-1', rating: 5, comment: 'Las sesiones online son muy dinÃ¡micas. Recomiendo especialmente para TDAH adulto.', createdAt: '2026-04-11T12:00:00.000Z' },
    { id: 'r-7', psyId: 'psy-2', patientId: 'u-pat-4', rating: 4, comment: 'Muy buen profesional. La espera para el turno fue de dos semanas, pero valiÃ³ la pena.', createdAt: '2026-03-02T12:00:00.000Z' },
    { id: 'r-8', psyId: 'psy-3', patientId: 'u-pat-2', rating: 5, comment: 'SofÃ­a acompaÃ±Ã³ a mi hija y a toda la familia. Nos dio estrategias para la escuela que realmente funcionaron.', createdAt: '2026-08-22T12:00:00.000Z' },
    { id: 'r-9', psyId: 'psy-3', patientId: 'u-pat-3', rating: 5, comment: 'Un espacio seguro y sin juicios. Muy recomendable.', createdAt: '2026-05-09T12:00:00.000Z' },
    { id: 'r-10', psyId: 'psy-3', patientId: 'u-pat-4', rating: 4, comment: 'Muy buena escucha. Solo online, la conexiÃ³n a veces fallÃ³, pero lo resolvimos.', createdAt: '2026-02-27T12:00:00.000Z' },
    { id: 'r-11', psyId: 'psy-4', patientId: 'u-pat-2', rating: 5, comment: 'Nos ayudÃ³ a salir de la pelea repetida. Las herramientas de comunicaciÃ³n nos cambiaron la semana.', createdAt: '2026-07-30T12:00:00.000Z' },
    { id: 'r-12', psyId: 'psy-4', patientId: 'u-pat-4', rating: 5, comment: 'Directo, honesto y muy respetuoso. Recomendado para terapia de pareja.', createdAt: '2026-06-05T12:00:00.000Z' },
    { id: 'r-13', psyId: 'psy-4', patientId: 'u-pat-1', rating: 3, comment: 'Buen profesional, aunque el enfoque no era lo que yo buscaba. Me derivÃ³ con criterio.', createdAt: '2026-03-19T12:00:00.000Z' },
    { id: 'r-14', psyId: 'psy-5', patientId: 'u-pat-4', rating: 5, comment: 'Camila me acompaÃ±Ã³ en el duelo por mi mamÃ¡ con una sensibilidad enorme. No me apurÃ³ nunca.', createdAt: '2026-08-01T12:00:00.000Z' },
    { id: 'r-15', psyId: 'psy-5', patientId: 'u-pat-3', rating: 5, comment: 'El trabajo con EMDR me ayudÃ³ a dormir despuÃ©s del asalto. Muy agradecida.', createdAt: '2026-05-14T12:00:00.000Z' },
    { id: 'r-16', psyId: 'psy-5', patientId: 'u-pat-1', rating: 2, comment: 'La profesional es cÃ¡lida, pero no me sentÃ­ cÃ³moda con la modalidad online y la frecuencia de sesiones.', createdAt: '2026-01-22T12:00:00.000Z' },
    { id: 'r-17', psyId: 'psy-6', patientId: 'u-pat-3', rating: 5, comment: 'JoaquÃ­n me acompaÃ±Ã³ sin juzgarme. La entrevista motivacional me ayudÃ³ a decidir por mÃ­, no por presiÃ³n.', createdAt: '2026-06-12T12:00:00.000Z' },
    { id: 'r-18', psyId: 'psy-6', patientId: 'u-pat-4', rating: 5, comment: 'Muy claro con los lÃ­mites y con la familia. Gracias.', createdAt: '2026-04-02T12:00:00.000Z' },
    { id: 'r-19', psyId: 'psy-6', patientId: 'u-pat-2', rating: 2, comment: 'No logramos coordinar horarios y las sesiones se suspendieron varias veces. La atenciÃ³n humana estuvo bien.', createdAt: '2026-02-10T12:00:00.000Z' },
    { id: 'r-20', psyId: 'psy-7', patientId: 'u-pat-1', rating: 5, comment: 'Renata es muy profesional y cuidadosa. El trabajo en red con la nutricionista fue clave.', createdAt: '2026-07-08T12:00:00.000Z' },
    { id: 'r-21', psyId: 'psy-7', patientId: 'u-pat-2', rating: 1, comment: 'No fue lo que esperaba: sentÃ­ que la sesiÃ³n se centrÃ³ en el peso y no en lo que yo necesitaba. No volverÃ­a.', createdAt: '2026-03-27T12:00:00.000Z' },
    { id: 'r-22', psyId: 'psy-8', patientId: 'u-pat-1', rating: 4, comment: 'TomÃ¡s es muy respetuoso y las sesiones online son cÃ³modas. Me ayudÃ³ a retomar pequeÃ±as rutinas.', createdAt: '2026-09-16T12:00:00.000Z' },
    { id: 'r-23', psyId: 'psy-9', patientId: 'u-pat-3', rating: 5, comment: 'Me acompaÃ±Ã³ en el posparto con mucha calidez y informaciÃ³n clara. Muy recomendable.', createdAt: '2026-10-01T12:00:00.000Z' }
  ],

  publications: [
    {
      id: 'pub-1', psyId: 'psy-2', type: 'article', category: 'TDAH',
      title: 'EstimulaciÃ³n de baja fidelidad visual: por quÃ© menos estÃ­mulo es mÃ¡s',
      summary: 'QuÃ© es la baja fidelidad visual, por quÃ© ayuda en TDAH y TEA, y cÃ³mo se usa clÃ­nicamente sin convertirlo en una moda.',
      body: 'La expresiÃ³n "baja fidelidad visual" no significa baja calidad: significa reducir la cantidad de estÃ­mulos irrelevantes que compiten por la atenciÃ³n. En pantallas saturadas, el cerebro con TDAH gasta energÃ­a filtrando ruido antes de poder concentrarse en la tarea.\n\nEn WineBOX trabajamos con juegos clÃ¡sicos y consolas de interfaz simple. La evidencia no viene del juego en sÃ­, sino del encuadre: objetivos claros, sesiones cortas, dificultad progresiva y un adulto que observa y registra. El juego es el contexto; el entrenamiento es la intenciÃ³n.\n\nTres criterios para que funcione: (1) el estÃ­mulo debe ser predecible y visualmente limpio; (2) la sesiÃ³n debe tener inicio y fin, con una duraciÃ³n acordada; (3) debe haber una devoluciÃ³n, no solo tiempo de pantalla. Sin esos tres elementos, cualquier juego es solo entretenimiento.\n\nLa estimulaciÃ³n no reemplaza el tratamiento integral ni la medicaciÃ³n cuando estÃ¡ indicada. Es una herramienta mÃ¡s, y como toda herramienta, funciona cuando hay un plan.',
      createdAt: '2026-09-02T12:00:00.000Z', likes: ['u-pat-1', 'u-pat-2', 'u-pat-3'], url: ''
    },
    {
      id: 'pub-2', psyId: 'psy-2', type: 'ebook', category: 'Ansiedad',
      title: 'El arte de la calma: protocolo breve para crisis de ansiedad',
      summary: 'Un ebook gratuito con el protocolo de 5 pasos para atravesar una crisis de ansiedad y regular el cuerpo.',
      body: 'Este ebook reÃºne el protocolo que usamos en consultorio para las crisis de ansiedad: reconocer lo que pasa, bajar la activaciÃ³n fisiolÃ³gica, anclar la atenciÃ³n y planificar el despuÃ©s. EstÃ¡ escrito para leer en cualquier momento, incluso durante una crisis, con lenguaje simple y ejercicios de pocos minutos.',
      createdAt: '2026-08-10T12:00:00.000Z', likes: ['u-pat-1', 'u-pat-4'], url: '../calma/'
    },
    {
      id: 'pub-3', psyId: 'psy-1', type: 'article', category: 'Ansiedad',
      title: 'Ansiedad: cÃ³mo distinguirla de la preocupaciÃ³n cotidiana',
      summary: 'Cinco seÃ±ales que ayudan a decidir cuÃ¡ndo consultar, sin alarmismo ni minimizaciÃ³n.',
      body: 'Preocuparse es normal y hasta Ãºtil. La ansiedad se vuelve un problema cuando la preocupaciÃ³n es difÃ­cil de controlar, dura semanas y empieza a ordenar tus decisiones: quÃ© evitÃ¡s, a dÃ³nde no vas, cuÃ¡nto dormÃ­s.\n\nCinco seÃ±ales para consultar: el cuerpo se activa sin peligro real; el sueÃ±o se rompe; la evitaciÃ³n crece; la preocupaciÃ³n consume mÃ¡s de una hora por dÃ­a; y aparece la sensaciÃ³n de que "no podÃ©s sola/o".\n\nNo hace falta tener un diagnÃ³stico para empezar terapia. Una primera entrevista es un espacio para ordenar, no una prueba que hay que aprobar.',
      createdAt: '2026-09-20T12:00:00.000Z', likes: ['u-pat-2', 'u-pat-3'], url: ''
    },
    {
      id: 'pub-4', psyId: 'psy-3', type: 'ebook', category: 'TEA / Autismo',
      title: 'GuÃ­a para familias: acompaÃ±ar a un hijo o hija autista',
      summary: 'Pautas cotidianas para casa y escuela, desde un enfoque de derechos y sin recetas mÃ¡gicas.',
      body: 'Una guÃ­a pensada para familias que reciben un diagnÃ³stico y no saben por dÃ³nde empezar. Explica quÃ© es el autismo sin mitos, cÃ³mo leer la conducta como comunicaciÃ³n, cÃ³mo adaptar rutinas y cÃ³mo dialogar con la escuela. Incluye un apartado sobre el cuidado de los cuidadores.',
      createdAt: '2026-07-15T12:00:00.000Z', likes: ['u-pat-2', 'u-pat-4'], url: '../kids/'
    },
    {
      id: 'pub-5', psyId: 'psy-5', type: 'ebook', category: 'Duelo',
      title: 'Duelo sin recetas: lo que nadie te dice sobre perder a alguien',
      summary: 'Sobre los tiempos del duelo, las frases que no ayudan y cuÃ¡ndo pedir acompaÃ±amiento.',
      body: 'El duelo no sigue etapas ordenadas. Este ebook propone una mirada honesta: hay dÃ­as mejores y peores, culpa, enojo y momentos de calma que tambiÃ©n confunden. Incluye ejercicios de escritura y criterios para buscar ayuda profesional.',
      createdAt: '2026-06-01T12:00:00.000Z', likes: ['u-pat-4', 'u-pat-1'], url: '../duelo/'
    },
    {
      id: 'pub-6', psyId: 'psy-4', type: 'article', category: 'Pareja',
      title: 'Discutir mejor: cuatro reglas para una pelea Ãºtil',
      summary: 'CÃ³mo salir del reproche y la defensa, y convertir la pelea en informaciÃ³n sobre el vÃ­nculo.',
      body: 'Una pelea Ãºtil tiene reglas: hablar de una situaciÃ³n concreta, no de "siempre"; describir el impacto en uno, no el defecto del otro; pedir un cambio posible y acordar una pausa antes de que la escalada rompa la conversaciÃ³n.\n\nEl objetivo no es ganar. Es entender quÃ© necesita cada uno y quÃ© acuerdo es sostenible. Si la pelea se repite sin cambios durante meses, la terapia de pareja puede ayudar a ver el patrÃ³n que ambos sostienen sin querer.',
      createdAt: '2026-08-25T12:00:00.000Z', likes: ['u-pat-2'], url: ''
    },
    {
      id: 'pub-7', psyId: 'psy-7', type: 'article', category: 'Trastornos alimentarios',
      title: 'Cuando la comida ocupa todo: seÃ±ales de alerta',
      summary: 'QuÃ© mirar mÃ¡s allÃ¡ del cuerpo y por quÃ© el abordaje tiene que ser interdisciplinario.',
      body: 'Las seÃ±ales de un trastorno alimentario no son solo el peso: son la rigidez con la comida, el aislamiento en las comidas, la culpa, el ejercicio compensatorio y la preocupaciÃ³n constante por la imagen.\n\nEl tratamiento eficaz es interdisciplinario: psicologÃ­a, nutriciÃ³n y medicina, con la familia incluida cuando es posible. Cuanto antes se consulta, mejor pronÃ³stico. No hace falta "estar muy mal" para pedir ayuda.',
      createdAt: '2026-09-28T12:00:00.000Z', likes: ['u-pat-1'], url: ''
    },
    {
      id: 'pub-8', psyId: 'psy-2', type: 'ebook', category: 'TDAH',
      title: 'TDAH en adultos: la guÃ­a que me hubiera gustado tener',
      summary: 'Sobre el diagnÃ³stico tardÃ­o, la vergÃ¼enza, la organizaciÃ³n y el derecho a pedir adaptaciones.',
      body: 'Muchos adultos llegan al diagnÃ³stico despuÃ©s de aÃ±os de sentirse "vagos" o "desordenados". Este ebook ordena el proceso: quÃ© evalÃºa una consulta, quÃ© no es TDAH, cÃ³mo funcionan la medicaciÃ³n y el entrenamiento de funciones ejecutivas, y quÃ© adaptaciones pedir en el trabajo y el estudio.',
      createdAt: '2026-05-18T12:00:00.000Z', likes: ['u-pat-1', 'u-pat-3'], url: '../procastinar/'
    },
    {
      id: 'pub-9', psyId: 'psy-6', type: 'article', category: 'Adicciones',
      title: 'Consumo problemÃ¡tico: por quÃ© la motivaciÃ³n no es un interruptor',
      summary: 'La entrevista motivacional explicada para familias que esperan que "toque fondo".',
      body: 'La motivaciÃ³n para cambiar no aparece de golpe ni por insistencia. Se construye en una relaciÃ³n donde la persona puede hablar sin sentirse juzgada. La entrevista motivacional trabaja con la ambivalencia: reconocer que hay una parte que quiere seguir y otra que quiere parar.\n\nPara las familias: los ultimÃ¡tums suelen aumentar la defensa. Los lÃ­mites claros y amorosos, junto con un espacio propio de apoyo, sostienen mejor el proceso.',
      createdAt: '2026-07-05T12:00:00.000Z', likes: ['u-pat-3'], url: ''
    },
    {
      id: 'pub-10', psyId: 'psy-9', type: 'article', category: 'Perinatal',
      title: 'Posparto: cuando el amor y el agotamiento conviven',
      summary: 'QuÃ© es la depresiÃ³n posparto, quÃ© no lo es y cÃ³mo pedir ayuda sin culpa.',
      body: 'El posparto no es una foto: es una etapa con cambios de sueÃ±o, hormonas, identidad y vÃ­nculos. Sentir ambivalencia no te hace mala madre ni mal padre. La depresiÃ³n posparto se distingue por persistencia, intensidad y afectaciÃ³n del funcionamiento.\n\nPedir ayuda temprano es un acto de cuidado hacia tu hijo/a y hacia vos. La terapia perinatal puede incluir psicoeducaciÃ³n, regulaciÃ³n emocional y coordinaciÃ³n con obstetricia y pediatrÃ­a.',
      createdAt: '2026-09-10T12:00:00.000Z', likes: ['u-pat-3'], url: ''
    },
    {
      id: 'pub-11', psyId: 'psy-8', type: 'article', category: 'DepresiÃ³n',
      title: 'ActivaciÃ³n conductual: cuando las ganas llegan despuÃ©s de empezar',
      summary: 'Por quÃ© esperar motivaciÃ³n para hacer cosas puede mantener la depresiÃ³n.',
      body: 'En la depresiÃ³n, el cÃ­rculo suele ser: no tengo ganas, no hago, me siento peor. La activaciÃ³n conductual propone lo inverso: empezar con acciones muy pequeÃ±as, planificadas y posibles, para que la motivaciÃ³n aparezca despuÃ©s.\n\nNo se trata de "poner voluntad". Se trata de acordar pasos mÃ­nimos, medibles y amables, y de registrar lo que pasa. Un plan de activaciÃ³n se construye con un profesional, no a base de exigencias.',
      createdAt: '2026-08-02T12:00:00.000Z', likes: ['u-pat-1'], url: ''
    },
    {
      id: 'pub-12', psyId: 'psy-2', type: 'article', category: 'NeuropsicologÃ­a',
      title: 'Â¿QuÃ© evalÃºa una evaluaciÃ³n neuropsicolÃ³gica (y quÃ© no)?',
      summary: 'Diferencias entre diagnÃ³stico, evaluaciÃ³n cognitiva y bÃºsqueda de respuestas.',
      body: 'Una evaluaciÃ³n neuropsicolÃ³gica mide atenciÃ³n, memoria, funciones ejecutivas, lenguaje, visoespacialidad y estado emocional, y las compara con lo esperable para la edad y la educaciÃ³n de la persona. No es un examen que se aprueba o se reprueba: es un mapa.\n\nNo reemplaza a la neurologÃ­a ni a la psiquiatrÃ­a, y no sirve para "etiquetar" a alguien. Sirve para entender fortalezas y dificultades, y para armar un plan de apoyo concreto. El informe debe ser comprensible para la persona y para su familia.',
      createdAt: '2026-04-20T12:00:00.000Z', likes: ['u-pat-2', 'u-pat-3'], url: ''
    },
    // Ebooks adicionales para completar la biblioteca de 14
    {
      id: 'pub-13', psyId: 'psy-3', type: 'ebook', category: 'Ansiedad',
      title: 'Respirar para volver: tÃ©cnicas de regulaciÃ³n emocional',
      summary: 'Ejercicios prÃ¡cticos de respiraciÃ³n y grounding para momentos de alta activaciÃ³n.',
      body: 'Este ebook recopila tÃ©cnicas validadas de regulaciÃ³n emocional: respiraciÃ³n diafragmÃ¡tica, grounding 5-4-3-2-1, relajaciÃ³n muscular progresiva y anclajes sensoriales. Cada ejercicio viene con instrucciones paso a paso y sugerencias de prÃ¡ctica diaria.',
      createdAt: '2026-09-05T12:00:00.000Z', likes: ['u-pat-1', 'u-pat-2'], url: '../respirar/'
    },
    {
      id: 'pub-14', psyId: 'psy-4', type: 'ebook', category: 'Pareja',
      title: 'ComunicaciÃ³n no violenta en la pareja',
      summary: 'Herramientas para expresar necesidades sin culpa ni agresiÃ³n.',
      body: 'La comunicaciÃ³n no violenta propone observar sin juzgar, expresar sentimientos y necesidades, y pedir cosas concretas. Este ebook entrega ejercicios para cada paso, con ejemplos reales de parejas que practican el mÃ©todo.',
      createdAt: '2026-08-15T12:00:00.000Z', likes: ['u-pat-3'], url: '../cnv/'
    },
    {
      id: 'pub-15', psyId: 'psy-5', type: 'ebook', category: 'Duelo',
      title: 'El cuerpo recuerda: duelo y somatizaciÃ³n',
      summary: 'CÃ³mo el dolor emocional se expresa a travÃ©s del cuerpo y quÃ© hacer al respecto.',
      body: 'El duelo no solo afecta la mente: puede generar dolores de cabeza, tensiÃ³n muscular, problemas digestivos y fatiga crÃ³nica. Este ebook explica la conexiÃ³n mente-cuerpo en el proceso de pÃ©rdida y ofrece tÃ©cnicas de liberaciÃ³n corporal.',
      createdAt: '2026-07-20T12:00:00.000Z', likes: ['u-pat-4', 'u-pat-1'], url: '../cuerpo/'
    },
    {
      id: 'pub-16', psyId: 'psy-6', type: 'ebook', category: 'Autoestima',
      title: 'Hablarle como le hablarÃ­as a un amigo',
      summary: 'Trabajo interno para reducir la autocrÃ­tica destructiva.',
      body: 'La voz interior severa no es neutral: moldea nuestras decisiones y nuestra salud mental. Este ebook guÃ­a un proceso de 4 semanas para transformar el diÃ¡logo interno desde la compasiÃ³n, con diarios de prÃ¡ctica y ejercicios de auto-observaciÃ³n.',
      createdAt: '2026-06-10T12:00:00.000Z', likes: ['u-pat-2', 'u-pat-3'], url: '../amigo/'
    },
    {
      id: 'pub-17', psyId: 'psy-7', type: 'ebook', category: 'Adicciones',
      title: 'AntÃ­dotos: guÃ­a para familias de personas con adicciones',
      summary: 'CÃ³mo acompaÃ±ar sin caer en la codependencia.',
      body: 'Cuidar a alguien con un trastorno por uso de sustancias requiere lÃ­mites claros, amor sin habilitaciÃ³n y autocuidado del cuidador. Este ebook entrega herramientas para establecer rutinas familiares saludables mientras se acompaÃ±a el proceso de recuperaciÃ³n.',
      createdAt: '2026-05-25T12:00:00.000Z', likes: ['u-pat-1'], url: '../antidotos/'
    },
    {
      id: 'pub-18', psyId: 'psy-8', type: 'ebook', category: 'Infancia',
      title: 'Emociones en crecimiento: guÃ­a para padres de 3 a 8 aÃ±os',
      summary: 'CÃ³mo nombrar, validar y regular las emociones infantiles.',
      body: 'Los niÃ±os necesitan aprender a nombrar lo que sienten antes de poder regularlo. Este ebook ofrece actividades por edad, seÃ±ales de alerta emocional y estrategias de regulaciÃ³n adaptadas al desarrollo infantil.',
      createdAt: '2026-04-15T12:00:00.000Z', likes: ['u-pat-4', 'u-pat-2'], url: '../crecer/'
    },
    {
      id: 'pub-19', psyId: 'psy-9', type: 'ebook', category: 'DepresiÃ³n',
      title: 'PequeÃ±os pasos: plan de activaciÃ³n conductual',
      summary: 'DiseÃ±ar rutinas posibles cuando la depresiÃ³n pesa.',
      body: 'La depresiÃ³n hace que hasta las tareas simples parezcan imposibles. Este ebook entrega un sistema de micro-hÃ¡bitos que construye momentum sin exigir perfecciÃ³n, con plantillas descargables para organizar dÃ­as difÃ­ciles.',
      createdAt: '2026-03-20T12:00:00.000Z', likes: ['u-pat-3'], url: '../pasos/'
    },
    {
      id: 'pub-20', psyId: 'psy-2', type: 'ebook', category: 'TDAH',
      title: 'OrganizaciÃ³n sin culpa: sistema anti-procrastinaciÃ³n',
      summary: 'Herramientas concretas para personas con TDAH que luchan con la gestiÃ³n del tiempo.',
      body: 'El TDAH no es falta de voluntad: es un tema de regulaciÃ³n atencional. Este ebook propone mÃ©todos de ExternalizaciÃ³n de memoria, time blocking adaptado y recompensas inmediatas que funcionan con el cerebro TDAH, no contra Ã©l.',
      createdAt: '2026-02-10T12:00:00.000Z', likes: ['u-pat-1', 'u-pat-4'], url: '../organizar/'
    },
    {
      id: 'pub-21', psyId: 'psy-1', type: 'ebook', category: 'Ansiedad',
      title: 'El miedo Ãºtil: cuÃ¡ndo la ansiedad protege y cuÃ¡ndo sobra',
      summary: 'Distinguir entre ansiedad adaptativa y patolÃ³gica.',
      body: 'No toda ansiedad es mala: algunas formas son protecciones necesarias. Este ebook enseÃ±a a identificar cuÃ¡ndo la ansiedad sirve y cuÃ¡ndo se ha convertido en un mecanismo disfuncional, con criterios de evaluaciÃ³n y protocolos de intervenciÃ³n.',
      createdAt: '2026-01-15T12:00:00.000Z', likes: ['u-pat-2'], url: '../miedo/'
    },
    {
      id: 'pub-22', psyId: 'psy-3', type: 'ebook', category: 'LGBTQ+',
      title: 'Salud mental affirming: GuÃ­a para personas trans y NO Binarias',
      summary: 'AcompaÃ±amiento psicolÃ³gico respetuoso de la diversidad de gÃ©nero.',
      body: 'Este ebook ofrece marcos conceptuales para entender la disforia de gÃ©nero, el proceso de afirmaciÃ³n y los desafÃ­os especÃ­ficos de salud mental en personas trans y NO Binarias. Incluye glosario, recursos legales y protocolos de atenciÃ³n afirmativa.',
      createdAt: '2025-12-20T12:00:00.000Z', likes: ['u-pat-1', 'u-pat-3'], url: '../affirming/'
    },
    {
      id: 'pub-23', psyId: 'psy-5', type: 'ebook', category: 'Trauma',
      title: 'El cuerpo no olvida: introducciÃ³n al trauma complejo',
      summary: 'Entender cÃ³mo el trauma persiste mÃ¡s allÃ¡ del recuerdo consciente.',
      body: 'El trauma complejo deja huellas en el sistema nervioso incluso cuando no recordamos los hechos. Este ebook explica los sÃ­ntomas disociativos, la hipervigilancia y la desconexiÃ³n emocional, con referencias al modelo de Pat Ogden y terapie somÃ¡ticas.',
      createdAt: '2025-11-10T12:00:00.000Z', likes: ['u-pat-4'], url: '../trauma/'
    },
    {
      id: 'pub-24', psyId: 'psy-7', type: 'ebook', category: 'Maternidad',
      title: 'Ser madre sin perfecciÃ³n: desmintiendo el mito de la mamÃ¡ ideal',
      summary: 'AceptaciÃ³n y autocuidado en la primera infancia.',
      body: 'La cultural de la maternidad perfecta genera culpa innecesaria. Este ebook invita a repensar los estÃ¡ndares irreales, ofrecer estrategias de autocuidado realista y construir redes de apoyo comunitario para nuevas madres.',
      createdAt: '2025-10-05T12:00:00.000Z', likes: ['u-pat-2', 'u-pat-1'], url: '../madre/'
    }
  ],

  contacts: [
    { id: 'c-1', psyId: 'psy-1', patientId: 'u-pat-1', subject: 'Consulta por ansiedad', message: 'Hola Valentina, quisiera una primera entrevista. PreferirÃ­a online por la tarde.', createdAt: '2026-08-01T10:00:00.000Z', status: 'accepted' },
    { id: 'c-2', psyId: 'psy-2', patientId: 'u-pat-2', subject: 'EvaluaciÃ³n de mi hijo', message: 'Necesitamos una evaluaciÃ³n por TDAH. Tenemos derivaciÃ³n del pediatra.', createdAt: '2026-08-28T10:00:00.000Z', status: 'accepted' },
    { id: 'c-3', psyId: 'psy-5', patientId: 'u-pat-4', subject: 'Duelo', message: 'PerdÃ­ a mi mamÃ¡ hace dos meses y quisiera empezar terapia.', createdAt: '2026-07-25T10:00:00.000Z', status: 'accepted' },
    { id: 'c-4', psyId: 'psy-8', patientId: 'u-pat-1', subject: 'Terapia online', message: 'Quisiera consultar por sesiones online para depresiÃ³n.', createdAt: '2026-10-15T10:00:00.000Z', status: 'pending' },
    { id: 'c-5', psyId: 'psy-3', patientId: 'u-pat-2', subject: 'OrientaciÃ³n familiar', message: 'Quisiera una entrevista para orientarnos con nuestra hija.', createdAt: '2026-08-15T10:00:00.000Z', status: 'accepted' },
    { id: 'c-6', psyId: 'psy-6', patientId: 'u-pat-3', subject: 'Consumo', message: 'Quiero consultar por mi relaciÃ³n con el alcohol. Es confidencial, Â¿no?', createdAt: '2026-09-01T10:00:00.000Z', status: 'declined' },
    { id: 'c-7', psyId: 'psy-7', patientId: 'u-pat-4', subject: 'Consulta', message: 'Quisiera una primera consulta online.', createdAt: '2026-10-18T10:00:00.000Z', status: 'pending' }
  ],

  /* Historial de puntos (agregado, para que el ranking arranque con historia).
     Los eventos nuevos se suman uno por acciÃ³n desde la interfaz. */
  pointEvents: [
    { id: 'pe-1', psyId: 'psy-2', type: 'answer', delta: 160, label: '16 respuestas publicadas en el foro', createdAt: '2026-06-01T10:00:00.000Z' },
    { id: 'pe-2', psyId: 'psy-2', type: 'accepted', delta: 175, label: '7 respuestas elegidas como mejores', createdAt: '2026-06-15T10:00:00.000Z' },
    { id: 'pe-3', psyId: 'psy-2', type: 'upvote', delta: 72, label: '24 votos positivos de pacientes', createdAt: '2026-07-01T10:00:00.000Z' },
    { id: 'pe-4', psyId: 'psy-2', type: 'article', delta: 60, label: '3 artÃ­culos publicados', createdAt: '2026-07-20T10:00:00.000Z' },
    { id: 'pe-5', psyId: 'psy-2', type: 'ebook', delta: 80, label: '2 ebooks publicados', createdAt: '2026-08-10T10:00:00.000Z' },
    { id: 'pe-6', psyId: 'psy-2', type: 'review', delta: 53, label: 'Calificaciones recibidas (4Ã—5â˜…, 1Ã—4â˜…)', createdAt: '2026-09-03T10:00:00.000Z' },

    { id: 'pe-7', psyId: 'psy-1', type: 'answer', delta: 110, label: '11 respuestas publicadas en el foro', createdAt: '2026-06-01T10:00:00.000Z' },
    { id: 'pe-8', psyId: 'psy-1', type: 'accepted', delta: 100, label: '4 respuestas elegidas como mejores', createdAt: '2026-06-20T10:00:00.000Z' },
    { id: 'pe-9', psyId: 'psy-1', type: 'upvote', delta: 54, label: '18 votos positivos de pacientes', createdAt: '2026-07-05T10:00:00.000Z' },
    { id: 'pe-10', psyId: 'psy-1', type: 'article', delta: 40, label: '2 artÃ­culos publicados', createdAt: '2026-08-01T10:00:00.000Z' },
    { id: 'pe-11', psyId: 'psy-1', type: 'ebook', delta: 40, label: '1 ebook publicado', createdAt: '2026-08-20T10:00:00.000Z' },
    { id: 'pe-12', psyId: 'psy-1', type: 'review', delta: 38, label: 'Calificaciones recibidas (2Ã—5â˜…, 1Ã—4â˜…)', createdAt: '2026-09-10T10:00:00.000Z' },

    { id: 'pe-13', psyId: 'psy-3', type: 'answer', delta: 90, label: '9 respuestas publicadas en el foro', createdAt: '2026-06-10T10:00:00.000Z' },
    { id: 'pe-14', psyId: 'psy-3', type: 'accepted', delta: 75, label: '3 respuestas elegidas como mejores', createdAt: '2026-07-01T10:00:00.000Z' },
    { id: 'pe-15', psyId: 'psy-3', type: 'upvote', delta: 36, label: '12 votos positivos de pacientes', createdAt: '2026-07-25T10:00:00.000Z' },
    { id: 'pe-16', psyId: 'psy-3', type: 'article', delta: 20, label: '1 artÃ­culo publicado', createdAt: '2026-08-18T10:00:00.000Z' },
    { id: 'pe-17', psyId: 'psy-3', type: 'ebook', delta: 40, label: '1 ebook publicado', createdAt: '2026-08-30T10:00:00.000Z' },
    { id: 'pe-18', psyId: 'psy-3', type: 'review', delta: 38, label: 'Calificaciones recibidas (2Ã—5â˜…, 1Ã—4â˜…)', createdAt: '2026-09-12T10:00:00.000Z' },

    { id: 'pe-19', psyId: 'psy-4', type: 'answer', delta: 80, label: '8 respuestas publicadas en el foro', createdAt: '2026-06-05T10:00:00.000Z' },
    { id: 'pe-20', psyId: 'psy-4', type: 'accepted', delta: 50, label: '2 respuestas elegidas como mejores', createdAt: '2026-07-10T10:00:00.000Z' },
    { id: 'pe-21', psyId: 'psy-4', type: 'upvote', delta: 30, label: '10 votos positivos de pacientes', createdAt: '2026-08-01T10:00:00.000Z' },
    { id: 'pe-22', psyId: 'psy-4', type: 'article', delta: 20, label: '1 artÃ­culo publicado', createdAt: '2026-08-25T10:00:00.000Z' },
    { id: 'pe-23', psyId: 'psy-4', type: 'review', delta: 30, label: 'Calificaciones recibidas (2Ã—5â˜…, 1Ã—3â˜…)', createdAt: '2026-09-15T10:00:00.000Z' },

    { id: 'pe-24', psyId: 'psy-5', type: 'answer', delta: 70, label: '7 respuestas publicadas en el foro', createdAt: '2026-06-08T10:00:00.000Z' },
    { id: 'pe-25', psyId: 'psy-5', type: 'accepted', delta: 50, label: '2 respuestas elegidas como mejores', createdAt: '2026-07-12T10:00:00.000Z' },
    { id: 'pe-26', psyId: 'psy-5', type: 'upvote', delta: 24, label: '8 votos positivos de pacientes', createdAt: '2026-08-05T10:00:00.000Z' },
    { id: 'pe-27', psyId: 'psy-5', type: 'ebook', delta: 40, label: '1 ebook publicado', createdAt: '2026-08-28T10:00:00.000Z' },
    { id: 'pe-28', psyId: 'psy-5', type: 'review', delta: 15, label: 'Calificaciones recibidas (2Ã—5â˜…, 1Ã—2â˜…)', createdAt: '2026-09-20T10:00:00.000Z' },

    { id: 'pe-29', psyId: 'psy-6', type: 'answer', delta: 50, label: '5 respuestas publicadas en el foro', createdAt: '2026-06-12T10:00:00.000Z' },
    { id: 'pe-30', psyId: 'psy-6', type: 'accepted', delta: 25, label: '1 respuesta elegida como mejor', createdAt: '2026-07-15T10:00:00.000Z' },
    { id: 'pe-31', psyId: 'psy-6', type: 'upvote', delta: 18, label: '6 votos positivos de pacientes', createdAt: '2026-08-10T10:00:00.000Z' },
    { id: 'pe-32', psyId: 'psy-6', type: 'article', delta: 20, label: '1 artÃ­culo publicado', createdAt: '2026-09-02T10:00:00.000Z' },
    { id: 'pe-33', psyId: 'psy-6', type: 'review', delta: 15, label: 'Calificaciones recibidas (2Ã—5â˜…, 1Ã—2â˜…)', createdAt: '2026-09-22T10:00:00.000Z' },

    { id: 'pe-34', psyId: 'psy-7', type: 'answer', delta: 40, label: '4 respuestas publicadas en el foro', createdAt: '2026-06-18T10:00:00.000Z' },
    { id: 'pe-35', psyId: 'psy-7', type: 'accepted', delta: 25, label: '1 respuesta elegida como mejor', createdAt: '2026-07-20T10:00:00.000Z' },
    { id: 'pe-36', psyId: 'psy-7', type: 'upvote', delta: 9, label: '3 votos positivos de pacientes', createdAt: '2026-08-12T10:00:00.000Z' },
    { id: 'pe-37', psyId: 'psy-7', type: 'article', delta: 20, label: '1 artÃ­culo publicado', createdAt: '2026-09-05T10:00:00.000Z' },
    { id: 'pe-38', psyId: 'psy-7', type: 'review', delta: -15, label: 'Calificaciones recibidas (1Ã—5â˜…, 1Ã—1â˜…)', createdAt: '2026-09-25T10:00:00.000Z' },

    { id: 'pe-39', psyId: 'psy-8', type: 'answer', delta: 20, label: '2 respuestas publicadas en el foro', createdAt: '2026-07-01T10:00:00.000Z' },
    { id: 'pe-40', psyId: 'psy-8', type: 'accepted', delta: 25, label: '1 respuesta elegida como mejor', createdAt: '2026-08-01T10:00:00.000Z' },
    { id: 'pe-41', psyId: 'psy-8', type: 'upvote', delta: 3, label: '1 voto positivo de paciente', createdAt: '2026-09-01T10:00:00.000Z' },
    { id: 'pe-42', psyId: 'psy-8', type: 'review', delta: 8, label: 'CalificaciÃ³n de 4 estrellas', createdAt: '2026-09-16T10:00:00.000Z' },

    { id: 'pe-43', psyId: 'psy-9', type: 'answer', delta: 20, label: '2 respuestas publicadas en el foro', createdAt: '2026-08-01T10:00:00.000Z' },
    { id: 'pe-44', psyId: 'psy-9', type: 'upvote', delta: 6, label: '2 votos positivos de pacientes', createdAt: '2026-09-01T10:00:00.000Z' },
    { id: 'pe-45', psyId: 'psy-9', type: 'review', delta: 15, label: 'CalificaciÃ³n de 5 estrellas', createdAt: '2026-10-01T10:00:00.000Z' }
  ],

  reports: [
    { id: 'rep-1', targetType: 'question', targetId: 'q-7', reporterId: 'u-pat-2', reason: 'Datos personales en el tÃ­tulo', createdAt: '2026-10-19T10:00:00.000Z', status: 'open' }
  ],

  posts: [
    {
      id: 'post-1', authorId: 'u-psy-1', createdAt: '2026-10-23T10:30:00.000Z',
      body: 'Una cosa que repito mucho en consulta: la ansiedad no se combate con "pensÃ¡ positivo". Se trabaja entendiendo quÃ© la activa, quÃ© la mantiene y quÃ© pequeÃ±as acciones te devuelven control. Si estÃ¡s postergando una consulta por miedo a que te digan que exagerÃ¡s, ese miedo tambiÃ©n es parte de lo que podemos mirar juntos.',
      imageUrl: '', likes: ['u-pat-1', 'u-pat-2', 'u-pat-3', 'u-pat-4'], comments: [
        { id: 'pc-1', authorId: 'u-pat-1', body: 'Me costÃ³ mucho animarme, pero leer esto ayuda.', createdAt: '2026-10-23T10:44:00.000Z' },
        { id: 'pc-2', authorId: 'u-psy-2', body: 'Totalmente. La evitaciÃ³n es el mejor indicador de que algo merece atenciÃ³n.', createdAt: '2026-10-23T11:02:00.000Z' }
      ]
    },
    {
      id: 'post-2', authorId: 'u-psy-2', createdAt: '2026-10-23T09:10:00.000Z',
      body: 'Estamos probando la nueva consola de estimulaciÃ³n de baja fidelidad visual con pacientes adultos con TDAH. La clave no es el juego: es el encuadre (objetivo, tiempo acotado y registro). Menos estÃ­mulo, mÃ¡s aprendizaje. Si querÃ©s probarla, estÃ¡ abierta y es gratuita.',
      imageUrl: '', likes: ['u-pat-1', 'u-pat-2', 'u-psy-1', 'u-psy-3', 'u-pat-3'], comments: [
        { id: 'pc-3', authorId: 'u-pat-2', body: 'Â¿Sirve para niÃ±os de 9 aÃ±os?', createdAt: '2026-10-23T09:30:00.000Z' },
        { id: 'pc-4', authorId: 'u-psy-2', body: 'SÃ­, con supervisiÃ³n y sesiones cortas. La evaluaciÃ³n primero.', createdAt: '2026-10-23T09:41:00.000Z' }
      ]
    },
    {
      id: 'post-3', authorId: 'u-psy-3', createdAt: '2026-10-22T18:20:00.000Z',
      body: 'Cuando un chico autista se tapa los oÃ­dos no estÃ¡ "haciendo berrinche": estÃ¡ regulando un sistema nervioso que recibe demasiado. Antes de pedir que se adapte, preguntemos quÃ© del entorno podemos cambiar. Adaptar no es malcriar: es enseÃ±ar en condiciones posibles.',
      imageUrl: '', likes: ['u-pat-3', 'u-pat-2', 'u-psy-1', 'u-psy-2', 'u-pat-1'], comments: [
        { id: 'pc-5', authorId: 'u-pat-3', body: 'Gracias por decirlo asÃ­. OjalÃ¡ lo hubiera leÃ­do de chica.', createdAt: '2026-10-22T18:40:00.000Z' }
      ]
    },
    {
      id: 'post-4', authorId: 'u-pat-1', createdAt: '2026-10-22T16:00:00.000Z',
      body: 'Hoy fui a mi primera entrevista despuÃ©s de meses de pensarlo. No fue tan terrible como lo imaginaba. Si estÃ¡s en esa duda, te entiendo: pedir ayuda tambiÃ©n da vergÃ¼enza. Pero se puede.',
      imageUrl: '', likes: ['u-psy-1', 'u-psy-2', 'u-pat-2', 'u-pat-3'], comments: [
        { id: 'pc-6', authorId: 'u-psy-1', body: 'QuÃ© bueno leerte. El primer paso suele ser el mÃ¡s costoso.', createdAt: '2026-10-22T16:15:00.000Z' }
      ]
    },
    {
      id: 'post-5', authorId: 'u-psy-5', createdAt: '2026-10-22T12:40:00.000Z',
      body: 'El duelo no sigue etapas ordenadas. Hay dÃ­as de enojo, dÃ­as de calma que dan culpa y dÃ­as en que la ausencia pesa todo. No hay un plazo correcto. Si te dicen "ya deberÃ­as estar mejor", recordÃ¡ que el tiempo del otro no es tu tiempo.',
      imageUrl: '', likes: ['u-pat-4', 'u-pat-1', 'u-pat-2'], comments: []
    },
    {
      id: 'post-6', authorId: 'u-pat-3', createdAt: '2026-10-21T20:10:00.000Z',
      body: 'Descubrir que soy autista a los 34 explicÃ³ muchas cosas y abriÃ³ otras. Estoy armando un pequeÃ±o grupo de lectura sobre autismo en adultos. Si te interesa, escribime por chat.',
      imageUrl: '', likes: ['u-psy-3', 'u-pat-1'], comments: [
        { id: 'pc-7', authorId: 'u-psy-3', body: 'QuÃ© lindo que circule. Los grupos de pares hacen mucho.', createdAt: '2026-10-21T20:30:00.000Z' }
      ]
    },
    {
      id: 'post-7', authorId: 'u-psy-4', createdAt: '2026-10-21T11:00:00.000Z',
      body: 'Una pelea repetida no siempre significa que la relaciÃ³n estÃ© mal: a veces es la puerta de entrada a algo que ninguno de los dos se anima a nombrar. Antes de decidir, vale la pena preguntarse: Â¿quÃ© necesita cada uno detrÃ¡s del reproche?',
      imageUrl: '', likes: ['u-pat-2', 'u-pat-4'], comments: []
    },
    {
      id: 'post-8', authorId: 'u-psy-9', createdAt: '2026-10-20T17:30:00.000Z',
      body: 'Posparto: no todo es amor instantÃ¡neo. TambiÃ©n hay cansancio, ambivalencia, culpa y miedo. Sentir eso no te hace mala madre ni mal padre. Si la tristeza se sostiene, pedir ayuda es un acto de cuidado, no una falla.',
      imageUrl: '', likes: ['u-pat-1', 'u-pat-3', 'u-psy-1'], comments: []
    },
    {
      id: 'post-9', authorId: 'u-psy-8', createdAt: '2026-10-20T10:15:00.000Z',
      body: 'En depresiÃ³n, esperar las ganas para empezar suele mantener el cÃ­rculo. La activaciÃ³n conductual propone lo contrario: un paso mÃ­nimo, concreto y posible. No es "poner voluntad": es bajar la exigencia hasta que algo se mueva.',
      imageUrl: '', likes: ['u-pat-1', 'u-pat-4'], comments: []
    },
    {
      id: 'post-10', authorId: 'u-pat-2', createdAt: '2026-10-19T22:00:00.000Z',
      body: 'Consejo de papÃ¡ aprendido a los golpes: cuando mi hijo estÃ¡ desregulado, hablar mÃ¡s fuerte no funciona. Bajar el tono, acercarme y esperar unos segundos hace mÃ¡s que veinte explicaciones. Me costÃ³ aÃ±os entenderlo.',
      imageUrl: '', likes: ['u-psy-3', 'u-psy-2', 'u-pat-1'], comments: [
        { id: 'pc-8', authorId: 'u-psy-3', body: 'Co-regular primero, razonar despuÃ©s. Muy bien dicho.', createdAt: '2026-10-20T08:00:00.000Z' }
      ]
    },
    {
      id: 'post-11', authorId: 'u-pat-3', createdAt: '2026-10-18T11:05:00.000Z', questionId: 'q-7',
      body: 'PubliquÃ© una pregunta en el foro: me da terror hablar en pÃºblico y lo evito siempre. Si te pasÃ³ algo parecido o sos profesional, te leo. A veces saber que a otros les pasa ayuda a animarse.',
      imageUrl: '', likes: ['u-pat-1', 'u-pat-2'], comments: []
    }
  ],

  messages: [
    { id: 'msg-1', fromId: 'u-pat-1', toId: 'u-psy-1', body: 'Hola Valentina, Â¿te queda algÃºn turno esta semana? PreferirÃ­a online por la tarde.', createdAt: '2026-10-22T15:10:00.000Z', readAt: '2026-10-22T15:20:00.000Z' },
    { id: 'msg-2', fromId: 'u-psy-1', toId: 'u-pat-1', body: 'Hola LucÃ­a, sÃ­. Tengo jueves 18:00 y viernes 17:00. Â¿CuÃ¡l te sirve?', createdAt: '2026-10-22T15:22:00.000Z', readAt: '2026-10-22T15:30:00.000Z' },
    { id: 'msg-3', fromId: 'u-pat-1', toId: 'u-psy-1', body: 'Jueves 18 me viene bien. Â¿CÃ³mo hacemos con el pago?', createdAt: '2026-10-22T15:32:00.000Z', readAt: '2026-10-22T15:40:00.000Z' },
    { id: 'msg-4', fromId: 'u-psy-1', toId: 'u-pat-1', body: 'Te paso el alias por privado y te reservo el jueves. Cualquier cosa antes, escribime por acÃ¡.', createdAt: '2026-10-23T09:05:00.000Z', readAt: null },

    { id: 'msg-5', fromId: 'u-pat-1', toId: 'u-psy-2', body: 'Hola Emanuel, gracias por la charla del otro dÃ­a. QuerÃ­a saber si la evaluaciÃ³n incluye informe.', createdAt: '2026-10-21T18:00:00.000Z', readAt: '2026-10-21T18:30:00.000Z' },
    { id: 'msg-6', fromId: 'u-psy-2', toId: 'u-pat-1', body: 'SÃ­, incluye entrevista, pruebas, informe y una devoluciÃ³n. Si querÃ©s te mando el detalle por mail.', createdAt: '2026-10-21T18:35:00.000Z', readAt: '2026-10-21T18:40:00.000Z' },

    { id: 'msg-7', fromId: 'u-pat-2', toId: 'u-psy-3', body: 'SofÃ­a, Â¿cÃ³mo podemos preparar la primera entrevista con nuestra hija?', createdAt: '2026-10-22T10:00:00.000Z', readAt: '2026-10-22T10:20:00.000Z' },
    { id: 'msg-8', fromId: 'u-psy-3', toId: 'u-pat-2', body: 'Con que vengan los dos y traigan informes de la escuela alcanza. No necesitan preparar nada especial.', createdAt: '2026-10-22T10:25:00.000Z', readAt: null },

    { id: 'msg-9', fromId: 'u-pat-3', toId: 'u-psy-2', body: 'Hola, querÃ­a consultar por evaluaciÃ³n en adultos para TEA. Â¿TenÃ©s lista de espera?', createdAt: '2026-10-20T09:30:00.000Z', readAt: '2026-10-20T10:00:00.000Z' },
    { id: 'msg-10', fromId: 'u-psy-2', toId: 'u-pat-3', body: 'Hola Marina, tengo lugar en dos semanas. Te paso los pasos y honorarios por mensaje privado.', createdAt: '2026-10-20T10:05:00.000Z', readAt: '2026-10-20T10:10:00.000Z' },
    { id: 'msg-11', fromId: 'u-pat-3', toId: 'u-psy-2', body: 'Perfecto, quedo atenta. Gracias.', createdAt: '2026-10-20T10:12:00.000Z', readAt: '2026-10-20T10:15:00.000Z' },

    { id: 'msg-12', fromId: 'u-pat-4', toId: 'u-psy-9', body: 'Hola Agustina, te escribo por una consulta perinatal para mi pareja. Â¿AtendÃ©s online?', createdAt: '2026-10-19T16:00:00.000Z', readAt: '2026-10-19T16:20:00.000Z' },
    { id: 'msg-13', fromId: 'u-psy-9', toId: 'u-pat-4', body: 'Hola Ramiro, sÃ­, atiendo online y presencial en CABA. Contame un poco mÃ¡s y vemos.', createdAt: '2026-10-19T16:25:00.000Z', readAt: null },

    { id: 'msg-14', fromId: 'u-pat-2', toId: 'u-psy-1', body: 'Valentina, Â¿sabÃ©s de algÃºn colega para terapia de pareja en Rosario?', createdAt: '2026-10-18T11:00:00.000Z', readAt: '2026-10-18T11:30:00.000Z' },
    { id: 'msg-15', fromId: 'u-psy-1', toId: 'u-pat-2', body: 'SÃ­, MartÃ­n Salas trabaja ahÃ­ y es muy recomendable. Te dejo su perfil.', createdAt: '2026-10-18T11:35:00.000Z', readAt: '2026-10-18T11:40:00.000Z' }
  ],

  appointments: [
    { id: 'ap-1', psyId: 'psy-2', patientId: 'u-pat-1', patientName: 'LucÃ­a FernÃ¡ndez', date: '2026-10-27', time: '15:00', service: 'Consulta de orientaciÃ³n', status: 'confirmed', notes: 'Primera entrevista. Trae informe previo.', createdAt: '2026-10-22T12:00:00.000Z' },
    { id: 'ap-2', psyId: 'psy-2', patientId: 'u-pat-3', patientName: 'Marina Ortiz', date: '2026-10-28', time: '10:30', service: 'EvaluaciÃ³n neuropsicolÃ³gica', status: 'pending', notes: 'Confirmar por WhatsApp.', createdAt: '2026-10-21T12:00:00.000Z' },
    { id: 'ap-3', psyId: 'psy-2', patientId: 'u-pat-2', patientName: 'Diego Sosa', date: '2026-11-03', time: '17:00', service: 'DevoluciÃ³n de informe', status: 'confirmed', notes: '', createdAt: '2026-10-20T12:00:00.000Z' },
    { id: 'ap-4', psyId: 'psy-1', patientId: 'u-pat-1', patientName: 'LucÃ­a FernÃ¡ndez', date: '2026-10-24', time: '18:00', service: 'SesiÃ³n online', status: 'confirmed', notes: 'Enviar enlace 10 min antes.', createdAt: '2026-10-22T12:00:00.000Z' },
    { id: 'ap-5', psyId: 'psy-3', patientId: 'u-pat-2', patientName: 'Familia Sosa', date: '2026-10-30', time: '09:00', service: 'Entrevista familiar', status: 'pending', notes: 'Traer informes escolares.', createdAt: '2026-10-21T12:00:00.000Z' }
  ],

  aurakitProjects: [
    {
      id: 'akp-1', psyId: 'psy-2', name: 'WineBOX NeuropsicologÃ­a',
      template: 'sesiones', brand: '#0f4a63', accent: '#17a589',
      headline: 'EvaluaciÃ³n y entrenamiento neurocognitivo con plan claro',
      subheadline: 'TDAH, TEA y ansiedad en niÃ±os, adolescentes y adultos. Presencial en CABA y online a todo el paÃ­s.',
      about: 'Soy el Lic. Emanuel Chanampa, neuropsicÃ³logo clÃ­nico. Trabajo con evaluaciÃ³n neurocognitiva y entrenamiento de funciones ejecutivas, con un enfoque claro, medible y humano. Cada proceso empieza con escuchar quÃ© necesitÃ¡s.',
      cta: 'Reservar una consulta',
      services: [
        { name: 'Consulta de orientaciÃ³n', price: 45000, desc: 'Primera entrevista y plan de trabajo.' },
        { name: 'EvaluaciÃ³n neuropsicolÃ³gica', price: 180000, desc: 'Entrevista, pruebas, informe y devoluciÃ³n.' },
        { name: 'Entrenamiento cognitivo', price: 38000, desc: 'Sesiones de 45 minutos, online o presencial.' }
      ],
      books: [
        { title: 'El arte de la calma', price: 0, desc: 'Protocolo breve para crisis de ansiedad.', url: '../calma/' },
        { title: 'TDAH en adultos', price: 0, desc: 'GuÃ­a para el diagnÃ³stico tardÃ­o y la organizaciÃ³n.', url: '../procastinar/' }
      ],
      testimonials: [
        { name: 'LucÃ­a F.', text: 'La devoluciÃ³n fue clara y el plan me ordenÃ³ la semana.' },
        { name: 'Diego S.', text: 'SentÃ­ que por primera vez alguien escuchÃ³ a mi hijo de verdad.' }
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
      id: 'akp-2', psyId: 'psy-1', name: 'Consultorio Valentina RÃ­os',
      template: 'landing', brand: '#3b2a5a', accent: '#c99a12',
      headline: 'RecuperÃ¡ el control de tu ansiedad',
      subheadline: 'Terapia cognitivo-conductual para ansiedad, pÃ¡nico y estrÃ©s. Online y presencial en CABA.',
      about: 'Soy la Dra. Valentina RÃ­os, psicÃ³loga clÃ­nica. Trabajo con TCC y exposiciÃ³n gradual, con tareas concretas entre sesiones. Mi objetivo no es que dejes de sentir, sino que recuperes la capacidad de decidir.',
      cta: 'Pedir mi primera entrevista',
      services: [{ name: 'Primera consulta', price: 32000, desc: 'EvaluaciÃ³n inicial y plan.' }, { name: 'SesiÃ³n online', price: 28000, desc: '50 minutos por videollamada.' }],
      books: [{ title: 'Ansiedad: guÃ­a breve', price: 0, desc: 'Cinco seÃ±ales para decidir cuÃ¡ndo consultar.', url: '../calma/' }],
      testimonials: [{ name: 'Paciente', text: 'Me dio herramientas concretas desde la primera sesiÃ³n.' }],
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
      'Ansiedad y pÃ¡nico', 'DepresiÃ³n', 'TDAH', 'TEA / Autismo', 'Duelo',
      'Pareja y vÃ­nculos', 'Infancia y adolescencia', 'Trauma y TEPT', 'Adicciones',
      'Trastornos alimentarios', 'NeuropsicologÃ­a', 'Perinatal', 'EstrÃ©s y burnout',
      'Fobias', 'Sexualidad', 'OrientaciÃ³n vocacional', 'OrientaciÃ³n'
    ],
    categories: ['Ansiedad', 'DepresiÃ³n', 'TDAH', 'TEA / Autismo', 'Duelo', 'Pareja', 'Infancia y adolescencia', 'Trauma y TEPT', 'Adicciones', 'Trastornos alimentarios', 'Perinatal', 'NeuropsicologÃ­a', 'OrientaciÃ³n'],
    approaches: [
      'Terapia Cognitivo-Conductual (TCC)', 'Terapia de AceptaciÃ³n y Compromiso (ACT)',
      'EMDR', 'Terapia sistÃ©mica', 'PsicoanÃ¡lisis', 'Terapia DialÃ©ctico Conductual (DBT)',
      'Terapia breve', 'Mindfulness', 'NeuropsicologÃ­a', 'EstimulaciÃ³n cognitiva',
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
      { id: 'answer', label: 'Responder una pregunta en el foro', delta: 10, icon: 'ðŸ’¬' },
      { id: 'accepted', label: 'Que un paciente elija tu respuesta como la mejor', delta: 25, icon: 'âœ…' },
      { id: 'upvote', label: 'Cada voto positivo de un paciente a tu respuesta', delta: 3, icon: 'ðŸ‘' },
      { id: 'article', label: 'Publicar un artÃ­culo clÃ­nico', delta: 20, icon: 'ðŸ“' },
      { id: 'ebook', label: 'Publicar un ebook o guÃ­a descargable', delta: 40, icon: 'ðŸ“š' },
      { id: 'profile', label: 'Completar el perfil profesional (una vez)', delta: 10, icon: 'ðŸªª' },
      { id: 'like', label: 'Me gusta de un paciente en una publicaciÃ³n', delta: 2, icon: 'â¤ï¸' },
      { id: 'review5', label: 'ReseÃ±a de 5 estrellas de un paciente', delta: 15, icon: 'â­' },
      { id: 'review4', label: 'ReseÃ±a de 4 estrellas', delta: 8, icon: 'â­' },
      { id: 'review3', label: 'ReseÃ±a de 3 estrellas', delta: 0, icon: 'â€¢' },
      { id: 'review2', label: 'ReseÃ±a de 2 estrellas', delta: -15, icon: 'âš ï¸' },
      { id: 'review1', label: 'ReseÃ±a de 1 estrella', delta: -30, icon: 'âš ï¸' }
    ]
  }
};
