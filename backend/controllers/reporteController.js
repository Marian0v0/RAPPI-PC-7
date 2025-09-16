/**
 * This module handles HTTP requests related to "reporte" management operations.
 * <p>
 * It exports an object with methods to handle requests for retrieving, creating, and authenticating clients.
 * 
 * @module reporteController
 * @author German Marcillo
 */

const reporte = require('../models/reporte');

const reporteController = {

    getReportes: async (req, res) => {
        try {
            const reportes = await reporte.all();
            res.json({ success: true, data: reportes });
        
        }catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getReportesById: async (req, res) => {
        try {

            const {id_reporte} = req.body;

            const reportes = await reporte.getById(id_reporte);
            res.json({ success: true, data: reportes });
        
        }catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getReportesByCliente: async (req, res) => {
        try {

            const {id_cliente} = req.body;

            const reportes = await reporte.getClientReports(id_cliente);
            res.json({ success: true, data: reportes });
        
        }catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getReportesByType: async (req, res) => {
        try {

            const {tipo_reporte} = req.body;

            const reportes = await reporte.getByType(tipo_reporte);
            res.json({ success: true, data: reportes });
        
        }catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    createReporte: async (req, res) => {   
        try {
            const newReporte = await reporte.create(req.body);
            res.status(201).json({ success: true, data: newReporte });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

};

module.exports = reporteController;