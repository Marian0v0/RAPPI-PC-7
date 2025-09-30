import React, { useState } from "react";
import "./Payments.css";

function Payments() {
  const [selectedMethod, setSelectedMethod] = useState("efectivo");

  const paymentMethods = [
    { id: "efectivo", icon: "💵", name: "Efectivo", default: true },
    { id: "tarjeta", icon: "💳", name: "Tarjeta" },
    { id: "nequi", icon: "📱", name: "Nequi" },
    { id: "daviplata", icon: "💰", name: "Daviplata" }
  ];

  return (
    <div className="payments-container">
      <section className="payments-section">
        <h2>Métodos de pago</h2>
        
        <div className="payment-methods-grid">
          <div className="add-payment-method">
            <div className="add-icon">+</div>
            <p>Agregar tarjeta</p>
          </div>

          {paymentMethods.map((method) => (
            <div 
              key={method.id}
              className={`payment-method ${selectedMethod === method.id ? 'active' : ''}`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="method-icon">{method.icon}</div>
              <div className="method-name">{method.name}</div>
              {selectedMethod === method.id && (
                <div className="selected-indicator">✓</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Payments;