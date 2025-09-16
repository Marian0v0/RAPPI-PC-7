import express from "express";
import { RestauranteController } from "../controllers/restauranteController.js";

const router = express.Router();

// Crear restaurante
router.post("/", RestauranteController.crearRestaurante);

// Obtener todos los restaurantes (con toda la info)
router.get("/", RestauranteController.getTodosRestaurantes);

// Obtener info de restaurantes (sin contraseña)
router.get("/info", RestauranteController.getInfoRestaurantes);

// Buscar por ID
router.get("/:id", RestauranteController.getRestauranteById);

// Buscar por tipo de comida
router.get("/tipo/:tipo", RestauranteController.getRestaurantesByTipo);

// Buscar por nombre
router.get("/nombre/:nombre", RestauranteController.getRestaurantesByNombre);

// Login
router.post("/login", RestauranteController.login);

// Actualizar información
router.put("/:id", RestauranteController.actualizarRestaurante);

// Cambiar contraseña
router.put("/:id/password", RestauranteController.cambiarContrasena);

// Eliminar restaurante
router.delete("/:id", RestauranteController.eliminarRestaurante);

export default router;
