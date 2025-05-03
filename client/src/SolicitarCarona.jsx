import React, { useState } from "react";
import fundo from "./assets/fundo-caronas.png"; // importa diretamente
import "./App.css";

export default function SolicitarCarona() {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensagem("Pedido de carona enviado com sucesso!");
  };

  return (
    <div className="solicitar-wrapper">
      <div
        className="imagem-fundo"
        style={{ backgroundImage: `url(${fundo})` }}
      ></div>

      <div className="solicitar-container">
        <h1> Solicitar Carona</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Origem</label>
            <input
              type="text"
              placeholder="Digite o local de partida"
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Destino</label>
            <input
              type="text"
              placeholder="Digite o destino"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              required
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Horário</label>
              <input
                type="time"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit">Solicitar</button>
          {mensagem && <p className="mensagem">{mensagem}</p>}
        </form>
      </div>
    </div>
  );
}