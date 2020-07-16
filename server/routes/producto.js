// Exportaciones
const express = require('express');
const {verificaToken} = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');


// Obtener todos los productos.           | Listo
// -------------------------------------- 
app.get('/producto', verificaToken, (req, res) => {
// Paginado
    // Define desde que producto mostrar en paginación.
    let desde = req.query.desde || 0;
    desde = Number(desde);

    // Define el límite de productos mostrados por paginación.
    let limite = req.query.limite || 5;
    limite = Number(limite);

// Muestra los productos, si no, muestra error.
    Producto.find({disponible: true})
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .skip(desde)
    .limit(limite)
    .exec((err, productos) => {
        // Error en búsqueda de productos.
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // Conteo de productos mostrado al final de la paginación.
        Producto.count((err, conteo) => {
            res.json({
                Ok: true,
                productos,
                cuantos: conteo
            });
        });
    });
});


// Obtiene un producto por ID.            | Listo
// -------------------------------------- 
app.get('/producto/:id', verificaToken, (req, res) => {
    // Llamado de ID
    let id = req.params.id;
    
    // Búsqueda de producto por ID
    Producto.findById(id)
    .populate('usuario', 'usuario email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) => {
        // Error en búsqueda del producto
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // Error en la búsqueda del ID
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        };

        // Muestra el producto buscado
        res.json({
            Ok: true,
            producto: productoDB
        });
    });
});


// Busca productos.                       |
// --------------------------------------
app.get('/producto/buscar/:termino', verificaToken,(req, res) => {
    // Define el término de búsqueda
    let termino = req.params.termino;

    // Crea una expresión regular para basarse en "termino".
    let regex = new RegExp (termino, 'i');

    //Busca los productos descritos por el término.
    Producto.find({nombre: regex, disponible: true})
    .populate('categoría', 'nombre')
    .exec((err, productos) => {
        // Muestra error general.
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // Búsqueda exitosa mostrando el número de resultados.
        Producto.count((err, conteo) => {
            res.json({
                Ok: true,
                productos,
                cuantos: conteo
            });
        });
    });
});


// Crea un nuevo producto.                | Listo
// -------------------------------------- 
app.post('/producto', verificaToken, (req, res) => {
    // Requiere campos del body.
    let body = req.body;

    // Crea nuevo producto.
    let producto = new Producto ({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    // Guarda el producto en base de datos, si guardó; imprime OK, si no; imprime error.
    producto.save((err, productoDB) => {
        // Error al guardar producto
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // Muestra mensaje de tarea completada
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});


// Actualiza un producto por ID.          | Listo
// -------------------------------------- 
app.put('/producto/:id', verificaToken, (req, res) => {
    // Llamado de ID.
    let id = req.params.id;

    // Requiere parámetros del BODY.
    let body = req.body;

    // Actualiza un producto por ID.
    Producto.findById(id, (err, productoDB) => {
        // Muestra error general.
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // Error si no encuentra el ID.
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        };

        // Captura de datos del producto a actualizar.
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        // Guarda los cambios en la base de datos
        productoDB.save((err, productoGuardado) => {
            // Muestra error si no guarda.
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            // Muestra actualización exitosa
            res.json({
                ok: true,
                producto: productoGuardado
            });
        })
    });
});


// Borra un producto por ID.              | Listo
// -------------------------------------- 
app.delete('/producto/:id', verificaToken, (req, res) => {
    // Llamado de ID
    let id = req.params.id;

    // Busca el producto por ID para actualizar su disponibilidad
    Producto.findById(id, (err, productoDB) => {
        // Muestra error general.
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // Error si no encuentra el ID.
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        };

        // Actualiza la disponiblidad a FALSE del producto selecionado
        productoDB.disponible = false;

        // Guarda la actualización de la disponibilidad del producto, si no, muestra error
        productoDB.save((err, productoNoDisp) => {
            // Muestra error general.
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            // Muestra actualización existosa
            res.json({
                ok: true,
                producto: productoNoDisp,
                message: 'Disponibilidad del producto actualizado'
            })
        });
    });
});

// Exportar modulos
module.exports = app;