import express from "express";
import { RestauranteController } from "../controllers/restauranteController.js";

const router = express.Router();

// Crear restaurante
router.post("/", RestauranteController.crearRestaurante);

// Obtener todos los restaurantes (con toda la info)
router.get("/", RestauranteController.getTodosRestaurantes);

// Obtener info de restaurantes (sin contraseña)
router.get("/info", RestauranteController.getInfoRestaurantes);

// Buscar restaurante por ID
router.get("/id/:id", RestauranteController.getRestauranteById);

// Buscar restaurantes por tipo de comida
router.get("/tipo/:tipo", RestauranteController.getRestaurantesByTipo);

// Buscar restaurantes por nombre
router.get("/nombre/:nombre", RestauranteController.getRestaurantesByNombre);

// Buscar restaurante por email
router.get("/email/:email", RestauranteController.getRestauranteByEmail);

// Login
router.post("/login", RestauranteController.login);

// Actualizar información del restaurante
router.put("/:id", RestauranteController.actualizarRestaurante);

// Cambiar contraseña
router.put("/:id/password", RestauranteController.cambiarContrasena);

// Eliminar restaurante
router.delete("/:id", RestauranteController.eliminarRestaurante);

export default router;
