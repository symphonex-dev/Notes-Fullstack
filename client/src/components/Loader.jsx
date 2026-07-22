// Composant minimal mais partagé par tout le projet : un bouton en cours de
// soumission, une page en cours de chargement, etc. utilisent tous le même
// <Loader />, ce qui évite de dupliquer un spinner différent à chaque endroit.
export default function Loader({ fullPage = false }) {
  if (fullPage) {
    return (
      <div className="page-loader" role="status" aria-live="polite">
        <span className="spinner" />
        <span className="visually-hidden">Chargement en cours…</span>
      </div>
    );
  }
  return <span className="spinner" role="status" aria-label="Chargement" />;
}
