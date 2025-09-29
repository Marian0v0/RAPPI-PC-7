const repartidorModel = require('../models/repartidorModel');

// Aceptar pedido
async function aceptarPedido(req, res) {
  try {
    const { id_pedido, id_repartidor } = req.body;
    const result = await repartidorModel.aceptarPedido(id_pedido, id_repartidor);
    res.json(result);
  } catch (error) {
    console.error("❌ Error en aceptar el pedido.", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Rechazar pedido
async function rechazarPedido(req, res) {
  try {
    const { id_pedido, id_repartidor } = req.body;
    const result = await repartidorModel.rechazarPedido(id_pedido, id_repartidor);
    res.json(result);
  } catch (error) {
    console.error("❌ Error en rechazar el pedido.:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Ver pedidos pendientes
async function obtenerPedidosPendientes(req, res) {
  try {
    const pedidos = await repartidorModel.pedidosPendientes();
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los pedidos pendientes",
      error: error.message
    });
  }
}

// Ver pedidos asignados
async function obtenerPedidos(req, res) {
  try {
    const { id_repartidor } = req.params;
    const result = await repartidorModel.obtenerPedidos(id_repartidor);
    res.json(result);
  } catch (error) {
    console.error("❌ Error en obtener los pedidos asignados a tu cuenta.", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Actualizar estado del pedido
async function actualizarEstadoPedido(req, res) {
  try {
    const { id_pedido } = req.params;
    const { estado_pedido } = req.body;
    const result = await repartidorModel.actualizarEstadoPedido(id_pedido, estado_pedido);
    res.json(result);
  } catch (error) {
    console.error("❌ Error en actualizar tu estado de acción como repartidor. Intenta de nuevo.", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Guardar calificación
async function guardarCalificacion(req, res) {
  try {
    const { id_repartidor } = req.params;
    const { tipo_calificacion, sugerencia_calificacion, valoracion } = req.body;
    const result = await repartidorModel.guardarCalificacion(
      id_repartidor,
      tipo_calificacion,
      sugerencia_calificacion,
      valoracion
    );
    res.json(result);
  } catch (error) {
    console.error("❌ Error en guardar las calificaciones que has recibido como repartidor.", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Obtener calificaciones
async function obtenerCalificaciones(req, res) {
  try {
    const { id_repartidor } = req.params;
    const result = await repartidorModel.obtenerCalificaciones(id_repartidor);
    res.json(result);
  } catch (error) {
    console.error("❌ Error en obtener las calificaciones que has recibido como repartidor.:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Actualizar disponibilidad
async function actualizarDisponibilidad(req, res) {
  try {
    const { id_repartidor } = req.params;
    const { id_estado } = req.body;
    const result = await repartidorModel.actualizarDisponibilidad(id_repartidor, id_estado);
    res.json(result);
  } catch (error) {
    console.error("❌ Error en actualizar la disponibilidad.", error);
    res.status(500).json({ error: "Error interno del servidor" });
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
  obtenerPedidosPendientes,
};
