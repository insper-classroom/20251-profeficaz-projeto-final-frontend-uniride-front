import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Inicio from "./Inicio";
import SolicitarCarona from "./SolicitarCarona";
import OferecerCarona from "./OferecerCarona";
import Avaliacoes from "./Avaliacoes";
import Perfil from "./Perfil";
import Layout from "./Layout";
import Configuracoes from "./Configuracoes";
import "./App.css";

function App() {
  const handleLogin = (token) => {
    console.log("Usuário logado com token:", token);
  };

  return (
    <Router>
      <Routes>
        {/* Rotas sem barra */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/cadastro" element={<Register />} />

        {/* Rotas com barra */}
        <Route path="/inicio" element={<Layout><Inicio /></Layout>} />
        <Route path="/solicitar" element={<Layout><SolicitarCarona /></Layout>} />
        <Route path="/oferecer" element={<Layout><OferecerCarona /></Layout>} />
        <Route path="/avaliacoes" element={<Layout><Avaliacoes /></Layout>} />
        <Route path="/perfil" element={<Layout><Perfil /></Layout>} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </Router>
  );
}

export default App;