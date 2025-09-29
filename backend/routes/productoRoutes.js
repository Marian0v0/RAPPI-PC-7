/**
 * Este módulo maneja la funcionalidad de rutas para "producto".
 * 
 * @module producto
 * @author isabbb
 */

// routes/productoRoutes.js

const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoControllers');

// Rutas para productos

// Obtener todos los productos
router.get('/', productoController.obtenerProductos);

// Obtener un producto por ID

router.get('/id/:id', productoController.obtenerProductoPorId)

router.get('/restaurante/:id_producto', productoController.getProductoByRestaurante)

router.get('/comercio/:id_producto', productoController.getProductoByComercio)


// Crear un nuevo producto
router.post('/', productoController.crearProducto);

// Actualizar un producto
router.put('/:id', productoController.actualizarProducto);

// Eliminar un producto
router.delete('/:id', productoController.eliminarProducto);

module.exports = router;
