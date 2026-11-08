/* ============================================================
   WineBOX.Clinic · Cliente Firebase (Firestore)
   Base de datos en tiempo real, autenticación, storage
   ============================================================ */
(function () {
  'use strict';

  // Configuración
  var CONFIG = window.FIREBASE_CONFIG || {};
  var DB_KEY = 'winebox_foro_db_v1';
  var SESSION_KEY = 'winebox_foro_session_v1';

  // Estado local
  var _DB = null;
  var _SESSION = null;
  var _ready = false;
  var _listeners = [];

  // Importar Firebase SDK
  var firebaseApp = null;
  var db = null;
  var auth = null;

  function initFirebase() {
    if (!CONFIG.apiKey) {
      console.warn('[Firebase] No configurado, usando localStorage');
      return false;
    }

    // Cargar Firebase SDK dinámicamente
    if (!window.firebase) {
      var script = document.createElement('script');
      script.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js';
      script.onload = function() {
        var script2 = document.createElement('script');
        script2.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js';
        script2.onload = function() {
          var script3 = document.createElement('script');
          script3.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js';
          script3.onload = loadFromFirebase;
          script3.onerror = function() { console.error('[Firebase] Error cargando auth'); };
          document.head.appendChild(script3);
        };
        script2.onerror = function() { console.error('[Firebase] Error cargando firestore'); };
        document.head.appendChild(script2);
      };
      script.onerror = function() { console.error('[Firebase] Error cargando app'); };
      document.head.appendChild(script);
      return true;
    }

    // Firebase ya cargado
    firebaseApp = window.firebase.initializeApp(CONFIG);
    db = firebaseApp.firestore();
    auth = firebaseApp.auth();
    return true;
  }

  // Cargar datos desde Firebase
  function loadFromFirebase() {
    if (!db) return;

    console.log('[Firebase] Cargando datos...');

    // Colecciones principales
    var collections = ['users', 'psychs', 'posts', 'questions', 'answers', 
                      'messages', 'reviews', 'publications', 'pointEvents', 
                      'comments', 'postLikes', 'appointments', 'aurakitProjects', 'reports'];

    var promises = collections.map(function(collection) {
      return new Promise(function(resolve) {
        db.collection(collection).get()
          .then(function(snapshot) {
            var data = {};
            snapshot.forEach(function(doc) {
              data[doc.id] = doc.data();
            });
            resolve({ collection: collection, data: data, count: snapshot.size });
          })
          .catch(function(err) {
            console.warn('[Firebase] Error cargando ' + collection + ':', err.message);
            resolve({ collection: collection, data: {}, count: 0 });
          });
      });
    });

    Promise.all(promises).then(function(results) {
      _DB = { config: window.WINEBOX_SEED?.config || {}, versions: {} };
      results.forEach(function(r) {
        _DB[r.collection] = Object.values(r.data);
        _DB.versions[r.collection] = r.count;
      });
      _ready = true;
      console.log('[Firebase] Datos cargados:', _DB.versions);
      
      // Sincronizar con localStorage
      try { localStorage.setItem(DB_KEY, JSON.stringify(_DB)); } catch(e) {}
      
      if (typeof initApp === 'function') initApp();
    });
  }

  // Guardar datos en Firebase
  function saveToFirebase() {
    if (!db || !_DB) return;

    var collections = ['users', 'psychs', 'posts', 'questions', 'answers', 
                      'messages', 'reviews', 'publications', 'pointEvents', 
                      'comments', 'postLikes', 'appointments', 'aurakitProjects', 'reports'];

    collections.forEach(function(collection) {
      var items = _DB[collection] || [];
      items.forEach(function(item) {
        if (item && item.id) {
          db.collection(collection).doc(item.id).set(item, { merge: true })
            .catch(function(err) { console.warn('Error saving', collection, item.id, err); });
        }
      });
    });
  }

  // Escuchar cambios en tiempo real
  function listenToCollection(collection, callback) {
    if (!db) return;
    
    var unsubscribe = db.collection(collection)
      .onSnapshot(function(snapshot) {
        var changes = [];
        snapshot.docChanges().forEach(function(change) {
          changes.push({ type: change.type, id: change.doc.id, data: change.doc.data() });
        });
        if (changes.length > 0) {
          callback(changes);
          // Actualizar localStorage
          if (_DB && _DB[collection]) {
            changes.forEach(function(c) {
              var idx = _DB[collection].findIndex(function(item) { return item.id === c.id; });
              if (c.type === 'added' || c.type === 'modified') {
                if (idx >= 0) _DB[collection][idx] = c.data;
                else _DB[collection].push(c.data);
              } else if (c.type === 'removed' && idx >= 0) {
                _DB[collection].splice(idx, 1);
              }
            });
            try { localStorage.setItem(DB_KEY, JSON.stringify(_DB)); } catch(e) {}
          }
        }
      }, function(err) {
        console.error('[Firebase] Error listening to ' + collection, err);
      });
    
    _listeners.push(unsubscribe);
    return unsubscribe;
  }

  // Autenticación
  function signIn(email, password) {
    if (!auth) return Promise.reject('Firebase auth no inicializado');
    return auth.signInWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        _SESSION = { userId: userCredential.user.uid, token: userCredential.user.accessToken };
        try { localStorage.setItem(SESSION_KEY, JSON.stringify(_SESSION)); } catch(e) {}
        return userCredential.user;
      })
      .catch(function(err) {
        // Si el usuario no existe en Firebase, intentar con localStorage
        console.warn('[Firebase] Auth error:', err.message);
        throw err;
      });
  }

  function signUp(email, password, userData) {
    if (!auth) return Promise.reject('Firebase auth no inicializado');
    return auth.createUserWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        userData.id = userCredential.user.uid;
        userData.createdAt = new Date().toISOString();
        
        // Guardar datos del usuario en Firestore
        return db.collection('users').doc(userCredential.user.uid).set(userData)
          .then(function() { return userCredential.user; });
      })
      .catch(function(err) { throw err; });
  }

  function signOut() {
    if (auth) {
      auth.signOut();
    }
    _SESSION = null;
    try { localStorage.removeItem(SESSION_KEY); } catch(e) {}
    // Desuscribir listeners
    _listeners.forEach(function(unsubscribe) { unsubscribe(); });
    _listeners = [];
  }

  // Operaciones de CRUD
  function addDocument(collection, data) {
    if (!db) return Promise.reject('No database');
    if (!data.id) data.id = 'doc_' + Date.now();
    data.createdAt = data.createdAt || new Date().toISOString();
    return db.collection(collection).doc(data.id).set(data)
      .then(function() { return data; });
  }

  function updateDocument(collection, id, updates) {
    if (!db) return Promise.reject('No database');
    return db.collection(collection).doc(id).update(updates)
      .then(function() { return { id: id, updates: updates }; });
  }

  function deleteDocument(collection, id) {
    if (!db) return Promise.reject('No database');
    return db.collection(collection).doc(id).delete();
  }

  function queryCollection(collection, whereField, op, value, limit) {
    if (!db) return Promise.resolve([]);
    var query = db.collection(collection);
    if (whereField && op && value !== undefined) {
      query = query.where(whereField, op, value);
    }
    if (limit) {
      query = query.limit(limit);
    }
    return query.get().then(function(snapshot) {
      return snapshot.docs.map(function(doc) { return doc.data(); });
    });
  }

  // Exponer global
  window.FirebaseClient = {
    get ready() { return _ready; },
    get DB() { return _DB; },
    get SESSION() { return _SESSION; },
    
    // Init
    init: initFirebase,
    load: loadFromFirebase,
    save: saveToFirebase,
    
    // Auth
    signIn: signIn,
    signUp: signUp,
    signOut: signOut,
    
    // CRUD
    addDocument: addDocument,
    updateDocument: updateDocument,
    deleteDocument: deleteDocument,
    queryCollection: queryCollection,
    
    // Realtime
    listen: listenToCollection,
    
    // Config
    getConfig: function() { return CONFIG; }
  };

  // Iniciar
  initFirebase();
})();
