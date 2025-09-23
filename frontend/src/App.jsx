import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import VRestaurante from "./components/vista_restaurante/vista_restaurante";
import LoginPage from "./pages/Login/LoginPage";
import RepartidorLogin from "./pages/RepartidorLogin/RepartidorLogin";
import ClienteLogin from "./pages/ClienteLogin/ClienteLogin";
import RegistroPage from "./pages/Registro/RegistroPage";
import RegistroCliente from "./pages/RegistroCliente/RegistroCliente";
import RegistroRepartidor from "./pages/RegistroRepartidor/RegistroRepartidor";
import VistaCuenta from "./pages/perfil/VistaCuenta";

const router = createBrowserRouter([
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
    path: "/restaurantes/:nombreRestaurante",
    element: <VRestaurante/>,
  }
  {
    path: "/perfil",
    element: <VistaCuenta />,
  },

]);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="login"/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/restaurantes/:nombreRestaurante" element={<VRestaurante/>} />
      </Routes>
    </Router>
  );
}

export default App;
