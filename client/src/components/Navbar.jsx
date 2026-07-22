import { useAuth } from "../hooks/useAuth.js";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <span className="wordmark">Notes</span>
        <div className="navbar-user">
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
