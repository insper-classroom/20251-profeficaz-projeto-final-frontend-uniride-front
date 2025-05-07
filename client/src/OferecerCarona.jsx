import React, { useState, useEffect } from "react";
import fundo from "./assets/fundo-caronas.png";
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

  // Buscar caronas criadas pelo motorista
  const carregarMinhasCaronas = () => {
    if (!token) {
      setMensagem("Você precisa estar logado.");
      return;
    }

    axios
      .get("http://localhost:5000/caronas/minhas", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setMinhasCaronas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar minhas caronas:", error.response ? error.response.data : error.message);
      });
  };

  useEffect(() => {
    if (!token) {
      setMensagem("Você precisa estar logado para acessar esta página.");
      return;
    }
    carregarMinhasCaronas();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      setMensagem("Usuário não autenticado");
      return;
    }

    const dataCompleta = `${data}T${horario}`;
    const vagasInt = Math.max(parseInt(vagas), 0);

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
      vagas_disponiveis: vagasInt,
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
      carregarMinhasCaronas();
    })
    .catch((error) => {
      console.error("Erro ao criar carona:", error.response ? error.response.data : error.message);
      setMensagem("Erro ao registrar a carona. Tente novamente.");
    });
  };

  const excluirCarona = (idCarona) => {
    if (!token) return;

    if (!window.confirm("Tem certeza que deseja excluir esta carona?")) return;

    axios.delete(`http://localhost:5000/caronas/${idCarona}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMensagem("Carona excluída com sucesso!");
      carregarMinhasCaronas();
    })
    .catch((error) => {
      console.error("Erro ao excluir carona:", error.response ? error.response.data : error.message);
      setMensagem("Erro ao excluir carona.");
    });
  };

  // FUNÇÃO PARA FINALIZAR CARONA
  const finalizarCarona = (idCarona) => {
    if (!token) return;

    axios.post(`http://localhost:5000/caronas/${idCarona}/finalizar`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMensagem("Carona finalizada com sucesso!");
      carregarMinhasCaronas(); // Atualiza a lista sem sair da página
    })
    .catch((error) => {
      console.error("Erro ao finalizar carona:", error.response ? error.response.data : error.message);
      setMensagem("Erro ao finalizar carona.");
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

        <h2>Minhas Caronas</h2>
        {minhasCaronas.length > 0 ? (
          <ul className="lista-avaliacoes">
            {minhasCaronas.map((carona) => (
              <li key={carona._id} className="item-avaliacao">
                <div><strong>🏠 Origem:</strong> {carona.local_saida.rua}</div>
                <div><strong>🎯 Destino:</strong> {carona.destino.rua}</div>
                <div><strong>🕒 Data/Hora:</strong> {new Date(carona.horario_saida).toLocaleString()}</div>
                <div><strong>🚗 Vagas disponíveis:</strong> {Math.max(carona.vagas_disponiveis, 0)}</div>
                {carona.information && (
                  <div><strong>ℹ️ Informações:</strong> {carona.information}</div>
                )}

                {carona.status !== 'completa' ? (
                  <>
                    <button
                      onClick={() => finalizarCarona(carona._id)}
                      style={{
                        marginTop: "10px",
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                    >
                      Finalizar Carona
                    </button>
                    <button
                      onClick={() => excluirCarona(carona._id)}
                      style={{
                        marginTop: "10px",
                        backgroundColor: "#e63946",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                    >
                      Excluir
                    </button>
                  </>
                ) : (
                  <p style={{ color: "green", fontWeight: "bold" }}>✅ Carona finalizada</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Você ainda não criou caronas.</p>
        )}
      </div>
    </div>
  );
}