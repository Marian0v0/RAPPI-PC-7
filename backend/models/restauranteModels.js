import { supabase } from '../config/supabase.js';

export const RestauranteModel = {
  // Crear un nuevo restaurante
  async nuevoRestaurante(restauranteData) {
    const requiredFields = [
      "nombre_restaurante",
      "email_restaurante",
      "contrasena_restaurante",
      "cel_restaurante",
      "direccion_restaurante",
      "tipo_comida"
    ];
  
    for (const field of requiredFields) {
      if (!restauranteData[field]) {
        throw new Error(`El campo ${field} es obligatorio`);
      }
    }
  
    const { data, error } = await supabase
      .from("restaurante")
      .insert([restauranteData])
      .select();
  
    if (error) throw error;
    return data[0];
  },
  

  // Obtener todos los restaurantes
  async obtenerTodosRestaurantes() {
    const { data, error } = await supabase
      .from('restaurante')
      .select('*');

    if (error) throw error;
    return data;
  },

  // Obtener informacion de los restaurantes
  async obtenerInfoRestaurantes() {
    const { data, error } = await supabase
      .from("restaurante")
      .select("id_restaurante, nombre_restaurante, tipo_comida, cel_restaurante, direccion_restaurante, email_restaurante");
  
    if (error) throw error;
    return data;
  },
  

  // Buscar restaurante por ID
  async findById(id) {
    const { data, error } = await supabase
      .from('restaurante')
      .select('*')
      .eq('id_restaurante', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Buscar restaurante por email 
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('restaurante')
      .select('*')
      .eq('email_restaurante', email)
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar datos de un restaurante
  async update(id, updates) {
    const { data, error } = await supabase
      .from('restaurante')
      .update(updates)
      .eq('id_restaurante', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Eliminar restaurante
  async remove(id) {
    const { error } = await supabase
      .from('restaurante')
      .delete()
      .eq('id_restaurante', id);

    if (error) throw error;
    return { message: 'Restaurante eliminado correctamente' };
  }
};
