const supabase = require('../utils/database');

// ✅ Aceptar pedido
async function aceptarPedido(id_pedido, id_repartidor) {
  try {
    const { data, error } = await supabase
      .from('pedido')
      .update({ estado_pedido: 'aceptado', id_repartidor })
      .eq('id_pedido', id_pedido)
      .eq('estado_pedido', 'pendiente')
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error en aceptarPedido:", error);
    throw error;
  }
}

// ✅ Rechazar pedido
async function rechazarPedido(id_pedido, id_repartidor) {
  try {
    const { data, error } = await supabase
      .from('pedido')
      .update({ estado_pedido: 'rechazado' })
      .eq('id_pedido', id_pedido)
      .eq('id_repartidor', id_repartidor)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error en rechazarPedido:", error);
    throw error;
  }
}

// ✅ Obtener pedidos de un repartidor
async function obtenerPedidos(id_repartidor) {
  try {
    const { data, error } = await supabase
      .from('pedido')
      .select('*')
      .eq('id_repartidor', id_repartidor);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error en obtenerPedidos:", error);
    throw error;
  }
}

// ✅ Actualizar estado de un pedido
async function actualizarEstadoPedido(id_pedido, estado_pedido) {
  try {
    const { data, error } = await supabase
      .from('pedido')
      .update({ estado_pedido })
      .eq('id_pedido', id_pedido)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error en actualizarEstadoPedido:", error);
    throw error;
  }
}

// ✅ Guardar calificación
async function guardarCalificacion(id_repartidor, tipo_calificacion, sugerencia_calificacion, valoracion) {
  try {
    const { data, error } = await supabase
      .from('calificacion_repartidor')
      .insert([{ id_repartidor, tipo_calificacion, sugerencia_calificacion, valoracion }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error en guardarCalificacion:", error);
    throw error;
  }
}

// ✅ Obtener calificaciones
async function obtenerCalificaciones(id_repartidor) {
  try {
    const { data, error } = await supabase
      .from('calificacion_repartidor')
      .select('*')
      .eq('id_repartidor', id_repartidor);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error en obtenerCalificaciones:", error);
    throw error;
  }
}

// ✅ Actualizar disponibilidad repartidor
async function actualizarDisponibilidad(id_repartidor, id_estado) {
  try {
    const { data, error } = await supabase
      .from('repartidor')
      .update({ id_estado })
      .eq('id_repartidor', id_repartidor)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("❌ Error en actualizarDisponibilidad:", error);
    throw error;
  }
}

module.exports = {
  aceptarPedido,
  rechazarPedido,
  obtenerPedidos,
  actualizarEstadoPedido,
  guardarCalificacion,
  obtenerCalificaciones,
  actualizarDisponibilidad,
};