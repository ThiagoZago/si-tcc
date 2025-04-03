import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";

function UserPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate("/");
    };

  return (
    <div className="container text-center mt-5">
      <h1>Bem-vindo ao Dashboard</h1>
      <p>Área autenticada!</p>
      <button className="btn btn-danger" onClick={handleLogout}>Sair</button>
    </div>
  );
}

export default UserPage;
