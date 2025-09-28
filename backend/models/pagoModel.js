/**
 * Pago Model
 * @module pagoModel
 * @author Marian:D
 */

const supabase = require('../utils/database');

const pagoModel = {
    
    getAll: async () => {
        try {
            const { data, error } = await supabase
                .from('pago').select('*');
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en getAll:", error);
            throw error;
        }
    },

    getById: async (id_pago) => {
        try {
            const { data, error } = await supabase
                .from('pago').select('*').eq('id_pago', id_pago).single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en getById:", error);
            throw error;
        }
    },

    getByPedido: async (id_pedido) => {
        try {
            const { data, error } = await supabase
                .from('pago').select('*').eq('id_pedido', id_pedido);
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en getByPedido:", error);
            throw error;
        }
    },

    getByCliente: async (id_cliente) => {
        try {
            const { data, error } = await supabase
                .from('pago').select('*').eq('id_cliente', id_cliente);
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en getByCliente:", error);
            throw error;
        }
    },

    checkPagoByPedido: async (id_pedido) => {
        try {
            const { data, error } = await supabase
                .from('pago').select('*').eq('id_pedido', id_pedido).limit(1);
            if (error) throw error;
            return data && data.length > 0 ? data[0] : null;
        } catch (error) {
            console.error("Error en checkPagoByPedido:", error);
            throw error;
        }
    },

    create: async (pagoData) => {
        try {
            const { data: ultimoPago, error: errorUltimo } = await supabase
                .from('pago').select('id_pago').order('id_pago', { ascending: false }).limit(1);
            let id_pago = 1;
            if (!errorUltimo && ultimoPago && ultimoPago.length > 0) {
                id_pago = ultimoPago[0].id_pago + 1;
            }
            const pago = {id_pago,...pagoData };
            const { data, error } = await supabase
                .from('pago').insert([pago]).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en create:", error);
            throw error;
        }
    },

    update: async (id_pago, pagoData) => {
        try {
            const { data, error } = await supabase
                .from('pago').update(pagoData).eq('id_pago', id_pago).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    },

    delete: async (id_pago) => {
        try {
            const { data, error } = await supabase
                .from('pago').delete().eq('id_pago', id_pago).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
};

module.exports = pagoModel;