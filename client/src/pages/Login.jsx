import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import PasswordField from "../components/PasswordField.jsx";
import { validateEmail, extractErrorMessage } from "../utils/validators.js";

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ==========================================================================
  // "Mot de passe oublié" est un lien FACTICE demandé pour cette démo : il
  // n'appelle aucune route backend (pas d'envoi d'e-mail). On se contente
  // d'un état booléen local qui affiche un message d'avertissement. C'est
  // une bonne illustration de la différence JS vanille / React :
  // - En JS vanille, on ferait un `element.style.display = "block"` en
  //   manipulant le DOM directement.
  // - En React, on ne touche jamais le DOM à la main : on change une valeur
  //   d'état (`showForgotWarning`), et c'est React qui décide de (re)afficher
  //   ou non le message en conséquence, lors du prochain rendu.
  // ==========================================================================
  const [showForgotWarning, setShowForgotWarning] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const validate = () => {
    const errors = {
      email: validateEmail(form.email),
      password: form.password ? null : "Le mot de passe est requis.",
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await login(form);
      showToast(`Bienvenue, ${user.name} !`, "success");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setFormError(extractErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="wordmark">Notes</div>
          <p className="tagline">Vos idées, organisées.</p>
        </div>

        <h1>Connexion</h1>
        <p className="subtitle">Accédez à vos notes personnelles.</p>

        {formError && <div className="form-error-banner">{formError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="nom@exemple.com"
              autoComplete="username"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          {/* Champ mot de passe : on délègue au composant réutilisable
              PasswordField, qui gère lui-même le bouton œil et le
              placeholder propre (fini les "••••••••" par défaut). */}
          <PasswordField
            id="password"
            label="Mot de passe"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="Saisissez votre mot de passe"
            autoComplete="current-password"
            error={fieldErrors.password}
          />

          {/* Lien factice "Mot de passe oublié ?", aligné à droite,
              juste au-dessus du bouton de connexion. Un <button> plutôt
              qu'un <a href="#">, car il ne mène nulle part : utiliser un
              vrai lien avec un href bidon serait trompeur pour les
              lecteurs d'écran et les moteurs de recherche. */}
          <div className="forgot-password-row">
            <button
              type="button"
              className="link-button"
              onClick={() => setShowForgotWarning(true)}
            >
              Mot de passe oublié ?
            </button>
          </div>

          {showForgotWarning && (
            <p className="forgot-password-warning" role="alert">
              Fonctionnalité désactivée sur la version de démonstration. Veuillez recréer un
              compte.
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting && <span className="spinner" />}
            Se connecter
          </button>
        </form>

        <p className="auth-switch">
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
