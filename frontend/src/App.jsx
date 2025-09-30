import React from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import RepartidorLogin from "./pages/RepartidorLogin/RepartidorLogin";
import ClienteLogin from "./pages/ClienteLogin/ClienteLogin";
import RegistroPage from "./pages/Registro/RegistroPage";
import RegistroCliente from "./pages/RegistroCliente/RegistroCliente";
import RegistroRepartidor from "./pages/RegistroRepartidor/RegistroRepartidor";
import VistaComecio from "./components/vista_comercio/vista_comercio";
import VistaRestaurante from "./components/vista_restaurante/vista_restaurante";
import RepartidorVistaPedidos from "./pages/RepartidorVistaPedidos/RepartidorVistaPedidos";
import AñadirFavoritos from "./pages/Cuenta/añadirFavoritos/AñadirFavoritos";
import SeccionCuenta from "./pages/Cuenta/SeccionCuenta";
import RegistroRestaurante from "./pages/RegistroRestaurante/RegistroRestaurante";


const router = createBrowserRouter([
  {
    path: "/registro/restaurante",
    element: <RegistroRestaurante/>,
  },
  {
    path: "/cuenta",
    element: <SeccionCuenta/>,
  },
  {
    path: "/",
    element: <AñadirFavoritos /> 
  },
  {
    path: "/añadirFavoritos", 
    element: <AñadirFavoritos/>,
  },
  {
    path: "/",
    element: <Navigate to="/login"/>
  },
  {
    path: "/login",
    element: <LoginPage/>,
  },
  {
    path: "/registro",
    element: <RegistroPage/>,
  },
  {
    path: "/registro/cliente",
    element: <RegistroCliente/>,
  },
  {
    path: "/registro/repartidor",
    element: <RegistroRepartidor/>,
  },
  {
    path: "/repartidor/login",
    element: <RepartidorLogin/>,
  },
  {
    path: "/cliente/login",
    element: <ClienteLogin/>,
  },
  {
    path:"/comercios/:nombreComercio",
    element: <VistaComecio/>
  },
  {
    path:"/restaurantes/:nombreRestaurante",
    element: <VistaRestaurante/>
  },
  {
    path: "/repartidor/repartidorPedidos",
    element: <RepartidorVistaPedidos/>,
  }
]);

function App() {
  return (
    <React.Fragment>
      <RouterProvider router={router} />
    </React.Fragment>
  );
}

export default App;
