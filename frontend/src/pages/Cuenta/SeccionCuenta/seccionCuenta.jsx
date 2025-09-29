import React, { useState } from 'react';
import './Cuenta.css';

const Cuenta = () => {
  const [checkboxes, setCheckboxes] = useState({
    aliado: false,
    repartidor: true,
    hermes: false,
    privacidad: false,
    informacion: false,
    datos: false,
    interferencia: false
  });

  const handleCheckboxChange = (name) => {
    setCheckboxes(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión
    console.log('Cerrar sesión');
  };

  const handleLogoutAll = () => {
    // Lógica para cerrar todas las sesiones
    console.log('Cerrar todas las sesiones');
  };

  return (
    <div className="cuenta-container">
      {/* Header */}
      <h1>Cuenta</h1>

      {/* Sección LIB */}
      <section className="section">
        <div className="lib-section">
          <h2>LIB</h2>
          <div className="lib-info">
            <span>Juan </span>
            <button className="edit-btn">✏️</button>
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