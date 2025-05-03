import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";

export default function Configuracoes() {
    const [usuario, setUsuario] = useState(null);

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
            setUsuario(response.data);
        })
        .catch(error => {
            console.error("Erro ao buscar perfil:", error);
            alert("Erro ao buscar perfil. Faça login novamente.");
            window.location.href = "/";
        });
    }, []);

    if (!usuario) return <Layout><p>Carregando...</p></Layout>;

    return (
        <Layout>
            <div className="login-container">
                <h1>Meu Perfil</h1>
                <p><strong>Nome:</strong> {usuario.nome}</p>
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>Matrícula:</strong> {usuario.matricula}</p>
                <h2>Avaliações</h2>
                <p>Nota como Motorista: {usuario.nota_como_motorista || "N/A"}</p>
                <p>Nota como Passageiro: {usuario.nota_como_passageiro || "N/A"}</p>

                <h3>Avaliações Recebidas</h3>
                {usuario.avaliacoes_recebidas && usuario.avaliacoes_recebidas.length > 0 ? (
                    <ul className="lista-avaliacoes">
                        {usuario.avaliacoes_recebidas.map((av, index) => (
                            <li key={index} className="item-avaliacao">
                                <span className="estrela">⭐ {av.nota}</span> <br />
                                Tipo: {av.tipo} <br />
                                Comentário: {av.comentario}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Sem avaliações ainda.</p>
                )}
            </div>
        </Layout>
    );
}