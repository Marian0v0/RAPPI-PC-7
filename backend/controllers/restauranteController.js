import { RestauranteModel } from "../models/restauranteModel.js";

export const RestauranteController = {
  // Crear restaurante
  async crearRestaurante(req, res) {
    try {
      const data = await RestauranteModel.nuevoRestaurante(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Obtener todos los restaurantes
  async getTodosRestaurantes(req, res) {
    try {
      const data = await RestauranteModel.obtenerTodosRestaurantes();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener restaurantes sin contraseña
  async getInfoRestaurantes(req, res) {
    try {
      const data = await RestauranteModel.obtenerInfoRestaurantes();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Buscar por ID
  async getRestauranteById(req, res) {
    try {
      const { id } = req.params;
      const data = await RestauranteModel.bucarRestauranteId(id);
      res.json(data);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  // Buscar por tipo de comida
  async getRestaurantesByTipo(req, res) {
    try {
      const { tipo } = req.params;
      const data = await RestauranteModel.bucarRestauranteTipo(tipo);
      res.json(data);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  // Buscar por nombre
  async getRestaurantesByNombre(req, res) {
    try {
      const { nombre } = req.params;
      const data = await RestauranteModel.bucarRestauranteNombre(nombre);
      res.json(data);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  // Login restaurante
  async login(req, res) {
    try {
      const { email_restaurante, contrasena_restaurante } = req.body;
      const data = await RestauranteModel.login(email_restaurante, contrasena_restaurante);
      res.json(data);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  // Actualizar información
  async actualizarRestaurante(req, res) {
    try {
      const { id } = req.params;
      const data = await RestauranteModel.actualizarRestaurante(id, req.body);
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Cambiar contraseña
  async cambiarContrasena(req, res) {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;
      const result = await RestauranteModel.cambiarContraseñaRestaurante(id, oldPassword, newPassword);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar restaurante
  async eliminarRestaurante(req, res) {
    try {
      const { id } = req.params;
      const result = await RestauranteModel.eliminarRestaurante(id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
