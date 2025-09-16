/**
 * Server Initialization
 * @author German Marcillo
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reporteRoutes = require('./routes/reporteRoutes');
//const clienteRoutes = require('./routes/client.routes.js');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/backend', reporteRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Microservicio ejecutándose en puerto ${PORT}`);
});