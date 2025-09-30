import React, { useState, useEffect } from "react";
import "./ComercioRestaurante.css";

const API_BASE_URL = "http://localhost:3000/backend";

function RestaurantProfile() {
  const [restaurantData, setRestaurantData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchRestaurantInfo();
  }, []);

  const fetchRestaurantInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurantes/info`);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setRestaurantData(data[0]);
        } else {
          setError("No se encontró información del restaurante");
        }
      } else {
        throw new Error("Error al cargar información del restaurante");
      }
    } catch (err) {
      setError("Error al cargar la información: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestaurant = async () => {
    if (!restaurantData.id_restaurante) {
      alert("No se puede eliminar: ID de restaurante no disponible");
      return;
    }

    if (!window.confirm(`¿Estás seguro de que quieres eliminar el restaurante "${restaurantData.nombre_restaurante}"?\n\nID: ${restaurantData.id_restaurante}\nEmail: ${restaurantData.email_restaurante}\n\n⚠️ Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`${API_BASE_URL}/restaurantes/${restaurantData.id_restaurante}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      alert(`✅ Restaurante eliminado correctamente\n\nNombre: ${restaurantData.nombre_restaurante}\nID: ${restaurantData.id_restaurante}\n\nLa página se recargará.`);
      window.location.reload();
      
    } catch (error) {
      console.error("❌ Error eliminando restaurante:", error);
      alert(`❌ Error al eliminar restaurante: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseOtherSessions = () => {
    alert("Sesiones cerradas correctamente (simulación)");
  };

  const handleUpdateInfo = () => {
    alert("Funcionalidad de actualización en desarrollo");
  };

  if (loading) {
    return <div className="profile-info loading">Cargando información del restaurante...</div>;
  }

  if (error) {
    return <div className="profile-info error">{error}</div>;
  }

  return (
    <section className="profile-info">
      <div className="profile-header">
        <h2>Información del Restaurante</h2>
      </div>

      <div className="form-grid">
        <div>
          <label>Nombre del Restaurante</label>
          <div className="data-display">
            {restaurantData.nombre_restaurante || "No disponible"}
          </div>
        </div>

        <div>
          <label>ID Restaurante</label>
          <div className="data-display">
            {restaurantData.id_restaurante || "No disponible"}
          </div>
        </div>

        <div>
          <label>Email</label>
          <div className="data-display">
            {restaurantData.email_restaurante || "No disponible"}
          </div>
        </div>

        <div>
          <label>Teléfono</label>
          <div className="data-display">
            {restaurantData.cel_restaurante || "No disponible"}
          </div>
        </div>

        <div>
          <label>Dirección</label>
          <div className="data-display">
            {restaurantData.direccion_restaurante || "No disponible"}
          </div>
        </div>

        <div>
          <label>Tipo de Comida</label>
          <div className="data-display">
            {restaurantData.tipo_comida || "No disponible"}
          </div>
        </div>

        <div className="full-width">
          <label>Dirección</label>
          <div className="data-display">
            {restaurantData.direccion_restaurante || "No disponible"}
          </div>
        </div>
      </div>


      <div className="buttons">

        <button 
          className="btn-green" 
          onClick={handleCloseOtherSessions}
          disabled={isDeleting}
        >
          Cerrar Otras Sesiones
        </button>
        <button 
          className="btn-red" 
          onClick={handleDeleteRestaurant}
          disabled={isDeleting}
        >
          {isDeleting ? "Eliminando..." : "Eliminar Restaurante"}
        </button>
      </div>
    </section>
  );
}

export default RestaurantProfile;