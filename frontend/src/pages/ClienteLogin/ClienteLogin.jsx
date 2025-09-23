import { useState } from "react";
import "./ClienteLogin.css";
import "../../styles/shared.css";
import RappiLogo from "../../assets/images/logos/rappi.png";

const ClienteLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login cliente:", formData);
  };

  return (
    <div className="login-container">
      <div className="top-header">
        <img src={RappiLogo} alt="Rappi Logo" className="rappi-logo-top" />
      </div>

      <div className="content-wrapper">
        <div className="left-panel">
          <div className="overlay-content">
            <h1>Bienvenido Cliente</h1>
            <p>Realiza tus pedidos y gestiona tus compras</p>
          </div>
        </div>
        
        <div className="right-panel">
          <h2>Iniciar sesión como Cliente</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="base-button login-submit">
              Iniciar Sesión
            </button>
          </form>
          <button 
            className="base-button back-button"
            onClick={() => window.history.back()}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClienteLogin;