import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import "./App.css";

function App() {
  const handleLogin = (token) => {
    console.log("Usuário logado com token:", token);
    // Aqui pode ser usado para controlar o estado de autenticação do usuario futuramente, para ele acessar partes especificas do site
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/cadastro" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;