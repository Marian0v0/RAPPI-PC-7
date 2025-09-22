// controllers/comercio.controller.js
const Comercio = require('../models/comercio.models');
const bcrypt = require('bcrypt');

const ComercioController = {
  // Crear un nuevo comercio
  async create(req, res) {
    try {
      const {
        id_comercio,
        nombre_encargado,
        apellido_encargado,
        correo_encargado,
        telefono_encargado,
        password_encargado,
        tipo_comercio,
        tipo_persona,
        nombre_marca
      } = req.body;

      // Verificar si el correo ya existe
      const existingComercio = await Comercio.findByEmail(correo_encargado);
      if (existingComercio) {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password_encargado, 10);

      const nuevoComercio = await Comercio.create({
        id_comercio,
        nombre_encargado,
        apellido_encargado,
        correo_encargado,
        telefono_encargado,
        password_encargado: hashedPassword,
        tipo_comercio,
        tipo_persona,
        nombre_marca
      });

      res.status(201).json({
        message: 'Comercio registrado exitosamente',
        id_comercio: nuevoComercio.id_comercio
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener todos los comercios
  async getAll(req, res) {
    try {
      const comercios = await Comercio.findAll();
      res.status(200).json(comercios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un comercio por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const comercio = await Comercio.findById(id);
      
      if (!comercio) {
        return res.status(404).json({ error: 'Comercio no encontrado' });
      }
      
      res.status(200).json(comercio);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un comercio
  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      
      // Si se está actualizando la contraseña, encriptarla
      if (updateData.password_encargado) {
        updateData.password_encargado = await bcrypt.hash(updateData.password_encargado, 10);
      }
      
      const comercioActualizado = await Comercio.update(id, updateData);
      
      if (!comercioActualizado) {
        return res.status(404).json({ error: 'Comercio no encontrado' });
      }
      
      res.status(200).json({
        message: 'Comercio actualizado exitosamente',
        comercio: comercioActualizado
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un comercio
  async delete(req, res) {
    try {
      const { id } = req.params;
      await Comercio.delete(id);
      res.status(200).json({ message: 'Comercio eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Inicio de sesión para comercio
  async login(req, res) {
    try {
      const { correo, password } = req.body;
      
      // Buscar comercio por correo
      const comercio = await Comercio.findByEmail(correo);
      if (!comercio) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      
      // Verificar contraseña
      const validPassword = await bcrypt.compare(password, comercio.password_encargado);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      
      // Eliminar la contraseña de la respuesta
      const { password_encargado, ...comercioSinPassword } = comercio;
      
      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        comercio: comercioSinPassword
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ComercioController;