/**
 * Pedido Controller
 * @module pedidoController
 * @author Marian:D
 */

const pedidoModel = require('../models/pedidoModels');

const pedidoController = {

    getPedidos: async (req, res) => {
        try {
            const pedidos = await pedidoModel.getAll();
            res.json({ success: true, data: pedidos });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getPedidoById: async (req, res) => {
        try {
            const { id_pedido } = req.params;
            const pedido = await pedidoModel.getById(id_pedido);
            if (!pedido) {
                return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
            }
            res.json({ success: true, data: pedido });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getPedidosByCliente: async (req, res) => {
        try {
            const { id_cliente } = req.params;
            const pedidos = await pedidoModel.getByCliente(id_cliente);
            res.json({ success: true, data: pedidos });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getPedidosByEstado: async (req, res) => {
        try {
            const { estado } = req.params;
            const estadosValidos = ['Pendiente', 'Aceptado', 'En Proceso', 'Entregado', 'Cancelado'];
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({ success: false, error: `Estado no válido. Los estados permitidos son: ${estadosValidos.join(', ')}` });
            }
            const pedidos = await pedidoModel.getByEstado(estado);
            res.json({ success: true, data: pedidos });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    createPedido: async (req, res) => {
        try {
            const { id_cliente, direccion_entrega, total_pedido, cargos_adicionales, productos } = req.body;
            if (!id_cliente || !total_pedido || !productos || productos.length === 0) {
                return res.status(400).json({ success: false, error: 'Datos incompletos: id_cliente, total_pedido y productos son requeridos' });
            }
            if (total_pedido <= 0) {
                return res.status(400).json({ success: false, error: 'El total del pedido debe ser mayor a 0'});
            }
            const pedidoData = {pedido: {id_cliente, direccion_entrega: direccion_entrega || null, total_pedido,cargos_adicionales: cargos_adicionales || 0,estado_pedido: 'Pendiente'},
                                detalles: productos.map(producto => ({id_producto: producto.id_producto,cantidad: producto.cantidad || 1,precio_unitario: producto.precio_unitario}))
            };
            const newPedido = await pedidoModel.create(pedidoData);
            res.status(201).json({ success: true, data: newPedido });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    updatePedido: async (req, res) => {
        try {
            const { id_pedido } = req.params;
            const { direccion_entrega, total_pedido, cargos_adicionales } = req.body;
            if (!direccion_entrega && !total_pedido && !cargos_adicionales) {
                return res.status(400).json({ success: false, error: 'Se requiere al menos un campo para actualizar' });
            }
            if (total_pedido && total_pedido <= 0) {
                return res.status(400).json({ success: false, error: 'El total del pedido debe ser mayor a 0' });
            }
            const updateData = {};
            if (direccion_entrega) updateData.direccion_entrega = direccion_entrega;
            if (total_pedido) updateData.total_pedido = total_pedido;
            if (cargos_adicionales) updateData.cargos_adicionales = cargos_adicionales;
            
            const pedidoActualizado = await pedidoModel.update(id_pedido, updateData);
            res.json({ success: true, data: pedidoActualizado });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    updateEstadoPedido: async (req, res) => {
        try {
            const { id_pedido, estado_pedido } = req.body;
            if (!id_pedido || !estado_pedido) {
                return res.status(400).json({ success: false, error: 'id_pedido y estado_pedido son requeridos' });
            }
            const estadosValidos = ['Pendiente', 'Aceptado', 'En Proceso', 'Entregado', 'Cancelado'];
            if (!estadosValidos.includes(estado_pedido)) {
                return res.status(400).json({ success: false, error: `Estado no válido. Los estados permitidos son: ${estadosValidos.join(', ')}` });
            }
            const pedido = await pedidoModel.updateEstado(id_pedido, estado_pedido);
            res.json({ success: true, data: pedido });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    deletePedido: async (req, res) => {
        try {
            const { id_pedido } = req.params;
            const pedidoExistente = await pedidoModel.getById(id_pedido);
            if (!pedidoExistente) {
                return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
            }
            if (pedidoExistente.estado_pedido === 'Entregado' || pedidoExistente.estado_pedido === 'En Proceso') {
                return res.status(400).json({ success: false, error: 'No se puede eliminar un pedido que ya fue entregado o está en proceso' });
            }
            const pedidoEliminado = await pedidoModel.delete(id_pedido);
            res.json({ success: true, message: 'Pedido eliminado correctamente',data: pedidoEliminado });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    addProductoToPedido: async (req, res) => {
        try {
            const { id_pedido } = req.params;
            const { id_producto, cantidad, precio_unitario } = req.body;
            if (!id_producto || !precio_unitario) {
                return res.status(400).json({ success: false, error: 'id_producto y precio_unitario son requeridos' });
            }
            if (precio_unitario <= 0) {
                return res.status(400).json({ success: false, error: 'El precio unitario debe ser mayor a 0' });
            }
            const productoData = {id_producto,cantidad: cantidad || 1,precio_unitario};
            const detalle = await pedidoModel.addProducto(id_pedido, productoData);
            res.status(201).json({ success: true, data: detalle });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    removeProductoFromPedido: async (req, res) => {
        try {
            const { id_pedido, id_producto } = req.params;
            const productoEliminado = await pedidoModel.removeProducto(id_pedido, id_producto);
            if (!productoEliminado) {
                return res.status(404).json({ success: false, error: 'Producto no encontrado en el pedido' });
            }
            res.json({ success: true, message: 'Producto eliminado del pedido correctamente',data: productoEliminado});
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    updateProductoInPedido: async (req, res) => {
        try {
            const { id_pedido, id_producto } = req.params;
            const { cantidad, precio_unitario } = req.body;
            if (!cantidad && !precio_unitario) {
                return res.status(400).json({ success: false,error: 'Se requiere al menos un campo para actualizar: cantidad o precio_unitario' });
            }
            if (cantidad && cantidad <= 0) {
                return res.status(400).json({ success: false, error: 'La cantidad debe ser mayor a 0'});
            }
            if (precio_unitario && precio_unitario <= 0) {
                return res.status(400).json({ success: false, error: 'El precio unitario debe ser mayor a 0'});
            }
            const updateData = {};
            if (cantidad) updateData.cantidad = cantidad;
            if (precio_unitario) updateData.precio_unitario = precio_unitario;
            
            const productoActualizado = await pedidoModel.updateProducto(id_pedido, id_producto, updateData);
            res.json({ success: true, data: productoActualizado });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    cancelarPedido: async (req, res) => {
        try {
            const { id_pedido, cargos_adicionales } = req.body;
            if (!id_pedido) {
                return res.status(400).json({ success: false, error: 'id_pedido es requerido' });
            }

            const pedidoExistente = await pedidoModel.getById(id_pedido);
            if (!pedidoExistente) {
                return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
            }

            if (pedidoExistente.estado_pedido === 'En Proceso' || pedidoExistente.estado_pedido === 'Entregado') {
                return res.status(400).json({ success: false, error: 'No se puede cancelar un pedido que ya está en proceso o entregado' });
            }

            const pedidoCancelado = await pedidoModel.updateEstado(id_pedido, 'Cancelado');
            if (cargos_adicionales !== undefined) {
                await pedidoModel.update(id_pedido, { cargos_adicionales });
            }res.json({ success: true, message: 'El pedido ha sido cancelado',data: pedidoCancelado});

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    agregarAlCarrito: async (req, res) => {
        try {
            const { id_cliente, productos } = req.body;
            
            if (!id_cliente || !productos || productos.length === 0) {
                return res.status(400).json({ success: false, error: 'id_cliente y productos son requeridos' });
            }

            for (const producto of productos) {
                if (!producto.id_producto || !producto.precio_producto) {
                    return res.status(400).json({ success: false, error: 'Cada producto debe tener id_producto y precio_producto' });
                }
            }

            const pedidoData = {
                pedido: {id_cliente,estado_pedido: 'Pendiente',total_pedido: 0, cargos_adicionales: 0},
                detalles: productos.map(producto => ({id_producto: producto.id_producto,cantidad: producto.cantidad || 1,precio_unitario: producto.precio_producto}))
            };

            const nuevoPedido = await pedidoModel.create(pedidoData);
            const calculadoraPrecios = require('../services/calculadoraPrecios');
            const costo = await calculadoraPrecios.actualizarTotalPedido(nuevoPedido.id_pedido);

            res.status(201).json({ success: true, message: 'Productos agregados al carrito exitosamente', data: {pedido: nuevoPedido,costo: costo}
            });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getEstadoPedido: async (req, res) => {
        try {
            const { id_pedido } = req.params;
            const pedido = await pedidoModel.getById(id_pedido);
            if (!pedido) {
                return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
            }

            let tiempoEstimado = null;
            const ahora = new Date();
            const fechaPedido = new Date(pedido.fecha_pedido);

            switch (pedido.estado_pedido) {
                case 'Pendiente':
                    tiempoEstimado = 'Esperando confirmación del restaurante';
                    break;
                case 'Aceptado':
                    tiempoEstimado = '30-45 minutos';
                    break;
                case 'En Proceso':
                    const tiempoTranscurrido = Math.floor((ahora - fechaPedido) / (1000 * 60)); 
                    tiempoEstimado = Math.max(0, 45 - tiempoTranscurrido) + ' minutos restantes';
                    break;
                case 'Entregado':
                    tiempoEstimado = 'Pedido entregado';
                    break;
                case 'Cancelado':
                    tiempoEstimado = 'Pedido cancelado';
                    break;
                default:
                    tiempoEstimado = 'Tiempo no disponible';
            }

            res.json({ success: true, data: {pedido: pedido,estado: pedido.estado_pedido,tiempoEstimado: tiempoEstimado,fechaPedido: pedido.fecha_pedido}
            });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = pedidoController;