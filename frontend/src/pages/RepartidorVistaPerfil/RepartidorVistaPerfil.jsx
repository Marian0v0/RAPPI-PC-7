import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FinanzasRepartidor from '../../components/FinanzasRepartidor/FinanzasRepartidor';
import './RepartidorVistaPerfil.css';

const RepartidorVistaPerfil = () => {
  const navigate = useNavigate();
  const [repartidor, setRepartidor] = useState(null);
  const [seccionActiva, setSeccionActiva] = useState('perfil');
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    pedidos_entregados: 0,
    calificacion_promedio: 0,
    ganancias_mes: 0,
    tiempo_promedio: 0
  });

  useEffect(() => {
    cargarDatosRepartidor();
  }, []);

  const cargarDatosRepartidor = async () => {
    try {
      const repartidorId = localStorage.getItem('repartidor_id') || 1;
      const response = await fetch(`https://rappi-pc-7.onrender.com/backend/repartidores/${repartidorId}`);
      
      if (response.ok) {
        const data = await response.json();
        setRepartidor(data);
      } else {
        // Datos mock si el backend no responde
        setRepartidor({
          id_repartidor: 1,
          nombre_repartidor: 'Carlos Mendoza',
          cel_repartidor: '300 123 4567',
          correo_repartidor: 'carlos@example.com',
          fotografia_repartidor: 'https://via.placeholder.com/150x150/00d4aa/ffffff?text=CM',
          tipo_vehiculo: 'Moto',
          placa_vehiculo: 'ABC-123',
          estado: 'disponible'
        });
      }
      
      cargarEstadisticas();
    } catch (error) {
      console.error('Error cargando datos del repartidor:', error);
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const repartidorId = localStorage.getItem('repartidor_id') || 1;
      const response = await fetch(`https://rappi-pc-7.onrender.com/backend/repartidores/${repartidorId}/estadisticas`);
      
      if (response.ok) {
        const data = await response.json();
        setEstadisticas(data);
      } else {
        // Datos mock
        setEstadisticas({
          pedidos_entregados: 156,
          calificacion_promedio: 4.8,
          ganancias_mes: 850000,
          tiempo_promedio: 18
        });
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarPerfil = async (datosActualizados) => {
    try {
      const repartidorId = localStorage.getItem('repartidor_id') || 1;
      const response = await fetch(`https://rappi-pc-7.onrender.com/backend/repartidores/${repartidorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizados),
      });

      if (response.ok) {
        const data = await response.json();
        setRepartidor(data);
        alert('Perfil actualizado exitosamente');
      } else {
        alert('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      alert('Error al actualizar el perfil');
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('repartidor_id');
    localStorage.removeItem('repartidor_data');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="perfil-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <button 
          className="btn-volver"
          onClick={() => navigate('/repartidor/pedidos')}
        >
          ← Volver
        </button>
        <h1>Mi Perfil</h1>
      </div>

      <div className="perfil-content">
        {/* Sidebar de navegación */}
        <div className="perfil-sidebar">
          <div className="perfil-info">
            <div className="avatar">
              <img 
                src={repartidor?.fotografia_repartidor || 'https://via.placeholder.com/80x80/00d4aa/ffffff?text=R'} 
                alt={repartidor?.nombre_repartidor}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80x80/00d4aa/ffffff?text=R';
                }}
              />
            </div>
            <h3>{repartidor?.nombre_repartidor}</h3>
            <p className="estado">
              {repartidor?.estado === 'disponible' && '🟢 Disponible'}
              {repartidor?.estado === 'ocupado' && '🟡 Ocupado'}
              {repartidor?.estado === 'offline' && '🔴 Offline'}
            </p>
          </div>

          <nav className="perfil-nav">
            <button 
              className={`nav-item ${seccionActiva === 'perfil' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('perfil')}
            >
              👤 Perfil
            </button>
            <button 
              className={`nav-item ${seccionActiva === 'estadisticas' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('estadisticas')}
            >
              📊 Estadísticas
            </button>
            <button 
              className={`nav-item ${seccionActiva === 'finanzas' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('finanzas')}
            >
              💰 Finanzas
            </button>
            <button 
              className={`nav-item ${seccionActiva === 'configuracion' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('configuracion')}
            >
              ⚙️ Configuración
            </button>
          </nav>

          <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
            🚪 Cerrar Sesión
          </button>
        </div>

        {/* Contenido principal */}
        <div className="perfil-main">
          {seccionActiva === 'perfil' && (
            <div className="seccion-perfil">
              <h2>Información Personal</h2>
              <div className="perfil-form">
                <div className="form-group">
                  <label>Nombre completo</label>
                  <input 
                    type="text" 
                    value={repartidor?.nombre_repartidor || ''} 
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input 
                    type="tel" 
                    value={repartidor?.cel_repartidor || ''} 
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Correo electrónico</label>
                  <input 
                    type="email" 
                    value={repartidor?.correo_repartidor || ''} 
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de vehículo</label>
                  <input 
                    type="text" 
                    value={repartidor?.tipo_vehiculo || ''} 
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Placa del vehículo</label>
                  <input 
                    type="text" 
                    value={repartidor?.placa_vehiculo || ''} 
                    readOnly
                  />
                </div>
                <button className="btn-editar-perfil">
                  ✏️ Editar Perfil
                </button>
              </div>
            </div>
          )}

          {seccionActiva === 'estadisticas' && (
            <div className="seccion-estadisticas">
              <h2>Mis Estadísticas</h2>
              <div className="estadisticas-grid">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <h3>Pedidos Entregados</h3>
                    <p className="stat-number">{estadisticas.pedidos_entregados}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <h3>Calificación Promedio</h3>
                    <p className="stat-number">{estadisticas.calificacion_promedio}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <h3>Ganancias del Mes</h3>
                    <p className="stat-number">${estadisticas.ganancias_mes.toLocaleString()}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏱️</div>
                  <div className="stat-content">
                    <h3>Tiempo Promedio</h3>
                    <p className="stat-number">{estadisticas.tiempo_promedio} min</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {seccionActiva === 'finanzas' && (
            <div className="seccion-finanzas">
              <FinanzasRepartidor />
            </div>
          )}

          {seccionActiva === 'configuracion' && (
            <div className="seccion-configuracion">
              <h2>Configuración</h2>
              <div className="configuracion-options">
                <div className="config-item">
                  <h3>Notificaciones</h3>
                  <p>Recibir notificaciones de nuevos pedidos</p>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="config-item">
                  <h3>Ubicación</h3>
                  <p>Compartir ubicación en tiempo real</p>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="config-item">
                  <h3>Modo Oscuro</h3>
                  <p>Activar tema oscuro</p>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepartidorVistaPerfil;
