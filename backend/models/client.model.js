const supabase = require('../utils/database');
const bcrypt = require('bcrypt');

const Cliente = {
  getAll: async() => {
    const { data, error } = await supabase
      .from('cliente')
      .select('id_cliente, nombre_cliente, cel_cliente, pais_cliente, ciudad_cliente, tipo_identificacion, numero_identificacion, fecha_cliente, correo_cliente, direccion_cliente')
      .order('nombre_cliente', { ascending: true });
    if (error) throw error;
    return data;
  },

  new: async (userData) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.contrasena_cliente, saltRounds);
    const { data, error } = await supabase
      .from('cliente')
      .insert([{
        id_cliente: userData.id_cliente,
        nombre_cliente: userData.nombre_cliente,
        cel_cliente: userData.cel_cliente,
        pais_cliente: userData.pais_cliente,
        ciudad_cliente: userData.ciudad_cliente,
        tipo_identificacion: userData.tipo_identificacion,
        numero_identificacion: userData.numero_identificacion,
        fecha_cliente: userData.fecha_cliente,
        correo_cliente: userData.correo_cliente,
        contrasena_cliente: hashedPassword,
        direccion_cliente: userData.direccion_cliente
      }])
      .select('id_cliente, nombre_cliente, cel_cliente, pais_cliente, ciudad_cliente, tipo_identificacion, numero_identificacion, fecha_cliente, correo_cliente, direccion_cliente');
    
    if (error) throw error;
    return data[0];
  },

  emailLogin: async (correo_cliente) => {
    const { data, error } = await supabase
      .from('cliente')
      .select('*')
      .eq('correo_cliente', correo_cliente)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  clientExists: async(id_cliente) => {
    const { data, error } = await supabase
      .from('cliente')
      .select('id_cliente')
      .eq('id_cliente', id_cliente)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? true : false;
  },

  delete: async (id_cliente) => {
    const { error } = await supabase
      .from('cliente')
      .delete()
      .eq('id_cliente', id_cliente);
    if (error) throw error;
    return true;
  },

  changePassword: async (id_cliente, newPassword) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const { data, error } = await supabase
      .from('cliente')
      .update({contrasena_cliente: hashedPassword})
      .eq('id_cliente', id_cliente)
      .select('id_cliente, correo_cliente, nombre_cliente');
    if (error) throw error;
    return data[0];
  },

  getClientWithPassword: async (id_cliente) => {
    const { data, error } = await supabase
      .from('cliente')
      .select('id_cliente, nombre_cliente, correo_cliente, contrasena_cliente')
      .eq('id_cliente', id_cliente)
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id_cliente, userData) => {
    const { data, error } = await supabase
      .from('cliente')
      .update({
        nombre_cliente: userData.nombre_cliente,
        cel_cliente: userData.cel_cliente,
        pais_cliente: userData.pais_cliente,
        ciudad_cliente: userData.ciudad_cliente,
        tipo_identificacion: userData.tipo_identificacion,
        numero_identificacion: userData.numero_identificacion,
        fecha_cliente: userData.fecha_cliente,
        correo_cliente: userData.correo_cliente,
        direccion_cliente: userData.direccion_cliente
      })
      .eq('id_cliente', id_cliente)
      .select('id_cliente, nombre_cliente, cel_cliente, pais_cliente, ciudad_cliente, tipo_identificacion, numero_identificacion, fecha_cliente, correo_cliente, direccion_cliente');
    
    if (error) throw error;
    return data[0];
  }
};

module.exports = Cliente;