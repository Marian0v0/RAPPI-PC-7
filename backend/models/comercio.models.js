// models/comercio.model.js
const supabase = require('../utils/database');

const Comercio = {
  // Crear un nuevo comercio
  async create(comercioData) {
    const { data, error } = await supabase
      .from('comercio')
      .insert([comercioData])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Obtener todos los comercios
  async findAll() {
    const { data, error } = await supabase
      .from('comercio')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  // Obtener comercio por ID
  async findById(id) {
    const { data, error } = await supabase
      .from('comercio')
      .select('*')
      .eq('id_comercio', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Obtener comercio por correo
  async findByEmail(correo) {
    const { data, error } = await supabase
      .from('comercio')
      .select('*')
      .eq('correo_encargado', correo)
      .single();
    
    if (error) return null;
    return data;
  },

  // Actualizar comercio
  async update(id, comercioData) {
    const { data, error } = await supabase
      .from('comercio')
      .update(comercioData)
      .eq('id_comercio', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Eliminar comercio
  async delete(id) {
    const { error } = await supabase
      .from('comercio')
      .delete()
      .eq('id_comercio', id);
    
    if (error) throw error;
    return true;
  }
};

module.exports = Comercio;