
/**
 * Este módulo maneja la funcionalidad de models para "productos".
 * 
 * @module producto
 * @author isabbb
 */

const supabase = require('../utils/database');

//Obtener todos los productos
async function obtenerProductos() {
    const { data, error } = await supabase
        .from('producto')
        .select('*');

    if (error) {
        console.error("❌ Error en obtenerProductos:", error);
        throw error;
    }
    return data;
}

// Obtener un producto por ID
async function obtenerProductoPorId(id_producto) {
    const { data, error } = await supabase
      .from('producto')
      .select()
      .eq('id_producto', id_producto)
      .single()

    if (error) {
        console.error("❌ Error en obtenerProductoPorId:", error);
        throw error;
    }
    return data;
}


  async function getByComercio (id_producto) {
    const { data, error } = await supabase
      .from('producto')
      .select()
      .eq('id_comercio', id_producto)

    if (error) throw error
    return data
  }

 async function getByRestaurante(id_producto) {
    const { data, error } = await supabase
      .from('producto')
      .select()
      .eq('id_restaurante', id_producto)

    if (error) throw error
    return data
  }


// Crear un producto
async function crearProducto({ detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio }) {

    const { data, error } = await supabase
        .from('producto')
        .insert([{ detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio }])
        .select()
        .single();

    if (error) {
        console.error("❌ Error en crearProducto:", error);
        throw error;
    }
    return data;
}

// Actualizar un producto
async function actualizarProducto(id_producto, { detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio }) {
    const { data, error } = await supabase
        .from('producto')
        .update({ detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio })
        .eq('id_producto', id_producto)
        .select()
        .single();

    if (error) {
        console.error("❌ Error en actualizarProducto:", error);
        throw error;
    }
    return data;
}

//Eliminar un producto
async function eliminarProducto(id_producto) {
    const { data, error } = await supabase
        .from('producto')
        .delete()
        .eq('id_producto', id_producto)
        .select()
        .single();

    if (error) {
        console.error("❌ Error en eliminarProducto:", error);
        throw error;
    }
    return data;
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    getByComercio,
    getByRestaurante,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
};
