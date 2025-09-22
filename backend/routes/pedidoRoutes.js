/**
 * Pedido routes
 * @module pedidoRoutes
 * @author Marian:D
 */

const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/pedidos', pedidoController.getPedidos);
router.get('/pedidos/:id_pedido', pedidoController.getPedidoById);
router.get('/pedidos/cliente/:id_cliente', pedidoController.getPedidosByCliente);
router.get('/pedidos/estado/:estado', pedidoController.getPedidosByEstado);
router.post('/pedidos/create', pedidoController.createPedido);
router.put('/pedidos/:id_pedido', pedidoController.updatePedido);
router.put('/pedidos/estado', pedidoController.updateEstadoPedido);
router.delete('/pedidos/:id_pedido', pedidoController.deletePedido);
router.post('/pedidos/:id_pedido/productos', pedidoController.addProductoToPedido);
router.delete('/pedidos/:id_pedido/productos/:id_producto', pedidoController.removeProductoFromPedido);
router.put('/pedidos/:id_pedido/productos/:id_producto', pedidoController.updateProductoInPedido);

module.exports = router;