// models/productoModel.js

/**
 * Este módulo maneja la funcionalidad para la gestion de "producto".
 * 
 * @module producto
 */

const supabase = require('../utils/database')

const Producto = {
  // obtener todos los productos
  all: async () => {
    const { data, error } = await supabase
      .from('producto')
      .select(`
        id_producto,
        detalles_producto,
        precio_producto,
        fotografia_producto,
        restaurante: id_restaurante (
          id_restaurante,
          nombre_restaurante,
          tipo_comida,
          direccion_restaurante
        ),
        comercio: id_comercio (
          id_comercio,
          nombre_marca,
          tipo_comercio
        )
      `)

    if (error) throw error
    return data
  },

  // obtener un producto por id
  getById: async (id_producto) => {
    const { data, error } = await supabase
      .from('producto')
      .select()
      .eq('id_producto', id_producto)
      .single()

    if (error) throw error
    return data
  },

  getByComercio: async (id_producto) => {
    const { data, error } = await supabase
      .from('producto')
      .select()
      .eq('id_comercio', id_producto)

    if (error) throw error
    return data
  },

  getByRestaurante: async (id_producto) => {
    const { data, error } = await supabase
      .from('producto')
      .select()
      .eq('id_restaurante', id_producto)

    if (error) throw error
    return data
  },

  // crear un producto
  create: async ({ detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio }) => {
    const { data, error } = await supabase
      .from('producto')
      .insert([
        { detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio }
      ])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // actualizar un producto
  update: async (id_producto, { detalles_producto, precio_producto, fotografia_producto }) => {
    const { data, error } = await supabase
      .from('producto')
      .update({ detalles_producto, precio_producto, fotografia_producto })
      .eq('id_producto', id_producto)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // eliminar un producto
  delete: async (id_producto) => {
    const { data, error } = await supabase
      .from('producto')
      .delete()
      .eq('id_producto', id_producto)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

module.exports = Producto
