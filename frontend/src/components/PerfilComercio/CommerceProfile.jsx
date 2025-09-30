import React, { useState, useEffect } from "react";
import "./ComercioRestaurante.css";

const API_BASE_URL = "http://localhost:3000/backend";

function CommerceProfile() {
  const [commerceData, setCommerceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCommerceInfo();
  }, []);

  const fetchCommerceInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/comercio`);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setCommerceData(data[0]);
        } else {
          setError("No se encontró información del comercio");
        }
      } else {
        throw new Error("Error al cargar información del comercio");
      }
    } catch (err) {
      setError("Error al cargar la información: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCommerce = async () => {
    if (!commerceData.id_comercio) {
      alert("No se puede eliminar: ID de comercio no disponible");
      return;
    }

    if (!window.confirm(`¿Estás seguro de que quieres eliminar el comercio "${commerceData.nombre_marca}"?\n\nID: ${commerceData.id_comercio}\nEmail: ${commerceData.email_comercio}\n\n⚠️ Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`${API_BASE_URL}/comercio/${commerceData.id_comercio}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      alert(`✅ Comercio eliminado correctamente\n\nNombre: ${commerceData.nombre_marca}\nID: ${commerceData.id_comercio}\n\nLa página se recargará.`);
      window.location.reload();
      
    } catch (error) {
      console.error("❌ Error eliminando comercio:", error);
      alert(`❌ Error al eliminar comercio: ${error.message}`);
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
    return <div className="profile-info loading">Cargando información del comercio...</div>;
  }

  if (error) {
    return <div className="profile-info error">{error}</div>;
  }

  return (
    <section className="profile-info">
      <div className="profile-header">
        <h2>Información del Comercio</h2>
      </div>

      <div className="form-grid">
        <div>
          <label>Nombre de la Marca</label>
          <div className="data-display">
            {commerceData.nombre_marca || "No disponible"}
          </div>
        </div>

        <div>
          <label>ID Comercio</label>
          <div className="data-display">
            {commerceData.id_comercio || "No disponible"}
          </div>
        </div>

        <div>
          <label>Nombre del encargado</label>
          <div className="data-display">
            {commerceData.nombre_encargado || "No disponible"}
          </div>
        </div>

        <div>
          <label>Apellido del encargado</label>
          <div className="data-display">
            {commerceData.apellido_encargado || "No disponible"}
          </div>
        </div>

        <div>
          <label>Email</label>
          <div className="data-display">
            {commerceData.correo_encargado || "No disponible"}
          </div>
        </div>

        <div>
          <label>Teléfono</label>
          <div className="data-display">
            {commerceData.telefono_encargado || "No disponible"}
          </div>
        </div>

        <div>
          <label>Tipo persona</label>
          <div className="data-display">
            {commerceData.tipo_persona || "No disponible"}
          </div>
        </div>

        <div>
          <label>Tipo de Comercio</label>
          <div className="data-display">
            {commerceData.tipo_comercio || "No disponible"}
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
          onClick={handleDeleteCommerce}
          disabled={isDeleting}
        >
          {isDeleting ? "Eliminando..." : "Eliminar Comercio"}
        </button>
      </div>
    </section>
  );
}

export default CommerceProfile;