import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Music2 } from "lucide-react";
import { demoAdminCredentials, isAdminLoggedIn, loginAdmin } from "../utils/adminAuth.js";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  if (isAdminLoggedIn()) {
    return <Navigate to="/admin" replace />;
  }

  const from = location.state?.from || "/admin";

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = loginAdmin({
      username: form.username.trim(),
      password: form.password,
    });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-bg">
        <div className="admin-login-glow admin-login-glow-one" />
        <div className="admin-login-glow admin-login-glow-two" />
      </div>

      <section className="admin-login-card">
        <div className="admin-login-brand">
          <span className="brand-mark">37</span>

          <div>
            <strong>37 Music Studio</strong>
            <p>Admin access</p>
          </div>
        </div>

        <div className="admin-login-heading">
          <div className="admin-login-icon">
            <LockKeyhole size={24} />
          </div>

          <h1>Login Admin</h1>
          <p>Masuk dulu sebelum mengelola kalender, booking request, dan data studio.</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input
              type="text"
              placeholder="Masukkan username"
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
              autoComplete="username"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit">
            <Music2 size={19} />
            Masuk ke Admin
          </button>
        </form>

        <div className="admin-demo-note">
          <strong>Demo login:</strong>
          <span>Username: {demoAdminCredentials.username}</span>
          <span>Password: {demoAdminCredentials.password}</span>
        </div>
      </section>
    </main>
  );
}
