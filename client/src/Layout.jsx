
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./App.css";

export default function Layout({ children }) {
  const location = useLocation();
  const hideBar = location.pathname === "/" || location.pathname === "/cadastro";

  return (
    <div className="app-wrapper">
      <div className="app-content">{children}</div>

      {!hideBar && (
        <div className="homebar">
          <Link to="/inicio">Início</Link>
          <Link to="/solicitar">Solicitar</Link>
          <Link to="/perfil">Perfil</Link>
        </div>
      )}
    </div>
  );
}