/**
 * MetodoPago Model
 * @module metodoPagoModel
 * @author Marian:D
 */

const supabase = require('../utils/database');

const metodoPagoModel = {
    
    getAll: async () => {
        try {
            const { data, error } = await supabase
                .from('metodo_pago').select('*');
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en getAll:", error);
            throw error;
        }
    },

    getById: async (id_metodo) => {
        try {
            const { data, error } = await supabase
                .from('metodo_pago').select('*').eq('id_metodo', id_metodo).single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en getById:", error);
            throw error;
        }
    },

    getByCliente: async (id_cliente) => {
        try {
            const { data, error } = await supabase
                .from('metodo_pago').select('*').eq('id_cliente', id_cliente);
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en getByCliente:", error);
            throw error;
        }
    },

    getByTipo: async (id_cliente, tipo_metodo) => {
        try {
            const { data, error } = await supabase
                .from('metodo_pago').select('*').eq('id_cliente', id_cliente).eq('tipo_metodo', tipo_metodo);
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en getByTipo:", error);
            throw error;
        }
    },

    create: async (metodoData) => {
        try {
            const { id_cliente, tipo_metodo, confirmacion_metodo } = metodoData;
            if (!id_cliente || !tipo_metodo) {
                throw new Error('ID cliente y tipo método son requeridos');
            }
            if (!['Efectivo', 'Tarjeta', 'Nequi'].includes(tipo_metodo)) {
                throw new Error('Tipo de método inválido');
            }
            const { data: ultimoMetodo, error: errorUltimo } = await supabase
                .from('metodo_pago').select('id_metodo').order('id_metodo', { ascending: false }).limit(1);
            let id_metodo = 1;
            if (!errorUltimo && ultimoMetodo && ultimoMetodo.length > 0) {
                id_metodo = ultimoMetodo[0].id_metodo + 1;
            }
            const metodo = {id_metodo,id_cliente,tipo_metodo,confirmacion_metodo: confirmacion_metodo || `Método de pago ${tipo_metodo}`};
            const { data, error } = await supabase
                .from('metodo_pago').insert([metodo]).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en create:", error);
            throw error;
        }
    },

    createEfectivo: async (efectivoData) => {
        try {
            const { id_cliente, confirmacion_metodo } = efectivoData;
            if (!id_cliente) {
                throw new Error('ID cliente es requerido');
            }
            const { data: ultimoMetodo, error: errorUltimo } = await supabase
                .from('metodo_pago').select('id_metodo').order('id_metodo', { ascending: false }).limit(1);
            let id_metodo = 1;
            if (!errorUltimo && ultimoMetodo && ultimoMetodo.length > 0) {
                id_metodo = ultimoMetodo[0].id_metodo + 1;
            }

            const metodoData = {id_metodo,id_cliente,tipo_metodo: 'Efectivo',confirmacion_metodo: confirmacion_metodo || 'Pago en efectivo al momento de la entrega' };
            const { data, error } = await supabase
                .from('metodo_pago').insert([metodoData]).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en createEfectivo:", error);
            throw error;
        }
    },

    createTarjeta: async (tarjetaData) => {
        try {
            const { id_cliente, nombre_titular, numero_tarjeta, fecha_tarjeta, codigo_tar, tipo_tar } = tarjetaData;
            if (!id_cliente || !nombre_titular || !numero_tarjeta || !fecha_tarjeta || !codigo_tar || !tipo_tar) {
                throw new Error('Todos los campos de tarjeta son requeridos');
            }

            if (numero_tarjeta.length < 13 || numero_tarjeta.length > 19) {
                throw new Error('Número de tarjeta inválido');
            }

            const { data: ultimoMetodo, error: errorUltimo } = await supabase
                .from('metodo_pago').select('id_metodo').order('id_metodo', { ascending: false }).limit(1);
            let id_metodo = 1;
            if (!errorUltimo && ultimoMetodo && ultimoMetodo.length > 0) {
                id_metodo = ultimoMetodo[0].id_metodo + 1;
            }
            
            const metodoData = {id_metodo,id_cliente,tipo_metodo: 'Tarjeta',confirmacion_metodo: `Tarjeta ${tipo_tar} terminada en ${numero_tarjeta.slice(-4)} - Titular: ${nombre_titular}`};
            const { data, error } = await supabase
                .from('metodo_pago').insert([metodoData]).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en createTarjeta:", error);
            throw error;
        }
    },

    createNequi: async (nequiData) => {
        try {
            const { id_cliente, numero_cel, nombre_titular, codigo_pago, valor_pago } = nequiData;
            if (!id_cliente || !numero_cel || !nombre_titular) {
                throw new Error('ID cliente, número celular y nombre titular son requeridos');
            }
            const celularRegex = /^3[0-9]{9}$/;
            if (!celularRegex.test(numero_cel)) {
                throw new Error('Número de celular inválido para Nequi');
            }
            const { data: ultimoMetodo, error: errorUltimo } = await supabase
                .from('metodo_pago').select('id_metodo').order('id_metodo', { ascending: false }).limit(1);

            let id_metodo = 1;
            if (!errorUltimo && ultimoMetodo && ultimoMetodo.length > 0) {
                id_metodo = ultimoMetodo[0].id_metodo + 1;
            }
            const metodoData = {id_metodo,id_cliente,tipo_metodo: 'Nequi',confirmacion_metodo: `Nequi - Celular: ${numero_cel} - Titular: ${nombre_titular} - Código: ${codigo_pago || 'Por generar'}`};
            const { data, error } = await supabase
                .from('metodo_pago').insert([metodoData]).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en createNequi:", error);
            throw error;
        }
    },

    update: async (id_metodo, metodoData) => {
        try {
            const { data, error } = await supabase
                .from('metodo_pago').update(metodoData).eq('id_metodo', id_metodo).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    },

    delete: async (id_metodo) => {
        try {
            const { data, error } = await supabase
                .from('metodo_pago').delete().eq('id_metodo', id_metodo).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
};

module.exports = metodoPagoModel;