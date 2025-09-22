import "./Login.css";

import RappiLogo from "../assets/images/logos/rappi.png";
import GoogleIcon from "../assets/images/logos/google.png";
import PhoneIcon from "../assets/images/logos/phone.png";
import FacebookIcon from "../assets/images/logos/Facebook.png";
import AppleIcon from "../assets/images/logos/apple.png";

const Login = () => {
  return (
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
            <button className="google">
              <img src={GoogleIcon} alt="Google" className="button-icon" />
              Continuar con Google
            </button>
            <button className="phone">
              <img src={PhoneIcon} alt="Phone" className="button-icon" />
              Continuar con tu celular
            </button>
            <button className="facebook">
              <img src={FacebookIcon} alt="Facebook" className="button-icon" />
              Continuar con Facebook
            </button>
            <button className="apple">
              <img src={AppleIcon} alt="Apple" className="button-icon" />
              Continuar con Apple
            </button>
            <button className="existing-account">Ya tengo cuenta</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;