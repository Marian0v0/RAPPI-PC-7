import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './carrito.css';

const Carrito = () => {
  const navigate = useNavigate();
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [cupon, setCupon] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [propina, setPropina] = useState(0);
  const [tipoPropina, setTipoPropina] = useState('porcentaje'); // 'porcentaje' o 'fijo'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    const handleAgregarAlCarrito = (event) => {
      const producto = event.detail;
      agregarProductoAlCarrito(producto);
    };

    window.addEventListener('agregarAlCarrito', handleAgregarAlCarrito);

    return () => {
      window.removeEventListener('agregarAlCarrito', handleAgregarAlCarrito);
    };
  }, [carrito]);

  const agregarProductoAlCarrito = (nuevoProducto) => {
    setCarrito(prevCarrito => {
      const productoExistente = prevCarrito.find(item => 
        item.id_producto === nuevoProducto.id_producto
      );

      if (productoExistente) {
        return prevCarrito.map(item =>
          item.id_producto === nuevoProducto.id_producto
            ? { ...item, cantidad: item.cantidad + nuevoProducto.cantidad }
            : item
        );
      } else {
        return [...prevCarrito, nuevoProducto];
      }
    });
  };

  const eliminarProducto = (idProducto) => {
    setCarrito(prevCarrito => 
      prevCarrito.filter(item => item.id_producto !== idProducto)
    );
  };

  const actualizarCantidad = (idProducto, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    setCarrito(prevCarrito =>
      prevCarrito.map(item =>
        item.id_producto === idProducto
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => {
      return total + (item.precio_producto * item.cantidad);
    }, 0);
  };

  const calcularPropina = () => {
    if (tipoPropina === 'porcentaje') {
      return (calcularSubtotal() * propina) / 100;
    }
    return propina;
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const propinaCalculada = calcularPropina();
    return subtotal - descuento + propinaCalculada;
  };

  const aplicarCupon = async () => {
    if (!cupon.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('https://rappi-pc-7.onrender.com/backend/validar-cupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo: cupon }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valido) {
          setDescuento(data.descuento);
          alert(`¡Cupón aplicado! Descuento: $${data.descuento.toLocaleString('es-CO')}`);
        } else {
          alert('Cupón no válido');
        }
      } else {
        alert('Error al validar el cupón');
      }
    } catch (error) {
      console.error('Error validando cupón:', error);
      alert('Error al validar el cupón');
    } finally {
      setLoading(false);
    }
  };

  const handleIrAPagar = () => {
    const datosPago = {
      productos: carrito,
      subtotal: calcularSubtotal(),
      descuento: descuento,
      propina: calcularPropina(),
      total: calcularTotal(),
      cupon: cupon,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('datosPago', JSON.stringify(datosPago));
    navigate('/checkout');
  };

  const toggleCarrito = () => {
    setCarritoAbierto(!carritoAbierto);
  };

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <>
      <div className="carrito-burbuja" onClick={toggleCarrito}>
        <span className="carrito-icono">🛒</span>
        {cantidadTotal > 0 && (
          <span className="carrito-contador">{cantidadTotal}</span>
        )}
      </div>

      {carritoAbierto && (
        <div className="carrito-modal-overlay" onClick={() => setCarritoAbierto(false)}>
          <div className="carrito-modal" onClick={(e) => e.stopPropagation()}>
            <div className="carrito-header">
              <h2>Tu Carrito</h2>
              <button 
                className="carrito-cerrar-btn"
                onClick={() => setCarritoAbierto(false)}
              >
                ×
              </button>
            </div>

            <div className="carrito-content">
              {carrito.length === 0 ? (
                <div className="carrito-vacio">
                  <p>Tu carrito está vacío</p>
                  <span>Agrega algunos productos deliciosos</span>
                </div>
              ) : (
                <>
                  <div className="carrito-items">
                    {carrito.map((item) => (
                      <div key={item.id_producto} className="carrito-item">
                        <div className="item-imagen">
                          <img 
                            src={item.fotografia_producto} 
                            alt={item.detalles_producto}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/60x60/ffffff/666666?text=Imagen';
                            }}
                          />
                        </div>
                        
                        <div className="item-info">
                          <h4 className="item-nombre">{item.detalles_producto}</h4>
                          <p className="item-precio-unitario">
                            ${item.precio_producto.toLocaleString('es-CO')} c/u
                          </p>
                          
                          <div className="item-controls">
                            <div className="cantidad-controls">
                              <button 
                                className="cantidad-btn"
                                onClick={() => actualizarCantidad(item.id_producto, item.cantidad - 1)}
                              >
                                -
                              </button>
                              <span className="cantidad-value">{item.cantidad}</span>
                              <button 
                                className="cantidad-btn"
                                onClick={() => actualizarCantidad(item.id_producto, item.cantidad + 1)}
                              >
                                +
                              </button>
                            </div>
                            
                            <button 
                              className="eliminar-btn"
                              onClick={() => eliminarProducto(item.id_producto)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                        
                        <div className="item-total">
                          <strong>
                            ${(item.precio_producto * item.cantidad).toLocaleString('es-CO')}
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cupón */}
                  <div className="cupon-section">
                    <h4>¿Tienes un cupón?</h4>
                    <div className="cupon-input-group">
                      <input
                        type="text"
                        placeholder="Código del cupón"
                        value={cupon}
                        onChange={(e) => setCupon(e.target.value)}
                        className="cupon-input"
                      />
                      <button 
                        className="btn-aplicar-cupon"
                        onClick={aplicarCupon}
                        disabled={loading || !cupon.trim()}
                      >
                        {loading ? 'Validando...' : 'Aplicar'}
                      </button>
                    </div>
                    {descuento > 0 && (
                      <div className="descuento-aplicado">
                        <span>Descuento aplicado: -${descuento.toLocaleString('es-CO')}</span>
                        <button 
                          className="btn-remover-descuento"
                          onClick={() => {
                            setDescuento(0);
                            setCupon('');
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Propina */}
                  <div className="propina-section">
                    <h4>Propina para el repartidor</h4>
                    <div className="propina-opciones">
                      <div className="propina-tipo">
                        <label>
                          <input
                            type="radio"
                            name="tipoPropina"
                            value="porcentaje"
                            checked={tipoPropina === 'porcentaje'}
                            onChange={(e) => setTipoPropina(e.target.value)}
                          />
                          Porcentaje
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="tipoPropina"
                            value="fijo"
                            checked={tipoPropina === 'fijo'}
                            onChange={(e) => setTipoPropina(e.target.value)}
                          />
                          Monto fijo
                        </label>
                      </div>
                      
                      {tipoPropina === 'porcentaje' ? (
                        <div className="propina-porcentajes">
                          {[10, 15, 20, 25].map((porcentaje) => (
                            <button
                              key={porcentaje}
                              className={`propina-btn ${propina === porcentaje ? 'activo' : ''}`}
                              onClick={() => setPropina(porcentaje)}
                            >
                              {porcentaje}%
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="propina-monto">
                          <input
                            type="number"
                            placeholder="Monto de propina"
                            value={propina || ''}
                            onChange={(e) => setPropina(Number(e.target.value) || 0)}
                            className="propina-input"
                            min="0"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="carrito-footer">
                    <div className="carrito-resumen">
                      <div className="resumen-linea">
                        <span>Subtotal:</span>
                        <span>${calcularSubtotal().toLocaleString('es-CO')}</span>
                      </div>
                      {descuento > 0 && (
                        <div className="resumen-linea descuento">
                          <span>Descuento:</span>
                          <span>-${descuento.toLocaleString('es-CO')}</span>
                        </div>
                      )}
                      {calcularPropina() > 0 && (
                        <div className="resumen-linea">
                          <span>Propina:</span>
                          <span>${calcularPropina().toLocaleString('es-CO')}</span>
                        </div>
                      )}
                      <div className="resumen-linea total">
                        <span>Total:</span>
                        <strong>${calcularTotal().toLocaleString('es-CO')}</strong>
                      </div>
                    </div>
                    
                    <button 
                      className="btn-ir-pagar"
                      onClick={handleIrAPagar}
                    >
                      Ir a Pagar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Carrito;