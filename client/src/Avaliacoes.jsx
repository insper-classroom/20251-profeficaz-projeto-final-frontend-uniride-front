import React, { useEffect, useState } from "react";
import "./App.css";
import fundoAvaliacao from "./assets/avaliacoes.png";
import axios from "axios";
import Layout from "./Layout"; // Layout padrão já inclui HomeBar

export default function Avaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [notaMotorista, setNotaMotorista] = useState(0);
  const [notaPassageiro, setNotaPassageiro] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado");
      window.location.href = "/";
      return;
    }

    axios.get("http://localhost:5000/perfil", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      const usuario = response.data;
      setNotaMotorista(usuario.nota_como_motorista ?? 0);
      setNotaPassageiro(usuario.nota_como_passageiro ?? 0);
      if (usuario.avaliacoes_recebidas && Array.isArray(usuario.avaliacoes_recebidas)) {
        setAvaliacoes(usuario.avaliacoes_recebidas);
      } else {
        setAvaliacoes([]);
      }
    })
    .catch(error => {
      console.error("Erro ao buscar avaliações:", error);
      alert("Erro ao buscar avaliações. Faça login novamente.");
      window.location.href = "/";
    });
  }, []);

  return (
    <Layout>
      {/* Aqui dentro vai só o conteúdo */}
      <div className="solicitar-wrapper">
        <div
          className="imagem-fundo"
          style={{ backgroundImage: `url(${fundoAvaliacao})` }}
        ></div>

        <div className="solicitar-container">

          <p><strong>Nota como Motorista:</strong> {notaMotorista ? notaMotorista.toFixed(1) : "N/A"}</p>
          <p><strong>Nota como Passageiro:</strong> {notaPassageiro ? notaPassageiro.toFixed(1) : "N/A"}</p>

          {avaliacoes.length > 0 ? (
            <ul className="lista-avaliacoes">
              {avaliacoes.map((avaliacao, index) => (
                <li key={index} className="item-avaliacao">
                  <div className="estrela">⭐ {avaliacao.nota ?? "Sem nota"}</div>
                  <p>{avaliacao.comentario || "Sem comentário"}</p>
                  <p><strong>Tipo:</strong> {avaliacao.tipo || "Não especificado"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Você ainda não recebeu nenhuma avaliação.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}