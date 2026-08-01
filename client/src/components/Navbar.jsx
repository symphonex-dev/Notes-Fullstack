import { useAuth } from "../hooks/useAuth.js";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <span className="wordmark">Notes</span>
        <div className="navbar-user">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Passer au mode ${theme === "light" ? "sombre" : "clair"}`}
            title={`Passer au mode ${theme === "light" ? "sombre" : "clair"}`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <span className="user-name">
            Bonjour, <strong>{user?.name}</strong>
          </span>
          <button type="button" className="btn btn-secondary" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}