import api from "./api.js";

// Chaque fonction renvoie directement `response.data` : les composants
// n'ont jamais besoin de connaître la forme brute d'une réponse Axios.

export const registerRequest = async ({ name, email, password }) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data; // { user, token }
};

export const loginRequest = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { user, token }
};
