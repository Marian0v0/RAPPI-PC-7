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

module.exports = router;
