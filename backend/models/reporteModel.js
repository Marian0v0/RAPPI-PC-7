/**
 * This module provides functionality for "reporte" management operations.
 * 
 * It exports an object with methods to retrieve, create, and validate client records.
 * 
 * @module reporte
 * @author German Marcillo
 */

const Reporte = {

    all: async() => {
        const { data, error } = await supabase.from('reporte').select('*');

        if (error) throw error;
        return data;
    },

    getById: async(id_reporte) =>{
        const { data, error } = await supabase.from('reporte').select('*').eq('id_reporte', id_reporte).single();

        if (error) throw error;
        return data;
    },

    getClientReports: async(id_cliente) =>{
        const { data, error } = await supabase.from('reporte').select('*').eq('id_cliente', id_cliente);

        if (error) throw error;
        return data;
    },

    getByType: async(tipo_reporte) =>{
        const { data, error } = await supabase.from('reporte').select('*').eq('tipo_reporte', tipo_reporte);

        if (error) throw error;
        return data;
    },

    create: async(userData) =>{
        const { data, error } = await supabase.from('reporte').insert([{userData}]).select('*');
    
        if (error) throw error;
        return data[0];
    },

    delete: async (id_reporte) => {
        const { error } = await supabase.from('reporte').delete().eq('id_reporte', id_reporte);

        if (error) throw error;
        return true;
    },

    edit_report : async (id_reporte, newDescripcion) => {
        const { data, error } = await supabase.from('reporte').update({descripcion: newDescripcion}).eq('id_reporte', id_reporte).select('*');

        if (error) throw error;
        return data[0];
  },

};

module.exports = Reporte;