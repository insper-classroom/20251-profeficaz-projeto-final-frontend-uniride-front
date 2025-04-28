// src/App.js
import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [notas, setNotas] = useState([]);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      axios
        .get("http://127.0.0.1:5000/notas", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setNotas(res.data))
        .catch((err) => {
          console.error(err);
          handleLogout(); // token inválido ou expirado
        });
    }
  }, [token]);

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <h2>Bem-vindo!</h2>
      <button onClick={handleLogout}>Sair</button>
      <h3>Suas Notas:</h3>
      <ul>
        {notas.map((nota, i) => (
          <li key={i}>{nota.texto || JSON.stringify(nota)}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;