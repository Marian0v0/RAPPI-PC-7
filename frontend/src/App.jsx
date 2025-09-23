import React from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
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
    path: "/perfil",
    element: <VistaCuenta />,
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
