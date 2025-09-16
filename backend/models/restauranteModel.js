import { supabase } from '../config/supabase.js';
import bcrypt from "bcrypt";

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
  

  // Obtener todos los restaurantes con toda la informacion
  async obtenerTodosRestaurantes() {
    const { data, error } = await supabase
      .from('restaurante')
      .select('*');

    if (error) throw error;
    return data;
  },

  // Obtener todos los restaurantes con su informacion excepto contraseña
  async obtenerInfoRestaurantes() {
    const { data, error } = await supabase
      .from("restaurante")
      .select("id_restaurante, nombre_restaurante, tipo_comida, cel_restaurante, direccion_restaurante, email_restaurante");
  
    if (error) throw error;
    return data;
  },
  

  // Buscar restaurante por ID
  async bucarRestauranteId(id) {
    const { data, error } = await supabase
      .from('restaurante')
      .select('*')
      .eq('id_restaurante', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Buscar restaurantes por tipo de comida 
  async bucarRestauranteTipo(tipo) {
    const { data, error } = await supabase
      .from("restaurante")
      .select("id_restaurante, nombre_restaurante, tipo_comida, cel_restaurante, direccion_restaurante, email_restaurante")
      .ilike("tipo_comida", `%${tipo}%`);  

    if (error) throw error;
    return data;
  },
  

  // Buscar restaurante por nombre 
    async bucarRestauranteNombre(nombre) {
       const { data, error } = await supabase
        .from("restaurante")
        .select("id_restaurante, nombre_restaurante, tipo_comida, cel_restaurante, direccion_restaurante, email_restaurante")
        .ilike("nombre_restaurante", `%${nombre}%`); 

      if (error) throw error;
      return data;
    },

  // Buscar restaurante por email 
  async bucarRestauranteEmail(email) {
    const { data, error } = await supabase
      .from('restaurante')
      .select('*')
      .eq('email_restaurante', email)
      .single();

    if (error) throw error;
    return data;
  },

  async login(email, contrasena) {
    const { data, error } = await supabase
      .from("restaurante")
      .select("*")
      .eq("email_restaurante", email)
      .single();
  
    if (error) throw new Error("Restaurante no encontrado");
  
    if (data.contrasena_restaurante !== contrasena) {
      throw new Error("Contraseña incorrecta");
    }
  
    // Retornar restaurante sin la contraseña
    const { contrasena_restaurante, ...restauranteSeguro } = data;
    return restauranteSeguro;
  },

  // Actualizar datos de un restaurante
  async actualizarRestaurante(id, updates) {
    // Evitar que se actualice la contraseña desde este método
    if (updates.contrasena_restaurante) {
      throw new Error("La contraseña no se puede actualizar aquí");
    }
    const { data, error } = await supabase
      .from("restaurante")
      .update(updates)
      .eq("id_restaurante", id)
      .select();
  
    if (error) throw error;
    return data[0];
  },

  //Cambiar contraseña
  async cambiarContraseñaRestaurante(id, oldPassword, newPassword) {
    const { data, error } = await supabase
        .from("restaurante")
        .select("*")
        .eq("id_restaurante", id)
        .single();

    if (error) throw new Error("Restaurante no encontrado");

    const validPassword = await bcrypt.compare(oldPassword, data.contrasena_restaurante);

    if (!validPassword) throw new Error("La contraseña actual no es correcta");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabase
        .from("restaurante")
        .update({ contrasena_restaurante: hashedPassword })
        .eq("id_restaurante", id);

    if (updateError) throw updateError;

    return { message: "Contraseña actualizada correctamente" };
    },
  
  // Eliminar restaurante
  async eliminarRestaurante(id) {
    const { error } = await supabase
      .from('restaurante')
      .delete()
      .eq('id_restaurante', id);

    if (error) throw error;
    return { message: 'Restaurante eliminado correctamente' };
  }
};
