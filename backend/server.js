/**
 * Server Initialization
 * @author German Marcillo
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const clientRoutes = require('./routes/client.routes');
const reporteRoutes = require('./routes/reporteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/backend', clientRoutes);
app.use('/backend', reporteRoutes);

app.listen(PORT, () => {
  console.log(`Microservicio ejecutándose en puerto ${PORT}`);
});