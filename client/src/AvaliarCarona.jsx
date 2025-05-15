import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

export default function AvaliarCarona() {
  const { id } = useParams(); // Pega o id da carona da URL
  const navigate = useNavigate();

  const [carona, setCarona] = useState(null);
  const [notaMotorista, setNotaMotorista] = useState("");
  const [comentarioMotorista, setComentarioMotorista] = useState("");
  const [avaliacoesPassageiros, setAvaliacoesPassageiros] = useState({});
  const [mensagem, setMensagem] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Usuário não autenticado");
      navigate("/");
      return;
    }

    axios.get(`http://127.0.0.1:5000/caronas/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCarona(res.data))
    .catch(err => {
      console.error("Erro ao buscar carona:", err);
      alert("Erro ao buscar carona.");
      navigate("/inicio");
    });
  }, [id]);

  const handleNotaPassageiro = (pid, nota) => {
    setAvaliacoesPassageiros(prev => ({
      ...prev,
      [pid]: {
        ...prev[pid],
        nota
      }
    }));
  };

  const handleComentarioPassageiro = (pid, comentario) => {
    setAvaliacoesPassageiros(prev => ({
      ...prev,
      [pid]: {
        ...prev[pid],
        comentario
      }
    }));
  };

  const enviarAvaliacoes = () => {
    if (!token) return;

    // Avaliar o motorista
    axios.post(`http://127.0.0.1:5000/caronas/${id}/avaliar_motorista`, {
      nota: parseFloat(notaMotorista),
      comentario: comentarioMotorista,
      avaliador_id: carona.passageiros_ids[0],
      avaliado_id: carona.motorista_id
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      // Agora avaliar cada passageiro (um por um)
      const avaliacoesPromises = carona.passageiros_ids.map(pid => {
        const avaliacao = avaliacoesPassageiros[pid] || {};
        return axios.post(`http://127.0.0.1:5000/caronas/${id}/avaliar_passageiro`, {
          passageiro_id: pid,
          nota: parseFloat(avaliacao.nota || 0),
          comentario: avaliacao.comentario || "",
          avaliador_id: carona.motorista_id,
          avaliado_id: pid
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      });

      return Promise.all(avaliacoesPromises);
    })
    .then(() => {
      setMensagem("Avaliações enviadas com sucesso!");
      setTimeout(() => navigate("/inicio"), 2000);
    })
    .catch(err => {
      console.error("Erro ao enviar avaliações:", err.response ? err.response.data : err.message);
      setMensagem("Erro ao enviar avaliações. Confira as notas e comentários.");
    });
  };

  if (!carona) return <p>Carregando carona...</p>;

  return (
    <div className="solicitar-container">
      <h1>Avaliar Carona</h1>
      <p><strong>Destino:</strong> {carona.destino.rua}</p>

      <h2>Avaliar Motorista</h2>
      <p>ID: {carona.motorista_id}</p>
      <input
        type="number"
        min="1"
        max="5"
        placeholder="Nota 1 a 5"
        value={notaMotorista}
        onChange={(e) => setNotaMotorista(e.target.value)}
      />
      <textarea
        placeholder="Comentário para o motorista"
        value={comentarioMotorista}
        onChange={(e) => setComentarioMotorista(e.target.value)}
      ></textarea>

      <h2>Avaliar Passageiros</h2>
      {carona.passageiros_ids && carona.passageiros_ids.length > 0 ? (
        carona.passageiros_ids.map(pid => (
          <div key={pid} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <p>Passageiro ID: {pid}</p>
            <input
              type="number"
              min="1"
              max="5"
              placeholder="Nota 1 a 5"
              value={avaliacoesPassageiros[pid]?.nota || ""}
              onChange={(e) => handleNotaPassageiro(pid, e.target.value)}
            />
            <textarea
              placeholder="Comentário"
              value={avaliacoesPassageiros[pid]?.comentario || ""}
              onChange={(e) => handleComentarioPassageiro(pid, e.target.value)}
            ></textarea>
          </div>
        ))
      ) : (
        <p>Não há passageiros.</p>
      )}

      <button onClick={enviarAvaliacoes}>Enviar Avaliações</button>
      {mensagem && <p className="mensagem">{mensagem}</p>}
    </div>
  );
}