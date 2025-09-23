/**
 * Este módulo maneja la funcionalidad de rutas para "producto".
 * 
 * @module producto
 */


// routes/productoRoutes.js
const express = require('express')
const router = express.Router()
const productoController = require('../controllers/productoControllers')

// Rutas para productos

// Obtener todos los productos
router.get('/', productoController.getProductos)

// Obtener un producto por ID
router.get('/id/:id_producto', productoController.getProductoById)

router.get('/restaurante/:id_producto', productoController.getProductoByRestaurante)

router.get('/comercio/:id_producto', productoController.getProductoByComercio)

// Crear un nuevo producto
router.post('/', productoController.createProducto)

// Actualizar un producto
router.put('/:id_producto', productoController.updateProducto)

// Eliminar un producto
router.delete('/:id_producto', productoController.deleteProducto)

module.exports = router
