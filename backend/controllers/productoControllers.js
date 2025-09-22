// controllers/productoController.js
const producto = require('../models/productoModels')

const productoController = {

  // get all
  getProductos: async (req, res) => {
    try {
      const productos = await producto.all()
      res.json({ success: true, data: productos })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  // get by id
  getProductoById: async (req, res) => {
    try {
      const { id_producto } = req.params
      const result = await producto.getById(id_producto)
      res.json({ success: true, data: result })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  // create
  createProducto: async (req, res) => {
    try {
      const { detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio } = req.body
      const nuevo = await producto.create({ detalles_producto, precio_producto, fotografia_producto, id_restaurante, id_comercio })
      res.json({ success: true, data: nuevo })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  // update
  updateProducto: async (req, res) => {
    try {
      const { id_producto } = req.params
      const { detalles_producto, precio_producto, fotografia_producto } = req.body
      const actualizado = await producto.update(id_producto, { detalles_producto, precio_producto, fotografia_producto })
      res.json({ success: true, data: actualizado })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  },

  // delete
  deleteProducto: async (req, res) => {
    try {
      const { id_producto } = req.params
      const eliminado = await producto.delete(id_producto)
      res.json({ success: true, data: eliminado })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

}

module.exports = productoController
