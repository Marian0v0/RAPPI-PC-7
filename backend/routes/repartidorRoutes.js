const express = require('express');
const router = express.Router();
const repartidorController = require('../controllers/repartidorController');

// Endpoints
router.patch('/pedidos/aceptar', repartidorController.aceptarPedido);
router.patch('/pedidos/rechazar', repartidorController.rechazarPedido);
router.get("/pendientes", repartidorController.obtenerPedidosPendientes);
router.get('/pedidos/:id_repartidor', repartidorController.obtenerPedidos);
router.patch('/pedidos/:id_pedido/estado', repartidorController.actualizarEstadoPedido);

router.post('/calificaciones/:id_repartidor', repartidorController.guardarCalificacion);
router.get('/calificaciones/:id_repartidor', repartidorController.obtenerCalificaciones);

router.patch('/disponibilidad/:id_repartidor', repartidorController.actualizarDisponibilidad);

module.exports = router;

//Comentario