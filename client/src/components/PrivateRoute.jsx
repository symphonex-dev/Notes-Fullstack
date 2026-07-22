import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Loader from "./Loader.jsx";

// ============================================================================
// COMPARAISON JS vanille vs React :
// En JS classique, protéger une page se ferait souvent en vérifiant le
// token au tout début du script de la page ("if (!token) location.href =
// '/login.html'"). Ici, React Router n'a pas de "pages" séparées : toutes
// les routes vivent dans le même arbre de composants, donc la protection
// devient un composant wrapper qui décide, à chaque rendu, d'afficher soit
// la page demandée, soit une redirection.
// ============================================================================
export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Tant qu'on ne sait pas encore si une session existe (lecture du
  // localStorage au démarrage), on affiche un loader plutôt que de
  // rediriger trop vite vers /login par erreur.
  if (loading) {
    return <Loader fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
