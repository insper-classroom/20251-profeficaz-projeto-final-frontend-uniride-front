import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const [nome, setUsername] = useState("");
  const [senha, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", {
        nome,
        senha,
      });
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      onLogin(token);
    } catch (err) {
      alert("Login falhou");
    }
  };

  return (
    <div className="login-container">
      <h1>Bem-vindo ao Uniride</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuário"
          required
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <button type="submit">Entrar</button>
      </form>
      <Link to="/cadastro">Não tem conta? Cadastre-se</Link>
    </div>
  );
}