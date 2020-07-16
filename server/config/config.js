// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Fecha de Expiración del Token (60seg, 60min, 1hr, 30d)
process.env.CADUCIDAD_TOKEN = '48h';

// Semilla de Autenticación
process.env.SEED = 'este-es-el-seed-desarrollo';

// Base de Datos
let urlDB; 

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // urlDB = 'mongodb://cafe-user:cafe123@cluster0-shard-00-02.v2wru.mongodb.net/cafe';
// urlDB = 'mongodb+srv://cafe-user:cafe123@cluster0.v2wru.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '461451371868-065q0fh2ea715tr9gf2hrnem7dqhvm4f.apps.googleusercontent.com';


// mongodb://localhost:27017/cafe
// mongodb://azbel:<xF947zFRDJkhcLc0>@cluster0.v2wru.mongodb.net/cafe