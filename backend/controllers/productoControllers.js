// controllers/productoController.js

const productoModel = require('../models/productoModels');
//Obtener todos los productos
async function obtenerProductos(req, res) {
    try {
        const productos = await productoModel.obtenerProductos();
        res.status(200).json(productos);
    } catch (error) {
        console.error("❌ Error en obtenerProductos:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
}

//Obtener producto por ID
async function obtenerProductoPorId(req, res) {
    const { id } = req.params;
    try {
        const producto = await productoModel.obtenerProductoPorId(id);
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.status(200).json(producto);
    } catch (error) {
        console.error("❌ Error en obtenerProductoPorId:", error);
        res.status(500).json({ error: "Error al obtener el producto" });
    }
}

  async function getProductoByComercio (req, res) {
    try {
      const { id_producto } = req.params
      const result = await productoModel.getByComercio(id_producto)
      res.json({ success: true, data: result })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

   async function getProductoByRestaurante (req, res){
    try {
      const { id_producto } = req.params
      const result = await productoModel.getByRestaurante(id_producto)
      res.json({ success: true, data: result })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

//Crear producto
async function crearProducto(req, res) {
    const { detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio } = req.body;

    try {
        const nuevoProducto = await productoModel.crearProducto({
            id_producto,
            detalles_producto,
            precio_producto,
            fotografia_producto,
            id_restaurante,
            id_comercio
        });
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("❌ Error en crearProducto:", error);
        res.status(500).json({ error: "Error al crear el producto" });
    }
}

//Actualizar producto
async function actualizarProducto(req, res) {
    const { id } = req.params;
    const { detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio } = req.body;

    try {
        const productoActualizado = await productoModel.actualizarProducto(id, {
            detalles_producto,
            precio_producto,
            fotografia_producto,
            id_restaurante,
            id_comercio
        });

        if (!productoActualizado) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.status(200).json(productoActualizado);
    } catch (error) {
        console.error("❌ Error en actualizarProducto:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
}

// Eliminar producto
async function eliminarProducto(req, res) {
    const { id } = req.params;
    try {
        const productoEliminado = await productoModel.eliminarProducto(id);
        if (!productoEliminado) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.status(200).json({ mensaje: "Producto eliminado", producto: productoEliminado });
    } catch (error) {
        console.error("❌ Error en eliminarProducto:", error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
}


module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    getProductoByComercio,
    getProductoByRestaurante,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
};
