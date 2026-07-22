import api from "./api.js";

// Couche API dédiée aux notes. Le token est déjà ajouté automatiquement
// par l'intercepteur défini dans api.js : ces fonctions n'ont donc pas à
// s'en préoccuper.

export const fetchNotes = async () => {
  const { data } = await api.get("/notes");
  return data.notes;
};

export const createNoteRequest = async ({ title, content }) => {
  const { data } = await api.post("/notes", { title, content });
  return data.note;
};

export const updateNoteRequest = async (id, { title, content }) => {
  const { data } = await api.put(`/notes/${id}`, { title, content });
  return data.note;
};

export const deleteNoteRequest = async (id) => {
  await api.delete(`/notes/${id}`);
  return id;
};
