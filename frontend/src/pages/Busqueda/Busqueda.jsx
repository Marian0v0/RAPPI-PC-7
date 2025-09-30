import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Busqueda.css';

const Busqueda = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [filters, setFilters] = useState({
    tipo: 'todos',
    precioMin: '',
    precioMax: '',
    ubicacion: '',
    calificacion: ''
  });

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery, activeFilter]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      let allResults = [];

      // Buscar en restaurantes
      if (activeFilter === 'todos' || activeFilter === 'restaurantes') {
        const restaurantesResponse = await fetch(`https://rappi-pc-7.onrender.com/backend/restaurantes/buscar/${encodeURIComponent(searchQuery)}`);
        if (restaurantesResponse.ok) {
          const data = await restaurantesResponse.json();
          const restaurantesResults = data.map(r => ({ 
            ...r, 
            tipo: 'restaurante',
            categoria: 'restaurante'
          }));
          allResults = [...allResults, ...restaurantesResults];
        }
      }

      // Buscar en comercios
      if (activeFilter === 'todos' || activeFilter === 'comercios') {
        const comerciosResponse = await fetch(`https://rappi-pc-7.onrender.com/backend/comercios/buscar/${encodeURIComponent(searchQuery)}`);
        if (comerciosResponse.ok) {
          const data = await comerciosResponse.json();
          const comerciosResults = data.map(c => ({ 
            ...c, 
            tipo: 'comercio',
            categoria: 'comercio'
          }));
          allResults = [...allResults, ...comerciosResults];
        }
      }

      // Buscar en productos
      if (activeFilter === 'todos' || activeFilter === 'productos') {
        const productosResponse = await fetch(`https://rappi-pc-7.onrender.com/backend/productos/buscar/${encodeURIComponent(searchQuery)}`);
        if (productosResponse.ok) {
          const data = await productosResponse.json();
          const productosResults = data.map(p => ({ 
            ...p, 
            tipo: 'producto',
            categoria: 'producto'
          }));
          allResults = [...allResults, ...productosResults];
        }
      }

      // Aplicar filtros adicionales
      let filteredResults = allResults;

      if (filters.precioMin) {
        filteredResults = filteredResults.filter(item => 
          item.precio_producto >= parseFloat(filters.precioMin)
        );
      }

      if (filters.precioMax) {
        filteredResults = filteredResults.filter(item => 
          item.precio_producto <= parseFloat(filters.precioMax)
        );
      }

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
  };

  const handleResultClick = (result) => {
    if (result.tipo === 'restaurante') {
      navigate(`/restaurantes/${result.nombre_restaurante}`);
    } else if (result.tipo === 'comercio') {
      navigate(`/comercios/${result.nombre_marca}`);
    } else if (result.tipo === 'producto') {
      // Navegar al restaurante o comercio del producto
      if (result.id_restaurante) {
        navigate(`/restaurantes/${result.nombre_restaurante}`);
      } else if (result.id_comercio) {
        navigate(`/comercios/${result.nombre_marca}`);
      }
    }
  };

  const getResultTitle = (result) => {
    if (result.tipo === 'restaurante') {
      return result.nombre_restaurante;
    } else if (result.tipo === 'comercio') {
      return result.nombre_marca;
    } else if (result.tipo === 'producto') {
      return result.detalles_producto;
    }
    return 'Sin nombre';
  };

  const getResultSubtitle = (result) => {
    if (result.tipo === 'restaurante') {
      return `${result.tipo_comida} • ${result.direccion_restaurante}`;
    } else if (result.tipo === 'comercio') {
      return `${result.tipo_comercio} • ${result.nombre_encargado} ${result.apellido_encargado}`;
    } else if (result.tipo === 'producto') {
      return `$${result.precio_producto?.toLocaleString() || '0'}`;
    }
    return '';
  };

  const getResultImage = (result) => {
    if (result.tipo === 'restaurante') {
      return result.fotografia_restaurante || 'https://via.placeholder.com/100x100/ffffff/666666?text=Restaurante';
    } else if (result.tipo === 'comercio') {
      return result.fotografia_comercio || 'https://via.placeholder.com/100x100/ffffff/666666?text=Comercio';
    } else if (result.tipo === 'producto') {
      return result.fotografia_producto || 'https://via.placeholder.com/100x100/ffffff/666666?text=Producto';
    }
    return 'https://via.placeholder.com/100x100/ffffff/666666?text=Imagen';
  };

  return (
    <div className="busqueda-container">
      {/* Header */}
      <div className="busqueda-header">
        <div className="header-top">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ←
          </button>
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar restaurantes, comercios o productos..."
              value={searchQuery}
              onChange={handleInputChange}
              className="search-input"
            />
            {loading && <div className="search-loading"></div>}
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-container">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${activeFilter === 'todos' ? 'active' : ''}`}
              onClick={() => handleFilterChange('todos')}
            >
              Todos
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'restaurantes' ? 'active' : ''}`}
              onClick={() => handleFilterChange('restaurantes')}
            >
              🍽️ Restaurantes
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'comercios' ? 'active' : ''}`}
              onClick={() => handleFilterChange('comercios')}
            >
              🏪 Comercios
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'productos' ? 'active' : ''}`}
              onClick={() => handleFilterChange('productos')}
            >
              🛍️ Productos
            </button>
          </div>

          {/* Filtros adicionales */}
          <div className="additional-filters">
            <div className="filter-group">
              <label>Precio mínimo</label>
              <input
                type="number"
                placeholder="0"
                value={filters.precioMin}
                onChange={(e) => setFilters({...filters, precioMin: e.target.value})}
              />
            </div>
            <div className="filter-group">
              <label>Precio máximo</label>
              <input
                type="number"
                placeholder="100000"
                value={filters.precioMax}
                onChange={(e) => setFilters({...filters, precioMax: e.target.value})}
              />
            </div>
            <button 
              className="btn-apply-filters"
              onClick={handleSearch}
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="busqueda-content">
        {searchQuery && (
          <div className="search-info">
            <h2>Resultados para "{searchQuery}"</h2>
            <p>{searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}</p>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Buscando...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="results-container">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="result-card"
                onClick={() => handleResultClick(result)}
              >
                <div className="result-image">
                  <img
                    src={getResultImage(result)}
                    alt={getResultTitle(result)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100/ffffff/666666?text=Imagen';
                    }}
                  />
                </div>
                <div className="result-info">
                  <h3>{getResultTitle(result)}</h3>
                  <p className="result-subtitle">{getResultSubtitle(result)}</p>
                  <div className="result-meta">
                    <span className="result-type">{result.tipo}</span>
                    {result.precio_producto && (
                      <span className="result-price">${result.precio_producto.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="result-arrow">
                  →
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No se encontraron resultados</h3>
            <p>Intenta con otros términos de búsqueda o ajusta los filtros</p>
            <button 
              className="btn-clear-filters"
              onClick={() => {
                setFilters({
                  tipo: 'todos',
                  precioMin: '',
                  precioMax: '',
                  ubicacion: '',
                  calificacion: ''
                });
                setActiveFilter('todos');
              }}
            >
              Limpiar Filtros
            </button>
          </div>
        ) : (
          <div className="search-suggestions">
            <h3>Sugerencias de búsqueda</h3>
            <div className="suggestions-grid">
              <div className="suggestion-card" onClick={() => setSearchQuery('pizza')}>
                <span className="suggestion-icon">🍕</span>
                <span>Pizza</span>
              </div>
              <div className="suggestion-card" onClick={() => setSearchQuery('hamburguesa')}>
                <span className="suggestion-icon">🍔</span>
                <span>Hamburguesa</span>
              </div>
              <div className="suggestion-card" onClick={() => setSearchQuery('sushi')}>
                <span className="suggestion-icon">🍣</span>
                <span>Sushi</span>
              </div>
              <div className="suggestion-card" onClick={() => setSearchQuery('farmacia')}>
                <span className="suggestion-icon">💊</span>
                <span>Farmacia</span>
              </div>
              <div className="suggestion-card" onClick={() => setSearchQuery('supermercado')}>
                <span className="suggestion-icon">🛒</span>
                <span>Supermercado</span>
              </div>
              <div className="suggestion-card" onClick={() => setSearchQuery('licores')}>
                <span className="suggestion-icon">🍷</span>
                <span>Licores</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Busqueda;
