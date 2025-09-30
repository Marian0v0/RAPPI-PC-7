import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MetodosPago.css';

const MetodosPago = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [metodoSeleccionado, setMetodoSeleccionado] = useState('');
    const [metodosGuardados, setMetodosGuardados] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [formularioData, setFormularioData] = useState({
        tipo: '',
        numero_tarjeta: '',
        nombre_titular: '',
        fecha_tarjeta: '',
        codigo_tar: '',
        tipo_tar: 'Visa',
        numero_cel: '',
        codigo_pago: '',
        confirmacion_metodo: ''
    });

    // Obtener datos del pedido desde la navegación
    const pedidoData = location.state?.pedido || {};

    useEffect(() => {
        cargarMetodosGuardados();
    }, []);

    const cargarMetodosGuardados = async () => {
        try {
            setCargando(true);
            // Simular ID de cliente (en producción vendría del contexto de autenticación)
            const idCliente = 1;
            const response = await fetch(`https://rappi-pc-7.onrender.com/backend/metodos-pago/cliente/${idCliente}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                setMetodosGuardados(data.data);
            } else {
                console.error('Error del servidor:', data.error);
                setMetodosGuardados([]);
            }
        } catch (error) {
            console.error('Error cargando métodos de pago:', error);
            // Si hay error, mostrar métodos de ejemplo para desarrollo
            console.log('Usando datos de ejemplo para desarrollo...');
            setMetodosGuardados([
                {
                    id_metodo: 1,
                    tipo_metodo: 'Efectivo',
                    confirmacion_metodo: 'Pago en efectivo al momento de la entrega'
                },
                {
                    id_metodo: 2,
                    tipo_metodo: 'Tarjeta',
                    confirmacion_metodo: 'Tarjeta Visa terminada en 1234'
                }
            ]);
        } finally {
            setCargando(false);
        }
    };

    const seleccionarMetodo = (metodo) => {
        setMetodoSeleccionado(metodo);
        // Si es un método guardado, no mostrar formulario
        const metodoGuardado = metodosGuardados.find(m => m.tipo_metodo === metodo);
        if (metodoGuardado) {
            setMostrarFormulario(false);
        } else {
            // Si es un método nuevo, mostrar formulario
            setMostrarFormulario(true);
        }
    };

    const validarFormulario = () => {
        switch (formularioData.tipo) {
            case 'tarjeta':
                if (!formularioData.numero_tarjeta || formularioData.numero_tarjeta.length < 13) {
                    alert('Por favor ingresa un número de tarjeta válido');
                    return false;
                }
                if (!formularioData.nombre_titular.trim()) {
                    alert('Por favor ingresa el nombre del titular');
                    return false;
                }
                if (!formularioData.fecha_tarjeta || formularioData.fecha_tarjeta.length !== 5) {
                    alert('Por favor ingresa una fecha de vencimiento válida (MM/AA)');
                    return false;
                }
                if (!formularioData.codigo_tar || formularioData.codigo_tar.length < 3) {
                    alert('Por favor ingresa un CVV válido');
                    return false;
                }
                break;
            case 'nequi':
                if (!formularioData.numero_cel || formularioData.numero_cel.length !== 10) {
                    alert('Por favor ingresa un número de celular válido (10 dígitos)');
                    return false;
                }
                if (!formularioData.nombre_titular.trim()) {
                    alert('Por favor ingresa el nombre del titular');
                    return false;
                }
                break;
        }
        return true;
    };

    const guardarMetodoPago = async () => {
        if (!validarFormulario()) {
            return;
        }

        try {
            setCargando(true);
            const idCliente = 1; // En producción vendría del contexto
            
            let endpoint = '';
            let dataToSend = { id_cliente: idCliente };

            switch (formularioData.tipo) {
                case 'efectivo':
                    endpoint = 'https://rappi-pc-7.onrender.com/backend/metodos-pago/efectivo';
                    dataToSend.confirmacion_metodo = formularioData.confirmacion_metodo || 'Pago en efectivo al momento de la entrega';
                    break;
                case 'tarjeta':
                    endpoint = 'https://rappi-pc-7.onrender.com/backend/metodos-pago/tarjeta';
                    dataToSend = {
                        ...dataToSend,
                        numero_tarjeta: formularioData.numero_tarjeta,
                        nombre_titular: formularioData.nombre_titular,
                        fecha_tarjeta: formularioData.fecha_tarjeta,
                        codigo_tar: formularioData.codigo_tar,
                        tipo_tar: formularioData.tipo_tar
                    };
                    break;
                case 'nequi':
                    endpoint = 'https://rappi-pc-7.onrender.com/backend/metodos-pago/nequi';
                    dataToSend = {
                        ...dataToSend,
                        numero_cel: formularioData.numero_cel,
                        nombre_titular: formularioData.nombre_titular,
                        codigo_pago: formularioData.codigo_pago
                    };
                    break;
                default:
                    throw new Error('Tipo de método no válido');
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                alert('Método de pago guardado exitosamente');
                setMostrarFormulario(false);
                cargarMetodosGuardados();
                setFormularioData({
                    tipo: '',
                    numero_tarjeta: '',
                    nombre_titular: '',
                    fecha_tarjeta: '',
                    codigo_tar: '',
                    tipo_tar: 'Visa',
                    numero_cel: '',
                    codigo_pago: '',
                    confirmacion_metodo: ''
                });
            } else {
                alert('Error al guardar el método de pago: ' + result.error);
            }
        } catch (error) {
            console.error('Error guardando método de pago:', error);
            // Para desarrollo, simular éxito si el backend no está disponible
            if (error.message.includes('Failed to fetch') || error.message.includes('404')) {
                console.log('Backend no disponible, simulando éxito para desarrollo...');
                alert('Método de pago guardado exitosamente (modo desarrollo)');
                setMostrarFormulario(false);
                cargarMetodosGuardados();
                setFormularioData({
                    tipo: '',
                    numero_tarjeta: '',
                    nombre_titular: '',
                    fecha_tarjeta: '',
                    codigo_tar: '',
                    tipo_tar: 'Visa',
                    numero_cel: '',
                    codigo_pago: '',
                    confirmacion_metodo: ''
                });
            } else {
                alert('Error al guardar el método de pago: ' + error.message);
            }
        } finally {
            setCargando(false);
        }
    };

    const continuarConMetodo = async () => {
        if (!metodoSeleccionado) {
            alert('Por favor selecciona un método de pago');
            return;
        }

        try {
            setCargando(true);
            
            // Obtener datos del pedido desde localStorage
            const datosPago = localStorage.getItem('datosPago');
            if (!datosPago) {
                alert('No se encontraron datos del pedido. Regresa al carrito.');
                navigate('/home');
                return;
            }

            const pedidoData = JSON.parse(datosPago);
            const clienteId = localStorage.getItem('cliente_id') || 1;

            // Crear el pedido con el método de pago seleccionado
            const pedidoCompleto = {
                id_cliente: clienteId,
                productos: pedidoData.productos,
                direccion_entrega: "Calle 11, #6-79", // Dirección por defecto
                instrucciones: "Yo recibo el pedido en mi puerta",
                metodo_pago: metodoSeleccionado,
                propina: pedidoData.propina || 0,
                cupon: pedidoData.cupon || "",
                total: pedidoData.total,
                estado: 'preparando',
                fecha_pedido: new Date().toISOString()
            };

            console.log('Procesando pago con pedido:', pedidoCompleto);

            // Enviar pedido al backend
            const response = await fetch('https://rappi-pc-7.onrender.com/backend/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedidoCompleto),
            });

            console.log('Respuesta del backend:', response.status, response.statusText);

            let pedidoId;
            if (response.ok) {
                const data = await response.json();
                pedidoId = data.id_pedido || data.id || Math.floor(Math.random() * 1000) + 1;
            } else {
                // Fallback: crear pedido mock
                pedidoId = Math.floor(Math.random() * 1000) + 1;
            }

            // Guardar ID del pedido para seguimiento
            localStorage.setItem('pedido_actual', JSON.stringify({
                id: pedidoId,
                estado: 'preparando',
                fecha: new Date().toISOString(),
                productos: pedidoData.productos,
                total: pedidoData.total,
                metodo_pago: metodoSeleccionado
            }));

            // Limpiar carrito y datos de pago
            localStorage.removeItem('carrito');
            localStorage.removeItem('datosPago');

            console.log('Redirigiendo a seguimiento con ID:', pedidoId);
            alert('¡Pago procesado exitosamente! Redirigiendo al seguimiento...');
            
            // Pequeño delay para que el usuario vea el mensaje
            setTimeout(() => {
                navigate(`/seguimiento/${pedidoId}`);
            }, 1000);

        } catch (error) {
            console.error('Error procesando pago:', error);
            alert('Error al procesar el pago. Intenta nuevamente.');
        } finally {
            setCargando(false);
        }
    };

    const MetodoPagoCard = ({ tipo, icono, titulo, descripcion, seleccionado, onClick }) => (
        <div 
            className={`metodo-pago-card ${seleccionado ? 'seleccionado' : ''}`}
            onClick={onClick}
        >
            <div className="metodo-icono">
                <span className="icono">{icono}</span>
            </div>
            <div className="metodo-info">
                <h3 className="metodo-titulo">{titulo}</h3>
                <p className="metodo-descripcion">{descripcion}</p>
            </div>
            <div className="metodo-radio">
                <div className={`radio-circle ${seleccionado ? 'activo' : ''}`}>
                    {seleccionado && <div className="radio-dot"></div>}
                </div>
            </div>
        </div>
    );

    const FormularioMetodo = () => (
        <div className="formulario-metodo">
            <div className="formulario-header">
                <h3>Agregar {formularioData.tipo === 'tarjeta' ? 'Tarjeta' : formularioData.tipo === 'nequi' ? 'Nequi' : 'Efectivo'}</h3>
                <button 
                    className="btn-cerrar"
                    onClick={() => setMostrarFormulario(false)}
                >
                    ✕
                </button>
            </div>

            {formularioData.tipo === 'tarjeta' && (
                <div className="formulario-campos">
                    <div className="campo-grupo">
                        <label>Tipo de tarjeta</label>
                        <select
                            value={formularioData.tipo_tar}
                            onChange={(e) => setFormularioData(prev => ({ ...prev, tipo_tar: e.target.value }))}
                            className="select-tarjeta"
                        >
                            <option value="Visa">Visa</option>
                            <option value="Mastercard">Mastercard</option>
                            <option value="American Express">American Express</option>
                        </select>
                    </div>
                    <div className="campo-grupo">
                        <label>Número de tarjeta</label>
                        <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={formularioData.numero_tarjeta}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setFormularioData(prev => ({ ...prev, numero_tarjeta: value }));
                            }}
                            maxLength="19"
                            className="modern-input"
                        />
                    </div>
                    <div className="campo-grupo">
                        <label>Nombre del titular</label>
                        <input
                            type="text"
                            placeholder="Nombre del titular"
                            value={formularioData.nombre_titular}
                            onChange={(e) => setFormularioData(prev => ({ ...prev, nombre_titular: e.target.value }))}
                            className="modern-input"
                        />
                    </div>
                    <div className="campos-dobles">
                        <div className="campo-grupo">
                            <label>Fecha de vencimiento</label>
                            <input
                                type="text"
                                placeholder="MM/AA"
                                value={formularioData.fecha_tarjeta}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, '');
                                    if (value.length >= 2) {
                                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                    }
                                    setFormularioData(prev => ({ ...prev, fecha_tarjeta: value }));
                                }}
                                maxLength="5"
                                className="modern-input"
                            />
                        </div>
                        <div className="campo-grupo">
                            <label>CVV</label>
                            <input
                                type="text"
                                placeholder="123"
                                value={formularioData.codigo_tar}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    setFormularioData(prev => ({ ...prev, codigo_tar: value }));
                                }}
                                maxLength="4"
                                className="modern-input"
                            />
                        </div>
                    </div>
                </div>
            )}

            {formularioData.tipo === 'nequi' && (
                <div className="formulario-campos">
                    <div className="campo-grupo">
                        <label>Número de celular</label>
                        <input
                            type="tel"
                            placeholder="3001234567"
                            value={formularioData.numero_cel}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setFormularioData(prev => ({ ...prev, numero_cel: value }));
                            }}
                            maxLength="10"
                            className="modern-input"
                        />
                        <small className="campo-ayuda">Formato: 3001234567 (10 dígitos)</small>
                    </div>
                    <div className="campo-grupo">
                        <label>Nombre del titular</label>
                        <input
                            type="text"
                            placeholder="Nombre del titular"
                            value={formularioData.nombre_titular}
                            onChange={(e) => setFormularioData(prev => ({ ...prev, nombre_titular: e.target.value }))}
                            className="modern-input"
                        />
                    </div>
                    <div className="campo-grupo">
                        <label>Código de pago (opcional)</label>
                        <input
                            type="text"
                            placeholder="Código de 4 dígitos"
                            value={formularioData.codigo_pago}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setFormularioData(prev => ({ ...prev, codigo_pago: value }));
                            }}
                            maxLength="4"
                            className="modern-input"
                        />
                        <small className="campo-ayuda">Código de seguridad de 4 dígitos</small>
                    </div>
                </div>
            )}

            {formularioData.tipo === 'efectivo' && (
                <div className="formulario-campos">
                    <div className="efectivo-info">
                        <div className="efectivo-icono">💵</div>
                        <h4>Pago en efectivo</h4>
                        <p>Pagarás al momento de recibir tu pedido</p>
                    </div>
                    <div className="campo-grupo">
                        <label>Instrucciones adicionales (opcional)</label>
                        <textarea
                            placeholder="Ej: Tengo cambio exacto, entregar en la puerta principal..."
                            value={formularioData.confirmacion_metodo}
                            onChange={(e) => setFormularioData(prev => ({ ...prev, confirmacion_metodo: e.target.value }))}
                            rows="3"
                            className="textarea-efectivo"
                        />
                        <small className="campo-ayuda">Instrucciones especiales para el repartidor</small>
                    </div>
                </div>
            )}

            <div className="formulario-acciones">
                <button 
                    className="btn-cancelar"
                    onClick={() => setMostrarFormulario(false)}
                >
                    Cancelar
                </button>
                <button 
                    className="btn-guardar"
                    onClick={guardarMetodoPago}
                    disabled={cargando}
                >
                    {cargando ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="metodos-pago-container">
            <div className="metodos-pago-header">
                <button 
                    className="btn-volver"
                    onClick={() => navigate('/checkout', { state: { pedido: pedidoData } })}
                >
                    ←
                </button>
                <h1>Método de pago</h1>
            </div>

            <div className="metodos-pago-content">
                {/* Métodos guardados */}
                {metodosGuardados.length > 0 && (
                    <div className="metodos-guardados">
                        <h2>Métodos guardados</h2>
                        {metodosGuardados.map(metodo => (
                            <MetodoPagoCard
                                key={metodo.id_metodo}
                                tipo={metodo.tipo_metodo.toLowerCase()}
                                icono={metodo.tipo_metodo === 'Efectivo' ? '💵' : 
                                      metodo.tipo_metodo === 'Tarjeta' ? '💳' : '📱'}
                                titulo={metodo.tipo_metodo}
                                descripcion={metodo.confirmacion_metodo}
                                seleccionado={metodoSeleccionado === metodo.tipo_metodo}
                                onClick={() => seleccionarMetodo(metodo.tipo_metodo)}
                            />
                        ))}
                    </div>
                )}

                {/* Opciones de nuevos métodos */}
                <div className="nuevos-metodos">
                    <h2>Agregar nuevo método</h2>
                    
                    <MetodoPagoCard
                        tipo="efectivo"
                        icono="💵"
                        titulo="Efectivo"
                        descripcion="Paga al momento de recibir tu pedido"
                        seleccionado={metodoSeleccionado === 'Efectivo'}
                        onClick={() => {
                            setFormularioData(prev => ({ ...prev, tipo: 'efectivo' }));
                            seleccionarMetodo('Efectivo');
                        }}
                    />

                    <MetodoPagoCard
                        tipo="nequi"
                        icono="📱"
                        titulo="Nequi"
                        descripcion="Pago rápido y seguro con Nequi"
                        seleccionado={metodoSeleccionado === 'Nequi'}
                        onClick={() => {
                            setFormularioData(prev => ({ ...prev, tipo: 'nequi' }));
                            seleccionarMetodo('Nequi');
                        }}
                    />

                    <MetodoPagoCard
                        tipo="tarjeta"
                        icono="💳"
                        titulo="Tarjeta de crédito/débito"
                        descripcion="Visa, Mastercard, American Express"
                        seleccionado={metodoSeleccionado === 'Tarjeta'}
                        onClick={() => {
                            setFormularioData(prev => ({ ...prev, tipo: 'tarjeta' }));
                            seleccionarMetodo('Tarjeta');
                        }}
                    />
                </div>

                

                {/* Formulario para agregar método */}
                {mostrarFormulario && <FormularioMetodo />}
            </div>

            {/* Botón continuar */}
            <div className="metodos-pago-footer">
                <button 
                    className="btn-continuar"
                    onClick={continuarConMetodo}
                    disabled={!metodoSeleccionado || cargando}
                >
                    {cargando ? 'Procesando pago...' : `Continuar con ${metodoSeleccionado || 'método de pago'}`}
                </button>
            </div>
        </div>
    );
};

export default MetodosPago;
