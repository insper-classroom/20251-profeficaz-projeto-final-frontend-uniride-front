// src/Inicio.jsx
import { useNavigate } from "react-router-dom";
import "./App.css";

// IMPORTANDO AS IMAGENS
import logo from "./assets/logo.png";
import solicitarIcon from "./assets/solicitar1.png";
import oferecerIcon from "./assets/oferecer1.png";
import perfilIcon from "./assets/perfil1.png";
import avaliacoesIcon from "./assets/avaliacoes1.png";

export default function Inicio() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="app-wrapper">
      <div className="app-content">
        <div className="inicio-container">
          <div className="topo-logo-container">
            <img src={logo} alt="Logo Uniride" className="logo-inicio" />
          </div>

          <h2 className="boas-vindas">Bem-vindo, João!</h2>
          <p className="subtitulo">Encontre ou ofereça caronas com segurança</p>

          <div className="grid-botoes">
            <button className="card vermelho" onClick={() => navigate("/solicitar")}>
              <img src={solicitarIcon} alt="Solicitar" className="icon-grande" /><br />
              <span className="texto-preto">Solicitar</span>
            </button>
            <button className="card preto" onClick={() => navigate("/oferecer")}>
              <img src={oferecerIcon} alt="Oferecer" className="icon" /><br />
              Oferecer
            </button>
            <button className="card preto" onClick={() => navigate("/avaliacoes")}>
              <img src={avaliacoesIcon} alt="Avaliações" className="icon" /><br />
              Avaliações
            </button>
            <button className="card preto" onClick={() => navigate("/perfil")}>
              <img src={perfilIcon} alt="Perfil" className="icon" /><br />
              Perfil
            </button>            
          </div>

        </div>
      </div>
    </div>
  );
}