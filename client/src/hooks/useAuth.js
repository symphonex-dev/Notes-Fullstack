import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

// Évite d'écrire `useContext(AuthContext)` (et l'import associé) dans
// chaque composant : un seul hook, un seul point d'entrée. Lève aussi une
// erreur explicite si jamais utilisé hors de <AuthProvider>, plutôt que de
// planter plus loin avec un message obscur "Cannot read properties of null".
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>.");
  }
  return context;
}
