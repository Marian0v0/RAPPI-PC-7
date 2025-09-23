import "./LoginTypeSelector.css";

const LoginTypeSelector = ({ onDeliveryPersonSelect, onCustomerSelect }) => {
  const handleDeliveryPersonLogin = () => {
    onDeliveryPersonSelect();
  };

  const handleCustomerLogin = () => {
    onCustomerSelect();
  };

  return (
    <div className="login-type-selector">
      <h3>Iniciar sesión</h3>

      <div className="login-options">
        <button
          className="login-option phone-style"
          onClick={handleDeliveryPersonLogin}
        >
          <div className="option-content">
            <h4>Continuar como repartidor</h4>
          </div>
        </button>

        <button
          className="login-option phone-style"
          onClick={handleCustomerLogin}
        >
          <div className="option-content">
            <h4>Continuar como cliente</h4>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LoginTypeSelector;
