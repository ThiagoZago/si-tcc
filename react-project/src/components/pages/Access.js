import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authService";
import styles from "./Access.module.css";

function Access() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Adiciona uma classe que aplica a animação após o componente ser montado
    const card = document.querySelector(`.${styles.card}`);
    if (card) {
      card.classList.add(styles.showCard);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(username, password);

    if (response.token) {
      navigate("/inicio");
    } else {
      setError(response.msg);
    }
  };

  return (
    <div className={`${styles.gradiente} d-flex justify-content-center align-items-center vh-100`}>
      <div className={`${styles.card} card p-4 shadow`} style={{ width: "55vh" }}>
          <h2 className="text-center">Acesse já</h2>
          {error && <p className="alert alert-danger">{error}</p>}
          <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Senha"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            <button type="submit" className="btn btn-dark w-100">Entrar</button>
          </form>

          {/* Botão para registro */}
          <div className="mt-5">
            <p className="text-center">Ainda não tem uma conta?</p>
            <Link to="/registro" className="btn btn-danger w-100">Criar Conta</Link>
          </div>
        </div>
    </div>
  );
}

export default Access;