import { Navigate, useLocation } from "react-router-dom";
import { isAdminLoggedIn } from "../../utils/adminAuth.js";

export default function AdminProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
