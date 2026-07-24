import { createContext, useState, useCallback } from "react";

export const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // useCallback évite de recréer cette fonction à chaque rendu : comme elle
  // est distribuée à tout l'arbre via le contexte, la rendre stable évite
  // des re-rendus inutiles des composants qui la reçoivent en dépendance.
  const showToast = useCallback((message, type = "success") => {
    const id = ++idCounter;
    setToasts((current) => [...current, { id, message, type }]);

    // Auto-disparition après 4 secondes, comme un vrai toast d'interface.
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 1000);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
    </ToastContext.Provider>
  );
}
