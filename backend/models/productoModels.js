// models/productoModel.js

const pool = require('../utils/database');

// ✅ Obtener todos los productos
async function obtenerProductos() {
    try {
        const result = await pool.query(
            `SELECT * FROM producto`
        );
        return result.rows;
    } catch (error) {
        console.error("❌ Error en obtenerProductos:", error);
        throw error;
    }
}

// ✅ Obtener un producto por ID
async function obtenerProductoPorId(id_producto) {
    try {
        const result = await pool.query(
            `SELECT * FROM producto WHERE id_producto = $1`,
            [id_producto]
        );
        return result.rows[0];
    } catch (error) {
        console.error("❌ Error en obtenerProductoPorId:", error);
        throw error;
    }
}

// ✅ Crear un producto
async function crearProducto({ detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio }) {
    try {
        const result = await pool.query(
            `INSERT INTO producto (detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio]
        );
        return result.rows[0];
    } catch (error) {
        console.error("❌ Error en crearProducto:", error);
        throw error;
    }
}

//  Actualizar un producto
async function actualizarProducto(id_producto, { detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio }) {
    try {
        const result = await pool.query(
            `UPDATE producto
             SET detalles_producto = $1, precio_producto = $2, fotografia_producto = $3, id_restaurante = $4, id_comercio = $5
             WHERE id_producto = $6
             RETURNING *`,
            [detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio, id_producto]
        );
        return result.rows[0];
    } catch (error) {
        console.error("❌ Error en actualizarProducto:", error);
        throw error;
    }
}

// Eliminar un producto
async function eliminarProducto(id_producto) {
    try {
        const result = await pool.query(
            `DELETE FROM producto
             WHERE id_producto = $1
             RETURNING *`,
            [id_producto]
        );
        return result.rows[0];
    } catch (error) {
        console.error("❌ Error en eliminarProducto:", error);
        throw error;
    }
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
};
