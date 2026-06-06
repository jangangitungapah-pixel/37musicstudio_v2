import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, LayoutDashboard, LogOut } from "lucide-react";
import { isAdminLoggedIn, logoutAdmin } from "../../utils/adminAuth.js";

export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <>
      <header className="admin-topbar">
        <Link className="admin-topbar-brand" to="/admin">
          <span className="brand-mark">37</span>
          <span>
            <strong>Admin Panel</strong>
            <small>37 Music Studio</small>
          </span>
        </Link>

        <nav className="admin-topbar-nav">
          <Link to="/admin">
            <LayoutDashboard size={17} />
            Dashboard
          </Link>

          <Link to="/admin/calendar">
            <CalendarDays size={17} />
            Calendar
          </Link>
        </nav>

        <button type="button" className="admin-logout-button" onClick={handleLogout}>
          <LogOut size={17} />
          Logout
        </button>
      </header>

      {children}
    </>
  );
}
