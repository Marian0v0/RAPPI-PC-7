const {Router} = require('express');
const router = Router();
const repartidorModel = require('../models/repartidorModel');

router.patch('/aceptarPedido', async (req, res) => {
    try {
        const result = await repartidorModel.aceptarPedido(req.body.id_pedido, req.body.id_repartidor);
        res.json(result);
    } catch (error) {
        console.error("❌ Error al actualizar el estado de aceptación", error);
        res.status(500).json({error: 'Error interno del servidor' });        
    }
});

router.patch('/rechazarPedido', async (req, res) => {
    try {
        const result = await repartidorModel.rechazarPedido(req.body.id_pedido, req.body.id_repartidor);
        res.json(result);
    } catch (error) {
        console.error("❌ Error al actualizar el estado de rechazo", error);
        res.status(500).json({error: 'Error interno del servidor' });        
    }
});

//hola mundo

