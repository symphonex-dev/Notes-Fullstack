// ============================================================================
// Icône loupe dessinée en SVG "trait fin" (stroke="currentColor"), pour
// rester cohérente avec les icônes déjà présentes dans NoteCard.jsx plutôt
// que d'utiliser l'émoji brut 🔍 (rendu différent selon OS/police, moins
// sobre que le reste de l'identité visuelle "fiche de catalogue").
// `aria-hidden="true"` : c'est une icône purement décorative, le champ a
// déjà son propre `aria-label` ("Rechercher une note") donc on ne veut pas
// que les lecteurs d'écran l'annoncent une deuxième fois.
// ============================================================================
function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="search-icon"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-box">
      <SearchIcon />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Titre ou contenu d'une note…"
        aria-label="Rechercher une note"
      />
    </div>
  );
}
