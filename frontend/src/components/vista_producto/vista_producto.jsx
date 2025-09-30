import { useState, useEffect } from 'react';
import './vista_producto.css';

const Producto = ({ isOpen, onClose, idProducto, onAddToCart }) => {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    if (isOpen && idProducto) {
      fetchProducto();
    }
  }, [isOpen, idProducto]);

  const fetchProducto = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://rappi-pc-7.onrender.com/backend/productos/id/${idProducto}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar el producto');
      }
      
      const data = await response.json();
      setProducto(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching producto:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAumentarCantidad = () => {
    setCantidad(cantidad + 1);
  };

  const handleDisminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const handleAgregarCarrito = () => {
    if (producto) {
    const productoConCantidad = {
      ...producto,
      cantidad: cantidad
    };

    const event = new CustomEvent('agregarAlCarrito', {
      detail: productoConCantidad
    });
    window.dispatchEvent(event);
  }
  };

  const handleAgregarYPagar = () => {
    handleAgregarCarrito();
    // redirigir al pago xd
    console.log('Redirigiendo a página de pago');
  };

  const handleSeguirComprando = () => {
    handleAgregarCarrito();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {loading && (
          <div className="modal-loading">
            <p>Cargando producto...</p>
          </div>
        )}

        {error && (
          <div className="modal-error">
            <p>Error: {error}</p>
            <button className="modal-close-btn" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}

        {producto && !loading && (
          <>
            <div className="modal-header">
              <strong className="modal-title">{producto.detalles_producto}</strong>
            </div>

            <div className="modal-body">
              <div className="producto-imagen-container">
                <img 
                  src={producto.fotografia_producto} 
                  alt={producto.detalles_producto}
                  className="producto-imagen"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300/ffffff/666666?text=Imagen+No+Disponible';
                  }}
                />
              </div>

              <div className="producto-detalles">
                <div className="precio-container">
                  <strong className="producto-precio">
                    ${(producto.precio_producto * cantidad).toLocaleString('es-CO')}
                  </strong>
                  <span className="precio-unitario">
                    ${producto.precio_producto.toLocaleString('es-CO')} c/u
                  </span>
                </div>

                <div className="cantidad-container">
                  <div className="cantidad-controls">
                    <label className="cantidad-label">Cantidad:</label>
                    <button 
                      className="cantidad-btn" 
                      onClick={handleDisminuirCantidad}
                      disabled={cantidad <= 1}
                    >
                      -
                    </button>
                    <span className="cantidad-value">{cantidad}</span>
                    <button 
                      className="cantidad-btn" 
                      onClick={handleAumentarCantidad}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    className="btn-agregar-seguir"
                    onClick={handleSeguirComprando}
                  >
                    Agregar y Seguir Comprando
                  </button>
                  
                  <button 
                    className="btn-agregar-pagar"
                    onClick={handleAgregarYPagar}
                  >
                    Agregar e Ir a Pagar ${(producto.precio_producto * cantidad).toLocaleString('es-CO')}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Producto;