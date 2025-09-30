/**
 * Vista comercio jsx component
 * @author German Marcillo
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './vista_comercio.css';
import Carrito from '../carrito/carrito';
import Producto from '../vista_producto/vista_producto';

const Comercio = () => {
  const {nombreComercio } = useParams();
  const [comercio, setComercio] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchComercio = async () => {
      try {
        setLoading(true);
        setError(null);
    
        const response = await fetch(`https://rappi-pc-7.onrender.com/backend/comercio/marca/${encodeURIComponent(nombreComercio)}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Comercio "${nombreComercio}" no encontrado`);
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setComercio(data[0]);
        
        if (data[0] && data[0].id_comercio) {
          await fetchProductos(data[0].id_comercio);
        }
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching comercio:', err);
        setLoading(false);
      }
    };

    const fetchProductos = async (idComercio) => {
      try {
        const response = await fetch(`https://rappi-pc-7.onrender.com/backend/productos/comercio/${idComercio}`);
        
        if (!response.ok) {
          throw new Error(`Error cargando productos: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success) {
          setProductos(data.data);
        }
      } catch (err) {
        console.error('Error fetching productos:', err);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    if (nombreComercio) {
      fetchComercio();
    } else {
      setError('No se proporcionó nombre de comercio');
      setLoading(false);
    }
  }, [nombreComercio]);

  const handleProductClick = (producto) => {
    setProductoSeleccionado(producto.id_producto);
    setModalAbierto(true);
  };

  const handleCloseModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
  };

  const handleAddToCart = (productoConCantidad) => {
    const event = new CustomEvent('agregarAlCarrito', { detail: productoConCantidad });
    window.dispatchEvent(event);
  };

  if (loading) {
    return (
      <div className="loading-vc-container">
        <div className="loading-vc-spinner"></div>
        <p>Cargando información del comercio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <p>Nombre buscado: "{nombreComercio}"</p>
        <button onClick={() => window.history.back()} className="back-button">
          Volver atrás
        </button>
      </div>
    );
  }

  if (!comercio) {
    return (
      <div className="not-found-vc-container">
        <h2>Comercio no encontrado</h2>
        <p>No se encontró información para el comercio solicitado.</p>
        <button onClick={() => window.history.back()} className="back-button">
          Volver atrás
        </button>
      </div>
    );
  }

  return (
    <>
      <title>{comercio.nombre_marca}</title>

      <div className="comercio-container">
        <div className="comercio-header">
          <div className="header-content">
            <div className="comercio-encabezado">Comercio {comercio.tipo_comercio}</div>
            <h1 className="comercio-nombre">{comercio.nombre_marca}</h1>
            <p className="comercio-pais">Colombia</p>
            <p className="comercio-tipo">
              {comercio.tipo_comercio} - {comercio.nombre_marca}
            </p>
          </div>
        </div>

        <div className="productos-vc-section">
          <div className="productos-vc-container">
            <h2 className="productos-vc-title">Productos</h2>
            
            {productos.length === 0 ? (
              <div className="no-products">
                <p>No hay productos disponibles en este momento.</p>
              </div>
            ) : (
              <div className="productos-vc-grid">
                {productos.map((producto) => (
                  <div 
                    key={producto.id_producto} 
                    className="producto-vc-card"
                    onClick={() => handleProductClick(producto)}
                  >
                    <div className="producto-vc-image-container">
                      <img 
                        src={producto.fotografia_producto} 
                        alt={producto.detalles_producto}
                        className="producto-vc-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200/ffffff/666666?text=Imagen+No+Disponible';
                        }}
                      />
                    </div>
                    
                    <div className="producto-vc-info">
                      <h3 className="producto-vc-nombre">{producto.detalles_producto}</h3>
                      <p className="producto-vc-precio">
                        ${producto.precio_producto.toLocaleString('es-CO')}
                      </p>
                    </div>
                    
                    <div className="producto-vc-actions">
                      <button 
                        className="agregar-carrito-vc-btn"
                        onClick={(e) => {
                          handleAddToCart({...producto, cantidad: 1});
                          e.stopPropagation();
                        }}
                      >
                        Agregar al Carrito
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Producto isOpen={modalAbierto} onClose={handleCloseModal} idProducto={productoSeleccionado} onAddToCart={handleAddToCart}/>
        <Carrito/>
      </div>
    </>
  );
};

export default Comercio;