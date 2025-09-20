/**
 * Server Initialization
 * @author German Marcillo
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reporteRoutes = require('./routes/reporteRoutes');
const clientRoutes = require('./routes/client.routes');
const comercioRoutes = require('./routes/comercio.routes');
const productoRoutes = require('./routes/productoRoutes');
const restaranteRoutes = require('./routes/restaurandeRoutes');
const repartidorRoutes = require('./routes/repartidorRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/backend', reporteRoutes);
app.use('/backend', clientRoutes);
app.use('/backend', comercioRoutes);
app.use('/backend', productoRoutes);
app.use('/backend', restaranteRoutes);
app.use('/backend', repartidorRoutes);

app.listen(PORT, () => {
  console.log(`Microservicio ejecutándose en puerto ${PORT}`);
});