/**
 * Ruta Routes
 * @module rutaRoutes
 * @author Marian:D
 */

const express = require('express');
const router = express.Router();
const rutaController = require('../controllers/rutaController');

router.post('/ruta/generar', rutaController.generarRutaEntrega);
router.get('/geolocalizacion/coordenadas/:direccion', rutaController.obtenerCoordenadas);
router.get('/geolocalizacion/direccion/:latitud/:longitud', rutaController.obtenerDireccion);
router.get('/geolocalizacion/distancia/:lat1/:lon1/:lat2/:lon2', rutaController.calcularDistancia);
router.get('/pedidos/disponibles/:id_repartidor', rutaController.getPedidosDisponibles);
router.post('/pedidos/tomar', rutaController.tomarPedido);
router.get('/pedidos/mis-pedidos/:id_repartidor', rutaController.getMisPedidos);

module.exports = router;
