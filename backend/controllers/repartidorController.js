const pool = require('../utils/database');

async function aceptarPedido(id_pedido, id_repartidor) {
  try {
    const result = await pool.query(
      `UPDATE pedido 
       SET estado_pedido = 'aceptado', id_repartidor = $1 
       WHERE id_pedido = $2 AND estado_pedido = 'pendiente' 
       RETURNING *`,
      [id_repartidor, id_pedido]
    );
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error en aceptarPedido:", error);
    throw error; 
  }
}

async function rechazarPedido(id_pedido, id_repartidor) {
  try {
    const result = await pool.query(
      `UPDATE pedido 
       SET estado_pedido = 'rechazado'
       WHERE id_pedido = $1 AND id_repartidor = $2
       RETURNING *`,
      [id_pedido, id_repartidor]
    );
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error en aceptarPedido:", error);
    throw error; 
  }
}


  

module.exports = { 
    aceptarPedido,
    rechazarPedido,
};