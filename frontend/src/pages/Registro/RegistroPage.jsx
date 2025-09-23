import "./RegistroPage.css";
import "../../styles/shared.css";

import RappiLogo from "../../assets/images/logos/rappi.png";
import AccountTypeSelector from "../../components/auth/AccountTypeSelector";

const RegistroPage = () => {
  const handleDeliveryPersonSelect = () => {
    window.location.href = "/registro/repartidor";
  };

  const handleCustomerSelect = () => {
    window.location.href = "/registro/cliente";
  };

  return (
    <div className="login-container">
      <div className="top-header">
        <img src={RappiLogo} alt="Rappi Logo" className="rappi-logo-top" />
      </div>

      <div className="content-wrapper">
        <div className="left-panel">
          <div className="overlay-content">
            <h1>Únete a la familia Rappi</h1>
            <p>Crea tu cuenta y disfruta de todos nuestros beneficios</p>
          </div>
        </div>
        
        <div className="right-panel">
          <div className="registro-selector">
            <AccountTypeSelector
              onDeliveryPersonSelect={handleDeliveryPersonSelect}
              onCustomerSelect={handleCustomerSelect}
            />
          </div>
          <button 
            className="base-button registro-back-button"
            onClick={() => window.history.back()}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistroPage;