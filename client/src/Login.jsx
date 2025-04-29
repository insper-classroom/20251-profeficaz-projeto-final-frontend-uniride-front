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
    <form onSubmit={handleSubmit}>
      <input value={nome} onChange={e => setUsername(e.target.value)} placeholder="Usuário" />
      <input value={senha} type="senha" onChange={e => setPassword(e.target.value)} placeholder="Senha" />
      <Link to="/cadastro">Criar uma conta</Link>
      <button type="submit">Entrar</button>
    </form>
  );
}