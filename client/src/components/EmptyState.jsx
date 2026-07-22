export default function EmptyState({ isSearching, onCreateClick }) {
  if (isSearching) {
    return (
      <div className="empty-state">
        <p className="empty-title">Aucun résultat</p>
        <p className="empty-hint">Aucune note ne correspond à cette recherche.</p>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <p className="empty-title">Aucune note pour l'instant</p>
      <p className="empty-hint">Créez votre première note pour commencer.</p>
      <button type="button" className="btn btn-primary" onClick={onCreateClick}>
        + Nouvelle note
      </button>
    </div>
  );
}
