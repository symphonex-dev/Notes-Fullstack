import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <span className="code">404</span>
      <h1>Page introuvable</h1>
      <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link to="/dashboard" className="btn btn-primary">
        Retour au tableau de bord
      </Link>
    </div>
  );
}
