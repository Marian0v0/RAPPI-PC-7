import Perfil from "../../components/perfil/perfil";

import "./VistaCuenta.css";

export default function VistaCuenta() {
  return (
    <div className="vista-cuenta">
      <h1>Mi Cuenta</h1>

      {/* Ejemplos de uso */}
      <Perfil tipo="cliente" id={1} />
      <Perfil tipo="restaurante" id={2} />
      <Perfil tipo="comercio" id={3} />
    </div>
  );    
}
