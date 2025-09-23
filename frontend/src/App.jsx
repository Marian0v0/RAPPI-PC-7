import React from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import VRestaurante from "./components/vista_restaurante/vista_restaurante";

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
    path: "/restaurantes/:nombreRestaurante",
    element: <VRestaurante/>,
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
