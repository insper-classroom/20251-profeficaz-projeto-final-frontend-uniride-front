import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import EstrelasAvaliacao from "./EstrelasAvaliacao"; // IMPORTANTE: importar

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [minhasCaronasOferecidas, setMinhasCaronasOferecidas] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Usuário não autenticado");
      navigate("/");
      return;
    }

    // Buscar perfil
    axios
      .get("http://127.0.0.1:5000/perfil", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUsuario(res.data))
      .catch((err) => {
        console.error("Erro ao carregar perfil:", err);
        alert("Erro ao carregar perfil. Faça login novamente.");
        navigate("/");
      });

    // Buscar minhas caronas oferecidas (para avaliar passageiros depois)
    axios
      .get("http://127.0.0.1:5000/caronas/minhas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMinhasCaronasOferecidas(res.data))
      .catch((err) => console.error("Erro ao buscar minhas caronas:", err));
  }, []);

  const voltar = () => navigate("/inicio");

  if (!usuario) return <p>Carregando...</p>;

  return (
    <div className="login-container">
      <h1>Perfil do Usuário</h1>
      <p><strong>Nome:</strong> {usuario.nome}</p>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Matrícula:</strong> {usuario.matricula}</p>
      <p><strong>Endereço:</strong> {usuario.endereco?.rua}, {usuario.endereco?.numero}</p>
      <p><strong>Nota como Motorista:</strong> {usuario.nota_como_motorista?.toFixed(1) || "N/A"}</p>
      <p><strong>Nota como Passageiro:</strong> {usuario.nota_como_passageiro?.toFixed(1) || "N/A"}</p>


      <h2>Minhas Caronas Reservadas</h2>
      {usuario.caronas_reservadas && usuario.caronas_reservadas.length > 0 ? (
        <ul className="lista-avaliacoes">
          {usuario.caronas_reservadas.map((carona) => (
            <li key={carona._id} className="item-avaliacao">
              <div><strong>Motorista:</strong> {carona.motorista_id}</div>
              <div><strong>🏠 Origem:</strong> {carona.local_saida.rua}</div>
              <div><strong>🎯 Destino:</strong> {carona.destino.rua}</div>
              <div><strong>🕒 Data/Hora:</strong> {new Date(carona.horario_saida).toLocaleString()}</div>
              <div><strong>Observações:</strong> {carona.information || "Nenhuma"}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Você ainda não reservou nenhuma carona.</p>
      )}

      <h2>Caronas Finalizadas para Avaliar Motorista</h2>
      {usuario.caronas_reservadas &&
      usuario.caronas_reservadas.filter(c => c.status === 'completa').length > 0 ? (
        <ul className="lista-avaliacoes">
          {usuario.caronas_reservadas.filter(c => c.status === 'completa').map(carona => (
            <li key={carona._id} className="item-avaliacao">
              <div><strong>Motorista:</strong> {carona.motorista_id}</div>
              <div><strong>Origem:</strong> {carona.local_saida.rua}</div>
              <div><strong>Destino:</strong> {carona.destino.rua}</div>
              <div><strong>Data/Hora:</strong> {new Date(carona.horario_saida).toLocaleString()}</div>

              <p><strong>Avaliar Motorista:</strong></p>
              {!usuario.avaliacoes_recebidas.some(av =>
                av.carona_id === carona._id && av.tipo === 'motorista'
              ) ? (
                <EstrelasAvaliacao caronaId={carona._id} tipo="motorista" />
              ) : (
                <p>✅ Você já avaliou este motorista.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Você não tem caronas finalizadas para avaliar motorista.</p>
      )}

      <h2>Caronas Finalizadas como Motorista (Avaliar Passageiros)</h2>
      {minhasCaronasOferecidas &&
      minhasCaronasOferecidas.filter(c => c.status === 'completa').length > 0 ? (
        <ul className="lista-avaliacoes">
          {minhasCaronasOferecidas.filter(c => c.status === 'completa').map(carona => (
            <li key={carona._id} className="item-avaliacao">
              <div><strong>Origem:</strong> {carona.local_saida.rua}</div>
              <div><strong>Destino:</strong> {carona.destino.rua}</div>
              <div><strong>Data/Hora:</strong> {new Date(carona.horario_saida).toLocaleString()}</div>

              <p><strong>Avaliar Passageiros:</strong></p>
              {carona.passageiros_ids && carona.passageiros_ids.length > 0 ? (
                carona.passageiros_ids.map(pid => (
                  <div key={pid}>
                    <p>Passageiro ID: {pid}</p>
                    {!usuario.avaliacoes_recebidas.some(av =>
                      av.carona_id === carona._id &&
                      av.tipo === 'passageiro' &&
                      av.passageiro_id === pid
                    ) ? (
                      <EstrelasAvaliacao
                        caronaId={carona._id}
                        tipo="passageiro"
                        passageiroId={pid}
                      />
                    ) : (
                      <p>✅ Você já avaliou este passageiro.</p>
                    )}
                  </div>
                ))
              ) : (
                <p>Não há passageiros nesta carona.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Você não tem caronas finalizadas para avaliar passageiros.</p>
      )}

    </div>
  );
}