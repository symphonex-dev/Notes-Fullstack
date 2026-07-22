import { createContext, useState, useEffect } from "react";
import { registerRequest, loginRequest } from "../services/authService.js";

// ============================================================================
// COMPARAISON JS vanille vs React :
// Dans une version JS "classique", l'état de connexion vivrait dans des
// variables globales + localStorage, relues à la main dans chaque page
// (ex: `const user = JSON.parse(localStorage.getItem("user"))` répété
// partout). Ici, le Context React joue exactement ce rôle de "état global
// partagé", mais de façon réactive : dès que `setUser` est appelé, TOUS
// les composants qui lisent ce contexte (via useAuth) se re-rendent
// automatiquement avec la nouvelle valeur — pas besoin d'écouter un
// évènement custom ou de re-lire localStorage manuellement.
// ============================================================================

export const AuthContext = createContext(null);

const TOKEN_KEY = "notes_token";
const USER_KEY = "notes_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // `loading` distingue "on ne sait pas encore si l'utilisateur est connecté"
  // (lecture initiale de localStorage) de "on sait qu'il n'est pas connecté" :
  // sans cette distinction, PrivateRoute redirigerait vers /login pendant
  // une fraction de seconde à chaque rechargement de page, même pour un
  // utilisateur déjà authentifié.
  const [loading, setLoading] = useState(true);

  // Au premier montage de l'app, on restaure la session depuis
  // localStorage. C'est l'équivalent React de "vérifier si un token existe"
  // qu'on ferait en JS vanille au tout début du script.
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persistSession = (nextUser, nextToken) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    setToken(nextToken);
  };

  const register = async ({ name, email, password }) => {
    const data = await registerRequest({ name, email, password });
    persistSession(data.user, data.token);
    return data.user;
  };

  const login = async ({ email, password }) => {
    const data = await loginRequest({ email, password });
    persistSession(data.user, data.token);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
