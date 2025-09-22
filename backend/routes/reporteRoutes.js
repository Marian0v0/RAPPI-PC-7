/**
 * This module is for reporte routes.
 * 
 * It handles API endpoints related to "reportes", such as retrieving all "reportes", creating a new "reporte", and "reporte" authentication.
 * 
 * @module reporteRoutes
 * @author German Marcillo
 */

const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

router.get('/reportes', reporteController.getReportes);

router.get('/reportes/id/:id_reporte', reporteController.getReportesById);

router.get('/reportes/cliente/:id_cliente', reporteController.getReportesByCliente);

router.get('/reportes/tipo/:tipo_reporte', reporteController.getReportesByType);

router.post('/reportes/create', reporteController.createReporte);

router.put('/reportes/edit', reporteController.editReporte);

module.exports = router;