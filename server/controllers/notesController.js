import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  findNotesByUser,
  findNoteByIdAndUser,
  createNote,
  updateNote,
  deleteNote,
} from "../models/noteModel.js";

// GET /api/notes
// req.user est déjà garanti par le middleware `protect` en amont.
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await findNotesByUser(req.user.id);
  res.status(200).json({ notes });
});

// GET /api/notes/:id
// Utilisé notamment pour rafraîchir une note après édition.
export const getNoteById = asyncHandler(async (req, res) => {
  const note = await findNoteByIdAndUser(req.params.id, req.user.id);
  if (!note) {
    throw new ApiError(404, "Note introuvable.");
  }
  res.status(200).json({ note });
});

// POST /api/notes
export const addNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const note = await createNote({
    title: title.trim(),
    content: (content || "").trim(),
    userId: req.user.id,
  });
  res.status(201).json({ note });
});

// PUT /api/notes/:id
// La requête SQL sous-jacente filtre déjà par user_id : si la note
// n'appartient pas à l'utilisateur connecté, `updated` vaut null ici,
// et on renvoie 404 plutôt que de révéler qu'une note d'un autre id existe.
export const editNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const updated = await updateNote(req.params.id, req.user.id, {
    title: title.trim(),
    content: (content || "").trim(),
  });

  if (!updated) {
    throw new ApiError(404, "Note introuvable.");
  }
  res.status(200).json({ note: updated });
});

// DELETE /api/notes/:id
export const removeNote = asyncHandler(async (req, res) => {
  const wasDeleted = await deleteNote(req.params.id, req.user.id);
  if (!wasDeleted) {
    throw new ApiError(404, "Note introuvable.");
  }
  res.status(200).json({ message: "Note supprimée avec succès." });
});
