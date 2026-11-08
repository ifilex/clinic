/* ============================================================
   WineBOX.Clinic · Aura - Asistente Inteligente del Sitio
   Responde preguntas sobre funcionamiento, navegación y ayuda
   ============================================================ */
(function () {
  'use strict';

  var history = [];
  var quizStep = 0;
  var inQuiz = false;
  var quizAnswers = [];

  // Base de conocimiento completa
  var DB = {
    secciones: {
      inicio: {
        keys: ['inicio', 'home', 'feed', 'principal', 'publicaciones recientes'],
        titulo: 'Inicio',
        texto: 'Es la página principal. Acá ves:\n\n• Feed con publicaciones de la comunidad\n• Preguntas y respuestas del foro\n• Artículos y recursos educativos\n\nMenú superior: Inicio | Buscar | Utilidades | Notif.'
      },
      directorio: {
        keys: ['directorio', 'psicologo', 'psicologa', 'buscar profesional', 'terapeuta', 'consultorio'],
        titulo: 'Directorio de Psicólogos',
        texto: 'Buscá psicólogos verificados por:\n\n• Especialidad (ansiedad, depresión, TDAH, pareja, etc.)\n• Provincia o ciudad\n• Modalidad: online o presencial\n• Honorarios (rango de precio)\n• Puntaje del profesional\n\nCada perfil tiene: bio, especialidades, horarios, WhatsApp, email y reseñas.'
      },
      comunidad: {
        keys: ['comunidad', 'foro', 'pregunta', 'responder', 'forum'],
        titulo: 'Comunidad / Foro',
        texto: 'Espacio para hacer preguntas y recibir respuestas.\n\nCómo participar:\n1. Iniciá sesión\n2. Click en "Nueva pregunta"\n3. Escribí tu consulta\n4. Los profesionales y pacientes responden\n5. Votá las respuestas útiles\n6. El autor elige la mejor respuesta\n\nLos psicólogos ganan puntos por responder.'
      },
      publicaciones: {
        keys: ['publicacion', 'articulo', 'blog', 'ebook', 'libro', 'recurso', 'descargar'],
        titulo: 'Publicaciones y Ebooks',
        texto: 'Contenido educativo sobre salud mental:\n\n• Artículos sobre ansiedad, depresión, relaciones\n• 14 ebooks descargables en PDF\n• Guías prácticas y ejercicios\n\nPara descargar:\n1. Andá a Publicaciones\n2. Filtrá por "ebook"\n3. Elegí el tema\n4. Click en descargar PDF'
      },
      meritocracia: {
        keys: ['merito', 'punto', 'puntaje', 'sistema puntos', 'ranking', 'score'],
        titulo: 'Sistema de Puntos',
        texto: 'Los profesionales acumulan puntos por:\n\n• Responder preguntas: +10 pts\n• Recibir voto positivo: +3 pts\n• Respuesta elegida como mejor: +20 pts\n• Buena reseña: +5 pts\n\nEsto determina el orden en el directorio.'
      },
      cuenta: {
        keys: ['cuenta', 'perfil', 'mi cuenta', 'configuracion', 'ajustes', 'datos personales'],
        titulo: 'Mi Cuenta',
        texto: 'Desde tu perfil podés:\n\n• Ver y editar tus datos\n• Revisar mensajes directos\n• Ver consultas pendientes\n• Cambiar contraseña\n• Gestionar notificaciones\n\nProfesionales también acceden a AuraKit aquí.'
      },
      oficina: {
        keys: ['oficina', 'aura kit', 'aurakit', 'web profesional', 'crear web'],
        titulo: 'Oficina / AuraKit',
        texto: 'Herramienta PARA PROFESIONALES:\n\n• Crear web o landing page\n• Configurar turnos y agenda\n• Vender sesiones y ebooks\n• Generar app Android (PWA)\n• Personalizar con tu marca\n\nAcceso: Solo psicólogos verificados.'
      },
      aura: {
        keys: ['aura', 'asistente', 'ayuda', 'help', 'boton', 'flotante'],
        titulo: 'Aura - Tu Asistente',
        texto: 'Estás acá. Soy Aura.\n\nPreguntame sobre:\n• Cómo usar cada sección\n• Cómo publicar, buscar, contactar\n• Dónde encontrar ebooks\n• Sistema de puntos\n• Cualquier duda funcional\n\nNo reemplazo terapia ni diagnóstico.'
      },
      mensajeria: {
        keys: ['mensaje', 'chat', 'escribir', 'conversar', 'private', 'directo'],
        titulo: 'Mensajería Directa',
        texto: 'Sistema de mensajes privados:\n\n• Requiere contacto aceptado\n• Andá a Mensajes (#/mensajes)\n• Seleccioná conversación o creá nueva\n• Mensajes solo entre vos y el profesional\n• No se guardan en servidor (privacidad)'
      },
      registro: {
        keys: ['registro', 'crear cuenta', 'inscribirse', 'registrarse', 'sign up'],
        titulo: 'Registro de Cuenta',
        texto: 'Para crear cuenta:\n1. Andá a Registro (#/registro)\n2. Elegí: Paciente o Psicólogo\n3. Completá nombre, email, contraseña\n4. Verificá tu email\n5. Psicólogos: validar matrícula\n\nCuentas demo: sofia.martinez@example.com / Paciente1!'
      }
    },

    comoHacer: {
      publicar: {
        keys: ['publicar', 'crear post', 'nueva publicacion', 'escribir post', 'nuevo post'],
        titulo: 'Cómo publicar',
        pasos: ['1. Iniciar sesión', '2. Ir a Inicio (#/)', '3. Click en "Crear publicación"', '4. Escribir texto (máx 2000 chars)', '5. Opcional: agregar imagen URL', '6. Click en "Publicar"']
      },
      buscar: {
        keys: ['buscar', 'encontrar', 'filtros', 'buscador', 'filter'],
        titulo: 'Cómo buscar',
        pasos: ['1. Barra de búsqueda arriba', '2. Escribí: nombre, tema, palabra', '3. En Directorio: filtros laterales', '4. En Comunidad: filtrá por categoría', '5. En Publicaciones: filtrá por tipo']
      },
      contactar: {
        keys: ['contactar', 'solicitar consulta', 'pedir turno', 'hablar con psico', 'consulta'],
        titulo: 'Cómo contactar un psicólogo',
        pasos: ['1. Buscá en Directorio', '2. Entrá al perfil del profesional', '3. Click en "Contactar"', '4. Escribí motivo (mín 20 chars)', '5. Esperá aceptación del profesional', '6. Si acepta, podés chatear']
      },
      mensaje: {
        keys: ['enviar mensaje', 'como mensaje', 'chat directo', 'mensajeria'],
        titulo: 'Cómo enviar mensaje',
        pasos: ['1. Debes tener contacto aceptado', '2. Andá a Mensajes (#/mensajes)', '3. Seleccioná conversación', '4. Escribí y enviá', '5. El profesional responderá cuando esté online']
      },
      ebook: {
        keys: ['ebook', 'descargar ebook', 'libro pdf', 'material educativo'],
        titulo: 'Cómo descargar ebooks',
        pasos: ['1. Andá a Publicaciones', '2. Filtrá por "ebook"', '3. Elegí el tema', '4. Click en descargar PDF', '5. Se guarda en tu dispositivo']
      },
      votar: {
        keys: ['votar', 'upvote', 'responder pregunta', 'comentar pregunta'],
        titulo: 'Cómo votar y comentar',
        pasos: ['1. Andá a Comunidad', '2. Entrá a una pregunta', '3. Click ❤️ en respuesta que te sirva', '4. Escribí tu comentario abajo', '5. El autor elige la mejor respuesta']
      },
      reseña: {
        keys: ['resena', 'opinion', 'calificacion', 'dejar reseña'],
        titulo: 'Cómo dejar reseña',
        pasos: ['1. Tenés que tener consulta aceptada', '2. Andá al perfil del psicólogo', '3. Click en "Dejar reseña"', '4. Calificá 1-5 estrellas', '5. Escribí tu experiencia']
      }
    },

    faq: [
      { keys: ['gratis', 'precio', 'cuesta', 'pago', 'costo', 'economico'], preg: '¿Es gratis?', resp: 'Sí, la mayoría de funciones son gratuitas: navegar, publicar, preguntar, responder, descargar ebooks. Psicólogos tienen opciones premium opcionales para su web.' },
      { keys: ['verificado', 'check', 'certificado', 'matricula', 'validado'], preg: '¿Cómo sé si es verificado?', resp: 'Los perfiles verificados tienen ✓ junto al nombre. WineBOX verifica matrícula y especialización.' },
      { keys: ['emergencia', 'crisis', 'suicidio', 'auxilio', 'urgencia', 'mal'], preg: '¿Qué hago en emergencia?', resp: 'Si estás en crisis:\n• Argentina: 135 (CABA 24h) o 0800-345-1435\n• México: 800-290-0000\n• España: 024\n• Otros: número local de emergencias\nAura NO reemplaza atención de emergencia.' },
      { keys: ['privado', 'secreto', 'confidencial', 'seguridad'], preg: '¿Mis datos son privados?', resp: 'Sí. Mensajes directos son privados. Datos personales protegidos. No compartimos con terceros.' },
      { keys: ['faq', 'preguntas frecuentes', 'ayuda general'], preg: 'Preguntas frecuentes', resp: '• ¿Es gratis? Sí\n• ¿Cómo contacto un psico? Directorio → Contactar\n• ¿Cómo publico? Inicio → Crear publicación\n• ¿Dónde están los ebooks? Publicaciones → filtrar ebook\n• ¿Cómo voto? Comunidad → ❤️ en respuesta' },
      { keys: ['turno', 'agenda', 'horario', 'cita'], preg: '¿Cómo pedir turno?', resp: '1. Buscá psicólogo en Directorio\n2. Entrá a su perfil\n3. Click en "Contactar"\n4. Escribí motivo de consulta\n5. Esperá aceptación\n6. Coordinan turno por mensaje' },
      { keys: ['app', 'android', 'movil', 'descargar app'], preg: '¿Hay app para descargar?', resp: 'AuraKit genera PWA (web app) para Android. Los profesionales crean su app desde Oficina → AuraKit → Generar app.' },
      { keys: ['honorarios', 'valor', 'costo consulta'], preg: '¿Cuánto cuesta una consulta?', resp: 'Varía por profesional. En cada perfil del Directorio aparece el rango de honorarios. Podés filtrar por precio.' }
    ],

    quiz: {
      preguntas: [
        'En las últimas 2 semanas, ¿cómo fue tu estado de ánimo general?',
        '¿Con qué frecuencia sentís ansiedad o nerviosismo?',
        '¿Cómo es tu calidad de sueño?',
        '¿Te cuesta concentrarte?',
        '¿Cómo están tus relaciones sociales?',
        '¿Cómo está tu nivel de energía?'
      ],
      opciones: ['Bien / Rara vez', 'Regular / A veces', 'Mal / Frecuentemente', 'Muy mal / Casi siempre']
    }
  };

  // Detección de crisis
  var CRISIS = /suicid|matar|morir|no quiero vivir|autolesi|lastim|desaparec|quitarme la vida|cortarme|ayuda ya|emergencia/i;

  function process(text) {
    text = String(text || '').trim().toLowerCase();
    if (!text) return '';

    // Normalizar acentos
    text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Crisis
    if (CRISIS.test(text)) {
      return '🚨 IMPORTANTE: Si estás en crisis, necesitás ayuda AHORA:\n\n' +
        '📞 Argentina: 135 (CABA, 24h) | 0800-345-1435 (Salud Mental)\n' +
        '📞 México: 800-290-0000\n' +
        '📞 España: 024\n' +
        '📞 Otros: número de emergencias local\n\n' +
        'No estás solo/a. Hay personas dispuestas a ayudarte. ¿Podés llamar ahora?';
    }

    // Quiz activo
    if (inQuiz && quizStep < DB.quiz.preguntas.length) {
      var num = parseInt(text);
      if (isNaN(num) || num < 1 || num > 4) {
        return 'Respondé con un número: 1, 2, 3 o 4.';
      }
      quizAnswers.push(num);
      quizStep++;
      if (quizStep >= DB.quiz.preguntas.length) {
        inQuiz = false;
        return showQuizResult();
      }
      return 'Pregunta ' + quizStep + ' de ' + DB.quiz.preguntas.length + ':\n\n' +
        DB.quiz.preguntas[quizStep] + '\n\n' +
        '1. ' + DB.quiz.opciones[0] + '\n2. ' + DB.quiz.opciones[1] + '\n3. ' + DB.quiz.opciones[2] + '\n4. ' + DB.quiz.opciones[3];
    }

    // Saludos
    if (/^hola|buenas|hey|hi|buen dia|buenas tardes|que tal/.test(text)) {
      return '¡Hola! Soy Aura 🌿, tu asistente de WineBOX.Clinic.\n\nEstoy acá para ayudarte con:\n• Cómo usar el sitio\n• Buscar profesionales\n• Publicar, votar, descargar ebooks\n• Resolver dudas\n\n¿Qué necesitás saber?';
    }

    // Quiz
    if (/cuestionario|bienestar|como estoy|evaluacion|test|como me sento/.test(text)) {
      inQuiz = true;
      quizStep = 0;
      quizAnswers = [];
      return '🌿 CUESTIONARIO DE BIENESTAR\n\nBreve test para reflexionar. NO es diagnóstico.\n\nPregunta 1 de ' + DB.quiz.preguntas.length + ':\n' + DB.quiz.preguntas[0] + '\n\n1. ' + DB.quiz.opciones[0] + '\n2. ' + DB.quiz.opciones[1] + '\n3. ' + DB.quiz.opciones[2] + '\n4. ' + DB.quiz.opciones[3];
    }

    // Gracias
    if (/gracias|te ayudo|sirvio|genial|excelente|perfecto/.test(text)) {
      return '¡Me alegra poder ayudar! 😊\n\n¿Hay algo más en lo que pueda asistirte?';
    }

    // Adios
    if (/adios|bye|hasta luego|chao|me voy/.test(text)) {
      return '¡Que tengas un buen día! 🌿\n\nAcá estaré cuando me necesites.';
    }

    // Secciones
    for (var sec in DB.secciones) {
      var s = DB.secciones[sec];
      for (var i = 0; i < s.keys.length; i++) {
        if (text.indexOf(s.keys[i]) !== -1) {
          return '📍 ' + s.titulo + '\n\n' + s.texto;
        }
      }
    }

    // Cómo hacer
    for (var how in DB.comoHacer) {
      var h = DB.comoHacer[how];
      for (var j = 0; j < h.keys.length; j++) {
        if (text.indexOf(h.keys[j]) !== -1) {
          return '📋 ' + h.titulo + '\n\n' + h.pasos.join('\n');
        }
      }
    }

    // FAQ
    for (var k = 0; k < DB.faq.length; k++) {
      var f = DB.faq[k];
      for (var m = 0; m < f.keys.length; m++) {
        if (text.indexOf(f.keys[m]) !== -1) {
          return '❓ ' + f.preg + '\n\n' + f.resp;
        }
      }
    }

    // Menú de ayuda
    if (/ayuda|help|menu|opciones|que podés|que podes|ayudame/.test(text)) {
      return '🤖 **MENÚ DE AYUDA**\n\n' +
        '📍 **SECCIONES:**\n' +
        '• "inicio" - Feed principal\n' +
        '• "directorio" - Buscar psicólogos\n' +
        '• "comunidad" - Preguntas y respuestas\n' +
        '• "publicaciones" - Artículos y ebooks\n' +
        '• "cuenta" - Tu perfil\n' +
        '• "oficina" - AuraKit (solo profesionales)\n\n' +
        '📋 **CÓMO HACER:**\n' +
        '• "cómo publicar"\n' +
        '• "cómo buscar"\n' +
        '• "cómo contactar un psicólogo"\n' +
        '• "cómo descargar ebooks"\n' +
        '• "cómo votar"\n' +
        '• "cómo dejar reseña"\n\n' +
        '🌿 **BIENESTAR:**\n' +
        '• "cuestionario" - Test de bienestar\n\n' +
        '❓ **FAQ:**\n' +
        '• "es gratis"\n' +
        '• "cómo sé si es verificado"\n' +
        '• "datos privados"\n\n' +
        '¿Qué te interesa?';
    }

    // Página específica
    if (/pagina|navegar|ir a|como voy/.test(text)) {
      return '🗺️ **NAVEGACIÓN**\n\n' +
        'Usá el menú superior:\n' +
        '🏠 Inicio → Feed principal\n' +
        '🔍 Buscar → Directorio\n' +
        '🔧 Utilidades → Herramientas\n' +
        '💬 Notif. → Mensajes\n\n' +
        'O escribí la URL:\n' +
        '• #/ → Inicio\n' +
        '• #/directorio → Psicólogos\n' +
        '• #/comunidad → Foro\n' +
        '• #/publicaciones → Ebooks\n' +
        '• #/mensajes → Chat\n' +
        '• #/aura → Esta ayuda';
    }

    // Usuarios demo
    if (/demo|prueba|cuentas demo|usuarios demo|test/.test(text)) {
      return '👥 **USUARIOS DE PRUEBA**\n\n' +
        '**Paciente:**\n' +
        '• Email: sofia.martinez@example.com\n' +
        '• Password: Paciente1!\n\n' +
        '**Psicóloga:**\n' +
        '• Email: valentina.rios@example.com\n' +
        '• Password: Psy1234!\n\n' +
        '**Root:**\n' +
        '• Email: root@winebox.clinic\n' +
        '• Password: Spiderman1447#';
    }

    // Respuesta por defecto mejorada
    return 'No entendí bien. Puedo ayudarte con:\n\n' +
      '📍 Secciones: inicio, directorio, comunidad, publicaciones, cuenta\n' +
      '📋 Cómo: publicar, buscar, contactar, descargar ebooks\n' +
      '🌿 Bienestar: cuestionario\n' +
      '❓ FAQ: gratis, verificado, privado\n\n' +
      'Escribí "ayuda" para ver todas las opciones.';
  }

  function showQuizResult() {
    var total = quizAnswers.reduce(function(a, b) { return a + b; }, 0);
    var max = DB.quiz.preguntas.length * 4;
    var pct = total / max;
    var result;

    if (pct < 0.4) {
      result = '🌟 **BUEN ESTADO**\n\nParecés estar bien. Seguí cuidándote.\n\n¿Querés saber sobre técnicas de bienestar preventivo?';
    } else if (pct < 0.7) {
      result = '🌱 **ESTADO REGULAR**\n\nEstás pasando por algunos desafíos. Es normal.\n\nTe sugiero:\n• Explorar nuestros ebooks sobre el tema\n• Considerar hablar con un profesional\n• Usar ejercicios de respiración en Aura';
    } else {
      result = '⚠️ **ESTADO QUE REQUIERE ATENCIÓN**\n\nLos resultados sugieren que estás teniendo dificultades importantes.\n\nTe recomiendo:\n• Hablar con alguien de confianza\n• Buscar un profesional en el Directorio\n• Llamar al 135 si es urgente\n\n¿Te ayudo a buscar un psicólogo?';
    }
    return '📊 **RESULTADOS DEL CUESTIONARIO**\n\n' + result;
  }

  window.Aura = {
    init: function() {
      history = [{ type: 'bot', text: '¡Hola! Soy Aura 🌿, tu asistente de WineBOX.Clinic.\n\nEstoy acá para ayudarte a navegar el sitio, resolver dudas y guiar-te paso a paso.\n\n¿Qué te gustaría saber?' }];
    },
    process: process,
    getHistory: function() { return history; },
    reset: function() {
      history = [];
      inQuiz = false;
      quizStep = 0;
      quizAnswers = [];
      this.init();
    }
  };

  window.Aura.init();
})();
