import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuieroSerAliado.css';

const QuieroSerAliado = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionClick = (option) => {
    onClose();
    if (option === 'restaurante') {
      navigate('/registro/restaurante');
    } else if (option === 'comercio') {
      navigate('/registro/comercio');
    } else if (option === 'repartidor') {
      navigate('/registro/repartidor');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="quiero-ser-aliado-overlay" onClick={onClose}>
      <div className="quiero-ser-aliado-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Quiero ser aliado</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <p className="modal-description">
            Únete a nuestra plataforma y comienza a vender tus productos o servicios
          </p>
          
          <div className="options-grid">
            <div 
              className="option-card restaurante"
              onClick={() => handleOptionClick('restaurante')}
            >
              <div className="option-icon">🍽️</div>
              <h3>Restaurante</h3>
              <p>Vende comida y bebidas</p>
              <ul>
                <li>Menú digital</li>
                <li>Gestión de pedidos</li>
                <li>Estadísticas de ventas</li>
              </ul>
            </div>
            
            <div 
              className="option-card comercio"
              onClick={() => handleOptionClick('comercio')}
            >
              <div className="option-icon">🏪</div>
              <h3>Comercio</h3>
              <p>Vende productos diversos</p>
              <ul>
                <li>Catálogo de productos</li>
                <li>Gestión de inventario</li>
                <li>Reportes de ventas</li>
              </ul>
            </div>
            
            <div 
              className="option-card repartidor"
              onClick={() => handleOptionClick('repartidor')}
            >
              <div className="option-icon">🏍️</div>
              <h3>Repartidor</h3>
              <p>Gana dinero entregando</p>
              <ul>
                <li>Horarios flexibles</li>
                <li>Ganancias por entrega</li>
                <li>Seguimiento en tiempo real</li>
              </ul>
            </div>
          </div>
          
          <div className="modal-footer">
            <p className="help-text">
              ¿Necesitas ayuda? Contáctanos al 01 8000 123 456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuieroSerAliado;
