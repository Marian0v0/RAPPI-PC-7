import React from "react";
import Sidebar from "./Sidebar";
import "./Layout.css"; // Importamos solo los estilos del Layout

function Layout({ children }) {
  return (
    <div className="profile-layout-app">
      <div className="profile-main-layout">
        <div className="profile-sidebar-container">
          <Sidebar />
        </div>
        <div className="profile-main-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;