import "./AccountTypeSelector.css";

const AccountTypeSelector = ({
  onDeliveryPersonSelect,
  onCustomerSelect,
}) => {
  const handleDeliveryPersonLogin = () => {
    onDeliveryPersonSelect();
  };

  const handleCustomerLogin = () => {
    onCustomerSelect();
  };

  return (
    <div className="account-type-selector">
      <h3>Tipo de cuenta </h3>

      <div className="auth-options">
        <button
          className="auth-option delivery-option"
          onClick={handleDeliveryPersonLogin}
        >
          <div className="option-content">
            <h4>Crear cuenta como repartidor</h4>
          </div>
        </button>

        <button
          className="auth-option customer-option"
          onClick={handleCustomerLogin}
        >
          <div className="option-content">
            <h4>Crear cuenta como cliente</h4>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AccountTypeSelector;
