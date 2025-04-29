import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


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
          cep
        }
      });

      setMsg(res.data.msg);
      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Erro no cadastro");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={nome} onChange={e => setUsername(e.target.value)} placeholder="Usuário" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={matricula} onChange={e => setMatricula(e.target.value)} placeholder="Matrícula" />
      <input value={senha} onChange={e => setPassword(e.target.value)} placeholder="Senha" type="password" />
      <input value={rua} onChange={e => setRua(e.target.value)} placeholder="Rua" />
      <input value={numero} onChange={e => setNumero(e.target.value)} placeholder="Número" />
      <input value={bairro} onChange={e => setBairro(e.target.value)} placeholder="Bairro" />
      <input value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Cidade" />
      <input value={cep} onChange={e => setCep(e.target.value)} placeholder="CEP" />
      <button type="submit">Cadastrar</button>
      <p>{msg}</p>
    </form>
  );
}