import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistroComercio.css';

const RegistroComercio = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_encargado: '',
    apellido_encargado: '',
    correo_encargado: '',
    telefono_encargado: '',
    password_encargado: '',
    confirmPassword: '',
    tipo_comercio: '',
    tipo_persona: 'Natural',
    nombre_marca: '',
    direccion_comercio: '',
    descripcion_comercio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.nombre_encargado.trim()) {
      setError('El nombre del encargado es requerido');
      return false;
    }
    if (!formData.apellido_encargado.trim()) {
      setError('El apellido del encargado es requerido');
      return false;
    }
    if (!formData.correo_encargado.trim()) {
      setError('El correo electrónico es requerido');
      return false;
    }
    if (!formData.telefono_encargado.trim()) {
      setError('El teléfono es requerido');
      return false;
    }
    if (!formData.password_encargado.trim()) {
      setError('La contraseña es requerida');
      return false;
    }
    if (formData.password_encargado !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (!formData.tipo_comercio.trim()) {
      setError('El tipo de comercio es requerido');
      return false;
    }
    if (!formData.nombre_marca.trim()) {
      setError('El nombre de la marca es requerido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://rappi-pc-7.onrender.com/backend/comercios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_encargado: formData.nombre_encargado,
          apellido_encargado: formData.apellido_encargado,
          correo_encargado: formData.correo_encargado,
          telefono_encargado: formData.telefono_encargado,
          password_encargado: formData.password_encargado,
          tipo_comercio: formData.tipo_comercio,
          tipo_persona: formData.tipo_persona,
          nombre_marca: formData.nombre_marca,
          direccion_comercio: formData.direccion_comercio,
          descripcion_comercio: formData.descripcion_comercio
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Comercio registrado exitosamente');
        navigate('/home');
      } else {
        setError(data.error || 'Error al registrar el comercio');
      }
    } catch (error) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-comercio-container">
      <div className="registro-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Registro de Comercio</h1>
      </div>

      <div className="registro-content">
        <div className="form-container">
          <div className="form-header">
            <h2>Información del Comercio</h2>
            <p>Completa todos los campos para registrar tu comercio</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="registro-form">
            <div className="form-section">
              <h3>Información del Encargado</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre_encargado">Nombre *</label>
                  <input
                    type="text"
                    id="nombre_encargado"
                    name="nombre_encargado"
                    value={formData.nombre_encargado}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="apellido_encargado">Apellido *</label>
                  <input
                    type="text"
                    id="apellido_encargado"
                    name="apellido_encargado"
                    value={formData.apellido_encargado}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="correo_encargado">Correo Electrónico *</label>
                  <input
                    type="email"
                    id="correo_encargado"
                    name="correo_encargado"
                    value={formData.correo_encargado}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="telefono_encargado">Teléfono *</label>
                  <input
                    type="tel"
                    id="telefono_encargado"
                    name="telefono_encargado"
                    value={formData.telefono_encargado}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password_encargado">Contraseña *</label>
                  <input
                    type="password"
                    id="password_encargado"
                    name="password_encargado"
                    value={formData.password_encargado}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Información del Comercio</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre_marca">Nombre de la Marca *</label>
                  <input
                    type="text"
                    id="nombre_marca"
                    name="nombre_marca"
                    value={formData.nombre_marca}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="tipo_comercio">Tipo de Comercio *</label>
                  <select
                    id="tipo_comercio"
                    name="tipo_comercio"
                    value={formData.tipo_comercio}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="Supermercado">Supermercado</option>
                    <option value="Farmacia">Farmacia</option>
                    <option value="Licores">Licores</option>
                    <option value="Electrodomésticos">Electrodomésticos</option>
                    <option value="Ropa">Ropa</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Hogar">Hogar</option>
                    <option value="Deportes">Deportes</option>
                    <option value="Belleza">Belleza</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tipo_persona">Tipo de Persona</label>
                  <select
                    id="tipo_persona"
                    name="tipo_persona"
                    value={formData.tipo_persona}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="Natural">Natural</option>
                    <option value="Jurídica">Jurídica</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="direccion_comercio">Dirección del Comercio</label>
                  <input
                    type="text"
                    id="direccion_comercio"
                    name="direccion_comercio"
                    value={formData.direccion_comercio}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion_comercio">Descripción del Comercio</label>
                <textarea
                  id="descripcion_comercio"
                  name="descripcion_comercio"
                  value={formData.descripcion_comercio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe tu comercio, productos que ofreces, etc."
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrar Comercio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroComercio;
