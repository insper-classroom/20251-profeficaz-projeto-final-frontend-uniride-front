import React from "react";
import "./App.css";
import fundoAvaliacao from "./assets/avaliacoes.png"; // Importa a imagem corretamente

export default function Avaliacoes() {
  const avaliacoes = [
    { id: 1, nota: 5, comentario: "Motorista pontual e simpático!" },
    { id: 2, nota: 4, comentario: "Boa experiência, mas chegou com atraso." },
    { id: 3, nota: 5, comentario: "Carona excelente!" },
  ];

  return (
    <div className="solicitar-wrapper">
      <div
        className="imagem-fundo"
        style={{ backgroundImage: `url(${fundoAvaliacao})` }}
      ></div>

      <div className="solicitar-container">
        <ul className="lista-avaliacoes">
          {avaliacoes.map((avaliacao) => (
            <li key={avaliacao.id} className="item-avaliacao">
              <div className="estrela">⭐ {avaliacao.nota}</div>
              <p>{avaliacao.comentario}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}