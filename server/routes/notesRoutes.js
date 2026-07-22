import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validateNote } from "../middleware/validateMiddleware.js";
import {
  getNotes,
  getNoteById,
  addNote,
  editNote,
  removeNote,
} from "../controllers/notesController.js";

const router = Router();

// `protect` s'applique à TOUTES les routes de ce routeur : aucune route
// de notes n'est jamais accessible sans un token JWT valide.
router.use(protect);

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", validateNote, addNote);
router.put("/:id", validateNote, editNote);
router.delete("/:id", removeNote);

export default router;
