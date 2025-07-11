import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authService";
import styles from "./Access.module.css";

function Access() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
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
      setSuccess(true);
      setMessage(response.msg);
      setTimeout(() => {
        navigate("/inicio");
      }, 3000)
      
    } else {
      setMessage(response.msg);
      setTimeout(() => {
        setMessage(null);
      }, 3000)
    }
  };

  return (
    <div className={`${styles.gradiente} d-flex justify-content-center align-items-center vh-100`}>
      <div className={`${styles.card} col-4 card p-4 shadow`} >
          <h2 className="text-center mb-4">Acesse já</h2>
          {message && <div className={success ? "alert alert-success text-center" : "alert alert-danger text-center"}>{message}</div>}
          <form onSubmit={handleSubmit}>
              <div className="mb-3 form-floating">
                <input
                  id="floatingEmail"
                  type="email"
                  placeholder="Email"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label for="floatingEmail">Email</label>
              </div>
              <div className="mb-3">
                <div className="input-group form-floating">
                    <input
                      id="floatingPassword"
                      type={showPassword ? "text" : "password"} // Alterna o tipo do input
                      placeholder="Senha"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label for="floatingPassword">Senha</label>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)} // Alterna o estado
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
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