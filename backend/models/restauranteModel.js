const supabase = require('../utils/database');
const bcrypt = require("bcrypt");
const RestauranteModel = {

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

    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(restauranteData.contrasena_restaurante, 10);
    restauranteData.contrasena_restaurante = hashedPassword;

    const { data, error } = await supabase
      .from("restaurante")
      .insert([restauranteData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Obtener todos los restaurantes con toda la información
  async obtenerTodosRestaurantes() {
    const { data, error } = await supabase.from("restaurante").select("*");
    if (error) throw error;
    return data;
  },

  // Obtener info de restaurantes (sin contraseña)
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
      .from("restaurante")
      .select("*")
      .eq("id_restaurante", id)
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
      .from("restaurante")
      .select("*")
      .eq("email_restaurante", email)
      .single();

    if (error) throw error;
    return data;
  },

  //Login con bcrypt
  async login(email, contrasena) {
    const { data, error } = await supabase
      .from("restaurante")
      .select("*")
      .eq("email_restaurante", email)
      .single();

    if (error || !data) throw new Error("Restaurante no encontrado");

    // Comparar contraseñas con bcrypt
    const validPassword = await bcrypt.compare(contrasena, data.contrasena_restaurante);
    if (!validPassword) {
      throw new Error("Contraseña incorrecta");
    }

    // Retornar restaurante sin la contraseña
    const { contrasena_restaurante, ...restauranteSeguro } = data;
    return restauranteSeguro;
  },

  // Actualizar datos de un restaurante (sin contraseña)
  async actualizarRestaurante(id, updates) {
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

  // Cambiar contraseña
  async cambiarContraseñaRestaurante(id, oldPassword, newPassword) {
    const { data, error } = await supabase
      .from("restaurante")
      .select("*")
      .eq("id_restaurante", id)
      .single();

    if (error || !data) throw new Error("Restaurante no encontrado");

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
    const { error } = await supabase.from("restaurante").delete().eq("id_restaurante", id);
    if (error) throw error;
    return { message: "Restaurante eliminado correctamente" };
  }
};
module.exports = { RestauranteModel };
