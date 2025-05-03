// src/Perfil.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/usuario", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUsuario(res.data))
      .catch(() => alert("Erro ao carregar perfil"));
  }, []);

  const voltar = () => navigate("/inicio");

  if (!usuario) return <p>Carregando...</p>;

  return (
    <div className="login-container">
      <h1>Perfil do Usuário</h1>
      <p><strong>Nome:</strong> {usuario.nome}</p>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Matrícula:</strong> {usuario.matricula}</p>
      <p><strong>Endereço:</strong> {usuario.endereco?.rua}, {usuario.endereco?.numero}</p>
      <button onClick={voltar}>Voltar</button>
    </div>
  );
}