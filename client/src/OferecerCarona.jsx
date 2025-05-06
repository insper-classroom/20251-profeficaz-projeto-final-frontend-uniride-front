import React, { useState, useEffect } from "react";
import fundo from "./assets/fundo-caronas.png"; // importa diretamente
import "./App.css";
import axios from "axios";

export default function OferecerCarona() {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [vagas, setVagas] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [minhasCaronas, setMinhasCaronas] = useState([]);

  const token = localStorage.getItem("token");

  // Carregar minhas caronas cadastradas ao abrir a página
  useEffect(() => {
    if (!token) {
      alert("Usuário não autenticado");
      window.location.href = "/";
      return;
    }

    carregarMinhasCaronas();
  }, []);

  const carregarMinhasCaronas = () => {
    axios
      .get("http://localhost:5000/caronas/minhas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMinhasCaronas(res.data);
      })
      .catch((err) => {
        console.error("Erro ao carregar minhas caronas:", err.response ? err.response.data : err.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      alert("Usuário não autenticado");
      window.location.href = "/";
      return;
    }

    const dataCompleta = `${data}T${horario}`; // ISO format
    const caronaData = {
      local_saida: {
        rua: origem,
        numero: "S/N",
        bairro: "Não especificado",
        cidade: "Não especificado",
        cep: "00000-000"
      },
      destino: {
        rua: destino,
        numero: "S/N",
        bairro: "Não especificado",
        cidade: "Não especificado",
        cep: "00000-000"
      },
      horario_saida: dataCompleta,
      vagas_disponiveis: Math.max(parseInt(vagas), 0),
      information: observacoes
    };

    axios.post("http://localhost:5000/caronas", caronaData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMensagem("Oferta de carona registrada com sucesso!");
      setOrigem("");
      setDestino("");
      setData("");
      setHorario("");
      setVagas("");
      setObservacoes("");

      // Atualizar a lista de caronas
      carregarMinhasCaronas();
    })
    .catch((error) => {
      console.error("Erro ao criar carona:", error.response ? error.response.data : error.message);
      setMensagem("Erro ao registrar a carona. Tente novamente.");
    });
  };

  return (
    <div className="solicitar-wrapper">
      <div
        className="imagem-fundo"
        style={{ backgroundImage: `url(${fundo})` }}
      ></div>

      <div className="solicitar-container">
        <h1>Oferecer Carona</h1>
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

          <div className="input-group">
            <label>Nº de Vagas</label>
            <input
              type="number"
              placeholder="Ex: 3"
              value={vagas}
              onChange={(e) => setVagas(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Observações</label>
            <textarea
              placeholder="Informações adicionais (Ex.: Aceito bagagem, trago pet no carro, etc.)"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows="3"
            ></textarea>
          </div>

          <button type="submit">Oferecer</button>
          {mensagem && <p className="mensagem">{mensagem}</p>}
        </form>

        <h2>Minhas Caronas Cadastradas</h2>
        {minhasCaronas.length > 0 ? (
          <ul className="lista-avaliacoes">
            {minhasCaronas.map((carona) => (
              <li key={carona._id} className="item-avaliacao">
                <div><strong>🏠 Origem:</strong> {carona.local_saida.rua}</div>
                <div><strong>🎯 Destino:</strong> {carona.destino.rua}</div>
                <div><strong>🕒 Data/Hora:</strong> {new Date(carona.horario_saida).toLocaleString()}</div>
                <div><strong>🚗 Vagas:</strong> {carona.vagas_disponiveis}</div>
                <div><strong>Observações:</strong> {carona.information || "Nenhuma"}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Você ainda não cadastrou nenhuma carona.</p>
        )}
      </div>
    </div>
  );
}