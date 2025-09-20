/**
 * This module handles HTTP requests related to client management operations.
 * <p>
 * It exports an object with methods to handle requests for retrieving, creating, and authenticating clients.
 * 
 * @module clienteController
 * @author Juan Moncayo
 */

const Cliente = require('../models/client.model');
const bcrypt = require('bcrypt');

const clientController = {

    /**
     * Handles GET request to retrieve all client records.
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {void} Sends JSON response with all client data
     * @throws {Error} If there's an error processing the request
     */
    getClientes: async (req, res) => {
        try {
            const clientes = await Cliente.getAll();
            res.json({ success: true, data: clientes });
        } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        }
    },


    /**
     * Handles POST request to create a new client record.
     * 
     * @param {Object} req - Express request object with body containing client data
     * @param {Object} res - Express response object
     * @returns {void} Sends JSON response with the created client data
     * @throws {Error} If there's an error processing the request
     */
    createCliente: async (req, res) => {   
        try {
            const newCliente = await Cliente.new(req.body);
            res.status(201).json({ success: true, data: newCliente });
        } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * Handles POST request for client authentication.
     * 
     * @param {Object} req - Express request object with body containing:
     *                      - correo: Client email address
     *                      - password: Client password
     * @param {Object} res - Express response object
     * @returns {void} Sends JSON response with authentication result
     * @throws {Error} If there's an error processing the request
     */
    login: async(req, res) => {
        try{ 

            const { correo, password } = req.body;

            const cliente = await Cliente.emailLogin(correo);
                if (!cliente) {
                    return res.status(401).json({ 
                        success: false, 
                        error: 'El nombre o contraseña no existe' 
                    });
            }

            const passwordMatch = await bcrypt.compare(password, cliente.password);
            if (!passwordMatch) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'El nombre o contraseña no existe' 
                });
            }

            const { password: _, ...loginCliente} = cliente;
            res.json({ 
                success: true, 
                message: 'Inicio de sesión correcto',
                data: loginCliente
            });

        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    },

    /**
     * Handles DELETE request to remove a client record.
     * 
     * @param {Object} req - Express request object with params containing:
     *                      - id: Client ID to delete (required)
     * @param {Object} res - Express response object
     * @returns {void} Sends JSON response confirming deletion or error
     * @throws {Error} If there's an error processing the request
     */
    deleteCliente: async (req, res) => {
        try {
            const { id } = req.params;

            const clienteExistente = await Cliente.clientExists(id);
            if (!clienteExistente) {
                return res.status(404).json({
                    success: false,
                    error: 'Cliente no encontrado'
                });
            }

            await Cliente.delete(id);
            
            res.json({
                success: true,
                message: 'Cliente eliminado correctamente'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    /**
     * Handles PUT request to change a client's password.
     * 
     * @param {Object} req - Express request object with body containing:
     *                      - id: Client ID (required)
     *                      - newPassword: New password for the client (required)
     *                      - currentPassword: Current password for verification
     * @param {Object} res - Express response object
     * @returns {void} Sends JSON response with updated client data or error
     * @throws {Error} If there's an error processing the request
     */

    changePassword: async (req, res) => {
        try {
            const { id, newPassword, currentPassword } = req.body;

            if (!id || !newPassword) {
                return res.status(400).json({
                    success: false,
                    error: 'ID and new password are required'
                });
            }

            const clienteExists = await Cliente.clientExists(id);
            if (!clienteExists) {
                return res.status(404).json({
                    success: false,
                    error: 'Cliente not found'
                });
            }

            
            if (currentPassword) {
                const cliente = await Cliente.getClientWithPassword(id);
                const passwordMatch = await bcrypt.compare(currentPassword, cliente.password);
                if (!passwordMatch) {
                    return res.status(401).json({
                        success: false,
                        error: 'Incorrect current password'
                    });
                }
            }

            const clienteActualizado = await Cliente.changePassword(id, newPassword);
            
            res.json({
                success: true,
                message: 'Password updated successfully',
                data: clienteActualizado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    /**
     * Handles PUT request to change a client's role.
     * 
     * @param {Object} req - Express request object with body containing:
     *                      - id: Client ID (required)
     *                      - newRol: New role for the client (required)
     * @param {Object} res - Express response object
     * @returns {void} Sends JSON response with updated client data or error
     * @throws {Error} If there's an error processing the request
     */
    changeRol: async (req, res) => {
        try {
            const { id, newRol } = req.body;

            const clienteExistente = await Cliente.clientExists(id);
            if (!clienteExistente) {
                return res.status(404).json({
                    success: false,
                    error: 'Cliente no encontrado'
                });
            }

            const clienteActualizado = await Cliente.changeRol(id, newRol);
            
            res.json({
                success: true,
                message: 'Rol actualizado correctamente',
                data: clienteActualizado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

};

module.exports = clientController;