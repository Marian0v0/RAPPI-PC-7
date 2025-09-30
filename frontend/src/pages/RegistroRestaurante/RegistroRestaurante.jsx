
import React, { useState } from 'react';
import './RegistroRestaurante.css';

const RegistroRestaurante = () => {
  const [formData, setFormData] = useState({
    nombreRestaurante: '',
    tipoComida: '',
    direccion: '',
    telefono: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar el registro
    console.log('Datos del restaurante:', formData);
  };

  return (
    <div className="registro-restaurante-container">
      {/* Enlace superior */}
      <div className="cita-link">
        <a href="/cita">Haz cita aquí &gt;&gt;</a>
      </div>

      {/* Título principal */}
      <div className="registro-header">
        <h1>Registra tu restaurante</h1>
        <div className="continuar-registro">
          <p>¿Ya comenzaste tu registro?</p>
          <a href="/continuar-registro" className="continuar-link">continúa aquí.</a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="registro-form">
        {/* Nombre del restaurante */}
        <div className="form-group">
          <label htmlFor="nombreRestaurante">Nombre del restaurante</label>
          <input
            type="text"
            id="nombreRestaurante"
            name="nombreRestaurante"
            value={formData.nombreRestaurante}
            onChange={handleChange}
            placeholder="Ingresa el nombre de tu restaurante"
            required
          />
        </div>

        {/* Tipo de comida */}
        <div className="form-group">
          <label htmlFor="tipoComida">Tipo de comida</label>
          <select
            id="tipoComida"
            name="tipoComida"
            value={formData.tipoComida}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona el tipo de comida</option>
            <option value="italiana">Italiana</option>
            <option value="mexicana">Mexicana</option>
            <option value="china">China</option>
            <option value="colombiana">Colombiana</option>
            <option value="americana">Americana</option>
            <option value="vegetariana">Vegetariana</option>
            <option value="mariscos">Mariscos</option>
            <option value="rapida">Comida Rápida</option>
            <option value="postres">Postres</option>
            <option value="cafe">Café</option>
          </select>
        </div>

        {/* Dirección del restaurante */}
        <div className="form-group">
          <label htmlFor="direccion">Dirección del restaurante</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Ingresa la dirección completa"
            required
          />
        </div>

        {/* Teléfono */}
        <div className="form-group">
          <label htmlFor="telefono">Colombia (+57) Tu móvil</label>
          <div className="phone-input-container">
            <span className="country-code">+57</span>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Tu número de WhatsApp"
              required
            />
          </div>
          <small className="phone-note">Te requiere un número de WhatsApp</small>
        </div>

        {/* Email del responsable */}
        <div className="form-group">
          <label htmlFor="email">E-mail del responsable</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        {/* Contraseña */}
        <div className="form-group">
          <label htmlFor="password">Crea una contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Crea una contraseña segura"
            required
          />
        </div>

        {/* Botón de registro */}
        <button type="submit" className="submit-btn">
          Registrar restaurante
        </button>

        {/* Enlace para otros negocios */}
        <div className="other-business-link">
          <a href="/otro-negocio">Mi negocio no es un restaurante</a>
        </div>
      </form>
    </div>
  );
};

export default RegistroRestaurante;