import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './seccionCuenta.css';

const Cuenta = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkboxes, setCheckboxes] = useState({
    aliado: false,
    repartidor: true,
    hermes: false,
    privacidad: false,
    informacion: false,
    datos: false,
    interferencia: false
  });

  useEffect(() => {
    cargarDatosCliente();
  }, []);

  const cargarDatosCliente = async () => {
    try {
      // Primero intentar cargar desde localStorage
      const clienteLocal = localStorage.getItem('cliente_data');
      if (clienteLocal) {
        const clienteData = JSON.parse(clienteLocal);
        setCliente(clienteData);
        setLoading(false);
        return;
      }

      // Si no hay datos locales, intentar cargar desde el backend
      const clienteId = localStorage.getItem('cliente_id');
      if (clienteId) {
        const response = await fetch(`https://rappi-pc-7.onrender.com/backend/clientes/${clienteId}`);
        if (response.ok) {
          const data = await response.json();
          setCliente(data);
          localStorage.setItem('cliente_data', JSON.stringify(data));
        }
      }
    } catch (error) {
      console.error('Error cargando datos del cliente:', error);
      // Datos mock como fallback
      setCliente({
        id_cliente: 1,
        nombre_cliente: 'Usuario Demo',
        correo_cliente: 'usuario@demo.com',
        cel_cliente: '300 123 4567',
        direccion_cliente: 'Calle 123 #45-67, Bogotá'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (name) => {
    setCheckboxes(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('cliente_data');
    localStorage.removeItem('cliente_id');
    localStorage.removeItem('carrito');
    localStorage.removeItem('datosPago');
    navigate('/login');
  };

  const handleLogoutAll = () => {
    localStorage.clear();
    navigate('/login');
  };

  const editarPerfil = () => {
    navigate('/perfil/editar');
  };

  if (loading) {
    return (
      <div className="cuenta-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cuenta-container">
      {/* Header */}
      <h1>Cuenta</h1>

      {/* Sección LIB */}
      <section className="section">
        <div className="lib-section">
          <h2>Perfil</h2>
          <div className="lib-info">
            <span>{cliente?.nombre_cliente || 'Usuario'}</span>
            <button className="edit-btn" onClick={editarPerfil}>✏️</button>
          </div>
          <div className="cliente-details">
            <p><strong>Email:</strong> {cliente?.correo_cliente || 'No disponible'}</p>
            <p><strong>Teléfono:</strong> {cliente?.cel_cliente || 'No disponible'}</p>
            <p><strong>Dirección:</strong> {cliente?.direccion_cliente || 'No disponible'}</p>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Equipos de texto */}
      <section className="section">
        <h3>Equipos de texto</h3>
        <div className="item-list">
          <div className="item"><strong>Equipos Pro</strong></div>
          <div className="item"><strong>Equipos Pro</strong></div>
          <div className="item"><strong>Equipos Pro</strong></div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Envíos gratis, Promociones exclusivas */}
      <section className="section">
        <h3>Envíos gratis, Promociones exclusivas</h3>
        <div className="item-list">
          <div className="item"><strong>Promoción en la empresa</strong></div>
          <div className="item"><strong>Promoción directa</strong></div>
          <div className="item"><strong>Actuación periódica</strong></div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Empleo del texto */}
      <section className="section">
        <h3>Empleo del texto</h3>
        <div className="item-list">
          <div className="item"><strong>Empleo de texto</strong></div>
          <div className="item"><strong>Actuación periódica</strong></div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Ambiga e Influencera */}
      <section className="section">
        <h3>Amigos e Influencers</h3>
        <div className="item-list">
          <div className="item">
            <strong>Más amigos</strong>
            <div className="subtext">Memoria y fotografía de los autores</div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Influencera */}
      <section className="section">
        <h3>Influencera</h3>
        <div className="item-list">
          <div className="item">
            <strong>Ejecución financiera y entrada informativa</strong>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Beneficios */}
      <section className="section">
        <h3>Beneficios</h3>
        <div className="benefits-grid">
          <div className="benefit-item">
            <span className="benefit-label">Créditos</span>
            <span className="benefit-value">80</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-label">Cupones</span>
            <span className="benefit-value">5</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-label">Lojas/ir</span>
            <span className="benefit-value">3</span>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Mi cuenta */}
      <section className="section">
        <h3>Mi cuenta</h3>
        <div className="account-list">
          <div className="account-item">
            <span>Siguismo</span>
            <span className="count">3</span>
          </div>
          <div className="account-item">
            <span>Direcciones</span>
            <span className="count">3</span>
          </div>
          <div className="account-item">
            <span>Metodas de pago</span>
            <span className="count">3</span>
          </div>
          <div className="account-item">
            <span>Datos de facturación</span>
            <span className="count">3</span>
          </div>
          <div className="account-item">
            <span>Ayuda</span>
            <span className="count">3</span>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Configuración */}
      <section className="section">
        <h3>Configuración</h3>
        <div className="account-list">
          <div className="account-item">
            <span>Notificaciones</span>
            <span className="count">3</span>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Sección Más Información */}
      <section className="section">
        <h2>Más información</h2>
        <div className="options-list">
          <label className="option-item">
            <input 
              type="checkbox" 
              checked={checkboxes.aliado}
              onChange={() => handleCheckboxChange('aliado')}
            />
            <span className="checkmark"></span>
            Quiere ser Aliado Rappi
          </label>

          <label className="option-item">
            <input 
              type="checkbox" 
              checked={checkboxes.repartidor}
              onChange={() => handleCheckboxChange('repartidor')}
            />
            <span className="checkmark"></span>
            Quiero ser Repartidor
          </label>

          <label className="option-item">
            <input 
              type="checkbox" 
              checked={checkboxes.hermes}
              onChange={() => handleCheckboxChange('hermes')}
            />
            <span className="checkmark"></span>
            Terminos y Condiciones 
          </label>

          <label className="option-item">
            <input 
              type="checkbox" 
              checked={checkboxes.privacidad}
              onChange={() => handleCheckboxChange('privacidad')}
            />
            <span className="checkmark"></span>
            Politicas de Privacidad
          </label>

          <label className="option-item">
            <input 
              type="checkbox" 
              checked={checkboxes.informacion}
              onChange={() => handleCheckboxChange('informacion')}
            />
            <span className="checkmark"></span>
            Información relevante
          </label>

          <label className="option-item">
            <input 
              type="checkbox" 
              checked={checkboxes.datos}
              onChange={() => handleCheckboxChange('datos')}
            />
            <span className="checkmark"></span>
            Autorización de tratamiento de datos personales
          </label>

          <label className="option-item">
            <input 
              type="checkbox" 
              checked={checkboxes.interferencia}
              onChange={() => handleCheckboxChange('interferencia')}
            />
            <span className="checkmark"></span>
            Interferencia de bienes y fondos
          </label>
        </div>
      </section>

      {/* Botones de Cerrar Sesión */}
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
        <button className="logout-all-btn" onClick={handleLogoutAll}>
          Cerrar todas las sesiones
        </button>
      </div>
    </div>
  );
};

export default Cuenta;