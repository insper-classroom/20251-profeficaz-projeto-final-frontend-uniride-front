import React, { useEffect, useState } from "react";
import "./App.css";
import fundoAvaliacao from "./assets/avaliacoes.png";
import Layout from "./Layout";
import axios from "axios";

export default function Avaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState([]);

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
      if (usuario.avaliacoes_recebidas) {
        setAvaliacoes(usuario.avaliacoes_recebidas);
      } else {
        setAvaliacoes([]); // Não tem avaliações
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
      <div className="solicitar-wrapper">
        <div
          className="imagem-fundo"
          style={{ backgroundImage: `url(${fundoAvaliacao})` }}
        ></div>

        <div className="solicitar-container">
          <h1>Avaliações Recebidas</h1>
          {avaliacoes.length > 0 ? (
            <ul className="lista-avaliacoes">
              {avaliacoes.map((avaliacao, index) => (
                <li key={index} className="item-avaliacao">
                  <div className="estrela">⭐ {avaliacao.nota}</div>
                  <p>{avaliacao.comentario}</p>
                  <p><strong>Tipo:</strong> {avaliacao.tipo}</p>
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