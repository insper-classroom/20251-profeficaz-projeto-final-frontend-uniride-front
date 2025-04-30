// src/App.js
import React from "react";
import "./App.css";

function App() {
  return (
    <main className="login-container">
      <h1>Bem-vindo ao Uniride</h1>
      <form id="loginForm">
        <input type="text" placeholder="Usuário" id="username" required />
        <input type="password" placeholder="Senha" id="password" required />
        <button type="submit">Entrar</button>
      </form>
      <p>
        Não tem conta? <a href="#">Cadastre-se</a>
      </p>
    </main>
  );
}

export default App;