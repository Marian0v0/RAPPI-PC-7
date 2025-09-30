import { useState, useEffect } from 'react';
import './carrito.css';

const Carrito = () => {
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [carrito, setCarrito] = useState([]);

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

  const calcularTotal = () => {
    return carrito.reduce((total, item) => {
      return total + (item.precio_producto * item.cantidad);
    }, 0);
  };

  const handleIrAPagar = () => {
    const datosPago = {
      productos: carrito,
      total: calcularTotal(),
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('datosPago', JSON.stringify(datosPago));
    
    // Redirigir a la página de pago (cambiar cuando metan esto a la ruta que sea xd)
    window.location.href = '/pago';
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

                  <div className="carrito-footer">
                    <div className="carrito-total">
                      <span>Total:</span>
                      <strong>${calcularTotal().toLocaleString('es-CO')}</strong>
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