import "./LoginPage.css";
import "../../styles/shared.css";

import { useState } from "react";
import RappiLogo from "../../assets/images/logos/rappi.png";
import GoogleIcon from "../../assets/images/logos/google.png";
import PhoneIcon from "../../assets/images/logos/phone.png";
import FacebookIcon from "../../assets/images/logos/Facebook.png";
import AppleIcon from "../../assets/images/logos/apple.png";

import AccountTypeSelector from "../../components/auth/AccountTypeSelector";
import LoginTypeSelector from "../../components/auth/LoginTypeSelector";

const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeliveryPersonSelect = () => {
    window.location.href = "/repartidor/login";
  };

  const handleCustomerSelect = () => {
    window.location.href = "/cliente/login";
  };

  return (
    <>
      <div className="login-container">
        <div className="top-header">
          <img src={RappiLogo} alt="Rappi Logo" className="rappi-logo-top" />
        </div>

        <div className="content-wrapper">
          <div className="left-panel">
            <div className="overlay-content">
              <h1>Regístrate ya y ahórrate los costos de envío</h1>
              <p>
                Envíos gratis durante las primeras semanas pagando con tarjeta.
              </p>
              <p className="note">*Válido para nuevos usuarios</p>
            </div>
          </div>
          <div className="right-panel">
            <h2>Regístrate o ingresa para continuar</h2>
            <div className="login-options">
              <button className="base-button create-account" onClick={() => window.location.href = "/registro"}>
                Crear cuenta
              </button>
              <button className="base-button google">
                <img src={GoogleIcon} alt="Google" className="button-icon" />
                Continuar con Google
              </button>
              <button className="base-button phone">
                <img src={PhoneIcon} alt="Phone" className="button-icon" />
                Continuar con tu celular
              </button>
              <button className="base-button facebook">
                <img src={FacebookIcon} alt="Facebook" className="button-icon" />
                Continuar con Facebook
              </button>
              <button className="base-button apple">
                <img src={AppleIcon} alt="Apple" className="button-icon" />
                Continuar con Apple
              </button>
              
              <button className="base-button existing-account" onClick={openModal}>
                Ya tengo cuenta
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-body">
              <LoginTypeSelector
                onDeliveryPersonSelect={handleDeliveryPersonSelect}
                onCustomerSelect={handleCustomerSelect}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;