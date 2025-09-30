
import React, { useState } from 'react';
import './añadirFavoritos.css';

const RappiModule = () => {
  const [favorites, setFavorites] = useState([]);

  // Datos de ejemplo basados en tu imagen
  const superMarkets = [
    { id: 1, name: "Lícores", time: "4 min o prop." },
    { id: 2, name: "Éxito", time: "29 min o prop." }
  ];

  const restaurants = [
    { 
      id: 1, 
      name: "ENCALES", 
      time: "27h,9m", 
      note: "Nota: S$500 m", 
      distance: "" 
    },
    { 
      id: 2, 
      name: "Presto", 
      time: "39 min", 
      note: "S$500", 
      distance: "22 km" 
    },
    { 
      id: 3, 
      name: "Cheera Pizzeria", 
      time: "39 min", 
      note: "S$500", 
      distance: "34 km" 
    }
  ];

  const addToFavorites = (restaurant) => {
    if (!favorites.find(fav => fav.id === restaurant.id)) {
      setFavorites([...favorites, restaurant]);
    }
  };

  return (
    <div className="rappi-container">
      {/* Header de Favoritos */}
      <div className="favorites-header">
        <h1>Mis Favoritos</h1>
      </div>

      {/* Estado vacío de favoritos */}
      {favorites.length === 0 && (
        <div className="empty-favorites">
          <div className="empty-state">
            <p>¡Aún no tienes favoritos!</p>
            <p>Explora estas tiendas y elige tu primera favorita</p>
          </div>
        </div>
      )}

      {/* Sección de Supermercados */}
      <div className="section">
        <h2>Mejores ofertas de súper</h2>
        <div className="super-grid">
          {superMarkets.map((market) => (
            <div key={market.id} className="market-card">
              <div className="market-info">
                <h3>{market.name}</h3>
                <span className="delivery-time">{market.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="divider"></div>

      {/* Sección de Restaurantes */}
      <div className="section">
        <h2>Los mejores restaurantes en tu zona</h2>
        <div className="restaurants-list">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="restaurant-card">
              <div className="restaurant-main-info">
                <div className="restaurant-name-time">
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  <span className="delivery-time">{restaurant.time}</span>
                </div>
                <div className="restaurant-details">
                  <span className="note">{restaurant.note}</span>
                  {restaurant.distance && (
                    <span className="distance">{restaurant.distance}</span>
                  )}
                </div>
              </div>
              <button 
                className="add-favorite-btn"
                onClick={() => addToFavorites(restaurant)}
              >
                Añadir favoritos
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RappiModule;