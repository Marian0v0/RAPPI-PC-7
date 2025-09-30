import React, { useState, useEffect } from "react";
import "./ProfileInfo.css";

const API_BASE_URL = "https://rappi-pc-7.onrender.com/backend";

function ProfileInfo() {
  const [clientData, setClientData] = useState({
    id_cliente: "",
    nombre_cliente: "",
    correo_cliente: "",
    cel_cliente: "",
    numero_identificacion: "",
    fecha_cliente: "",
    tipo_identificacion: "",
    pais_cliente: "",
    ciudad_cliente: "",
    direccion_cliente: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClientData();
  }, []);

  // Cargar datos del cliente desde la API
  const loadClientData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Intentando cargar datos de la API...");
      
      const response = await fetch(`${API_BASE_URL}/clientes`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Respuesta de la API:", result);
      
      if (result.success && result.data && result.data.length > 0) {
        // Buscar el usuario específico para eliminar 
        let cliente = result.data.find(c => c.id_cliente === 123456);
        
        // Si no encuentra el usuario específico, usar el primero disponible
        if (!cliente) {
          console.warn("Usuario específico no encontrado, usando primer usuario disponible");
          cliente = result.data[0];
        }
        
        console.log("Cliente encontrado:", cliente);
        
        const formattedData = {
          id_cliente: cliente.id_cliente || "123456",
          nombre_cliente: cliente.nombre_cliente || "usuario2",
          correo_cliente: cliente.correo_cliente || "user2@gmail.com",
          cel_cliente: cliente.cel_cliente || "9876543210",
          numero_identificacion: cliente.numero_identificacion || "1472583690",
          fecha_cliente: cliente.fecha_cliente ? formatDateForDisplay(cliente.fecha_cliente) : "28/09/2025",
          tipo_identificacion: cliente.tipo_identificacion || "Cédula",
          pais_cliente: cliente.pais_cliente || "Colombia",
          ciudad_cliente: cliente.ciudad_cliente || "Pasto",
          direccion_cliente: cliente.direccion_cliente || "calle 23 8-43"
        };
        
        setClientData(formattedData);
        console.log("Datos formateados:", formattedData);
      } else {
        console.warn("No se encontraron datos en la respuesta, usando datos de prueba");
        setDefaultData();
      }
    } catch (error) {
      console.error("❌ Error cargando datos del cliente:", error);
      setError(error.message);
      // Usar datos de prueba en caso de error
      setDefaultData();
    } finally {
      setIsLoading(false);
    }
  };

  // Formatear fecha para mostrar
  const formatDateForDisplay = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.warn("Error formateando fecha:", error);
      return dateString;
    }
  };

  // Datos de prueba basados en tu BD - USUARIO PARA ELIMINAR
  const setDefaultData = () => {
    const defaultData = {
      id_cliente: "123456",
      nombre_cliente: "usuario2",
      correo_cliente: "user2@gmail.com",
      cel_cliente: "9876543210",
      numero_identificacion: "1472583690",
      fecha_cliente: "28/09/2025",
      tipo_identificacion: "Cédula",
      pais_cliente: "Colombia",
      ciudad_cliente: "Pasto",
      direccion_cliente: "calle 23 8-43"
    };
    
    console.log("Usando datos de prueba (usuario2):", defaultData);
    setClientData(defaultData);
    setError("No se pudo conectar a la API. Mostrando datos de prueba.");
  };

  // Eliminar cuenta - FUNCIONALIDAD REAL CON LA API
  const handleDeleteAccount = async () => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la cuenta de ${clientData.nombre_cliente}?\n\nID: ${clientData.id_cliente}\nEmail: ${clientData.correo_cliente}\n\n⚠️ Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setIsLoading(true);
      console.log("Intentando eliminar cuenta con ID:", clientData.id_cliente);
      
      const response = await fetch(`${API_BASE_URL}/delete-cliente/${clientData.id_cliente}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Respuesta de eliminación:", result);
      
      if (result.success) {
        alert(`✅ Cuenta eliminada correctamente\n\nUsuario: ${clientData.nombre_cliente}\nID: ${clientData.id_cliente}\n\nLa página se recargará.`);
        // Recargar la página para reflejar los cambios
        window.location.reload();
      } else {
        throw new Error(result.error || "Error al eliminar cuenta");
      }
    } catch (error) {
      console.error("❌ Error eliminando cuenta:", error);
      alert(`❌ Error al eliminar cuenta: ${error.message}\n\n🔍 Verifica:\n- Que el backend esté ejecutándose\n- Que el usuario con ID ${clientData.id_cliente} exista en la base de datos\n- Los logs de la consola para más detalles`);
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar otras sesiones (simulación)
  const handleCloseOtherSessions = () => {
    console.log("Simulando cierre de sesiones...");
    alert("Sesiones cerradas correctamente (simulación)");
  };

  if (isLoading) {
    return (
      <section className="profile-info">
        <div className="loading">
          <div>🔄 Cargando datos...</div>
          <small>Conectando a: {API_BASE_URL}/clientes</small>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Buscando usuario: <strong>usuario2 (ID: 123456)</strong>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-info">
      <h2>Información de tu cuenta</h2>

      {error && (
        <div className="error-message" style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '8px', 
          padding: '15px', 
          marginBottom: '20px',
          color: '#856404'
        }}>
          <strong>⚠️ Aviso:</strong> {error}
          <button 
            onClick={loadClientData} 
            className="btn-green"
            style={{ 
              marginLeft: '15px', 
              padding: '8px 15px',
              fontSize: '14px'
            }}
          >
            Reintentar conexión
          </button>
        </div>
      )}

      <div className="form-grid">
        <div>
          <label>Nombre completo</label>
          <div className="data-display">
            {clientData.nombre_cliente}
          </div>
        </div>

        <div>
          <label>Tipo de identificación</label>
          <div className="data-display">
            {clientData.tipo_identificacion}
          </div>
        </div>

        <div>
          <label>Correo Electrónico</label>
          <div className="data-display">
            {clientData.correo_cliente}
          </div>
        </div>

        <div>
          <label>Celular</label>
          <div className="data-display">
            {clientData.cel_cliente}
          </div>
        </div>

        <div>
          <label>Número de identificación</label>
          <div className="data-display">
            {clientData.numero_identificacion}
          </div>
        </div>

        <div>
          <label>Fecha de nacimiento</label>
          <div className="data-display">
            {clientData.fecha_cliente}
          </div>
        </div>

        <div>
          <label>País</label>
          <div className="data-display">
            {clientData.pais_cliente}
          </div>
        </div>

        <div>
          <label>Ciudad</label>
          <div className="data-display">
            {clientData.ciudad_cliente}
          </div>
        </div>

        <div className="full-width">
          <label>Dirección</label>
          <div className="data-display">
            {clientData.direccion_cliente}
          </div>
        </div>
      </div>

      <div className="buttons">
        <button 
          className="btn-green" 
          onClick={handleCloseOtherSessions}
          disabled={isLoading}
        >
          Cerrar otras sesiones
        </button>
        <button 
          className="btn-red" 
          onClick={handleDeleteAccount}
          disabled={isLoading}
        >
          {isLoading ? "Eliminando..." : "Eliminar mi cuenta"}
        </button>
      </div>
    </section>
  );
}

export default ProfileInfo;