/**
 * This module handles HTTP requests related to "reporte" management operations.
 * <p>
 * It exports an object with methods to handle requests for retrieving, creating, and authenticating clients.
 * 
 * @module reporteController
 * @author German Marcillo
 */

const reporte = require('../models/reporteModel');

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

            const {id_reporte} = req.params;

            const reportes = await reporte.getById(id_reporte);
            res.json({ success: true, data: reportes });
        
        }catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getReportesByCliente: async (req, res) => {
        try {

            const {id_cliente} = req.params;

            const reportes = await reporte.getClientReports(id_cliente);
            res.json({ success: true, data: reportes });
        
        }catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getReportesByType: async (req, res) => {
        try {

            const {tipo_reporte} = req.params;

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

    editReporte: async (req, res) => {
        try {
            const { id_reporte, descripcion } = req.body;

            const reporteExist = await reporte.getById(id_reporte);

            if (reporteExist === null) {
                return res.status(404).json({success: false,  error: 'Reporte no encontrado'});
            }

            const updateReport = await reporte.edit_report(id_reporte, descripcion);
            
            res.json({success: true, message: 'Reporte actualizado correctamente', data: updateReport});

        } catch (error) {
            res.status(500).json({success: false, error: error.message});
        }
    },

    deleteReporte: async (req, res) => {
        try {
            const { id_reporte } = req.params;

            const reporteExist = await reporte.getById(id_reporte);

            if (reporteExist === null) {
               return res.status(404).json({success: false,  error: 'Reporte no encontrado'});
            }

            await id_reporte(id_reporte);
            
            res.json({success: true, message: 'Reporte eliminado correctamente'});

        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

};

module.exports = reporteController;