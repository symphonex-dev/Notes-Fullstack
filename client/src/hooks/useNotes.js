import { useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchNotes,
  createNoteRequest,
  updateNoteRequest,
  deleteNoteRequest,
} from "../services/notesService.js";
import { useToast } from "./useToast.js";
import { extractErrorMessage } from "../utils/validators.js";

// Ce hook regroupe tout ce qui touche aux notes (chargement, CRUD, recherche)
// pour que le composant Dashboard reste un simple assemblage de JSX, sans
// logique métier mélangée dedans.
export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const createNote = async ({ title, content }) => {
    const note = await createNoteRequest({ title, content });
    setNotes((current) => [note, ...current]);
    showToast("Note créée avec succès.", "success");
  };

  const editNote = async (id, { title, content }) => {
    const updated = await updateNoteRequest(id, { title, content });
    // Le backend trie déjà les notes par "updated_at DESC" (la plus
    // récemment modifiée en premier), mais ce tri ne s'applique qu'au
    // moment où on RECHARGE la liste depuis l'API. Si on se contentait de
    // remplacer la note modifiée "à sa place" dans le tableau existant
    // (comme le faisait l'ancienne version : `.map(...)`), son ordre
    // visuel ne bougerait pas tant que la page ne serait pas rechargée —
    // ce qui contredirait l'objectif "la note remonte automatiquement en
    // haut dès qu'on la modifie". On reproduit donc ce même tri côté
    // client : on retire l'ancienne version du tableau (`.filter`), puis
    // on remet la version à jour tout en haut (`[updated, ...]`).
    setNotes((current) => [updated, ...current.filter((note) => note.id !== id)]);
    showToast("Note modifiée avec succès.", "success");
  };

  const removeNote = async (id) => {
    await deleteNoteRequest(id);
    setNotes((current) => current.filter((note) => note.id !== id));
    showToast("Note supprimée avec succès.", "success");
  };

  // Recherche instantanée côté client (titre + contenu), recalculée
  // uniquement quand `notes` ou `searchTerm` changent grâce à useMemo,
  // pour éviter de refiltrer sur chaque rendu sans rapport.
  const filteredNotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term)
    );
  }, [notes, searchTerm]);

  return {
    notes: filteredNotes,
    totalCount: notes.length,
    loading,
    searchTerm,
    setSearchTerm,
    createNote,
    editNote,
    removeNote,
    reload: loadNotes,
  };
}
