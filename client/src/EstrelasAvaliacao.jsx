import React, { useState } from "react";
import axios from "axios";

export default function EstrelasAvaliacao({ caronaId, tipo, passageiroId }) {
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [comentario, setComentario] = useState("");
  const [mensagem, setMensagem] = useState("");

  const enviarAvaliacao = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMensagem("Usuário não autenticado.");
      return;
    }

    const url = tipo === "motorista"
      ? `http://localhost:5000/caronas/${caronaId}/avaliar_motorista`
      : `http://localhost:5000/caronas/${caronaId}/avaliar_passageiro`;

    const body = tipo === "motorista"
      ? { nota: notaSelecionada, comentario: comentario }
      : { nota: notaSelecionada, comentario: comentario, passageiro_id: passageiroId };

    if (notaSelecionada < 1 || notaSelecionada > 5) {
      setMensagem("Selecione uma nota entre 1 e 5.");
      return;
    }

    axios.post(url, body, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setMensagem("✅ Avaliação enviada!");
    })
    .catch(err => {
      console.error("Erro ao enviar avaliação:", err.response ? err.response.data : err.message);
      setMensagem("Erro ao enviar avaliação.");
    });
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <div>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => setNotaSelecionada(star)}
            style={{
              cursor: "pointer",
              color: star <= notaSelecionada ? "gold" : "gray",
              fontSize: "1.5rem"
            }}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        placeholder="Comentário (opcional)"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        style={{ width: "100%", marginTop: "5px" }}
      ></textarea>
      <br />
      <button onClick={enviarAvaliacao} style={{ marginTop: "5px" }}>
        Enviar Avaliação
      </button>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}