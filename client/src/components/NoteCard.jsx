import { formatDate } from "../utils/formatDate.js";

export default function NoteCard({ note, onEdit, onDelete }) {
  const wasEdited = note.updatedAt !== note.createdAt;

  return (
    <article className="note-card">
      <h3 className="note-card-title">{note.title}</h3>
      <p className="note-card-content">{note.content || "(Aucun contenu)"}</p>

      <div className="note-card-footer">
        <span className="note-card-date">
          {wasEdited ? "Modifiée" : "Créée"} le {formatDate(wasEdited ? note.updatedAt : note.createdAt)}
        </span>

        <div className="note-card-actions">
          <button
            type="button"
            className="icon-btn"
            aria-label={`Modifier la note ${note.title}`}
            onClick={() => onEdit(note)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" strokeLinecap="round" />
              <path
                d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className="icon-btn danger"
            aria-label={`Supprimer la note ${note.title}`}
            onClick={() => onDelete(note)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18" strokeLinecap="round" />
              <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 6" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
