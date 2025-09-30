import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

// URL base de tu API
const API_BASE_URL = "https://rappi-pc-7.onrender.com/backend";

function Sidebar() {
  const location = useLocation();
  const [userName, setUserName] = useState("Cargando...");
  const [userType, setUserType] = useState("restaurante"); // "cliente", "restaurante", "comercio"
  const [isLoading, setIsLoading] = useState(true);

  const isActive = (path) => location.pathname === path ? "active" : "";

  // Cargar información del usuario al montar el componente
  useEffect(() => {
    loadUserInfo();
  }, []);

  // Determinar tipo de usuario y cargar información
  const loadUserInfo = async () => {
    try {
      // En una aplicación real, esto vendría del contexto de autenticación
      const currentPath = window.location.pathname;
      
      if (currentPath.includes('restaurant')) {
        setUserType("restaurante");
        await loadRestaurantName();
      } else if (currentPath.includes('commerce')) {
        setUserType("comercio");
        await loadCommerceName();
      } else {
        setUserType("cliente");
        await loadClientName();
      }
    } catch (error) {
      console.error("Error cargando información del usuario:", error);
      setUserName("Usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const loadClientName = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`);
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        let cliente = result.data.find(c => c.id_cliente === 123456) || result.data[0];
        setUserName(cliente.nombre_cliente || "Cliente");
      } else {
        setUserName("usuario2");
      }
    } catch (error) {
      setUserName("usuario2");
    }
  };

  const loadRestaurantName = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurantes/info`);
      const result = await response.json();
      
      if (result && result.length > 0) {
        const restaurante = result[0];
        setUserName(restaurante.nombre_restaurante || "Restaurante");
      } else {
        setUserName("Mi Restaurante");
      }
    } catch (error) {
      setUserName("Mi Restaurante");
    }
  };

  const loadCommerceName = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/comercio`);
      const result = await response.json();
      
      if (result && result.length > 0) {
        const comercio = result[0];
        setUserName(comercio.nombre_marca || "Comercio");
      } else {
        setUserName("Mi Comercio");
      }
    } catch (error) {
      setUserName("Mi Comercio");
    }
  };

  const getAvatarInitial = () => {
    if (isLoading || !userName) return "U";
    return userName.charAt(0).toUpperCase();
  };

  const getUserTypeLabel = () => {
    switch(userType) {
      case "restaurante": return "Restaurante";
      case "comercio": return "Comercio";
      default: return "👤 Cliente";
    }
  };

  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="avatar">{getAvatarInitial()}</div>
        <h3>{isLoading ? "Cargando..." : userName}</h3>
        <small style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
          {getUserTypeLabel()}
        </small>
      </div>

      <nav>
        <ul className="menu">
          {/* Navegación según tipo de usuario */}
          {userType === "cliente" && (
            <>
              <li className={isActive("/") || isActive("/ajustes")}>
                <Link to="/ajustes">Ajustes de cuenta</Link>
              </li>
              <li className={isActive("/payments")}>
                <Link to="/payments">Pagos</Link>
              </li>
              <li className={isActive("/registro/restaurante")}>
                <Link to="/registro/restaurante">Registra tu negocio</Link>
              </li>
            </>
          )}

          {(userType === "restaurante" || userType === "comercio") && (
            <>
              <li className={isActive("/restaurant-profile") || isActive("/commerce-profile")}>
                <Link to={userType === "restaurante" ? "/restaurant-profile" : "/commerce-profile"}>
                  Información del {userType === "restaurante" ? "Restaurante" : "Comercio"}
                </Link>
              </li>
              <li>
                <span style={{ color: '#999', cursor: 'not-allowed' }}>
                  Gestión de Productos (Próximamente)
                </span>
              </li>
            </>
          )}

          <li>Centro de notificaciones</li>
          <li>Centro de ayuda</li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;