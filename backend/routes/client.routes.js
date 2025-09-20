/**
 * This module is for client routes.
 * <p>
 * It handles API endpoints related to clients, such as retrieving all clients, creating a new client, and client authentication.
 * 
 * @module clienteRoutes
 * @author Juan Moncayo
 */

const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/client.controller');

/**
 * GET /backend/clientes
 * Retrieves all clients
 */
router.get('/clientes', clienteController.getClientes);

/**
 * POST /backend/new-cliente
 * Creates a new client
 */
router.post('/new-cliente', clienteController.createCliente);
router.post('/login', clienteController.login);

/**
 * POST /backend/login
 * Authenticates a client
 */
router.post('/login', clienteController.login);

/**
 * POST /backend/delete-cliente/:id
 * Deletes a client
 */
router.delete('/delete-cliente/:id', clienteController.deleteCliente);

/**
 * POST /backend/change-password
 * Change password a client
 */
router.put('/change-password', clienteController.changePassword);

/**
 * POST /backend/change-rol
 * Change role a client
 */
router.put('/change-rol', clienteController.changeRol);

module.exports = router;