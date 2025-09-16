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
        console.error("❌ Error en rechazarPedido:", error);
        throw error;
    }
}

async function obtenerPedidos(id_repartidor) {
    try {
        const result = await pool.query(
            `SELECT * FROM pedido 
        WHERE id_repartidor = $1`,
            [id_repartidor]
        );
        return result.rows;
    } catch (error) {
        console.error("❌ Error en obtenerPedidos:", error);
        throw error;
    }

}

async function actualizarEstadoPedido(id_pedido, estado_pedido) {
    try {
        const result = await pool.query(
            `UPDATE pedido 
            SET estado_pedido = $1 
            WHERE id_pedido = $2 
            RETURNING *`,
            [estado_pedido, id_pedido]
        );
        return result.rows[0];
    } catch (error) {
        console.error("❌ Error en actualizarEstadoPedido:", error);
        throw error;
    }

}

async function guardarCalificacion(id_repartidor, tipo_calificacion, sugerencia_calificacion, valoracion) {
    try {
        const result = await pool.query(
            `INSERT INTO calificacion_repartidor (id_repartidor, tipo_calificacion, sugerencia_calificacion, valoracion) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
            [id_repartidor, tipo_calificacion, sugerencia_calificacion, valoracion]
        );
        return result.rows[0];
    } catch (error) {
        console.error("❌ Error en guardarCalificacion:", error);
        throw error;
    }

}

async function obtenerCalificaciones(id_repartidor) {
    try {
        const result = await pool.query(
            `SELECT * FROM calificacion_repartidor 
            WHERE id_repartidor = $1`,
            [id_repartidor]
        );
        return result.rows;
    } catch (error) {
        console.error("❌ Error en obtenerCalificaciones:", error);
        throw error;
    }

}

async function actualizarDisponibilidad(id_repartidor, id_estado) {
    try {
        const result = await pool.query(
            `UPDATE repartidor 
            SET id_estado = $1 
            WHERE id_repartidor = $2 
            RETURNING *`,
            [id_estado, id_repartidor]
        );
        return result.rows[0];
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