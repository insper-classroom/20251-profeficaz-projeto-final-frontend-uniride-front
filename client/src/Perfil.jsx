import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado");
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:5000/perfil", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUsuario(res.data))
      .catch((err) => {
        console.error("Erro ao carregar perfil:", err);
        alert("Erro ao carregar perfil. Faça login novamente.");
        navigate("/");
      });
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
      <p><strong>Nota como Motorista:</strong> {usuario.nota_como_motorista?.toFixed(1)}</p>
      <p><strong>Nota como Passageiro:</strong> {usuario.nota_como_passageiro?.toFixed(1)}</p>
      
    </div>
  );
}