const ADMIN_AUTH_KEY = "37musicstudio_admin_session_v1";

/**
 * Demo credentials only.
 * Jangan pakai hardcoded login untuk production.
 * Nanti auth ini bisa diganti Firebase Auth / Supabase Auth / backend.
 */
export const demoAdminCredentials = {
  username: "admin",
  password: "37musicadmin",
};

export function getAdminSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(ADMIN_AUTH_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession);
  } catch {
    window.localStorage.removeItem(ADMIN_AUTH_KEY);
    return null;
  }
}

export function isAdminLoggedIn() {
  return Boolean(getAdminSession()?.isLoggedIn);
}

export function loginAdmin({ username, password }) {
  const isValid =
    username === demoAdminCredentials.username &&
    password === demoAdminCredentials.password;

  if (!isValid) {
    return {
      ok: false,
      message: "Username atau password salah.",
    };
  }

  const session = {
    isLoggedIn: true,
    username,
    loginAt: new Date().toISOString(),
  };

  window.localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(session));

  return {
    ok: true,
    session,
  };
}

export function logoutAdmin() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_AUTH_KEY);
}
