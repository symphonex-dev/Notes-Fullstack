import { useState, useEffect } from "react";
import { validateTitle } from "../utils/validators.js";

// Un seul composant sert à la fois pour "créer" et "modifier" une note :
// si `note` est fourni, le formulaire est pré-rempli et le titre change,
// sinon il démarre vide. Ça évite de dupliquer deux formulaires quasi
// identiques (DRY).
export default function NoteModal({ note, onClose, onSubmit }) {
  const isEditing = Boolean(note);

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Ferme la modale avec la touche Échap, comportement attendu de toute modale.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const titleError = validateTitle(title);
    if (titleError) {
      setError(titleError);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), content: content.trim() });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible d'enregistrer la note.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="note-modal-title">
        <div className="modal-header">
          <h2 id="note-modal-title">{isEditing ? "Modifier la note" : "Nouvelle note"}</h2>
          <button type="button" className="modal-close" aria-label="Fermer" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="note-title">Titre</label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Idées pour le projet React"
              autoFocus
              maxLength={200}
            />
          </div>

          <div className="field">
            <label htmlFor="note-content">Contenu</label>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écrivez le contenu de votre note ici…"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting && <span className="spinner" />}
              {isEditing ? "Enregistrer" : "Créer la note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
