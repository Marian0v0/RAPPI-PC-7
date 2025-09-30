/**
 * Pago Routes
 * @module pagoRoutes
 * @author Marian:D
 */

const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

router.get('/pagos', pagoController.getPagos);
router.get('/pagos/:id_pago', pagoController.getPagoById);
router.get('/pagos/pedido/:id_pedido', pagoController.getPagosByPedido);
router.get('/pagos/cliente/:id_cliente', pagoController.getPagosByCliente);
router.post('/pagos/create', pagoController.createPago);
router.put('/pagos/:id_pago', pagoController.updatePago);
router.delete('/pagos/:id_pago', pagoController.deletePago);
router.get('/pagos/calcular/:id_pedido', pagoController.calcularCostoPedido);
router.post('/pagos/realizar', pagoController.realizarPago);
router.get('/metodos-pago', pagoController.getMetodosPago);
router.get('/metodos-pago/:id_metodo', pagoController.getMetodoById);
router.get('/megtodos-pago/cliente/:id_cliente', pagoController.getMetodosByCliente);
router.post('/metodos-pago/create', pagoController.createMetodoPago);
router.post('/metodos-pago/efectivo', pagoController.createEfectivo);
router.post('/metodos-pago/tarjeta', pagoController.createTarjeta);
router.post('/metodos-pago/nequi', pagoController.createNequi);
router.put('/metodos-pago/:id_metodo', pagoController.updateMetodoPago);
router.delete('/metodos-pago/:id_metodo', pagoController.deleteMetodoPago);

module.exports = router;