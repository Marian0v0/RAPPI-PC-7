import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ClienteLogin.css";
import "../../styles/shared.css";
import RappiLogo from "../../assets/images/logos/rappi.png";

const ClienteLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://rappi-pc-7.onrender.com/backend/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("cliente", JSON.stringify(data.data));
        navigate("/perfil");
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
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
          
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="base-button login-submit"
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>
          <button 
            className="base-button button-back"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClienteLogin;