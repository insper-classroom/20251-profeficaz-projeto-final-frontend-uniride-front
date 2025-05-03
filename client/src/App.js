import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Inicio from "./Inicio";
import Perfil from "./Perfil";
import SolicitarCarona from "./SolicitarCarona";
import OferecerCarona from "./OferecerCarona";
import Avaliacoes from "./Avaliacoes";
import "./App.css";

// Importando imagens da pasta src/assets
import homeIcon from "./assets/home.png";
import perfilIcon from "./assets/perfil.png";
import estrelaIcon from "./assets/estrela.png";
import configIcon from "./assets/configuracoes.png";

function App() {
  const [token, setToken] = useState(null);
  const showHomebar = window.location.pathname !== "/" && window.location.pathname !== "/cadastro";

  return (
    <Router>
      <div className="app-wrapper">
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Login onLogin={setToken} />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/solicitar" element={<SolicitarCarona />} />
            <Route path="/oferecer" element={<OferecerCarona />} />
            <Route path="/avaliacoes" element={<Avaliacoes />} />
          </Routes>
        </div>

        {showHomebar && (
          <div className="homebar">
            <a href="/inicio" title="Início">
              <img src={homeIcon} alt="Início" className="icon" />
            </a>
            <a href="/perfil" title="Perfil">
              <img src={perfilIcon} alt="Perfil" className="icon" />
            </a>
            <a href="/avaliacoes" title="Avaliações">
              <img src={estrelaIcon} alt="Avaliações" className="icon" />
            </a>
            <a href="/configuracoes" title="Configurações">
              <img src={configIcon} alt="Configurações" className="icon" />
            </a>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;