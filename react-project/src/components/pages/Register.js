import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import styles from "./Register.module.css"

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
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
      setSuccess(true);
      setMessage(response.msg);
      setTimeout(() => {
        navigate("/acesso");
      }, 3000);        
    } else {
        setMessage(response.msg); // Exibir a mensagem de erro
        setTimeout(() => {
          setMessage(null);
        }, 3000)
    }
};

  return (
    <div className={`${styles.gradiente} d-flex justify-content-center align-items-center vh-100`}>
        <div className={`${styles.card} card p-4 shadow`} style={{ width: "55vh" }}>
            <h2 className="text-center mb-4">Registre-se Aqui</h2>
            {message && <div className={success ? "alert alert-success text-center" : "alert alert-danger text-center"}>{message}</div>}
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
