import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./App.css"; 

export default function Cadastrar() {
  const [nome, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [senha, setPassword] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [cep, setCep] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();


  const buscarCep = async (cepValue) => {
    
    const cepLimpo = cepValue.replace(/\D/g, '');
    

    if (cepLimpo.length !== 8) {
      return;
    }
    
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = response.data;
      
      if (!data.erro) {
        setRua(data.logradouro || "");
        setBairro(data.bairro || "");
        setCidade(data.localidade || "");

      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };


  const handleCepChange = (e) => {
    const novoCep = e.target.value;
    setCep(novoCep);

    if (novoCep.replace(/\D/g, '').length === 8) {
      buscarCep(novoCep);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/usuarios", {
        nome,
        email,
        matricula,
        senha,
        endereco: {
          rua,
          numero,
          bairro,
          cidade,
          cep,
        },
      });

      setMsg(res.data.msg);
      navigate("/");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Erro no cadastro");
    }
  };

  return (
    <div className="login-container">
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <input value={nome} onChange={(e) => setUsername(e.target.value)} placeholder="Usuário" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="Matrícula" />
        <input value={senha} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" type="password" />
        <input value={cep} onChange={handleCepChange} placeholder="CEP" />
        <input value={rua} onChange={(e) => setRua(e.target.value)} placeholder="Rua" />
        <input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Número" />
        <input value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Bairro" />
        <input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" />
        <button type="submit">Cadastrar</button>
      </form>
      {msg && <p>{msg}</p>}
      <Link to="/">Já tem conta? Voltar para login</Link>
    </div>
  );
}