/**
 * Server Initialization
 * @author German Marcillo
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reporteRoutes = require('./routes/reporteRoutes');
const comercioRoutes = require('./routes/comercio.routes');
const productoRoutes = require('./routes/productoRoutes');
const restauranteRoutes = require('./routes/restauranteRoutes');
const repartidorRoutes = require('./routes/repartidorRoutes');
const clienteRoutes = require('./routes/client.routes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/backend', reporteRoutes);
app.use('/backend', clienteRoutes);
app.use('/backend/repartidor', repartidorRoutes);
app.use('/backend/restaurantes', restauranteRoutes);

app.listen(PORT, () => {
  console.log(`Microservicio ejecutándose en puerto ${PORT}`);
});