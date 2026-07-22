import axios from "axios";

// Instance Axios unique partagée par tous les services (auth, notes...).
// Objectif : aucun composant n'appelle jamais fetch/axios directement,
// tout passe par ici pour éviter la duplication de logique HTTP.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Intercepteur de requête : ajoute automatiquement
// "Authorization: Bearer <token>" sur CHAQUE requête sortante, si un token
// est présent dans localStorage. C'est ce qui remplace le fait de devoir
// répéter ce header à la main dans chaque appel API.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("notes_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse : si le serveur renvoie 401 (token expiré/invalide),
// on nettoie la session locale. Le composant appelant reste responsable de
// rediriger l'utilisateur (voir AuthContext), cet intercepteur ne fait que
// garantir qu'un token mort n'est jamais réutilisé.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("notes_token");
      localStorage.removeItem("notes_user");
    }
    return Promise.reject(error);
  }
);

export default api;
