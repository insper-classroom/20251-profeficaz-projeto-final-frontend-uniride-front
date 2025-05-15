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
  const [reservaMensagem, setReservaMensagem] = useState("");
  const [usuarioId, setUsuarioId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado");
      window.location.href = "/";
      return;
    }

    // Buscar o perfil para saber quem é o usuário logado
    axios
      .get("http://127.0.0.1:5000/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsuarioId(response.data._id); // ou response.data.id dependendo do backend
      })
      .catch((error) => {
        console.error("Erro ao buscar perfil:", error);
      });

    carregarCaronas();
  }, []);

  const carregarCaronas = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:5000/caronas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCaronas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar caronas:", error);
        setCaronas([]);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensagem("Pedido de carona enviado com sucesso!");
  };

  const reservarCarona = (idCarona) => {
    const token = localStorage.getItem("token");

    axios.put(`http://127.0.0.1:5000/caronas/${idCarona}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setReservaMensagem("Carona reservada com sucesso!");
      carregarCaronas();
    })
    .catch(error => {
      console.error("Erro ao reservar carona:", error.response ? error.response.data : error.message);
      setReservaMensagem("Erro ao reservar carona.");
    });
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
        {reservaMensagem && <p className="mensagem">{reservaMensagem}</p>}

        {caronas.length > 0 ? (
          <ul className="lista-avaliacoes">
            {caronas.map((carona) => {
              const jaReservado = carona.passageiros_ids && carona.passageiros_ids.includes(usuarioId);

              return (
                <li key={carona._id} className="item-avaliacao">
                  <div><strong>Motorista:</strong> {carona.motorista_id}</div>
                  <div><strong>🏠 Origem:</strong> {carona.local_saida.rua}</div>
                  <div><strong>🎯 Destino:</strong> {carona.destino.rua}</div>
                  <div><strong>🕒 Data/Hora:</strong> {new Date(carona.horario_saida).toLocaleString()}</div>
                  <div><strong>🚗 Vagas:</strong> {Math.max(carona.vagas_disponiveis, 0)}</div>
                  {carona.information && (
                    <div><strong>ℹ️ Informações:</strong> {carona.information}</div>
                  )}

                  <button
                    onClick={() => reservarCarona(carona._id)}
                    disabled={carona.vagas_disponiveis <= 0 || jaReservado}
                    style={{
                      marginTop: "10px",
                      backgroundColor:
                        carona.vagas_disponiveis > 0 && !jaReservado
                          ? "#e63946"
                          : "#ccc",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      cursor:
                        carona.vagas_disponiveis > 0 && !jaReservado
                          ? "pointer"
                          : "not-allowed"
                    }}
                  >
                    {jaReservado
                      ? "Já reservado"
                      : carona.vagas_disponiveis > 0
                      ? "Reservar"
                      : "Sem vagas"}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Nenhuma carona disponível no momento.</p>
        )}
      </div>
    </div>
  );
}