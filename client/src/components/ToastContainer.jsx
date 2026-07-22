import { useToast } from "../hooks/useToast.js";

// Se contente de lire la file `toasts` du contexte et de l'afficher :
// c'est showToast() (appelé depuis n'importe quel composant via useToast)
// qui alimente cette file, pas ce composant lui-même.
export default function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="assertive">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`} role="status">
          {toast.message}
        </div>
      ))}
    </div>
  );
}
