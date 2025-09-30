import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SeguimientoEntrega.css';
import CalificacionRepartidor from '../../components/CalificacionRepartidor/CalificacionRepartidor';
import CalificacionRestaurante from '../../components/CalificacionRestaurante/CalificacionRestaurante';

const SeguimientoEntrega = () => {
    const { id_pedido } = useParams();
    const navigate = useNavigate();
    const [pedido, setPedido] = useState(null);
    const [estadoActual, setEstadoActual] = useState('preparando');
    const [tiempoEstimado, setTiempoEstimado] = useState(25);
    const [repartidor, setRepartidor] = useState(null);
    const [restaurante, setRestaurante] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [ubicacionRepartidor, setUbicacionRepartidor] = useState(null);
    const [mostrarCalificacionRepartidor, setMostrarCalificacionRepartidor] = useState(false);
    const [mostrarCalificacionRestaurante, setMostrarCalificacionRestaurante] = useState(false);

    useEffect(() => {
        console.log('SeguimientoEntrega montado con ID:', id_pedido);
        cargarDatosPedido();
        // Actualizaciones en tiempo real cada 10 segundos
        const interval = setInterval(actualizarEstado, 10000);
        return () => clearInterval(interval);
    }, [id_pedido]);

    useEffect(() => {
        // Obtener ubicación del repartidor en tiempo real
        if (repartidor && estadoActual !== 'preparando' && estadoActual !== 'entregado') {
            const ubicacionInterval = setInterval(obtenerUbicacionRepartidor, 5000);
            return () => clearInterval(ubicacionInterval);
        }
    }, [repartidor, estadoActual]);

    const cargarDatosPedido = async () => {
        try {
            setCargando(true);
            
            // Primero intentar cargar desde localStorage
            const pedidoLocal = localStorage.getItem('pedido_actual');
            if (pedidoLocal) {
                const pedidoData = JSON.parse(pedidoLocal);
                setPedido({
                    id: pedidoData.id,
                    productos: pedidoData.productos,
                    total: pedidoData.total,
                    direccion: "Calle 123 #45-67, Bogotá" // Dirección por defecto
                });
                setEstadoActual(pedidoData.estado || 'preparando');
                setTiempoEstimado(25);
                setCargando(false);
                return;
            }
            
            // Obtener datos del pedido desde el backend
            const response = await fetch(`https://rappi-pc-7.onrender.com/backend/pedidos/${id_pedido}`);
            if (response.ok) {
                const data = await response.json();
                setPedido(data.pedido);
                setEstadoActual(data.estado || 'preparando');
                setTiempoEstimado(data.tiempo_estimado || 25);
                
                if (data.repartidor) {
                    setRepartidor(data.repartidor);
                }
                
                if (data.restaurante) {
                    setRestaurante(data.restaurante);
                }
            } else {
                // Fallback con datos mock si el backend no responde
                setPedido({
                    id: id_pedido,
                    restaurante: "Mr. King Pollo",
                    productos: [
                        { nombre: "Combo mk broaster", cantidad: 1, precio: 17999 }
                    ],
                    total: 24099,
                    direccion: "Calle 123 #45-67, Bogotá"
                });
                
                setRepartidor({
                    id_repartidor: 1,
                    nombre_repartidor: "Carlos Mendoza",
                    cel_repartidor: "300 123 4567",
                    fotografia_repartidor: "https://images.rappi.com/delivery-person/avatar.png",
                    tipo_vehiculo: "Moto"
                });
                
                setRestaurante({
                    id_restaurante: 1,
                    nombre_restaurante: "Mr. King Pollo",
                    tipo_comida: "Pollo"
                });
            }
            
            setCargando(false);
        } catch (error) {
            console.error('Error cargando pedido:', error);
            setCargando(false);
        }
    };

    const actualizarEstado = async () => {
        try {
            // Obtener estado actualizado desde el backend
            const response = await fetch(`https://rappi-pc-7.onrender.com/backend/pedidos/${id_pedido}/estado`);
            if (response.ok) {
                const data = await response.json();
                setEstadoActual(data.estado);
                setTiempoEstimado(data.tiempo_estimado);
            }
        } catch (error) {
            console.error('Error actualizando estado:', error);
            // Fallback: simular progreso del pedido
            const estados = ['preparando', 'en_camino', 'cerca', 'entregado'];
            const indiceActual = estados.indexOf(estadoActual);
            
            if (indiceActual < estados.length - 1) {
                setEstadoActual(estados[indiceActual + 1]);
                setTiempoEstimado(Math.max(0, tiempoEstimado - 5));
            }
        }
    };

    const obtenerUbicacionRepartidor = async () => {
        try {
            const response = await fetch(`https://rappi-pc-7.onrender.com/backend/repartidores/${repartidor.id_repartidor}/ubicacion`);
            if (response.ok) {
                const data = await response.json();
                setUbicacionRepartidor(data.ubicacion);
            } else {
                // Simular ubicación del repartidor si no hay respuesta del backend
                const ubicacionesSimuladas = [
                    { lat: 4.6097, lng: -74.0817, direccion: "Cerca del restaurante" },
                    { lat: 4.6100, lng: -74.0820, direccion: "En camino" },
                    { lat: 4.6105, lng: -74.0825, direccion: "Aproximándose" },
                    { lat: 4.6110, lng: -74.0830, direccion: "Cerca de tu ubicación" }
                ];
                
                const indice = Math.min(estados.indexOf(estadoActual), ubicacionesSimuladas.length - 1);
                setUbicacionRepartidor(ubicacionesSimuladas[indice]);
            }
        } catch (error) {
            console.error('Error obteniendo ubicación:', error);
            // Fallback con ubicación simulada
            const ubicacionesSimuladas = [
                { lat: 4.6097, lng: -74.0817, direccion: "Cerca del restaurante" },
                { lat: 4.6100, lng: -74.0820, direccion: "En camino" },
                { lat: 4.6105, lng: -74.0825, direccion: "Aproximándose" },
                { lat: 4.6110, lng: -74.0830, direccion: "Cerca de tu ubicación" }
            ];
            
            const estados = ['preparando', 'en_camino', 'cerca', 'entregado'];
            const indice = Math.min(estados.indexOf(estadoActual), ubicacionesSimuladas.length - 1);
            setUbicacionRepartidor(ubicacionesSimuladas[indice]);
        }
    };

    const calcularDistancia = (lat1, lng1, lat2, lng2) => {
        const R = 6371; // Radio de la Tierra en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const getEstadoInfo = () => {
        switch (estadoActual) {
            case 'preparando':
                return {
                    titulo: 'Preparando tu pedido',
                    descripcion: 'El restaurante está preparando tu comida',
                    icono: '👨‍🍳',
                    color: '#ff6b6b'
                };
            case 'en_camino':
                return {
                    titulo: 'En camino',
                    descripcion: 'Tu pedido está en camino',
                    icono: '🚚',
                    color: '#00d4aa'
                };
            case 'cerca':
                return {
                    titulo: 'Casi llegamos',
                    descripcion: 'Tu pedido está cerca',
                    icono: '📍',
                    color: '#00d4aa'
                };
            case 'entregado':
                return {
                    titulo: '¡Entregado!',
                    descripcion: 'Tu pedido ha sido entregado',
                    icono: '✅',
                    color: '#00d4aa'
                };
            default:
                return {
                    titulo: 'Procesando',
                    descripcion: 'Procesando tu pedido',
                    icono: '⏳',
                    color: '#666'
                };
        }
    };

    const llamarRepartidor = () => {
        if (repartidor?.cel_repartidor) {
            window.open(`tel:${repartidor.cel_repartidor}`, '_self');
        }
    };

    const calificarRepartidor = () => {
        setMostrarCalificacionRepartidor(true);
    };

    const calificarRestaurante = () => {
        setMostrarCalificacionRestaurante(true);
    };

    if (cargando) {
        return (
            <div className="seguimiento-container">
                <div className="cargando">
                    <div className="spinner"></div>
                    <p>Cargando información del pedido...</p>
                </div>
            </div>
        );
    }

    const estadoInfo = getEstadoInfo();

    return (
        <div className="seguimiento-container">
            <div className="seguimiento-header">
                <button 
                    className="btn-volver"
                    onClick={() => navigate('/')}
                >
                    ←
                </button>
                <h1>Seguimiento del pedido</h1>
            </div>

            <div className="seguimiento-content">
                {/* Estado actual */}
                <div className="estado-actual">
                    <div className="estado-icono" style={{ backgroundColor: estadoInfo.color }}>
                        <span>{estadoInfo.icono}</span>
                    </div>
                    <div className="estado-info">
                        <h2>{estadoInfo.titulo}</h2>
                        <p>{estadoInfo.descripcion}</p>
                        {estadoActual !== 'entregado' && (
                            <div className="tiempo-estimado">
                                <span className="tiempo">⏱️ {tiempoEstimado} min</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Información del pedido */}
                {pedido && (
                    <div className="pedido-info">
                        <h3>Detalles del pedido</h3>
                        <div className="restaurante-info">
                            <div className="restaurante-avatar">🍗</div>
                            <div className="restaurante-details">
                                <h4>{pedido.restaurante}</h4>
                                <p>{pedido.productos.length} producto{pedido.productos.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        
                        <div className="productos-lista">
                            {pedido.productos.map((producto, index) => (
                                <div key={index} className="producto-item">
                                    <span className="producto-nombre">{producto.nombre}</span>
                                    <span className="producto-cantidad">x{producto.cantidad}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pedido-total">
                            <span>Total: ${pedido.total.toLocaleString()}</span>
                        </div>
                    </div>
                )}

                {/* Información del repartidor */}
                {repartidor && estadoActual !== 'preparando' && (
                    <div className="repartidor-info">
                        <h3>Tu Rappi</h3>
                        <div className="repartidor-card">
                            <div className="repartidor-avatar">
                                <img 
                                    src={repartidor.fotografia_repartidor} 
                                    alt={repartidor.nombre_repartidor}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="avatar-fallback" style={{display: 'none'}}>🚚</div>
                            </div>
                            <div className="repartidor-details">
                                <h4>{repartidor.nombre_repartidor}</h4>
                                <div className="repartidor-rating">
                                    <span>⭐ 4.8</span>
                                </div>
                                {ubicacionRepartidor && (
                                    <div className="ubicacion-info">
                                        <span className="distancia">
                                            📍 {ubicacionRepartidor.direccion || 'En camino'}
                                        </span>
                                        <span className="tiempo-estimado">
                                            ⏱️ {tiempoEstimado} min
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button 
                                className="btn-llamar"
                                onClick={llamarRepartidor}
                            >
                                📞
                            </button>
                        </div>
                    </div>
                )}

                {/* Mapa en tiempo real */}
                {ubicacionRepartidor && (
                    <div className="mapa-seguimiento">
                        <h3>Ubicación en tiempo real</h3>
                        <div className="mapa-container">
                            <div className="mapa-mini">
                                <div className="pin-repartidor" style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)'
                                }}>
                                    🏍️
                                </div>
                                <div className="pin-destino" style={{
                                    left: '70%',
                                    top: '30%',
                                    transform: 'translate(-50%, -50%)'
                                }}>
                                    🏠
                                </div>
                            </div>
                            <div className="mapa-info">
                                <div className="info-item">
                                    <span className="label">Repartidor:</span>
                                    <span className="value">{ubicacionRepartidor.direccion}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Destino:</span>
                                    <span className="value">{pedido?.direccion}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dirección de entrega */}
                <div className="direccion-entrega">
                    <h3>Dirección de entrega</h3>
                    <div className="direccion-info">
                        <span className="icono">📍</span>
                        <span className="direccion">{pedido?.direccion}</span>
                    </div>
                </div>
            </div>

            {/* Botones de calificación */}
            {estadoActual === 'entregado' && (
                <div className="seguimiento-footer">
                    <button 
                        className="btn-calificar"
                        onClick={calificarRepartidor}
                    >
                        Calificar Repartidor
                    </button>
                    <button 
                        className="btn-calificar"
                        onClick={calificarRestaurante}
                    >
                        Calificar Restaurante
                    </button>
                </div>
            )}

            {/* Modales de calificación */}
            {mostrarCalificacionRepartidor && repartidor && (
                <CalificacionRepartidor
                    isOpen={mostrarCalificacionRepartidor}
                    onClose={() => setMostrarCalificacionRepartidor(false)}
                    repartidor={repartidor}
                    pedidoId={id_pedido}
                    onCalificar={() => {
                        setMostrarCalificacionRepartidor(false);
                        alert('¡Gracias por calificar al repartidor!');
                    }}
                />
            )}

            {mostrarCalificacionRestaurante && restaurante && (
                <CalificacionRestaurante
                    isOpen={mostrarCalificacionRestaurante}
                    onClose={() => setMostrarCalificacionRestaurante(false)}
                    restaurante={restaurante}
                    pedidoId={id_pedido}
                    onCalificar={() => {
                        setMostrarCalificacionRestaurante(false);
                        alert('¡Gracias por calificar el restaurante!');
                    }}
                />
            )}
        </div>
    );
};

export default SeguimientoEntrega;
