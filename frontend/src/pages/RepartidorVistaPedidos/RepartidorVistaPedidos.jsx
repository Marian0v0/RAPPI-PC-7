import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditarEstadoModal from "../../components/editarEstadoPedido/EditarEstadoModal";
import "./RepartidorVistaPedidos.css";

const RepartidorVistaPedidos = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("Pendiente");
  const [pedidos, setPedidos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [estadoRepartidor, setEstadoRepartidor] = useState('disponible'); // disponible, ocupado, offline
  const [loading, setLoading] = useState(false);

  // Cargar pedidos desde la API al montar el componente
  useEffect(() => {
    cargarPedidos();
    obtenerUbicacion();
    actualizarEstadoRepartidor();
    
    // Actualizar pedidos cada 30 segundos
    const interval = setInterval(cargarPedidos, 30000);
    return () => clearInterval(interval);
  }, []);

  // Actualizar ubicación cada 10 segundos
  useEffect(() => {
    if (estadoRepartidor === 'disponible' || estadoRepartidor === 'ocupado') {
      const ubicacionInterval = setInterval(actualizarUbicacion, 10000);
      return () => clearInterval(ubicacionInterval);
    }
  }, [estadoRepartidor]);

  const obtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const ubicacion = {
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
            timestamp: new Date().toISOString()
          };
          setUbicacionActual(ubicacion);
          enviarUbicacionAlBackend(ubicacion);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
        }
      );
    }
  };

  const actualizarUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const ubicacion = {
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
            timestamp: new Date().toISOString()
          };
          setUbicacionActual(ubicacion);
          enviarUbicacionAlBackend(ubicacion);
        },
        (error) => {
          console.error('Error actualizando ubicación:', error);
        }
      );
    }
  };

  const enviarUbicacionAlBackend = async (ubicacion) => {
    try {
      const repartidorId = localStorage.getItem('repartidor_id') || 1; // Obtener ID del repartidor logueado
      await fetch(`https://rappi-pc-7.onrender.com/backend/repartidores/${repartidorId}/ubicacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ubicacion),
      });
    } catch (error) {
      console.error('Error enviando ubicación:', error);
    }
  };

  const cargarPedidos = async () => {
    try {
      const response = await fetch("https://rappi-pc-7.onrender.com/backend/repartidor/pendientes");
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      }
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  const actualizarEstadoRepartidor = async () => {
    try {
      const repartidorId = localStorage.getItem('repartidor_id') || 1;
      const response = await fetch(`https://rappi-pc-7.onrender.com/backend/repartidores/${repartidorId}/estado`);
      if (response.ok) {
        const data = await response.json();
        setEstadoRepartidor(data.estado);
      }
    } catch (error) {
      console.error('Error obteniendo estado:', error);
    }
  };

  const handleAceptar = async (id) => {
    if (estadoRepartidor !== 'disponible') {
      alert('Debes estar disponible para aceptar pedidos');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://rappi-pc-7.onrender.com/backend/repartidor/pedidos/aceptar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Error al aceptar pedido");
      
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: "Aceptado" } : p))
      );
      
      // Cambiar estado a ocupado
      setEstadoRepartidor('ocupado');
      await actualizarEstadoEnBackend('ocupado');
      
      alert('¡Pedido aceptado! Ve al restaurante a recoger el pedido.');
    } catch (error) {
      console.error(error);
      alert("No se pudo aceptar el pedido");
    } finally {
      setLoading(false);
    }
  };

  const handleRechazar = async (id) => {
    if (window.confirm("¿Seguro que quieres rechazar este pedido?")) {
      try {
        const res = await fetch("https://rappi-pc-7.onrender.com/backend/repartidor/pedidos/rechazar", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error("Error al rechazar pedido");
        setPedidos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, estado: "Rechazado" } : p))
        );
      } catch (error) {
        console.error(error);
        alert("No se pudo rechazar el pedido");
      }
    }
  };

  const handleOpenModal = (pedido) => {
    setPedidoSeleccionado(pedido);
    setModalOpen(true);
  };

  const actualizarEstadoEnBackend = async (nuevoEstado) => {
    try {
      const repartidorId = localStorage.getItem('repartidor_id') || 1;
      await fetch(`https://rappi-pc-7.onrender.com/backend/repartidores/${repartidorId}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  const cambiarEstadoRepartidor = async (nuevoEstado) => {
    setLoading(true);
    try {
      setEstadoRepartidor(nuevoEstado);
      await actualizarEstadoEnBackend(nuevoEstado);
      
      if (nuevoEstado === 'disponible') {
        alert('¡Ahora estás disponible para recibir pedidos!');
      } else if (nuevoEstado === 'ocupado') {
        alert('Estado cambiado a ocupado');
      } else {
        alert('Estado cambiado a offline');
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar estado');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEstado = (nuevoEstado) => {
    if (pedidoSeleccionado) {
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoSeleccionado.id ? { ...p, estado: nuevoEstado } : p
        )
      );
    }
    setModalOpen(false);
    setPedidoSeleccionado(null);
  };

  const calcularDistancia = (pedido) => {
    if (!ubicacionActual || !pedido.ubicacion_restaurante) return null;
    
    // Fórmula de distancia simple (en producción usarías una librería como geolib)
    const R = 6371; // Radio de la Tierra en km
    const dLat = (pedido.ubicacion_restaurante.latitud - ubicacionActual.latitud) * Math.PI / 180;
    const dLon = (pedido.ubicacion_restaurante.longitud - ubicacionActual.longitud) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(ubicacionActual.latitud * Math.PI / 180) * Math.cos(pedido.ubicacion_restaurante.latitud * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distancia = R * c;
    
    return distancia.toFixed(1);
  };

  const pedidosFiltrados = pedidos.filter((p) =>
    filtro === "Todos" ? true : p.estado === filtro
  );

  return (
    <div className="container">
      <div className="header-section">
        <h2 className="titulo">Pedidos del repartidor</h2>
        
        {/* Estado del repartidor */}
        <div className="estado-repartidor">
          <div className="estado-info">
            <span className={`estado-indicador ${estadoRepartidor}`}>
              {estadoRepartidor === 'disponible' && '🟢 Disponible'}
              {estadoRepartidor === 'ocupado' && '🟡 Ocupado'}
              {estadoRepartidor === 'offline' && '🔴 Offline'}
            </span>
            {ubicacionActual && (
              <span className="ubicacion-info">
                📍 Ubicación actualizada
              </span>
            )}
          </div>
          
          <div className="estado-buttons">
            <button 
              className={`btn-estado ${estadoRepartidor === 'disponible' ? 'activo' : ''}`}
              onClick={() => cambiarEstadoRepartidor('disponible')}
              disabled={loading}
            >
              Disponible
            </button>
            <button 
              className={`btn-estado ${estadoRepartidor === 'ocupado' ? 'activo' : ''}`}
              onClick={() => cambiarEstadoRepartidor('ocupado')}
              disabled={loading}
            >
              Ocupado
            </button>
            <button 
              className={`btn-estado ${estadoRepartidor === 'offline' ? 'activo' : ''}`}
              onClick={() => cambiarEstadoRepartidor('offline')}
              disabled={loading}
            >
              Offline
            </button>
          </div>
        </div>
      </div>

      <div className="filtros">
        {["Todos", "Pendiente", "Aceptado", "Rechazado"].map((f) => (
          <button
            key={f}
            className={`filtro ${filtro === f ? "filtroActivo" : ""}`}
            onClick={() => setFiltro(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="pedidos-container">
        {pedidosFiltrados.length === 0 ? (
          <div className="no-pedidos">
            <p>No hay pedidos disponibles</p>
            {estadoRepartidor === 'offline' && (
              <p className="suggestion">Cambia tu estado a "Disponible" para recibir pedidos</p>
            )}
          </div>
        ) : (
          pedidosFiltrados.map((pedido) => {
            const distancia = calcularDistancia(pedido);
            return (
              <div key={pedido.id} className="card">
                <div className="cardHeader">
                  <span className="estado">{pedido.estado}</span>
                  <span className="fecha">{pedido.fecha}</span>
                </div>
                <div className="restaurante">{pedido.restaurante}</div>
                <div className="precio">${pedido.precio}</div>
                
                {distancia && (
                  <div className="distancia-info">
                    <span className="distancia">📍 {distancia} km</span>
                    <span className="tiempo-estimado">⏱️ ~{Math.round(distancia * 2)} min</span>
                  </div>
                )}
                
                <div className="cardFooter">
                  <button
                    className={`boton ${
                      pedido.estado !== "Pendiente" || estadoRepartidor !== 'disponible' ? "botonDeshabilitado" : ""
                    }`}
                    onClick={() => handleAceptar(pedido.id)}
                    disabled={pedido.estado !== "Pendiente" || estadoRepartidor !== 'disponible' || loading}
                  >
                    {loading ? '⏳' : '✓'} Aceptar
                  </button>
                  <button
                    className={`boton ${
                      pedido.estado !== "Pendiente" ? "botonDeshabilitado" : ""
                    }`}
                    onClick={() => handleRechazar(pedido.id)}
                    disabled={pedido.estado !== "Pendiente"}
                  >
                    ✕ Rechazar
                  </button>
                  <button className="boton" onClick={() => handleOpenModal(pedido)}>
                    ✎ Editar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <EditarEstadoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onChangeEstado={handleChangeEstado}
      />
    </div>
  );
};

export default RepartidorVistaPedidos;