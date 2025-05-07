import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";

export default function Configuracoes() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    matricula: "",
    endereco: {
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      cep: ""
    }
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
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
      setFormData({
        nome: response.data.nome || "",
        email: response.data.email || "",
        matricula: response.data.matricula || "",
        endereco: {
          rua: response.data.endereco?.rua || "",
          numero: response.data.endereco?.numero || "",
          bairro: response.data.endereco?.bairro || "",
          cidade: response.data.endereco?.cidade || "",
          cep: response.data.endereco?.cep || ""
        }
      });
    })
    .catch(error => {
      console.error("Erro ao buscar dados do usuário:", error);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("endereco.")) {
      const campo = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        endereco: { ...prev.endereco, [campo]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSalvar = () => {
    axios.put("http://localhost:5000/perfil", formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert("Informações atualizadas com sucesso!");
      setEditando(false);
      // Recarregar as informações do usuário
      return axios.get("http://localhost:5000/perfil", {
        headers: { Authorization: `Bearer ${token}` }
      });
    })
    .then(response => {
      setUsuario(response.data);
    })
    .catch(error => {
      console.error("Erro ao atualizar perfil:", error.response?.data || error.message);
      alert("Erro ao atualizar informações.");
    });
  };

  if (!usuario) return <Layout><p>Carregando dados...</p></Layout>;

  return (
    <Layout>
      <div className="inicio-container">
        <h1>Configurações</h1>

        <div className="input-group">
          <label>Nome:</label>
          <input 
            type="text" 
            name="nome" 
            value={formData.nome} 
            onChange={handleChange} 
            disabled={!editando} 
          />
        </div>

        <div className="input-group">
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            disabled={!editando} 
          />
        </div>

        <div className="input-group">
          <label>Matrícula:</label>
          <input 
            type="text" 
            name="matricula" 
            value={formData.matricula} 
            onChange={handleChange} 
            disabled={!editando} 
          />
        </div>

        <h2>Endereço</h2>
        {["rua", "numero", "bairro", "cidade", "cep"].map((campo) => (
          <div className="input-group" key={campo}>
            <label>{campo[0].toUpperCase() + campo.slice(1)}:</label>
            <input 
              type="text" 
              name={`endereco.${campo}`} 
              value={formData.endereco[campo]} 
              onChange={handleChange} 
              disabled={!editando} 
            />
          </div>
        ))}

        {!editando ? (
          <button onClick={() => setEditando(true)}>Editar</button>
        ) : (
          <button onClick={handleSalvar}>Salvar</button>
        )}
      </div>
    </Layout>
  );
}