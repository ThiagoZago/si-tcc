/* eslint-disable no-useless-escape */
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../../utils/axiosInterceptor";

function UserProfile() {
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmail(res.data.email);
      setBusinessName(res.data.businessName);
      setLoading(false);
    } catch (err) {
      toast.error("Erro ao carregar perfil.");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.warning("Preencha todos os campos.");
      return;
    }

    // Validação da força da nova senha
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:_\-])[A-Za-z\d@$!%*?&.,;:_\-]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      toast.warning(
        "A nova senha deve conter ao menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.put(
        "/profile/password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.msg);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Erro ao atualizar senha.");
    }
  };


  return (
    <div className="container py-5">
      <h2 className="h5 mb-4">Perfil do Usuário</h2>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className="mb-3">
            <label className="form-label fw-bold">Email:</label>
            <input
              type="text"
              className="form-control"
              value={email}
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Estabelecimento vinculado:</label>
            <input
              type="text"
              className="form-control"
              value={businessName || "Nenhum"}
              disabled
            />
          </div>

          <h5 className="mt-4 mb-3">Alterar senha</h5>
          <div className="d-flex flex-row justify-content-between">
            <div className="col-md-4 mb-3">
              <input
                type="password"
                placeholder="Senha atual"
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-3">
              <input
                type="password"
                placeholder="Nova senha"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="col-md-3 mb-3">
              <button
                className="btn btn-success w-100"
                onClick={handleChangePassword}
              >
                Salvar
              </button>
            </div>
          </div>
        </>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}
export default UserProfile