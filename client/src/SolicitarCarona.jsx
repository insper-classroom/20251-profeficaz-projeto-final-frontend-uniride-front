import React, { useState, useEffect } from "react";
import fundo from "./assets/fundo-caronas.png";
import "./App.css";
import axios from "axios";

export default function SolicitarCarona() {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [caronas, setCaronas] = useState([]);

  // Carregar as caronas do backend ao abrir a página
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("TOKEN ATUAL:", token); // 👈 VERIFICAR TOKEN

    if (!token) {
      alert("Usuário não autenticado");
      window.location.href = "/";
      return;
    }

    axios
      .get("http://localhost:5000/caronas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("DADOS RECEBIDOS DO BACK:", response.data); // 👈 VERIFICAR DADOS RECEBIDOS
        setCaronas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar caronas:", error.response ? error.response.data : error.message);
        setCaronas([]); // Em caso de erro, mostra como sem caronas
      });
  }, []);

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
        <h1>Solicitar Carona</h1>
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

        <h2>Caronas disponíveis</h2>
        {caronas.length > 0 ? (
          <ul className="lista-avaliacoes">
            {caronas.map((carona) => (
              <li key={carona._id} className="item-avaliacao">
                <div><strong>Motorista:</strong> {carona.motorista_id}</div>
                <div>
                  <strong>Origem:</strong> {carona.local_saida.rua}, {carona.local_saida.bairro}, {carona.local_saida.cidade}
                </div>
                <div>
                  <strong>Destino:</strong> {carona.destino.rua}, {carona.destino.bairro}, {carona.destino.cidade}
                </div>
                <div>
                  <strong>Data/Hora:</strong> {new Date(carona.horario_saida).toLocaleString()}
                </div>
                <div>
                  <strong>Vagas:</strong> {carona.vagas_disponiveis}
                </div>
                {carona.information && (
                  <div>
                    <strong>Informações:</strong> {carona.information}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma carona disponível no momento.</p>
        )}
      </div>
    </div>
  );
}