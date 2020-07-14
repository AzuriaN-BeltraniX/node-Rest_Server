require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// Habilitar carpeta "public"
app.use(express.static(path.resolve(__dirname, '../public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Configuración Global de rutas 
    app.use(require('./routes/index'));

    mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true, 
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    }, (err, res) => {
        if (err) throw err;

        console.log('Base de Datos ONLINE');  
    });

    app.listen(process.env.PORT, () => {
        console.log('Esuchando el puerto: ', process.env.PORT);
        
    })

//solucion

// mongoose.connect (process.env.MONGO_URI, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
// })
// .then (() => console.log ('DB Connected!'))
// .catch (err => {
//     console.log (`DB Connection Error: ${err.message}`);
// });