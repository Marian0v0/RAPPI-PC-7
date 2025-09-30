import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AñadirFavoritos.css';

const AñadirFavoritos = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('Favoritos');
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    // Obtener datos del cliente
    const clienteData = localStorage.getItem('cliente');
    if (clienteData) {
      setCliente(JSON.parse(clienteData));
    } else {
      navigate('/cliente/login');
      return;
    }

    // Cargar datos
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar restaurantes
      const restaurantesResponse = await fetch('https://rappi-pc-7.onrender.com/backend/restaurantes');
      if (restaurantesResponse.ok) {
        const data = await restaurantesResponse.json();
        setRestaurantes(data);
      }

      // Cargar comercios
      const comerciosResponse = await fetch('https://rappi-pc-7.onrender.com/backend/comercios');
      if (comerciosResponse.ok) {
        const data = await comerciosResponse.json();
        setComercios(data);
      }

      // Cargar favoritos del cliente (por ahora mock)
      loadFavoritos();
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavoritos = () => {
    // Por ahora usamos datos mock, pero aquí se conectaría con el backend
    const favoritosMock = [
      { id: 1, nombre: 'Mr. King Pollo', tipo: 'restaurante', imagen: 'https://images.rappi.com/restaurants/mr-king-pollo-logo.png' },
      { id: 2, nombre: 'Presto', tipo: 'restaurante', imagen: 'https://images.rappi.com/restaurants/presto-logo.png' },
      { id: 3, nombre: 'Mister Pollo', tipo: 'restaurante', imagen: 'https://images.rappi.com/restaurants/mister-pollo-logo.png' },
      { id: 4, nombre: 'Licores', tipo: 'comercio', imagen: 'https://images.rappi.com/stores/licores-logo.png' }
    ];
    setFavorites(favoritosMock);
  };

  const addToFavorites = async (item) => {
    try {
      // Aquí se implementaría la lógica para agregar favoritos al backend
      if (!favorites.find(fav => fav.id === item.id)) {
        setFavorites([...favorites, item]);
        // TODO: Llamar al backend para guardar el favorito
        console.log('Agregando favorito:', item);
      }
    } catch (error) {
      console.error('Error agregando favorito:', error);
    }
  };

  const removeFromFavorites = async (itemId) => {
    try {
      setFavorites(favorites.filter(fav => fav.id !== itemId));
      // TODO: Llamar al backend para eliminar el favorito
      console.log('Eliminando favorito:', itemId);
    } catch (error) {
      console.error('Error eliminando favorito:', error);
    }
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
    if (section === 'Inicio') {
      navigate('/home');
    } else if (section === 'Cuenta') {
      navigate('/perfil');
    }
  };

  const handleItemClick = (item) => {
    if (item.tipo === 'restaurante') {
      navigate(`/restaurantes/${item.nombre_restaurante || item.nombre}`);
    } else if (item.tipo === 'comercio') {
      navigate(`/comercios/${item.nombre_marca || item.nombre}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando favoritos...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Barra lateral vertical */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Rappi</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeSection === 'Inicio' ? 'active' : ''}
              onClick={() => handleNavigation('Inicio')}
            >
              <span>Inicio</span>
            </li>
            <li 
              className={activeSection === 'Ofertas' ? 'active' : ''}
              onClick={() => handleNavigation('Ofertas')}
            >
              <span>Ofertas</span>
            </li>
            <li 
              className={activeSection === 'Favoritos' ? 'active' : ''}
              onClick={() => handleNavigation('Favoritos')}
            >
              <span>Favoritos</span>
            </li>
            <li 
              className={activeSection === 'Cuenta' ? 'active' : ''}
              onClick={() => handleNavigation('Cuenta')}
            >
              <span>Cuenta</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        <div className="rappi-container">
          {/* Header de Favoritos */}
          <div className="favorites-header">
            <h1>Mis Favoritos</h1>
          </div>

          {/* Mis Favoritos */}
          {favorites.length > 0 && (
            <div className="section">
              <h2>Mis Favoritos</h2>
              <div className="favorites-grid">
                {favorites.map((favorito) => (
                  <div key={favorito.id} className="favorite-card">
                    <div className="favorite-image">
                      <img
                        src={favorito.imagen}
                        alt={favorito.nombre}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100/ffffff/666666?text=Imagen';
                        }}
                      />
                    </div>
                    <div className="favorite-info">
                      <h3>{favorito.nombre}</h3>
                      <p className="favorite-type">{favorito.tipo}</p>
                    </div>
                    <div className="favorite-actions">
                      <button 
                        className="btn-visit"
                        onClick={() => handleItemClick(favorito)}
                      >
                        Visitar
                      </button>
                      <button 
                        className="btn-remove"
                        onClick={() => removeFromFavorites(favorito.id)}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estado vacío de favoritos */}
          {favorites.length === 0 && (
            <div className="empty-favorites">
              <div className="empty-state">
                <p>¡Aún no tienes favoritos!</p>
                <p>Explora estas tiendas y elige tu primera favorita</p>
              </div>
            </div>
          )}

          {/* Sección de Comercios */}
          {comercios.length > 0 && (
            <div className="section">
              <h2>Comercios disponibles</h2>
              <div className="comercios-grid">
                {comercios.map((comercio) => (
                  <div key={comercio.id_comercio} className="comercio-card">
                    <div className="comercio-image">
                      <img
                        src={comercio.fotografia_comercio || 'https://via.placeholder.com/100x100/ffffff/666666?text=Comercio'}
                        alt={comercio.nombre_marca}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100/ffffff/666666?text=Comercio';
                        }}
                      />
                    </div>
                    <div className="comercio-info">
                      <h3>{comercio.nombre_marca}</h3>
                      <p className="comercio-type">{comercio.tipo_comercio}</p>
                      <p className="comercio-owner">
                        {comercio.nombre_encargado} {comercio.apellido_encargado}
                      </p>
                    </div>
                    <div className="comercio-actions">
                      <button 
                        className="btn-visit"
                        onClick={() => handleItemClick({...comercio, tipo: 'comercio'})}
                      >
                        Visitar
                      </button>
                      <button 
                        className="add-favorite-btn"
                        onClick={() => addToFavorites({...comercio, tipo: 'comercio', nombre: comercio.nombre_marca})}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Línea divisoria */}
          <div className="divider"></div>

          {/* Sección de Restaurantes */}
          {restaurantes.length > 0 && (
            <div className="section">
              <h2>Restaurantes disponibles</h2>
              <div className="restaurants-list">
                {restaurantes.map((restaurante) => (
                  <div key={restaurante.id_restaurante} className="restaurant-card">
                    <div className="restaurant-image">
                      <img
                        src={restaurante.fotografia_restaurante || 'https://via.placeholder.com/100x100/ffffff/666666?text=Restaurante'}
                        alt={restaurante.nombre_restaurante}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100/ffffff/666666?text=Restaurante';
                        }}
                      />
                    </div>
                    <div className="restaurant-main-info">
                      <div className="restaurant-name-time">
                        <h3 className="restaurant-name">{restaurante.nombre_restaurante}</h3>
                        <span className="delivery-time">30-45 min</span>
                      </div>
                      <div className="restaurant-details">
                        <span className="note">{restaurante.tipo_comida}</span>
                        <span className="distance">{restaurante.direccion_restaurante}</span>
                      </div>
                    </div>
                    <div className="restaurant-actions">
                      <button 
                        className="btn-visit"
                        onClick={() => handleItemClick({...restaurante, tipo: 'restaurante'})}
                      >
                        Visitar
                      </button>
                      <button 
                        className="add-favorite-btn"
                        onClick={() => addToFavorites({...restaurante, tipo: 'restaurante', nombre: restaurante.nombre_restaurante})}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AñadirFavoritos;