// Exportaciones
// -------------------------------------- 
const express = require('express');
const {verificaToken, verificaRol} = require('../middlewares/autenticacion');
const app = express();
const Categoria = require('../models/categoria');

// 
// Muestra todas las categorías.          | Listo
// -------------------------------------- 
app.get('/categoria', verificaToken, (req, res) => {
// Paginación
    // Define desde que categoría mostrar en paginación
    let desde = req.query.desde || 0;
    desde = Number(desde);

    // Define el límite de categorías mostradas por paginación
    let limite = req.query.limite || 5;
    limite = Number(limite);

// Muestra las categorías, si no, muestra error
    Categoria.find()
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .skip(desde)
    .limit(limite)
    .exec((err, categorias) => {
        // Error en búsqueda de categorías
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        // Conteo de categorías mostrado al final de la paginación
        Categoria.count((err, conteo) => {
            res.json({
                Ok: true,
                categorias,
                cuantos: conteo
            });
        });
    });
});

// 
// Muestra una categoría por ID.          | Listo
// -------------------------------------- 
app.get('/categoria/:id', verificaToken,(req, res) => {
    // Llamado de ID
    let id = req.params.id;
    
    // Búsqueda de categoría por ID
    Categoria.findById(id, (err, categoriaDB) => {
        // Error en búsqueda de categoría
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // Error en la búsqueda del ID
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // Muestra la categoría buscada
        res.json({
            ok: true,
            categoría: categoriaDB
        });
    });
});

// 
// Crea nueva Categoría.                  | Listo
// -------------------------------------- 
app.post('/categoria', verificaToken, (req, res) => {
    // Regresa a una nueva categoría (return)
    // req.usuario._id

    // Llamado de valor escrito
    let body = req.body;

    // Crea categoría requiriendo estos valores:
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    // Guarda nueva categoría en base de datos, si no, muestra error
    categoria.save((err, categoriaDB) => {
        // Error al guardar
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No se pudo guardar la categoría'
                }
            });
        }

        // Error si no se muestra la categoría
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo guardar la categoría'
                }
            });
        }

        // Muestra categoría guardada
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// 
// Actualiza la categoría seleccionada    | Listo
// --------------------------------------
app.put('/categoria/:id', verificaToken,(req, res) => {
    // Llamado de ID de la categoría
    let id = req.params.id;
    let body = req.body;

    // Parámetros a actualizar
    let descCategoria = {
        descripcion: body.descripcion
    };

    // Actualiza la categoría, si no, muestra error
    Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {
        // Error al actualizar
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No se pudo actualizar la categoría'
                }
            });
        }

        // Error si no existe la categoría
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo actualizar la categoría'
                }
            });
        }

        // Muestra categoría actualizada
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// 
// Borra la categoría seleccionada        | Listo
// --------------------------------------
app.delete('/categoria/:id', [verificaToken, verificaRol],  (req, res) => {
    // Solo un administrador puede borrar las categorías
    // Categoria.findByIdAndRemove

    // Requiere ID de la categoría
    let id = req.params.id;

    // Elimina categoría por ID, si no, muestra error
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        // Muestra error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // Muestra error si el ID mostrado ya fue eliminado
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        // Muestra la categoría borrada
        res.json({
            ok: true,
            message: 'Categoría Borrada'
        });
    });
});

module.exports = app;