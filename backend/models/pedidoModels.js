/**
 * Pedido Model - Versión Corregida (Sin dependencia de stock)
 * @module pedidoModel
 * @author Marian:D
 */

const supabase = require('../utils/database');

const pedidoModel = {
    
    getAll: async () => {
        try {
            const { data, error } = await supabase
            .from('pedido').select('*, cliente(*), pedido_detalle(*, producto(*))').order('fecha_pedido', { ascending: false });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("  Error en getAll:", error);
            throw error;
        }
    },

    getById: async (id_pedido) => {
    try {
        const { data: pedido, error: errorPedido } = await supabase
            .from('pedido').select('*').eq('id_pedido', id_pedido).single();
            
        if (errorPedido) {
            console.error("Error obteniendo pedido:", errorPedido);
            return null; 
        }
        if (!pedido) {return null; }
        
        const { data: detalles, error: errorDetalles } = await supabase
            .from('pedido_detalle').select('*').eq('id_pedido', id_pedido);
            
        if (errorDetalles) {
            console.warn("Error obteniendo detalles:", errorDetalles);
        }
        const { data: cliente, error: errorCliente } = await supabase
            .from('cliente').select('*').eq('id_cliente', pedido.id_cliente).single();
            
        if (errorCliente) {
            console.warn("Error obteniendo cliente:", errorCliente);
        }
        
        return { ...pedido, cliente: cliente || null, pedido_detalle: detalles || []
        };
    } catch (error) {
        console.error("  Error en getById:", error);
        return null; 
    }
},

    getByCliente: async (id_cliente) => {
        try {
            const { data, error } = await supabase
                .from('pedido').select('*, cliente(*), pedido_detalle(*, producto(*))').eq('id_cliente', id_cliente).order('fecha_pedido', { ascending: false });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("  Error en getByCliente:", error);
            throw error;
        }
    },

    getByEstado: async (estado_pedido) => {
        try {
            const { data, error } = await supabase
                .from('pedido').select('*, cliente(*), pedido_detalle(*, producto(*))').eq('estado_pedido', estado_pedido).order('fecha_pedido', { ascending: false });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("  Error en getByEstado:", error);
            throw error;
        }
    },

    create: async (pedidoData) => {
        const { pedido, detalles } = pedidoData;
        
        try {
            for (const detalle of detalles) {
                const { data: producto, error: productoError } = await supabase
                    .from('producto').select('*').eq('id_producto', detalle.id_producto).single();
                if (productoError) {
                    throw new Error(`Producto ${detalle.id_producto} no encontrado`);
                }
            }
            
            let pedidoCreado;
            const { id_pedido, ...pedidoSinId } = pedido;
            const { data: pedidoDataResult, error: errorPedido } = await supabase
                .from('pedido').insert([pedidoSinId]).select().single();
                
            if (errorPedido) throw errorPedido;
            pedidoCreado = pedidoDataResult;
            
            if (detalles && detalles.length > 0) {
                const detallesConPedido = detalles.map(detalle => ({
                    ...detalle,
                    id_pedido: pedidoCreado.id_pedido
                }));
                
                const { error: errorDetalles } = await supabase
                    .from('pedido_detalle').insert(detallesConPedido);
                if (errorDetalles) throw errorDetalles;
            }return await pedidoModel.getById(pedidoCreado.id_pedido);
        } catch (error) {
            console.error("  Error en create:", error);
            throw error;
        }
    },

    update: async (id_pedido, pedidoData) => {
    try {
        const { data, error } = await supabase
            .from('pedido').update(pedidoData).eq('id_pedido', id_pedido).select().single();
            
        if (error) {
            console.error("Error actualizando pedido:", error);
            throw error;
        }return data;
    } catch (error) {
        console.error("  Error en update:", error);
        throw error;
    }
},

    updateEstado: async (id_pedido, estado_pedido) => {
    try {
        const { data, error } = await supabase
            .from('pedido').update({ estado_pedido }).eq('id_pedido', id_pedido).select().single();
        if (error) {
            console.error("Error actualizando estado:", error);
            throw error;
        }return data;
    } catch (error) {
        console.error("  Error en updateEstado:", error);
        throw error;
    }
},

    delete: async (id_pedido) => {
        try {
            const { error: errorDetalles } = await supabase
                .from('pedido_detalle').delete().eq('id_pedido', id_pedido);
            if (errorDetalles) throw errorDetalles;
            const { data, error } = await supabase
                .from('pedido').delete().eq('id_pedido', id_pedido).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("  Error en delete:", error);
            throw error;
        }
    },

    addProducto: async (id_pedido, productoData) => {
    try {
        const { data: producto, error: productoError } = await supabase
            .from('producto').select('*').eq('id_producto', productoData.id_producto);
        if (productoError) {
            console.error("Error verificando producto:", productoError);
            throw new Error('Error verificando producto');
        }
        if (!producto || producto.length === 0) {
            throw new Error('Producto no encontrado');
        }
        const { data, error } = await supabase
            .from('pedido_detalle').insert([{ ...productoData, id_pedido }]).select();
            
        if (error) {
            console.error("Error agregando producto:", error);
            throw error;
        }return data && data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error("  Error en addProducto:", error);
        throw error;
    }
},

    removeProducto: async (id_pedido, id_producto) => {
        try {
            const { data, error } = await supabase
                .from('pedido_detalle').delete().eq('id_pedido', id_pedido).eq('id_producto', id_producto).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("  Error en removeProducto:", error);
            throw error;
        }
    },

    updateProducto: async (id_pedido, id_producto, productoData) => {
    try {
        const { data: productoExistente, error: errorVerificacion } = await supabase
            .from('pedido_detalle').select('*') .eq('id_pedido', id_pedido) .eq('id_producto', id_producto);
            
        if (errorVerificacion) {
            console.error("Error verificando producto:", errorVerificacion);
            throw new Error('Error verificando producto en el pedido');
        }
        const { data, error } = await supabase
            .from('pedido_detalle').update(productoData).eq('id_pedido', id_pedido).eq('id_producto', id_producto).select();
        if (error) {
            console.error("Error actualizando producto:", error);
            throw error;
        }
        return data && data.length > 0 ? data[0] : productoExistente[0];
    } catch (error) {
        console.error("  Error en updateProducto:", error);
        throw error;
    }
},

    calcularCostoPedido: async (id_pedido) => {
        try {
            const { data: pedido, error } = await supabase
                .from('pedido').select('*, pedido_detalle(*, producto(*))').eq('id_pedido', id_pedido).single();
            if (error) throw error;
            let subtotal = 0;
            pedido.pedido_detalle.forEach(detalle => {
                subtotal += detalle.cantidad * detalle.precio_unitario;
            });
            
            const tarifaBase = 5;
            const tarifaPorKm = 2;
            const distanciaEstimada = 5;
            const tarifaEnvio = Math.max(tarifaBase, distanciaEstimada * tarifaPorKm);
            const cargosAdicionales = pedido.cargos_adicionales || 0;
            const total = subtotal + tarifaEnvio + cargosAdicionales;
            
            return {subtotal,tarifaEnvio,cargosAdicionales,total};
        } catch (error) {
            console.error("  Error en calcularCostoPedido:", error);
            throw error;
        }
    }
};

module.exports = pedidoModel;