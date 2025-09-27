import React from "react";
//import "./EditarEstadoModal.css";

const EditarEstadoModal = ({ isOpen, onClose, onChangeEstado }) => {
  if (!isOpen) return null;

  const estados = [
    "Pendiente",
    "Aceptado",
    "Rechazado",
  ];

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h3 className="modalTitulo">Cambiar estado del pedido</h3>
        {estados.map((estado) => (
          <div
            key={estado}
            className="modalOpcion"
            onClick={() => onChangeEstado(estado)}
          >
            {estado}
          </div>
        ))}
        <button className="modalCerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default EditarEstadoModal;