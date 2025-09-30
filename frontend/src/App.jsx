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
import SeccionCuenta from "./pages/Cuenta/SeccionCuenta/seccionCuenta";
import RegistroRestaurante from "./pages/RegistroRestaurante/RegistroRestaurante";
import Layout from "./components/PerfilMenu/Layout";
import ProfileInfo from "./components/PerfilCliente/ProfileInfo";
import Payments from "./components/PerfilCliente/Payments";
import RestaurantProfile from "./components/PerfilComercio/RestaurantProfile";
import CommerceProfile from "./components/PerfilComercio/CommerceProfile";

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
    element: <VistaComecio/>,
  },
  {
    path:"/restaurantes/:nombreRestaurante",
    element: <VistaRestaurante/>,
  },
  {
    path: "/repartidor/repartidorPedidos",
    element: <RepartidorVistaPedidos/>,
  },
  {
    path: "/restaurantes/:nombreRestaurante",
    element: <VistaRestaurante/>,
  },
  {
    path: "/perfil",
    element: <Layout><ProfileInfo /></Layout>,
  },
  {
    path: "/ajustes",
    element: <Layout><ProfileInfo /></Layout>,
  },
  {
    path: "/payments",
    element: <Layout><Payments /></Layout>,
  },
  {
    path: "/restaurant-profile",
    element: <Layout><RestaurantProfile /></Layout>,
  },
  {
    path: "/commerce-profile",
    element: <Layout><CommerceProfile /></Layout>,
  },
]);


function App() {
  return (
    <React.Fragment>
      <RouterProvider router={router} />
    </React.Fragment>
  );
}

export default App;
