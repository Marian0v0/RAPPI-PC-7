// routes/comercio.routes.js
const express = require('express');
const router = express.Router();
const ComercioController = require('../controllers/comercio.controller');

// Rutas para comercio
router.post('/comercio', ComercioController.create);
router.get('/comercio', ComercioController.getAll);
router.get('/comercio/id/:id', ComercioController.getById);
router.get('/comercio/marca/:marca', ComercioController.getByMarca);
router.put('/comercio/:id', ComercioController.update);
router.delete('/comercio/:id', ComercioController.delete);
router.post('/comercio/login', ComercioController.login);

module.exports = router;