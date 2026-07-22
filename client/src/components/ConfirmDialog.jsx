import { useState } from "react";

// Générique et réutilisable : n'importe quelle action destructive future
// (pas seulement la suppression de note) pourrait passer par ce composant
// en changeant simplement les props title/message/onConfirm.
export default function ConfirmDialog({ title, message, confirmLabel = "Confirmer", onConfirm, onCancel }) {
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-box modal-small" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="modal-header">
          <h2 id="confirm-title">{title}</h2>
        </div>

        <p className="confirm-text">{message}</p>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
            Annuler
          </button>
          <button type="button" className="btn btn-danger" onClick={handleConfirm} disabled={submitting}>
            {submitting && <span className="spinner" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
