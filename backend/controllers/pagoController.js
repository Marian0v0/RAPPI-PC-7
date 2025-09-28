/**
 * Pago Controller
 * @module pagoController
 * @author Marian:D
 */

const pagoModel = require('../models/pagoModel');
const metodoPagoModel = require('../models/metodoPagoModel');
const calculadoraPrecios = require('../services/calculadoraPrecios');

const pagoController = {

    getPagos: async (req, res) => {
        try {
            const pagos = await pagoModel.getAll();
            res.json({ success: true, data: pagos });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getPagoById: async (req, res) => {
        try {
            const { id_pago } = req.params;
            const pago = await pagoModel.getById(id_pago);
            if (!pago) {
                return res.status(404).json({ success: false, error: 'Pago no encontrado' });
            }
            res.json({ success: true, data: pago });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getPagosByPedido: async (req, res) => {
        try {
            const { id_pedido } = req.params;
            const pagos = await pagoModel.getByPedido(id_pedido);
            res.json({ success: true, data: pagos });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getPagosByCliente: async (req, res) => {
        try {
            const { id_cliente } = req.params;
            const pagos = await pagoModel.getByCliente(id_cliente);
            res.json({ success: true, data: pagos });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    createPago: async (req, res) => {
        try {
            const { id_pedido, id_cliente, id_metodo, monto } = req.body;
            if (!id_pedido || !id_cliente || !id_metodo || !monto) {
                return res.status(400).json({ success: false, error: 'Todos los campos son requeridos: id_pedido, id_cliente, id_metodo, monto' });
            }
            const pagoExistente = await pagoModel.checkPagoByPedido(id_pedido);
            if (pagoExistente) {
                return res.status(400).json({ success: false, error: 'Este pedido ya tiene un pago registrado'});
            }
            if (monto <= 0) {
                return res.status(400).json({ success: false, error: 'El monto debe ser mayor a 0'});
            }
            const pagoData = {id_pedido,id_cliente,id_metodo,monto };
            const newPago = await pagoModel.create(pagoData);
            res.status(201).json({ success: true, data: newPago });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    updatePago: async (req, res) => {
        try {
            const { id_pago } = req.params;
            const { monto, id_metodo } = req.body;
            if (!monto && !id_metodo) {
                return res.status(400).json({ success: false, error: 'Se requiere al menos un campo para actualizar: monto o id_metodo' });
            }
            if (monto && monto <= 0) {
                return res.status(400).json({ success: false, error: 'El monto debe ser mayor a 0' });
            }
            const updateData = {};
            if (monto) updateData.monto = monto;
            if (id_metodo) updateData.id_metodo = id_metodo;
            const pagoActualizado = await pagoModel.update(id_pago, updateData);
            res.json({ success: true, data: pagoActualizado });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    deletePago: async (req, res) => {
        try {
            const { id_pago } = req.params;
            const pagoEliminado = await pagoModel.delete(id_pago);
            if (!pagoEliminado) {
                return res.status(404).json({ success: false, error: 'Pago no encontrado' });
            }
            res.json({ success: true, message: 'Pago eliminado correctamente',data: pagoEliminado});
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    calcularCostoPedido: async (req, res) => {
        try {
            const { id_pedido } = req.params;
            const costo = await calculadoraPrecios.calcularCostoPedido(id_pedido);
            res.json({ success: true, data: costo });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    realizarPago: async (req, res) => {
        try {
            const { id_pedido, id_cliente, id_metodo, pedido_completado } = req.body;
            
            if (!id_pedido || !id_cliente || !id_metodo) {
                return res.status(400).json({ success: false, error: 'id_pedido, id_cliente e id_metodo son requeridos' 
                });
            }
            const costo = await calculadoraPrecios.calcularCostoPedido(id_pedido);
            const pagoData = {id_pedido,id_cliente,id_metodo,monto: costo.total};
            const newPago = await pagoModel.create(pagoData);
            
            if (pedido_completado) {
                const pedidoModel = require('../models/pedidoModels');
                await pedidoModel.updateEstado(id_pedido, 'Entregado');
            }res.status(201).json({ success: true, message: 'Pago registrado exitosamente',data: {pago: newPago,costo: costo}
            });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    createMetodoPago: async (req, res) => {
        try {
            const { id_cliente, tipo_metodo, confirmacion_metodo } = req.body;
            
            if (!id_cliente || !tipo_metodo) {
                return res.status(400).json({ success: false, error: 'id_cliente y tipo_metodo son requeridos'});
            }
            const metodoData = {id_cliente,tipo_metodo,confirmacion_metodo: confirmacion_metodo || `Método de pago ${tipo_metodo}`};
            const newMetodo = await metodoPagoModel.create(metodoData);
            res.status(201).json({ success: true, message: `Método de pago ${tipo_metodo} registrado exitosamente`,data: newMetodo
            });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    createEfectivo: async (req, res) => {
        try {
            const { id_cliente, confirmacion_metodo } = req.body;
            
            if (!id_cliente) {
                return res.status(400).json({ success: false, error: 'id_cliente es requerido'});
            }

            const efectivoData = {id_cliente,confirmacion_metodo: confirmacion_metodo || 'Pago en efectivo al momento de la entrega'};
            const newMetodo = await metodoPagoModel.createEfectivo(efectivoData);
            res.status(201).json({ success: true, message: 'Método de pago en efectivo registrado exitosamente',data: newMetodo });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    createTarjeta: async (req, res) => {
        try {
            const { id_cliente, nombre_titular, numero_tarjeta, fecha_tarjeta, codigo_tar, tipo_tar } = req.body;
            
            if (!id_cliente || !nombre_titular || !numero_tarjeta || !fecha_tarjeta || !codigo_tar || !tipo_tar) {
                return res.status(400).json({ success: false, error: 'Todos los campos de tarjeta son requeridos'});
            }
            const tarjetaData = {id_cliente,nombre_titular,numero_tarjeta,fecha_tarjeta,codigo_tar,tipo_tar};
            const newMetodo = await metodoPagoModel.createTarjeta(tarjetaData);

            res.status(201).json({ success: true, message: 'Método de pago con tarjeta registrado exitosamente',data: newMetodo});
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    createNequi: async (req, res) => {
        try {
            const { id_cliente, numero_cel, nombre_titular, codigo_pago, valor_pago } = req.body;
            if (!id_cliente || !numero_cel || !nombre_titular) {
                return res.status(400).json({ success: false, error: 'id_cliente, numero_cel y nombre_titular son requeridos' });
            }
            const nequiData = {id_cliente,numero_cel,nombre_titular,codigo_pago,valor_pago};
            const newMetodo = await metodoPagoModel.createNequi(nequiData);

            res.status(201).json({ success: true, message: 'Método de pago Nequi registrado exitosamente',data: newMetodo });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getMetodosByCliente: async (req, res) => {
        try {
            const { id_cliente } = req.params;
            const metodos = await metodoPagoModel.getByCliente(id_cliente);
            res.json({ success: true, data: metodos });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getMetodosPago: async (req, res) => {
        try {
            const metodos = await metodoPagoModel.getAll();
            res.json({ success: true, data: metodos });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getMetodoById: async (req, res) => {
        try {
            const { id_metodo } = req.params;
            const metodo = await metodoPagoModel.getById(id_metodo);
            if (!metodo) {
                return res.status(404).json({ success: false, error: 'Método de pago no encontrado' });
            }
            res.json({ success: true, data: metodo });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    updateMetodoPago: async (req, res) => {
        try {
            const { id_metodo } = req.params;
            const updateData = req.body;
            const metodoActualizado = await metodoPagoModel.update(id_metodo, updateData);
            res.json({ success: true, data: metodoActualizado });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    deleteMetodoPago: async (req, res) => {
        try {
            const { id_metodo } = req.params;
            const metodoEliminado = await metodoPagoModel.delete(id_metodo);
            res.json({ success: true, message: 'Método de pago eliminado correctamente', data: metodoEliminado });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = pagoController;