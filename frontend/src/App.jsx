import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
    <Router>
      <Routes>
        <Route path="/"  element={<LoginPage/>} />
        <Route path="/restaurantes/:nombreRestaurante" element={<VRestaurante/>} />
      </Routes>
    </Router>
  );
}

export default App;
