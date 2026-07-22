// Centralise le formatage de date : toutes les notes affichent leurs dates
// exactement de la même façon, sans dupliquer `toLocaleDateString(...)`
// avec des options différentes à chaque endroit.
export const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
