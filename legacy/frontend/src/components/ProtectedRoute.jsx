import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;
