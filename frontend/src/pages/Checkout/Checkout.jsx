import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState('main');
    const [pedido, setPedido] = useState({
        productos: [],
        instrucciones: "Yo recibo el pedido en mi puerta",
        metodoPago: "Efectivo",
        propina: 0,
        cupon: "",
        esRegalo: false,
        mensajeRegalo: "",
        entregaEstimada: "normal" // normal, rapida, sinPrisas
    });
    
    const [direcciones, setDirecciones] = useState([
        { id: 1, nombre: "Casa", direccion: "Calle 12 #45-67, Pasto", activa: true },
        { id: 2, nombre: "Universidad", direccion: "Universidad Nariño, Pasto", activa: false },
        { id: 3, nombre: "Trabajo", direccion: "Centro Comercial Unicentro, Pasto", activa: false }
    ]);
    
    const [nuevaDireccion, setNuevaDireccion] = useState({
        nombre: "",
        direccion: "",
        detalles: ""
    });
    
    const [ubicacionMapa, setUbicacionMapa] = useState({
        lat: 4.6097,
        lng: -74.0817,
        direccion: "Calle 11, #6-79"
    });
    
    const [isDragging, setIsDragging] = useState(false);
    const [cargandoCoordenadas, setCargandoCoordenadas] = useState(false);
    const [zoom, setZoom] = useState(15);
    const [mapaOffset, setMapaOffset] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Cargar datos del carrito al montar el componente
    useEffect(() => {
        const datosPago = localStorage.getItem('datosPago');
        console.log('Datos del carrito cargados:', datosPago);
        
        if (datosPago) {
            try {
                const datos = JSON.parse(datosPago);
                console.log('Datos parseados:', datos);
                
                setPedido(prevPedido => ({
                    ...prevPedido,
                    productos: datos.productos || [],
                    propina: datos.propina || 0,
                    cupon: datos.cupon || ""
                }));
                
                // También cargar el descuento si existe
                if (datos.descuento && datos.descuento > 0) {
                    // Aplicar el descuento como cupón
                    setPedido(prevPedido => ({
                        ...prevPedido,
                        cupon: datos.cupon || "DESCUENTO_APLICADO"
                    }));
                }
            } catch (error) {
                console.error('Error cargando datos del carrito:', error);
            }
        } else {
            console.log('No se encontraron datos del carrito en localStorage');
        }
    }, []);

    // Calcular totales
    const calcularTotales = () => {
        const subtotal = pedido.productos.reduce((sum, p) => sum + ((p.precio_producto || p.precio) * p.cantidad), 0);
        let descuento = 0;
        let descuentoCupon = 0;
        let costoEntregaRapida = 0;
        
        // Descuento por entrega sin prisas
        if (pedido.entregaEstimada === 'sinPrisas') {
            descuento = 2900; // $2,900 de descuento como en la imagen
        }
        
        // Costo adicional por entrega rápida
        if (pedido.entregaEstimada === 'rapida') {
            costoEntregaRapida = 5500; // +$5,500 por entrega rápida
        }
        
        // Descuento por cupón
        if (pedido.cupon) {
            if (pedido.cupon === 'BIENVENIDO20') {
                descuentoCupon = subtotal * 0.2; // 20% de descuento
            } else if (pedido.cupon === 'ENVIOGRATIS') {
                descuentoCupon = 2900; // Envío gratis
            } else if (pedido.cupon === 'COMBO50') {
                descuentoCupon = subtotal * 0.5; // 50% de descuento
            }
        }
        
        const propina = pedido.propina;
        const costoEnvio = 2900;
        const tarifaServicio = 1900;
        const total = subtotal - descuento - descuentoCupon + propina + costoEnvio + tarifaServicio + costoEntregaRapida;
        
        return { subtotal, descuento, descuentoCupon, propina, costoEnvio, tarifaServicio, costoEntregaRapida, total };
    };

    const { subtotal, descuento, descuentoCupon, propina, costoEnvio, tarifaServicio, costoEntregaRapida, total } = calcularTotales();

    // Funciones de geolocalización
    const obtenerCoordenadas = async (direccion) => {
        try {
            setCargandoCoordenadas(true);
            const response = await fetch(`https://rappi-pc-7.onrender.com/backend/geolocalizacion/coordenadas/${encodeURIComponent(direccion)}`);
            const data = await response.json();
            
            if (data.success) {
                return {
                    lat: data.data.latitud,
                    lng: data.data.longitud,
                    direccion: data.data.direccion
                };
            }
        } catch (error) {
            console.error('Error obteniendo coordenadas:', error);
        } finally {
            setCargandoCoordenadas(false);
        }
        return null;
    };

    const obtenerDireccion = async (lat, lng) => {
        try {
            const response = await fetch(`https://rappi-pc-7.onrender.com/backend/geolocalizacion/direccion/${lat}/${lng}`);
            const data = await response.json();
            
            if (data.success) {
                return data.data.direccion;
            }
        } catch (error) {
            console.error('Error obteniendo dirección:', error);
        }
        return null;
    };

    // Generar tiles del mapa satelital usando Google Maps
    const generarTilesMapa = () => {
        const tiles = [];
        const tileSize = 256;
        const tilesPerSide = Math.ceil(400 / tileSize) + 2; // +2 para padding
        
        // Convertir lat/lng a tile coordinates
        const lat = ubicacionMapa.lat;
        const lng = ubicacionMapa.lng;
        const tileX = Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
        const tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
        
        for (let x = -tilesPerSide; x < tilesPerSide; x++) {
            for (let y = -tilesPerSide; y < tilesPerSide; y++) {
                const tileXPos = tileX + x;
                const tileYPos = tileY + y;
                const tileXCoord = x * tileSize;
                const tileYCoord = y * tileSize;
                
                tiles.push(
                    <div
                        key={`${x}-${y}`}
                        className="mapa-tile-rappi"
                        style={{
                            left: `${tileXCoord}px`,
                            top: `${tileYCoord}px`,
                            backgroundImage: `url(https://mt1.google.com/vt/lyrs=s&x=${tileXPos}&y=${tileYPos}&z=${zoom})`,
                            backgroundSize: 'cover'
                        }}
                    />
                );
            }
        }
        
        return tiles;
    };

    // Generar calles del overlay
    const generarCalles = () => {
        const calles = [];
        const numCalles = 6;
        
        for (let i = 0; i < numCalles; i++) {
            // Calles horizontales
            calles.push(
                <div
                    key={`h-${i}`}
                    className="calle-overlay-rappi horizontal"
                    style={{
                        top: `${(i + 1) * (100 / (numCalles + 1))}%`,
                        opacity: 0.4
                    }}
                />
            );
            
            // Calles verticales
            calles.push(
                <div
                    key={`v-${i}`}
                    className="calle-overlay-rappi vertical"
                    style={{
                        left: `${(i + 1) * (100 / (numCalles + 1))}%`,
                        opacity: 0.4
                    }}
                />
            );
        }
        
        return calles;
    };

    // Obtener mi ubicación
    const obtenerMiUbicacion = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const direccion = await obtenerDireccion(latitude, longitude);
                    
                    setUbicacionMapa({
                        lat: latitude,
                        lng: longitude,
                        direccion: direccion || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                    });
                },
                (error) => {
                    console.error('Error obteniendo ubicación:', error);
                    alert('No se pudo obtener tu ubicación');
                }
            );
        } else {
            alert('Geolocalización no soportada');
        }
    };

    // Manejar drag del mapa
    const handleMapaDrag = (e) => {
        if (isDragging) {
            const deltaX = e.clientX - dragStart.x;
            const deltaY = e.clientY - dragStart.y;
            
            setMapaOffset(prev => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY
            }));
            
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    // Manejar wheel para zoom
    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -1 : 1;
        setZoom(prev => Math.max(1, Math.min(18, prev + delta)));
    };

    // Manejar drag del pin
    const handlePinDrag = async (event) => {
        if (!isDragging) return;
        
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Convertir coordenadas del mapa a lat/lng (simplificado)
        const lat = 4.6097 + (y - rect.height/2) * 0.001;
        const lng = -74.0817 + (x - rect.width/2) * 0.001;
        
        setUbicacionMapa(prev => ({ ...prev, lat, lng }));
        
        // Obtener dirección actualizada
        const nuevaDireccion = await obtenerDireccion(lat, lng);
        if (nuevaDireccion) {
            setUbicacionMapa(prev => ({ ...prev, direccion: nuevaDireccion }));
        }
    };

    // Seleccionar dirección
    const seleccionarDireccion = (id) => {
        setDirecciones(prev => prev.map(d => ({ ...d, activa: d.id === id })));
        const direccionSeleccionada = direcciones.find(d => d.id === id);
        if (direccionSeleccionada) {
            setPedido(prev => ({ ...prev, direccion: direccionSeleccionada.direccion }));
        }
    };

    // Agregar nueva dirección
    const agregarNuevaDireccion = () => {
        if (nuevaDireccion.nombre && nuevaDireccion.direccion) {
            const nueva = {
                id: direcciones.length + 1,
                nombre: nuevaDireccion.nombre,
                direccion: nuevaDireccion.direccion,
                activa: false
            };
            setDirecciones(prev => [...prev, nueva]);
            setNuevaDireccion({ nombre: "", direccion: "", detalles: "" });
            setCurrentStep('main');
        }
    };

    // Aplicar ubicación del mapa
    const aplicarUbicacionMapa = () => {
        setPedido(prev => ({ ...prev, direccion: ubicacionMapa.direccion }));
        setCurrentStep('main');
    };

    // Hacer pedido
    const hacerPedido = async () => {
        try {
            const clienteId = localStorage.getItem('cliente_id') || 1;
            const pedidoData = {
                id_cliente: clienteId,
                productos: pedido.productos,
                direccion_entrega: pedido.direccion || ubicacionMapa.direccion,
                instrucciones: pedido.instrucciones,
                metodo_pago: pedido.metodoPago,
                propina: pedido.propina,
                cupon: pedido.cupon,
                total: total,
                estado: 'preparando',
                fecha_pedido: new Date().toISOString()
            };

            console.log('Enviando pedido:', pedidoData);

            // Enviar pedido al backend
            const response = await fetch('https://rappi-pc-7.onrender.com/backend/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedidoData),
            });

            if (response.ok) {
                const data = await response.json();
                const pedidoId = data.id_pedido || data.id || Math.floor(Math.random() * 1000) + 1;
                
                // Guardar ID del pedido para seguimiento
                localStorage.setItem('pedido_actual', JSON.stringify({
                    id: pedidoId,
                    estado: 'preparando',
                    fecha: new Date().toISOString(),
                    productos: pedido.productos,
                    total: total
                }));

                // Limpiar carrito
                localStorage.removeItem('carrito');
                localStorage.removeItem('datosPago');

                alert('¡Pedido realizado exitosamente!');
                navigate(`/seguimiento/${pedidoId}`);
            } else {
                // Fallback: crear pedido mock
                const pedidoId = Math.floor(Math.random() * 1000) + 1;
                localStorage.setItem('pedido_actual', JSON.stringify({
                    id: pedidoId,
                    estado: 'preparando',
                    fecha: new Date().toISOString(),
                    productos: pedido.productos,
                    total: total
                }));

                localStorage.removeItem('carrito');
                localStorage.removeItem('datosPago');

                alert('¡Pedido realizado exitosamente!');
                navigate(`/seguimiento/${pedidoId}`);
            }
        } catch (error) {
            console.error('Error realizando pedido:', error);
            alert('Error al realizar el pedido. Intenta nuevamente.');
        }
    };

    // Aplicar cupón
    const aplicarCupon = (codigoCupon) => {
        setPedido(prev => ({ ...prev, cupon: codigoCupon }));
        setCurrentStep('main');
    };

    // Validar cupón manual
    const validarCupon = () => {
        const cuponesValidos = ['BIENVENIDO20', 'ENVIOGRATIS', 'COMBO50'];
        if (cuponesValidos.includes(pedido.cupon)) {
            setCurrentStep('main');
        } else {
            alert('Cupón no válido');
        }
    };

    // Renderizar paso de ajustar ubicación
    if (currentStep === 'mapa') {
        return (
            <div className="checkout">
                <div className="header">
                    <button className="btn-back" onClick={() => setCurrentStep('main')}>
                        ←
                    </button>
                    <h1>Ajustar punto de entrega</h1>
                </div>

                <div className="mapa-rappi">
                    {/* Controles del mapa */}
                    <div className="mapa-controles">
                        <button className="btn-mi-ubicacion" onClick={obtenerMiUbicacion}>
                            <span className="icono-ubicacion"></span>
                            Mi ubicación
                        </button>
                        <div className="zoom-controls">
                            <button className="btn-zoom" onClick={() => setZoom(prev => Math.min(prev + 1, 18))}>
                                +
                            </button>
                            <button className="btn-zoom" onClick={() => setZoom(prev => Math.max(prev - 1, 1))}>
                                -
                            </button>
                        </div>
                    </div>

                    {/* Mapa satelital real estilo Rappi */}
                    <div 
                        className="mapa-container"
                        onMouseMove={handleMapaDrag}
                        onMouseUp={() => setIsDragging(false)}
                        onWheel={handleWheel}
                    >
                        <div className="mapa-satelital">
                            {/* Mapa base con OpenStreetMap */}
                            <div 
                                className="mapa-base"
                                style={{
                                    transform: `translate(${mapaOffset.x}px, ${mapaOffset.y}px) scale(${zoom})`,
                                    transformOrigin: 'center center'
                                }}
                            >
                                {/* Generar tiles del mapa satelital */}
                                {Array.from({ length: 9 }, (_, i) => (
                                    <div
                                        key={i}
                                        className="mapa-tile"
                                        style={{
                                            left: `${(i % 3) * 256}px`,
                                            top: `${Math.floor(i / 3) * 256}px`,
                                            backgroundImage: `url(https://tile.openstreetmap.org/${zoom}/${Math.floor(ubicacionMapa.lat * 1000000) % 1000000}/${Math.floor(ubicacionMapa.lng * 1000000) % 1000000}.png)`,
                                            backgroundSize: 'cover'
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Pin de ubicación */}
                            <div 
                                className={`pin-ubicacion ${isDragging ? 'dragging' : ''}`}
                                style={{
                                    left: `${50 + mapaOffset.x}px`,
                                    top: `${50 + mapaOffset.y}px`,
                                    transform: 'translate(-50%, -100%)'
                                }}
                                onMouseDown={(e) => {
                                    setIsDragging(true);
                                    setDragStart({ x: e.clientX, y: e.clientY });
                                }}
                            >
                                <div className="pin-icon-rappi"></div>
                                <div className="pin-sombra"></div>
                            </div>

                            {/* Indicador de carga */}
                            {cargandoCoordenadas && (
                                <div className="cargando-coordenadas">
                                    <div className="spinner"></div>
                                    <span>Obteniendo dirección...</span>
                                </div>
                            )}

                            {/* Overlay de calles */}
                            <div className="calles-overlay">
                                {Array.from({ length: 6 }, (_, i) => (
                                    <div
                                        key={`h-${i}`}
                                        className="calle-overlay horizontal"
                                        style={{
                                            top: `${(i + 1) * (100 / 7)}%`,
                                            opacity: 0.4
                                        }}
                                    />
                                ))}
                                {Array.from({ length: 6 }, (_, i) => (
                                    <div
                                        key={`v-${i}`}
                                        className="calle-overlay vertical"
                                        style={{
                                            left: `${(i + 1) * (100 / 7)}%`,
                                            opacity: 0.4
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Información de la ubicación */}
                    <div className="ubicacion-info">
                        <div className="ubicacion-direccion">
                            <span className="icono-pin-small"></span>
                            <span className="texto">{ubicacionMapa.direccion}</span>
                        </div>
                        <div className="ubicacion-coordenadas">
                            Lat: {ubicacionMapa.lat.toFixed(6)}, Lng: {ubicacionMapa.lng.toFixed(6)}
                        </div>
                    </div>

                    {/* Botón de confirmar */}
                    <div className="mapa-acciones">
                        <button 
                            className="btn-confirmar-ubicacion"
                            onClick={aplicarUbicacionMapa}
                        >
                            Confirmar ubicación
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Renderizar paso de seleccionar dirección
    if (currentStep === 'direccion') {
        return (
            <div className="checkout">
                <div className="header">
                    <button className="btn-back" onClick={() => setCurrentStep('main')}>
                        ←
                    </button>
                    <h1>Seleccionar dirección</h1>
                </div>

                <div className="direcciones-container">
                    {direcciones.map(direccion => (
                        <div 
                            key={direccion.id} 
                            className={`direccion-item ${direccion.activa ? 'activa' : ''}`}
                            onClick={() => seleccionarDireccion(direccion.id)}
                        >
                            <div className="direccion-icono">
                                {direccion.nombre === 'Casa' ? <span className="icono-casa"></span> : 
                                 direccion.nombre === 'Universidad' ? <span className="icono-universidad"></span> : 
                                 <span className="icono-trabajo"></span>}
                            </div>
                            <div className="direccion-info">
                                <h3>{direccion.nombre}</h3>
                                <p>{direccion.direccion}</p>
                            </div>
                            <div className="direccion-check">
                                {direccion.activa && <span className="icono-check"></span>}
                            </div>
                        </div>
                    ))}

                    <button 
                        className="btn-agregar-direccion"
                        onClick={() => setCurrentStep('nueva-direccion')}
                    >
                        <span className="icono-mas"></span>
                        Agregar nueva dirección
                    </button>
                </div>
            </div>
        );
    }

    // Renderizar paso de nueva dirección
    if (currentStep === 'nueva-direccion') {
        return (
            <div className="checkout">
                <div className="header">
                    <button className="btn-back" onClick={() => setCurrentStep('direccion')}>
                        ←
                    </button>
                    <h1>Nueva dirección</h1>
                </div>

                <div className="nueva-direccion-container">
                    <div className="form-group">
                        <label>Nombre de la dirección</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Casa, Trabajo, Universidad"
                            value={nuevaDireccion.nombre}
                            onChange={(e) => setNuevaDireccion(prev => ({ ...prev, nombre: e.target.value }))}
                        />
                    </div>

                    <div className="form-group">
                        <label>Dirección completa</label>
                        <input 
                            type="text" 
                            placeholder="Calle, número, barrio, ciudad"
                            value={nuevaDireccion.direccion}
                            onChange={(e) => setNuevaDireccion(prev => ({ ...prev, direccion: e.target.value }))}
                        />
                    </div>

                    <div className="form-group">
                        <label>Detalles adicionales (opcional)</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Apartamento 201, portón azul"
                            value={nuevaDireccion.detalles}
                            onChange={(e) => setNuevaDireccion(prev => ({ ...prev, detalles: e.target.value }))}
                        />
                    </div>

                    <button 
                        className="btn-guardar-direccion"
                        onClick={agregarNuevaDireccion}
                        disabled={!nuevaDireccion.nombre || !nuevaDireccion.direccion}
                    >
                        Guardar dirección
                    </button>
                </div>
            </div>
        );
    }

    // Renderizar paso de detalles
    if (currentStep === 'detalles') {
        return (
            <div className="checkout">
                <div className="header">
                    <button className="btn-back" onClick={() => setCurrentStep('main')}>
                        ←
                    </button>
                    <h1>Detalles del pedido</h1>
                </div>

                <div className="detalles-container">
                    <div className="productos-lista">
                        {pedido.productos.map(producto => (
                            <div key={producto.id} className="producto-item-rappi">
                                <div className="producto-imagen-rappi">
                                    <div className="imagen-producto-rappi">
                                        <img 
                                            src={producto.imagen} 
                                            alt={producto.nombre}
                                            className="producto-imagen-real"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="producto-icono-fallback" style={{display: 'none'}}>
                                            <span className="icono-restaurante"></span>
                                        </div>
                                </div>
                                </div>
                                <div className="producto-info-rappi">
                                    <div className="producto-header-rappi">
                                        <h4 className="producto-nombre-rappi">{producto.detalles_producto || producto.nombre}</h4>
                                        <div className="producto-precio-rappi">${((producto.precio_producto || producto.precio) * producto.cantidad).toLocaleString()}</div>
                                    </div>
                                    <div className="producto-details-rappi">
                                        <span className="producto-descripcion-rappi">{producto.descripcion || producto.detalles_producto}</span>
                                        <div className="producto-cantidad-rappi">
                                            <span className="cantidad-label">Cantidad:</span>
                                            <span className="cantidad-value">{producto.cantidad}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="resumen-totales-detalle">
                        <div className="total-item-detalle">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        {descuento > 0 && (
                            <div className="total-item-detalle descuento">
                                <span>Descuento (Sin prisas)</span>
                                <span>-${descuento.toLocaleString()}</span>
                            </div>
                        )}
                        {costoEntregaRapida > 0 && (
                            <div className="total-item-detalle">
                                <span>Entrega rápida</span>
                                <span>+${costoEntregaRapida.toLocaleString()}</span>
                            </div>
                        )}
                        {descuentoCupon > 0 && (
                            <div className="total-item-detalle descuento">
                                <span>Descuento ({pedido.cupon})</span>
                                <span>-${descuentoCupon.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="total-item-detalle">
                            <span>Propina</span>
                            <span>${propina.toLocaleString()}</span>
                        </div>
                        <div className="total-item-detalle total-final">
                            <span>Total</span>
                            <span>${total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Renderizar paso de instrucciones
    if (currentStep === 'instrucciones') {
        return (
            <div className="checkout">
                <div className="header">
                    <button className="btn-back" onClick={() => setCurrentStep('main')}>
                        ←
                    </button>
                    <h1>Instrucciones de entrega</h1>
                </div>

                <div className="instrucciones-container">
                    <div className="instrucciones-opciones">
                        <button 
                            className={`instruccion-btn ${pedido.instrucciones === "Yo recibo el pedido en mi puerta" ? 'activa' : ''}`}
                            onClick={() => setPedido(prev => ({ ...prev, instrucciones: "Yo recibo el pedido en mi puerta" }))}
                        >
                            <span className="icono-puerta"></span>
                            <span>Yo recibo el pedido en mi puerta</span>
                        </button>

                        <button 
                            className={`instruccion-btn ${pedido.instrucciones === "Dejar en portería" ? 'activa' : ''}`}
                            onClick={() => setPedido(prev => ({ ...prev, instrucciones: "Dejar en portería" }))}
                        >
                            <span className="icono-porteria"></span>
                            <span>Dejar en portería</span>
                        </button>

                        <button 
                            className={`instruccion-btn ${pedido.instrucciones === "Llamar al llegar" ? 'activa' : ''}`}
                            onClick={() => setPedido(prev => ({ ...prev, instrucciones: "Llamar al llegar" }))}
                        >
                            <span className="icono-llamar"></span>
                            <span>Llamar al llegar</span>
                        </button>

                        <button 
                            className={`instruccion-btn ${pedido.instrucciones === "Entregar a conserje" ? 'activa' : ''}`}
                            onClick={() => setPedido(prev => ({ ...prev, instrucciones: "Entregar a conserje" }))}
                        >
                            <span className="icono-conserje"></span>
                            <span>Entregar a conserje</span>
                        </button>
                    </div>

                    <div className="instrucciones-personalizadas">
                        <label>Instrucciones adicionales (opcional)</label>
                        <textarea 
                            placeholder="Ej: Apartamento 201, portón azul, timbre 2"
                            rows="3"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Renderizar paso de regalo
    if (currentStep === 'regalo') {
        return (
            <div className="checkout">
                <div className="header">
                    <button className="btn-back" onClick={() => setCurrentStep('main')}>
                        ←
                    </button>
                    <h1>Enviar como regalo</h1>
                </div>

                <div className="regalo-container">
                    <div className="regalo-toggle">
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={pedido.esRegalo}
                                onChange={(e) => setPedido(prev => ({ ...prev, esRegalo: e.target.checked }))}
                            />
                            <span className="slider"></span>
                        </label>
                        <span>Enviar como regalo</span>
                    </div>

                    {pedido.esRegalo && (
                        <div className="regalo-opciones">
                            <div className="form-group">
                                <label>Mensaje para el destinatario</label>
                                <textarea 
                                    placeholder="¡Feliz cumpleaños! Espero que disfrutes este delicioso pedido 🎉"
                                    value={pedido.mensajeRegalo}
                                    onChange={(e) => setPedido(prev => ({ ...prev, mensajeRegalo: e.target.value }))}
                                    rows="4"
                                />
                            </div>

                            <div className="regalo-preview">
                                <div className="tarjeta-regalo">
                                    <div className="tarjeta-header">
                                        <span className="icono-regalo"></span>
                                        <h3>¡Es un regalo!</h3>
                                    </div>
                                    <div className="tarjeta-mensaje">
                                        {pedido.mensajeRegalo || "Mensaje personalizado aquí"}
                                    </div>
                                    <div className="tarjeta-footer">
                                        <span>De: Tu amigo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Renderizar paso de cupones
    if (currentStep === 'cupones') {
        return (
            <div className="checkout">
                <div className="header">
                    <button className="btn-back" onClick={() => setCurrentStep('main')}>
                        ←
                    </button>
                    <h1>Cupones y promociones</h1>
                </div>

                <div className="cupones-container">
                    <div className="cupones-disponibles">
                        <h3>Cupones disponibles</h3>
                        
                        <div className="cupon-item">
                            <div className="cupon-info">
                                <h4>BIENVENIDO20</h4>
                                <p>20% de descuento en tu primera compra</p>
                                <span className="cupon-validez">Válido hasta: 31/12/2024</span>
                            </div>
                            <button 
                                className="btn-aplicar-cupon"
                                onClick={() => aplicarCupon('BIENVENIDO20')}
                            >
                                Aplicar
                            </button>
                        </div>

                        <div className="cupon-item">
                            <div className="cupon-info">
                                <h4>ENVIOGRATIS</h4>
                                <p>Envio gratis en pedidos mayores a $30.000</p>
                                <span className="cupon-validez">Válido hasta: 15/01/2025</span>
                            </div>
                            <button 
                                className="btn-aplicar-cupon"
                                onClick={() => aplicarCupon('ENVIOGRATIS')}
                            >
                                Aplicar
                            </button>
                        </div>

                        <div className="cupon-item">
                            <div className="cupon-info">
                                <h4>COMBO50</h4>
                                <p>50% de descuento en combos</p>
                                <span className="cupon-validez">Válido hasta: 20/01/2025</span>
                            </div>
                            <button 
                                className="btn-aplicar-cupon"
                                onClick={() => aplicarCupon('COMBO50')}
                            >
                                Aplicar
                            </button>
                        </div>
                    </div>

                    <div className="cupon-manual">
                        <h3>¿Tienes un código?</h3>
                        <div className="input-cupon">
                            <input 
                                type="text" 
                                placeholder="Ingresa tu código de cupón"
                                value={pedido.cupon}
                                onChange={(e) => setPedido(prev => ({ ...prev, cupon: e.target.value }))}
                            />
                            <button 
                                className="btn-validar-cupon"
                                onClick={validarCupon}
                            >
                                Validar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Renderizar paso de propina personalizada
    if (currentStep === 'propina-personalizada') {
        return (
            <div className="checkout">
                <div className="header">
                    <button className="btn-back" onClick={() => setCurrentStep('main')}>
                        ←
                    </button>
                    <h1>Propina personalizada</h1>
                </div>

                <div className="propina-personalizada-container">
                    <div className="form-group">
                        <label>Ingresa el monto de la propina</label>
                        <input 
                            type="number" 
                            placeholder="Ej: 5000"
                            value={pedido.propina || ''}
                            onChange={(e) => setPedido(prev => ({ ...prev, propina: parseInt(e.target.value) || 0 }))}
                        />
                    </div>

                    <div className="propina-sugerencias">
                        <h3>Sugerencias:</h3>
                        <div className="sugerencias-grid">
                            <button 
                                className="sugerencia-btn-rappi"
                                onClick={() => setPedido(prev => ({ ...prev, propina: 2000 }))}
                            >
                                $2.000
                            </button>
                            <button 
                                className="sugerencia-btn-rappi"
                                onClick={() => setPedido(prev => ({ ...prev, propina: 5000 }))}
                            >
                                $5.000
                            </button>
                            <button 
                                className="sugerencia-btn-rappi"
                                onClick={() => setPedido(prev => ({ ...prev, propina: 10000 }))}
                            >
                                $10.000
                            </button>
                        </div>
                    </div>

                    <button 
                        className="btn-aplicar-propina-rappi"
                        onClick={() => setCurrentStep('main')}
                    >
                        Aplicar propina
                    </button>
                </div>
            </div>
        );
    }

    // Si no hay productos, mostrar mensaje
    if (pedido.productos.length === 0) {
        return (
            <div className="checkout">
                <div className="header">
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        ←
                    </button>
                    <h1>Terminar y pagar</h1>
                </div>
                <div className="carrito-vacio-checkout">
                    <div className="mensaje-vacio">
                        <h2>Tu carrito está vacío</h2>
                        <p>Agrega algunos productos deliciosos antes de continuar</p>
                        <button 
                            className="btn-volver-carrito"
                            onClick={() => navigate('/home')}
                        >
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Renderizar vista principal
    return (
        <div className="checkout">
            <div className="header">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    ←
                </button>
                <h1>Terminar y pagar</h1>
            </div>

            <div className="checkout-content">

                {/* Sección del mapa */}
                <div className="mapa-section">
                    <div className="mapa-container-rappi">
                        <div className="mapa-satelital-rappi">
                            {/* Mapa base con Google Maps Satelital */}
                            <div 
                                className="mapa-base-rappi"
                                style={{
                                    transform: `translate(${mapaOffset.x}px, ${mapaOffset.y}px) scale(${zoom})`,
                                    transformOrigin: 'center center'
                                }}
                            >
                                {/* Tiles del mapa satelital de Google */}
                                {generarTilesMapa()}
                            </div>

                            {/* Pin de ubicación */}
                            <div 
                                className={`pin-ubicacion-rappi ${isDragging ? 'dragging' : ''}`}
                                style={{
                                    left: `${50 + mapaOffset.x}px`,
                                    top: `${50 + mapaOffset.y}px`,
                                    transform: 'translate(-50%, -100%)'
                                }}
                                onMouseDown={(e) => {
                                    setIsDragging(true);
                                    setDragStart({ x: e.clientX, y: e.clientY });
                                }}
                            >
                                <div className="pin-icon-rappi"></div>
                                <div className="pin-sombra-rappi"></div>
                            </div>

                            {/* Overlay de calles */}
                            <div className="calles-overlay-rappi">
                                {generarCalles()}
                            </div>
                        </div>

                        {/* Información de la ubicación */}
                        <div className="ubicacion-info-rappi">
                            <button 
                                className="btn-ajustar-punto-rappi"
                                onClick={() => setCurrentStep('mapa')}
                            >
                                <span className="icono-pin-small"></span>
                                Ajustar punto de entrega
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sección de detalles de entrega */}
                <div className="detalles-entrega-section">
                    <div className="detalle-item" onClick={() => setCurrentStep('direccion')}>
                        <div className="detalle-icono">
                            <span className="icono-ubicacion-small"></span>
                        </div>
                        <div className="detalle-info">
                            <span className="detalle-titulo">{direcciones.find(d => d.activa)?.nombre || 'Casa'}</span>
                            <span className="detalle-descripcion">{pedido.direccion || ubicacionMapa.direccion}</span>
                        </div>
                        <div className="detalle-arrow">
                            <span className="icono-flecha"></span>
                        </div>
                    </div>

                    <div className="detalle-item" onClick={() => setCurrentStep('detalles')}>
                        <div className="detalle-icono">
                            <span className="icono-detalles"></span>
                        </div>
                        <div className="detalle-info">
                            <span className="detalle-titulo">Detalles</span>
                            <span className="detalle-descripcion">{pedido.productos.length} Producto{pedido.productos.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="detalle-arrow">
                            <span className="icono-flecha"></span>
                        </div>
                    </div>

                    <div className="detalle-item" onClick={() => setCurrentStep('instrucciones')}>
                        <div className="detalle-icono">
                            <span className="icono-instrucciones"></span>
                        </div>
                        <div className="detalle-info">
                            <span className="detalle-titulo">{pedido.instrucciones}</span>
                            <span className="detalle-descripcion">Agregar instrucciones</span>
                        </div>
                        <div className="detalle-arrow">
                            <span className="icono-flecha"></span>
                        </div>
                    </div>
                </div>

                {/* Sección de entrega estimada */}
                <div className="entrega-estimada-section">
                    <div className="seccion-titulo">
                        <span>Entrega estimada</span>
                        <span className="info-icon">ⓘ</span>
                    </div>
                    
                    <div className="opciones-entrega">
                        <div className={`opcion-entrega ${pedido.entregaEstimada === 'rapida' ? 'seleccionada' : ''}`}>
                            <div className="radio-btn">
                                <input 
                                    type="radio" 
                                    name="entrega" 
                                    value="rapida"
                                    checked={pedido.entregaEstimada === 'rapida'}
                                    onChange={() => setPedido(prev => ({ ...prev, entregaEstimada: 'rapida' }))}
                                />
                            </div>
                            <div className="opcion-info">
                                <div className="opcion-titulo">
                                    <span className="icono-rapido"></span>
                                    <span>Más rápido</span>
                                </div>
                                <div className="opcion-tiempo">24 - 44 min</div>
                            </div>
                            <div className="opcion-precio">+$5,500</div>
                        </div>

                        <div className={`opcion-entrega ${pedido.entregaEstimada === 'normal' ? 'seleccionada' : ''}`}>
                            <div className="radio-btn">
                                <input 
                                    type="radio" 
                                    name="entrega" 
                                    value="normal"
                                    checked={pedido.entregaEstimada === 'normal'}
                                    onChange={() => setPedido(prev => ({ ...prev, entregaEstimada: 'normal' }))}
                                />
                            </div>
                            <div className="opcion-info">
                                <div className="opcion-titulo">
                                    <span className="icono-estandar"></span>
                                    <span>Estándar</span>
                                </div>
                                <div className="opcion-tiempo">38 - 58 min</div>
                            </div>
                            <div className="opcion-precio">$0</div>
                        </div>

                        <div className={`opcion-entrega ${pedido.entregaEstimada === 'sinPrisas' ? 'seleccionada' : ''}`}>
                            <div className="radio-btn">
                                <input 
                                    type="radio" 
                                    name="entrega" 
                                    value="sinPrisas"
                                    checked={pedido.entregaEstimada === 'sinPrisas'}
                                    onChange={() => setPedido(prev => ({ ...prev, entregaEstimada: 'sinPrisas' }))}
                                />
                            </div>
                            <div className="opcion-info">
                                <div className="opcion-titulo">
                                    <span className="icono-ahorro"></span>
                                    <span>Ahorra sin prisas</span>
                                </div>
                                <div className="opcion-tiempo">53 - 73 min</div>
                            </div>
                            <div className="opcion-precio ahorro">Ahorra $2,900</div>
                        </div>
                    </div>
                </div>

                {/* Sección de método de pago */}
                <div className="metodo-pago-section">
                    <div className="seccion-titulo">Método de pago</div>
                    <div className="metodo-pago-item" onClick={() => navigate('/metodos-pago')}>
                        <div className="metodo-icono">
                            <span className="icono-tarjeta"></span>
                        </div>
                        <div className="metodo-info">
                            <span className="metodo-titulo">Método de pago</span>
                            <span className="metodo-descripcion">{pedido.metodoPago || 'Selecciona un método de pago'}</span>
                        </div>
                        <div className="metodo-boton">
                            <span className="obligatorio">Obligatorio</span>
                            <span className="icono-flecha"></span>
                        </div>
                    </div>
                </div>

                {/* Sección de cupones */}
                <div className="cupones-section">
                    <div className="seccion-titulo">Cupones</div>
                    <div className="cupones-item" onClick={() => setCurrentStep('cupones')}>
                        <div className="cupones-info">
                            <span className="cupones-titulo">
                                {pedido.cupon ? `Cupón aplicado: ${pedido.cupon}` : 'Cupones'}
                            </span>
                            {pedido.cupon && (
                                <span className="cupones-descripcion">
                                    {pedido.cupon === 'BIENVENIDO20' ? '20% de descuento' :
                                     pedido.cupon === 'ENVIOGRATIS' ? 'Envío gratis' :
                                     pedido.cupon === 'COMBO50' ? '50% de descuento' : 'Descuento aplicado'}
                                </span>
                            )}
                        </div>
                        <span className="icono-flecha"></span>
                    </div>
                </div>

                {/* Resumen del pedido */}
                <div className="resumen-pedido-section">
                    <div className="seccion-titulo">Resumen del pedido</div>
                    
                    <div className="restaurante-info" onClick={() => setCurrentStep('detalles')}>
                        <div className="restaurante-avatar">
                            <img 
                                src="https://images.rappi.com/restaurants/mr-king-pollo-logo.png" 
                                alt="Mr. King Pollo"
                                className="restaurante-logo"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="restaurante-icono-fallback" style={{display: 'none'}}>
                                <span className="icono-restaurante"></span>
                            </div>
                        </div>
                        <div className="restaurante-details">
                            <span className="restaurante-nombre">{pedido.productos[0]?.nombre_restaurante || pedido.productos[0]?.restaurante || 'Restaurante'}</span>
                            <span className="restaurante-productos">{pedido.productos.length} Producto{pedido.productos.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="restaurante-arrow">
                            <span className="icono-flecha-abajo"></span>
                        </div>
                    </div>

                    <div className="regalo-option" onClick={() => setCurrentStep('regalo')}>
                        <span className="regalo-titulo">Enviar como regalo</span>
                        <span className="icono-flecha"></span>
                    </div>
                </div>

                {/* Sección de propina */}
                <div className="propina-section">
                    <div className="propina-header">
                        <div className="propina-info">
                            <div className="propina-titulo">Propina para tu Rappi</div>
                            <div className="propina-descripcion">Propina voluntaria, el valor sugerido puede ser modificado</div>
                        </div>
                        <div className="repartidor-avatar">
                            <div className="avatar">
                                <img 
                                    src="https://images.rappi.com/delivery-person/rappi-delivery-avatar.png" 
                                    alt="Repartidor Rappi"
                                    className="repartidor-imagen"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="repartidor-icono-fallback" style={{display: 'none'}}>
                                    <span className="icono-repartidor"></span>
                                </div>
                            </div>
                            <div className="corazones">
                                <span className="icono-corazon"></span>
                                <span className="icono-corazon"></span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="opciones-propina">
                        <button 
                            className={`propina-btn ${pedido.propina === Math.round(subtotal * 0.05) ? 'seleccionada' : ''}`}
                            onClick={() => setPedido(prev => ({ ...prev, propina: Math.round(subtotal * 0.05) }))}
                        >
                            5% $900
                        </button>
                        <button 
                            className={`propina-btn ${pedido.propina === Math.round(subtotal * 0.07) ? 'seleccionada' : ''}`}
                            onClick={() => setPedido(prev => ({ ...prev, propina: Math.round(subtotal * 0.07) }))}
                        >
                            7% $1.300
                        </button>
                        <button 
                            className={`propina-btn ${pedido.propina === Math.round(subtotal * 0.08) ? 'seleccionada' : ''}`}
                            onClick={() => setPedido(prev => ({ ...prev, propina: Math.round(subtotal * 0.08) }))}
                        >
                            8% $1.500
                        </button>
                        <button 
                            className={`propina-btn ${pedido.propina > 0 && pedido.propina !== Math.round(subtotal * 0.05) && pedido.propina !== Math.round(subtotal * 0.07) && pedido.propina !== Math.round(subtotal * 0.08) ? 'seleccionada' : ''}`}
                            onClick={() => setCurrentStep('propina-personalizada')}
                        >
                            Otro <span className="icono-lapiz"></span>
                        </button>
                    </div>
                </div>

                {/* Desglose de costos */}
                <div className="desglose-costos">
                    <div className="costo-item">
                        <span>Costo de productos</span>
                        <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="costo-item">
                        <span>Costo de envío</span>
                        <span>${costoEnvio.toLocaleString()}</span>
                    </div>
                    <div className="costo-item">
                        <span>Tarifa de Servicio</span>
                        <span>${tarifaServicio.toLocaleString()}</span>
                    </div>
                    {descuento > 0 && (
                        <div className="costo-item descuento">
                            <span>Descuento (Sin prisas)</span>
                            <span>-${descuento.toLocaleString()}</span>
                        </div>
                    )}
                    {descuentoCupon > 0 && (
                        <div className="costo-item descuento">
                            <span>Descuento ({pedido.cupon})</span>
                            <span>-${descuentoCupon.toLocaleString()}</span>
                        </div>
                    )}
                    {costoEntregaRapida > 0 && (
                        <div className="costo-item">
                            <span>Entrega rápida</span>
                            <span>+${costoEntregaRapida.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="costo-item">
                        <span>Propina</span>
                        <span>${propina.toLocaleString()}</span>
                    </div>
                    <div className="costo-item total-final">
                        <span>Total a pagar</span>
                        <span>${total.toLocaleString()}</span>
                    </div>
                </div>

                {/* Botón de hacer pedido */}
                <div className="bottom-bar">
                    <div className="total-info">
                        <span className="total-label">Total a pagar</span>
                        <span className="total-amount">${total.toLocaleString()}</span>
                    </div>
                    <button 
                        className="btn-hacer-pedido"
                        onClick={() => navigate('/metodos-pago')}
                    >
                        Ir a pagar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;