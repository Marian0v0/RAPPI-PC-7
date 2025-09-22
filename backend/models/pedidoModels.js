/**
 * Pedido Model
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
            console.error("❌ Error en getAll:", error);
            throw error;
        }
    },

    getById: async (id_pedido) => {
        try {
            const { data, error } = await supabase
                .from('pedido').select('*, cliente(*), pedido_detalle(*,producto(*))').eq('id_pedido', id_pedido).single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("❌ Error en getById:", error);
            throw error;
        }
    },

    getByCliente: async (id_cliente) => {
        try {
            const { data, error } = await supabase
                .from('pedido').select('*, cliente(*), pedido_detalle(*, producto(*))').eq('id_cliente', id_cliente).order('fecha_pedido', { ascending: false });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("❌ Error en getByCliente:", error);
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
            console.error("❌ Error en getByEstado:", error);
            throw error;
        }
    },

    create: async (pedidoData) => {
        const { pedido, detalles } = pedidoData;
        try {
            let pedidoCreado;
            const { data: pedidoData, error: errorPedido } = await supabase
                .from('pedido').insert([pedido]).select().single();
            if (errorPedido) throw errorPedido;
            pedidoCreado = pedidoData;
            if (detalles && detalles.length > 0) {
                const detallesConPedido = detalles.map(detalle => ({
                    ...detalle,
                    id_pedido: pedidoCreado.id_pedido
                }));
                const { error: errorDetalles } = await supabase
                    .from('pedido_detalle').insert(detallesConPedido);
                if (errorDetalles) throw errorDetalles;
            }
            return await pedidoModel.getById(pedidoCreado.id_pedido);
        } catch (error) {
            console.error("❌ Error en create:", error);
            throw error;
        }
    },

    update: async (id_pedido, pedidoData) => {
        try {
            const { data, error } = await supabase
                .from('pedido').update(pedidoData).eq('id_pedido', id_pedido).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("❌ Error en update:", error);
            throw error;
        }
    },

    updateEstado: async (id_pedido, estado_pedido) => {
        try {
            const { data, error } = await supabase
                .from('pedido').update({ estado_pedido }).eq('id_pedido', id_pedido).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("❌ Error en updateEstado:", error);
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
            console.error("❌ Error en delete:", error);
            throw error;
        }
    },

    addProducto: async (id_pedido, productoData) => {
        try {
            const { data, error } = await supabase
                .from('pedido_detalle').insert([{ ...productoData, id_pedido }]).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("❌ Error en addProducto:", error);
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
            console.error("❌ Error en removeProducto:", error);
            throw error;
        }
    },

    updateProducto: async (id_pedido, id_producto, productoData) => {
        try {
            const { data, error } = await supabase
                .from('pedido_detalle').update(productoData).eq('id_pedido', id_pedido).eq('id_producto', id_producto).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("❌ Error en updateProducto:", error);
            throw error;
        }
    }
};

module.exports = pedidoModel;