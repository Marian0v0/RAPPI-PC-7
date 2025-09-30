import React, { useState } from 'react';
import './CalificacionRestaurante.css';

const CalificacionRestaurante = ({ isOpen, onClose, restaurante, pedidoId, onCalificar }) => {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [categorias, setCategorias] = useState({
    calidad_comida: 0,
    tiempo_entrega: 0,
    presentacion: 0,
    temperatura: 0
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
        id_restaurante: restaurante.id_restaurante,
        id_pedido: pedidoId,
        valoracion: calificacion,
        tipo_calificacion: 'Restaurante',
        sugerencia_calificacion: comentario,
        categorias: categorias
      };

      // Enviar al backend
      const response = await fetch('https://rappi-pc-7.onrender.com/backend/calificaciones-restaurante', {
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
          <h2>Calificar Restaurante</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="restaurante-info">
          <div className="restaurante-avatar">
            <img 
              src={restaurante.fotografia_restaurante || 'https://via.placeholder.com/80x80/00d4aa/ffffff?text=R'} 
              alt={restaurante.nombre_restaurante}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/80x80/00d4aa/ffffff?text=R';
              }}
            />
          </div>
          <div className="restaurante-details">
            <h3>{restaurante.nombre_restaurante}</h3>
            <p>{restaurante.tipo_comida}</p>
            <div className="restaurante-stats">
              <span>⭐ 4.5</span>
              <span>🍽️ {restaurante.tipo_comida}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="calificacion-form">
          {/* Calificación General */}
          <div className="calificacion-section">
            <h3>¿Cómo calificarías el restaurante?</h3>
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
            <h3>Detalles de la experiencia</h3>
            
            <div className="categoria-item">
              <label>Calidad de la comida</label>
              <div className="categoria-estrellas">
                {[1, 2, 3, 4, 5].map((estrella) => (
                  <button
                    key={estrella}
                    type="button"
                    className={`estrella-pequena ${estrella <= categorias.calidad_comida ? 'activa' : ''}`}
                    onClick={() => handleCategoriaChange('calidad_comida', estrella)}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="categoria-item">
              <label>Tiempo de entrega</label>
              <div className="categoria-estrellas">
                {[1, 2, 3, 4, 5].map((estrella) => (
                  <button
                    key={estrella}
                    type="button"
                    className={`estrella-pequena ${estrella <= categorias.tiempo_entrega ? 'activa' : ''}`}
                    onClick={() => handleCategoriaChange('tiempo_entrega', estrella)}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="categoria-item">
              <label>Presentación</label>
              <div className="categoria-estrellas">
                {[1, 2, 3, 4, 5].map((estrella) => (
                  <button
                    key={estrella}
                    type="button"
                    className={`estrella-pequena ${estrella <= categorias.presentacion ? 'activa' : ''}`}
                    onClick={() => handleCategoriaChange('presentacion', estrella)}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="categoria-item">
              <label>Temperatura de la comida</label>
              <div className="categoria-estrellas">
                {[1, 2, 3, 4, 5].map((estrella) => (
                  <button
                    key={estrella}
                    type="button"
                    className={`estrella-pequena ${estrella <= categorias.temperatura ? 'activa' : ''}`}
                    onClick={() => handleCategoriaChange('temperatura', estrella)}
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
              placeholder="Cuéntanos sobre tu experiencia con el restaurante..."
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

export default CalificacionRestaurante;
