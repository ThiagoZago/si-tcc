import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import styles from "./Register.module.css"

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
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
    const response = await register(username, password);
    
    if (response.msg.includes("sucesso")) {
        navigate("/acesso");
    } else {
        setMessage(response.msg); // Exibir a mensagem de erro
    }
};

  return (
    <div className={`${styles.gradiente} d-flex justify-content-center align-items-center vh-100`}>
        <div className={`${styles.card} card p-4 shadow`} style={{ width: "55vh" }}>
            <h2 className="text-center">Registre-se Aqui</h2>
            {message && <p className="alert alert-danger">{message}</p>}
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <input
                    type="email"
                    placeholder="Email"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <input
                    type="password"
                    placeholder="Senha"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-dark w-100">Registrar</button>
            </form>
        </div>
    </div>
  );
}

export default Register;
