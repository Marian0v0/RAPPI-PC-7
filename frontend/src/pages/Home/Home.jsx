import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import RappiLogo from '../../assets/images/logos/rappi.png';
import QuieroSerAliado from '../../components/QuieroSerAliado/QuieroSerAliado';

const Home = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuieroSerAliado, setShowQuieroSerAliado] = useState(false);

  useEffect(() => {
    // Obtener datos del cliente desde localStorage
    const clienteData = localStorage.getItem('cliente');
    if (clienteData) {
      setCliente(JSON.parse(clienteData));
    } else {
      navigate('/cliente/login');
      return;
    }

    // Cargar datos iniciales
    loadInitialData();
  }, [navigate]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Cargar restaurantes
      const restaurantesResponse = await fetch('https://rappi-pc-7.onrender.com/backend/restaurantes');
      if (restaurantesResponse.ok) {
        const restaurantesData = await restaurantesResponse.json();
        setRestaurantes(restaurantesData.slice(0, 6)); // Mostrar solo los primeros 6
      }

      // Cargar comercios
      const comerciosResponse = await fetch('https://rappi-pc-7.onrender.com/backend/comercios');
      if (comerciosResponse.ok) {
        const comerciosData = await comerciosResponse.json();
        setComercios(comerciosData.slice(0, 6)); // Mostrar solo los primeros 6
      }

      // Cargar favoritos del cliente
      if (cliente) {
        await loadFavoritos();
      }
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Buscar en restaurantes
      const restaurantesResponse = await fetch(`https://rappi-pc-7.onrender.com/backend/restaurantes/buscar/${encodeURIComponent(query)}`);
      let restaurantesResults = [];
      if (restaurantesResponse.ok) {
        const data = await restaurantesResponse.json();
        restaurantesResults = data.map(r => ({ ...r, tipo: 'restaurante' }));
      }

      // Buscar en comercios
      const comerciosResponse = await fetch(`https://rappi-pc-7.onrender.com/backend/comercios/buscar/${encodeURIComponent(query)}`);
      let comerciosResults = [];
      if (comerciosResponse.ok) {
        const data = await comerciosResponse.json();
        comerciosResults = data.map(c => ({ ...c, tipo: 'comercio' }));
      }

      // Buscar en productos
      const productosResponse = await fetch(`https://rappi-pc-7.onrender.com/backend/productos/buscar/${encodeURIComponent(query)}`);
      let productosResults = [];
      if (productosResponse.ok) {
        const data = await productosResponse.json();
        productosResults = data.map(p => ({ ...p, tipo: 'producto' }));
      }

      setSearchResults([...restaurantesResults, ...comerciosResults, ...productosResults]);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
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

  const toggleFavorito = async (item) => {
    try {
      // Aquí se implementaría la lógica para agregar/quitar favoritos
      console.log('Toggle favorito:', item);
    } catch (error) {
      console.error('Error toggle favorito:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cliente');
    navigate('/cliente/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header">
        <div className="header-top">
          <img src={RappiLogo} alt="Rappi" className="rappi-logo" />
          <div className="header-actions">
            <button 
              className="btn-aliado"
              onClick={() => setShowQuieroSerAliado(true)}
            >
              <span className="icon-store">🏪</span>
              <span className="btn-text">Quiero ser aliado</span>
            </button>
            <button className="btn-notifications">
              <span className="icon-bell">🔔</span>
            </button>
            <button className="btn-profile" onClick={() => navigate('/perfil')}>
              <div className="profile-avatar">
                {cliente?.nombre_cliente?.charAt(0) || 'U'}
              </div>
            </button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar restaurantes, comercios o productos..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="search-input"
            />
            {isSearching && <div className="search-loading"></div>}
          </div>
        </div>

        {/* Saludo */}
        <div className="greeting">
          <h1>¡Hola, {cliente?.nombre_cliente || 'Usuario'}!</h1>
          <p>¿Qué se te antoja hoy?</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="home-content">
        {/* Resultados de búsqueda */}
        {searchQuery && (
          <div className="search-results">
            <h2>Resultados para "{searchQuery}"</h2>
            {searchResults.length > 0 ? (
              <div className="results-grid">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="result-item"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="result-image">
                      <img
                        src={result.fotografia_producto || 'https://via.placeholder.com/100x100/ffffff/666666?text=Imagen'}
                        alt={result.nombre_restaurante || result.nombre_marca || result.detalles_producto}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100/ffffff/666666?text=Imagen';
                        }}
                      />
                    </div>
                    <div className="result-info">
                      <h3>{result.nombre_restaurante || result.nombre_marca || result.detalles_producto}</h3>
                      <p className="result-type">{result.tipo}</p>
                      {result.precio_producto && (
                        <p className="result-price">${result.precio_producto.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-results">No se encontraron resultados</p>
            )}
          </div>
        )}

        {/* Favoritos */}
        {!searchQuery && favoritos.length > 0 && (
          <div className="favorites-section">
            <div className="section-header">
              <h2>Tu Favoritos</h2>
              <button 
                className="btn-see-all"
                onClick={() => navigate('/añadirFavoritos')}
              >
                Ver todos
              </button>
            </div>
            <div className="favorites-grid">
              {favoritos.map((favorito) => (
                <div
                  key={favorito.id}
                  className="favorite-item"
                  onClick={() => {
                    if (favorito.tipo === 'restaurante') {
                      navigate(`/restaurantes/${favorito.nombre}`);
                    } else {
                      navigate(`/comercios/${favorito.nombre}`);
                    }
                  }}
                >
                  <div className="favorite-image">
                    <img
                      src={favorito.imagen}
                      alt={favorito.nombre}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100/ffffff/666666?text=Imagen';
                      }}
                    />
                    <button
                      className="btn-favorite active"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorito(favorito);
                      }}
                    >
                      ❤️
                    </button>
                  </div>
                  <h3>{favorito.nombre}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restaurantes populares */}
        {!searchQuery && (
          <div className="restaurants-section">
            <div className="section-header">
              <h2>Restaurantes Populares</h2>
              <button className="btn-see-all">Ver todos</button>
            </div>
            <div className="restaurants-grid">
              {restaurantes.map((restaurante) => (
                <div
                  key={restaurante.id_restaurante}
                  className="restaurant-item"
                  onClick={() => navigate(`/restaurantes/${restaurante.nombre_restaurante}`)}
                >
                  <div className="restaurant-image">
                    <img
                      src={restaurante.fotografia_restaurante || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ78cie_Dy1k6Yb3tUjcyBIWPkmgyXFFKqdpQ&s'}
                      alt={restaurante.nombre_restaurante}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x150/ffffff/666666?text=Restaurante';
                      }}
                    />
                    <button
                      className="btn-favorite"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorito(restaurante);
                      }}
                    >
                      🤍
                    </button>
                  </div>
                  <div className="restaurant-info">
                    <h3>{restaurante.nombre_restaurante}</h3>
                    <p className="restaurant-type">{restaurante.tipo_comida}</p>
                    <p className="restaurant-address">{restaurante.direccion_restaurante}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comercios populares */}
        {!searchQuery && (
          <div className="commerce-section">
            <div className="section-header">
              <h2>Comercios Populares</h2>
              <button className="btn-see-all">Ver todos</button>
            </div>
            <div className="commerce-grid">
              {comercios.map((comercio) => (
                <div
                  key={comercio.id_comercio}
                  className="commerce-item"
                  onClick={() => navigate(`/comercios/${comercio.nombre_marca}`)}
                >
                  <div className="commerce-image">
                    <img
                      src={comercio.fotografia_comercio || 'https://via.placeholder.com/200x150/ffffff/666666?text=Comercio'}
                      alt={comercio.nombre_marca}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x150/ffffff/666666?text=Comercio';
                      }}
                    />
                    <button
                      className="btn-favorite"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorito(comercio);
                      }}
                    >
                      🤍
                    </button>
                  </div>
                  <div className="commerce-info">
                    <h3>{comercio.nombre_marca}</h3>
                    <p className="commerce-type">{comercio.tipo_comercio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button className="nav-item active">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Inicio</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/perfil')}>
          <span className="nav-icon">👤</span>
          <span className="nav-label">Perfil</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/checkout')}>
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Carrito</span>
        </button>
        <button className="nav-item" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Salir</span>
        </button>
      </div>

      {/* Modal Quiero Ser Aliado */}
      <QuieroSerAliado 
        isOpen={showQuieroSerAliado}
        onClose={() => setShowQuieroSerAliado(false)}
      />
    </div>
  );
};

export default Home;