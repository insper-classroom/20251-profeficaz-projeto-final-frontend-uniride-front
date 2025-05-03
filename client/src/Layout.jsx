import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./App.css";

// Importando as imagens
import homeIcon from "./assets/home.png";
import estrelaIcon from "./assets/estrela.png";
import perfilIcon from "./assets/perfil.png";
import configIcon from "./assets/configuracoes.png";

export default function Layout({ children }) {
  const location = useLocation();
  const hideBar = location.pathname === "/" || location.pathname === "/cadastro";

  return (
    <div className="app-wrapper">
      <div className="app-content">{children}</div>

      {!hideBar && (
        <div className="homebar">
          <Link to="/inicio">
            <img src={homeIcon} alt="Início" className="icon" />
          </Link>
          <Link to="/avaliacoes">
            <img src={estrelaIcon} alt="Avaliações" className="icon" />
          </Link>
          <Link to="/perfil">
            <img src={perfilIcon} alt="Perfil" className="icon" />
          </Link>
          <Link to="/configuracoes">
            <img src={configIcon} alt="Configurações" className="icon" />
          </Link>
        </div>
      )}
    </div>
  );
}