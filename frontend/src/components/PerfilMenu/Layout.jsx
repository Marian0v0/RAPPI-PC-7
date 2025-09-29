import React from "react";
import Sidebar from "./Sidebar";
import "./Layout.css"; // Importamos solo los estilos del Layout

function Layout({ children }) {
  return (
    <div className="app">
      <div className="main-layout">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;