import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import { useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setToken} />} />
        <Route path="/cadastro" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
