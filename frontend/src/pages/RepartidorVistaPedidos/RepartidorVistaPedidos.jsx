import React, { useState, useEffect } from "react";
import EditarEstadoModal from "../../components/editarEstadoPedido/EditarEstadoModal";
import "./RepartidorVistaPedidos.css";

const RepartidorVistaPedidos = () => {
  const [filtro, setFiltro] = useState("Pendiente");
  const [pedidos, setPedidos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  // Cargar pedidos desde la API al montar el componente
  useEffect(() => {
    fetch("http://localhost:3000/backend/repartidor/pendientes")
      .then((res) => res.json())
      .then((data) => setPedidos(data))
      .catch((err) => console.error("Error al obtener pedidos:", err));
  }, []);

  const handleAceptar = async (id) => {
    try {
      const res = await fetch("http://localhost:3000/backend/repartidor/pedidos/aceptar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Error al aceptar pedido");
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: "Aceptado" } : p))
      );
    } catch (error) {
      console.error(error);
      alert("No se pudo aceptar el pedido");
    }
  };

  const handleRechazar = async (id) => {
    if (window.confirm("¿Seguro que quieres rechazar este pedido?")) {
      try {
        const res = await fetch("http://localhost:3000/backend/repartidor/pedidos/rechazar", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error("Error al rechazar pedido");
        setPedidos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, estado: "Rechazado" } : p))
        );
      } catch (error) {
        console.error(error);
        alert("No se pudo rechazar el pedido");
      }
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
                className={`boton ${
                  pedido.estado !== "Pendiente" ? "botonDeshabilitado" : ""
                }`}
                onClick={() => handleAceptar(pedido.id)}
                disabled={pedido.estado !== "Pendiente"}
              >
                ✓ Aceptar
              </button>
              <button
                className={`boton ${
                  pedido.estado !== "Pendiente" ? "botonDeshabilitado" : ""
                }`}
                onClick={() => handleRechazar(pedido.id)}
                disabled={pedido.estado !== "Pendiente"}
              >
                ✕ Rechazar
              </button>
              <button className="boton" onClick={() => handleOpenModal(pedido)}>
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