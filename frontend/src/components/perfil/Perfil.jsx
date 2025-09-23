import { useEffect, useState } from "react";
import "./Perfil.css";

export default function Perfil({ tipo, id }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = "";
        if (tipo === "cliente") endpoint = `/backend/clientes/${id}`;
        if (tipo === "restaurante") endpoint = `/backend/restaurantes/id/${id}`;
        if (tipo === "comercio") endpoint = `/backend/comercios/${id}`;

        const res = await fetch(`http://localhost:3000${endpoint}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    fetchData();
  }, [tipo, id]);

  if (!data) return <p>Cargando...</p>;

  return (
    <div className="perfil-container">
      <div className="perfil-sidebar">
        <div className="avatar">
          {data.nombre_cliente?.[0] ||
            data.nombre_restaurante?.[0] ||
            data.nombre_encargado?.[0]}
        </div>
        <h3>
          {data.nombre_cliente ||
            data.nombre_restaurante ||
            data.nombre_encargado}{" "}
          {data.apellido_encargado || ""}
        </h3>
        <p className="tipo">{tipo.toUpperCase()}</p>
      </div>

      <div className="perfil-info">
        <h2>Información de tu cuenta</h2>

        <div className="info-row">
          <span>Correo Electrónico:</span>
          <p>
            {data.correo_cliente ||
              data.email_restaurante ||
              data.correo_encargado}
          </p>
        </div>

        <div className="info-row">
          <span>Teléfono:</span>
          <p>
            {data.cel_cliente ||
              data.cel_restaurante ||
              data.telefono_encargado}
          </p>
        </div>

        {tipo === "cliente" && (
          <>
            <div className="info-row">
              <span>Ciudad:</span>
              <p>{data.ciudad_cliente}</p>
            </div>
            <div className="info-row">
              <span>País:</span>
              <p>{data.pais_cliente}</p>
            </div>
          </>
        )}

        {tipo === "restaurante" && (
          <>
            <div className="info-row">
              <span>Tipo de comida:</span>
              <p>{data.tipo_comida}</p>
            </div>
            <div className="info-row">
              <span>Dirección:</span>
              <p>{data.direccion_restaurante}</p>
            </div>
          </>
        )}

        {tipo === "comercio" && (
          <>
            <div className="info-row">
              <span>Nombre de la marca:</span>
              <p>{data.nombre_marca}</p>
            </div>
            <div className="info-row">
              <span>Tipo de comercio:</span>
              <p>{data.tipo_comercio}</p>
            </div>
          </>
        )}

        <div className="actions">
          <button className="danger">Eliminar cuenta</button>
          <button className="secondary">Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}
