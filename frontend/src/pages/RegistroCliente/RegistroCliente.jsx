import { useState } from "react";
import "./RegistroCliente.css";
import "../../styles/shared.css";
import RappiLogo from "../../assets/images/logos/rappi.png";

const RegistroCliente = () => {
  const [formData, setFormData] = useState({
    nombre_cliente: "",
    cel_cliente: "",
    pais_cliente: "",
    ciudad_cliente: "",
    tipo_identificacion: "CC",
    numero_identificacion: "",
    correo_cliente: "",
    contrasena_cliente: "",
    confirmar_contrasena: "",
    direccion_cliente: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.contrasena_cliente !== formData.confirmar_contrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const clienteData = {
      id_cliente: parseInt(formData.numero_identificacion),
      nombre_cliente: formData.nombre_cliente,
      cel_cliente: formData.cel_cliente,
      pais_cliente: formData.pais_cliente,
      ciudad_cliente: formData.ciudad_cliente,
      tipo_identificacion: formData.tipo_identificacion,
      numero_identificacion: formData.numero_identificacion,
      fecha_cliente: new Date().toISOString().split('T')[0],
      correo_cliente: formData.correo_cliente,
      contrasena_cliente: formData.contrasena_cliente,
      direccion_cliente: formData.direccion_cliente
    };

    console.log("Datos del cliente:", clienteData);
  };

  return (
    <div className="login-container">
      <div className="top-header">
        <img src={RappiLogo} alt="Rappi Logo" className="rappi-logo-top" />
      </div>

      <div className="content-wrapper">
        <div className="left-panel">
          <div className="overlay-content">
            <h1>Registro Cliente</h1>
            <p>Completa tus datos para crear tu cuenta</p>
          </div>
        </div>
        
        <div className="right-panel">
          <h2>Crear cuenta de Cliente</h2>
          <form onSubmit={handleSubmit} className="registro-form">
            <div className="form-group">
              <input
                type="text"
                name="nombre_cliente"
                placeholder="Nombre completo"
                value={formData.nombre_cliente}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="cel_cliente"
                placeholder="Número de celular"
                value={formData.cel_cliente}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="pais_cliente"
                  placeholder="País"
                  value={formData.pais_cliente}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="ciudad_cliente"
                  placeholder="Ciudad"
                  value={formData.ciudad_cliente}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <select
                  name="tipo_identificacion"
                  value={formData.tipo_identificacion}
                  onChange={handleInputChange}
                  required
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PA">Pasaporte</option>
                  <option value="TI">Tarjeta de Identidad</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="numero_identificacion"
                  placeholder="Número de identificación"
                  value={formData.numero_identificacion}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="email"
                name="correo_cliente"
                placeholder="Correo electrónico"
                value={formData.correo_cliente}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="direccion_cliente"
                placeholder="Dirección"
                value={formData.direccion_cliente}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="contrasena_cliente"
                placeholder="Contraseña"
                value={formData.contrasena_cliente}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="confirmar_contrasena"
                placeholder="Confirmar contraseña"
                value={formData.confirmar_contrasena}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="base-button registro-submit">
              Crear Cuenta
            </button>
          </form>
          
          <button 
            className="base-button cliente-registro-back-button"
            onClick={() => window.history.back()}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistroCliente;