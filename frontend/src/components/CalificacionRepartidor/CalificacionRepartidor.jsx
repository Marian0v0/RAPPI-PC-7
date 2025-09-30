import React, { useState } from 'react';
import './CalificacionRepartidor.css';

const CalificacionRepartidor = ({ isOpen, onClose, repartidor, pedidoId, onCalificar }) => {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [categorias, setCategorias] = useState({
    puntualidad: 0,
    trato: 0,
    cuidado_pedido: 0,
    comunicacion: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (calificacion === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    setLoading(true);
    try {
      const calificacionData = {
        id_repartidor: repartidor.id_repartidor,
        id_pedido: pedidoId,
        valoracion: calificacion,
        tipo_calificacion: 'Repartidor',
        sugerencia_calificacion: comentario,
        categorias: categorias
      };

      // Enviar al backend
      const response = await fetch('https://rappi-pc-7.onrender.com/backend/calificaciones-repartidor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calificacionData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          if (onCalificar) {
            onCalificar(calificacionData);
          }
          alert('¡Gracias por tu calificación!');
          onClose();
        } else {
          alert('Error al enviar la calificación');
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error enviando calificación:', error);
      alert('Error al enviar la calificación');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriaChange = (categoria, valor) => {
    setCategorias(prev => ({
      ...prev,
      [categoria]: valor
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="calificacion-overlay" onClick={onClose}>
      <div className="calificacion-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Calificar Repartidor</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="repartidor-info">
          <div className="repartidor-avatar">
            <img 
              src={repartidor.fotografia_repartidor || 'https://via.placeholder.com/80x80/00d4aa/ffffff?text=R'} 
              alt={repartidor.nombre_repartidor}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/80x80/00d4aa/ffffff?text=R';
              }}
            />
          </div>
          <div className="repartidor-details">
            <h3>{repartidor.nombre_repartidor}</h3>
            <p>Repartidor</p>
            <div className="repartidor-stats">
              <span>⭐ 4.8</span>
              <span>🚗 {repartidor.tipo_vehiculo}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="calificacion-form">
          {/* Calificación General */}
          <div className="calificacion-section">
            <h3>¿Cómo calificarías al repartidor?</h3>
            <div className="estrellas-container">
              {[1, 2, 3, 4, 5].map((estrella) => (
                <button
                  key={estrella}
                  type="button"
                  className={`estrella ${estrella <= calificacion ? 'activa' : ''}`}
                  onClick={() => setCalificacion(estrella)}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className="calificacion-texto">
              {calificacion === 0 && 'Selecciona una calificación'}
              {calificacion === 1 && 'Muy malo'}
              {calificacion === 2 && 'Malo'}
              {calificacion === 3 && 'Regular'}
              {calificacion === 4 && 'Bueno'}
              {calificacion === 5 && 'Excelente'}
            </p>
          </div>

          {/* Calificaciones por Categoría */}
          <div className="categorias-section">
            <h3>Detalles del servicio</h3>
            
            <div className="categoria-item">
              <label>Puntualidad</label>
              <div className="categoria-estrellas">
                {[1, 2, 3, 4, 5].map((estrella) => (
                  <button
                    key={estrella}
                    type="button"
                    className={`estrella-pequena ${estrella <= categorias.puntualidad ? 'activa' : ''}`}
                    onClick={() => handleCategoriaChange('puntualidad', estrella)}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="categoria-item">
              <label>Trato</label>
              <div className="categoria-estrellas">
                {[1, 2, 3, 4, 5].map((estrella) => (
                  <button
                    key={estrella}
                    type="button"
                    className={`estrella-pequena ${estrella <= categorias.trato ? 'activa' : ''}`}
                    onClick={() => handleCategoriaChange('trato', estrella)}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="categoria-item">
              <label>Cuidado del pedido</label>
              <div className="categoria-estrellas">
                {[1, 2, 3, 4, 5].map((estrella) => (
                  <button
                    key={estrella}
                    type="button"
                    className={`estrella-pequena ${estrella <= categorias.cuidado_pedido ? 'activa' : ''}`}
                    onClick={() => handleCategoriaChange('cuidado_pedido', estrella)}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="categoria-item">
              <label>Comunicación</label>
              <div className="categoria-estrellas">
                {[1, 2, 3, 4, 5].map((estrella) => (
                  <button
                    key={estrella}
                    type="button"
                    className={`estrella-pequena ${estrella <= categorias.comunicacion ? 'activa' : ''}`}
                    onClick={() => handleCategoriaChange('comunicacion', estrella)}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comentario */}
          <div className="comentario-section">
            <label htmlFor="comentario">Comentario (opcional)</label>
            <textarea
              id="comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Cuéntanos sobre tu experiencia con el repartidor..."
              rows="4"
              maxLength="500"
            />
            <div className="contador-caracteres">
              {comentario.length}/500
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancelar"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-enviar"
              disabled={loading || calificacion === 0}
            >
              {loading ? 'Enviando...' : 'Enviar Calificación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalificacionRepartidor;