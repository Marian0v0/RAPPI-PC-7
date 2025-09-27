import React, { useState } from "react";
import EditarEstadoModal from "../../components/editarEstadoPedido/EditarEstadoModal";
import "./RepartidorVistaPedidos.css";

const RepartidorVistaPedidos = () => {
  const [filtro, setFiltro] = useState("Pendiente");
  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      estado: "Pendiente",
      fecha: "2025-09-26 18:30",
      restaurante: "Restaurante La Luna",
      precio: 20000,
    },
    {
      id: 2,
      estado: "Aceptado",
      fecha: "2025-09-25 20:15",
      restaurante: "Pizza Planet",
      precio: 45000,
    },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const handleAceptar = (id) => {
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, estado: "Aceptado" } : p
      )
    );
  };

  const handleRechazar = (id) => {
    if (window.confirm("¿Seguro que quieres rechazar este pedido?")) {
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, estado: "Rechazado" } : p
        )
      );
    }
  };

  const handleOpenModal = (pedido) => {
    setPedidoSeleccionado(pedido);
    setModalOpen(true);
  };

  const handleChangeEstado = (nuevoEstado) => {
    if (pedidoSeleccionado) {
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoSeleccionado.id ? { ...p, estado: nuevoEstado } : p
        )
      );
    }
    setModalOpen(false);
    setPedidoSeleccionado(null);
  };

  const pedidosFiltrados = pedidos.filter((p) =>
    filtro === "Todos" ? true : p.estado === filtro
  );

  return (
    <div className="container">
      <h2 className="titulo">Pedidos del repartidor</h2>

      <div className="filtros">
        {["Todos", "Pendiente", "Aceptado", "Rechazado"].map((f) => (
          <button
            key={f}
            className={`filtro ${filtro === f ? "filtroActivo" : ""}`}
            onClick={() => setFiltro(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div>
        {pedidosFiltrados.map((pedido) => (
          <div key={pedido.id} className="card">
            <div className="cardHeader">
              <span className="estado">{pedido.estado}</span>
              <span className="fecha">{pedido.fecha}</span>
            </div>
            <div className="restaurante">{pedido.restaurante}</div>
            <div className="precio">${pedido.precio}</div>
            <div className="cardFooter">
              <button
                className={`boton ${pedido.estado !== "Pendiente" ? "botonDeshabilitado" : ""}`}
                onClick={() => handleAceptar(pedido.id)}
                disabled={pedido.estado !== "Pendiente"}
              >
                ✓ Aceptar
              </button>
              <button
                className={`boton ${pedido.estado !== "Pendiente" ? "botonDeshabilitado" : ""}`}
                onClick={() => handleRechazar(pedido.id)}
                disabled={pedido.estado !== "Pendiente"}
              >
                ✕ Rechazar
              </button>
              <button
                className="boton"
                onClick={() => handleOpenModal(pedido)}
              >
                ✎ Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      <EditarEstadoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onChangeEstado={handleChangeEstado}
      />
    </div>
  );
};

export default RepartidorVistaPedidos;