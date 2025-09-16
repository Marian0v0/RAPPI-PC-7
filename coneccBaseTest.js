const pool = require("./utils/db");

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Conexión exitosa:", res.rows[0]);
  } catch (error) {
    console.error("❌ Error al conectar:", error);
  } finally {
    pool.end();
  }
}

testConnection();

// node backend/testConnection.js ejecutar en bash
//Borrar archivo una vez que se verifique la conexion
