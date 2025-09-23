/**
 * Vista restaurante jsx component
 * @author German Marcillo
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './vista_restaurante.css';

const Comercio = () => {
  const { nombreComercio } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurante = async () => {
      try {
        setLoading(true);
        setError(null);
    
        const response = await fetch(`http://localhost:3000/backend/comercio/marca/${encodeURIComponent(nombreComercio)}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Restaurante "${nombreRestaurante}" no encontrado`);
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setRestaurante(data[0]);
        
        if (data[0] && data[0].id_restaurante) {
          await fetchProductos(data[0].id_comercio);
        }
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching restaurante:', err);
        setLoading(false);
      }
    };

    const fetchProductos = async (idComercio) => {
      try {
        const response = await fetch(`http://localhost:3000/backend/productos/comercio/${idComercio}`);
        
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

    if (nombreRestaurante) {
      fetchRestaurante();
    } else {
      setError('No se proporcionó nombre de restaurante');
      setLoading(false);
    }
  }, [nombreRestaurante]);

  const handleProductClick = (producto) => {
    
    console.log('Producto clickeado:', producto);
    
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando información del restaurante...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <p>Nombre buscado: "{nombreRestaurante}"</p>
        <button onClick={() => window.history.back()} className="back-button">
          Volver atrás
        </button>
      </div>
    );
  }

  if (!restaurante) {
    return (
      <div className="not-found-container">
        <h2>Restaurante no encontrado</h2>
        <p>No se encontró información para el restaurante solicitado.</p>
        <button onClick={() => window.history.back()} className="back-button">
          Volver atrás
        </button>
      </div>
    );
  }

  return (
    <>
      <title>{restaurante.nombre_restaurante}</title>

      <div className="restaurante-container">
        <div className="restaurante-header">
          <div className="header-content">
            <div className="restaurante-encabezado">restaurante {restaurante.tipo_comida}</div>
            <h1 className="restaurante-nombre">{restaurante.nombre_restaurante}</h1>
            <p className="restaurante-direccion">{restaurante.direccion_restaurante}</p>
            <p className="restaurante-pais">Colombia</p>
            <p className="restaurante-tipo">
              {restaurante.tipo_comida} - {restaurante.nombre_restaurante}
            </p>
          </div>
        </div>

        <div className="productos-section">
          <div className="productos-container">
            <h2 className="productos-title">Productos</h2>
            
            {productos.length === 0 ? (
              <div className="no-products">
                <p>No hay productos disponibles en este momento.</p>
              </div>
            ) : (
              <div className="productos-grid">
                {productos.map((producto) => (
                  <div 
                    key={producto.id_producto} 
                    className="producto-card"
                    onClick={() => handleProductClick(producto)}
                  >
                    <div className="producto-image-container">
                      <img 
                        src={producto.fotografia_producto} 
                        alt={producto.detalles_producto}
                        className="producto-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200/ffffff/666666?text=Imagen+No+Disponible';
                        }}
                      />
                    </div>
                    
                    <div className="producto-info">
                      <h3 className="producto-nombre">{producto.detalles_producto}</h3>
                      <p className="producto-precio">
                        ${producto.precio_producto.toLocaleString('es-CO')}
                      </p>
                    </div>
                    
                    <div className="producto-actions">
                      <button 
                        className="agregar-carrito-btn"
                        onClick={(e) => {
                          e.stopPropagation(); 
                          console.log('Agregar al carrito:', producto);
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
      </div>
    </>
  );
};

export default Comercio;