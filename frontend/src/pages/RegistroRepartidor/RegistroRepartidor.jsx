import { useState } from "react";
import "./RegistroRepartidor.css";
import "../../styles/shared.css";
import RappiLogo from "../../assets/images/logos/rappi.png";

const RegistroRepartidor = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    cedula: "",
    password: "",
    confirmar_password: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmar_password) {
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log("Datos del repartidor:", formData);
  };

  return (
    <div className="login-container">
      <div className="top-header">
        <img src={RappiLogo} alt="Rappi Logo" className="rappi-logo-top" />
      </div>

      <div className="content-wrapper">
        <div className="left-panel">
          <div className="overlay-content">
            <h1>Registro Repartidor</h1>
            <p>Únete a nuestro equipo de repartidores</p>
          </div>
        </div>
        
        <div className="right-panel">
          <h2>Crear cuenta de Repartidor</h2>
          <form onSubmit={handleSubmit} className="registro-form">
            <div className="form-group">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="cedula"
                placeholder="Número de cédula"
                value={formData.cedula}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="telefono"
                placeholder="Número de teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
              />
            </div>

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

            <div className="form-group">
              <input
                type="password"
                name="confirmar_password"
                placeholder="Confirmar contraseña"
                value={formData.confirmar_password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="base-button registro-submit">
              Crear Cuenta
            </button>
          </form>
          
          <button 
            className="base-button repartidor-registro-back-button"
            onClick={() => window.history.back()}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistroRepartidor;