import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import { useTheme } from "../context/ThemeContext.jsx";
import PasswordField from "../components/PasswordField.jsx";
import { validateEmail, extractErrorMessage } from "../utils/validators.js";

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ==========================================================================
  // "Mot de passe oublié" est un lien FACTICE pour cette démo.
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
        {/* Bouton de thème placé directement dans la carte en haut à droite */}
        <button
          type="button"
          className="theme-toggle-btn card-theme-toggle"
          onClick={toggleTheme}
          aria-label={`Passer au mode ${theme === "light" ? "sombre" : "clair"}`}
          title={`Passer au mode ${theme === "light" ? "sombre" : "clair"}`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

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

          <PasswordField
            id="password"
            label="Mot de passe"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="Saisissez votre mot de passe"
            autoComplete="current-password"
            error={fieldErrors.password}
          />

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