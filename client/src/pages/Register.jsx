import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import PasswordField from "../components/PasswordField.jsx";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  extractErrorMessage,
} from "../utils/validators.js";

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const validate = () => {
    const errors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
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
      const user = await register(form);
      showToast(`Compte créé, bienvenue ${user.name} !`, "success");
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

        <h1>Créer un compte</h1>
        <p className="subtitle">Commencez à organiser vos notes en quelques secondes.</p>

        {formError && <div className="form-error-banner">{formError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Nom</label>
            <input
              id="name"
              name="username"
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Votre nom"
              autoComplete="username"
            />
            {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
          </div>

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

          {/* Mot de passe et confirmation : deux instances indépendantes du
              même composant PasswordField. Chacune gère son propre bouton
              œil sans interférer avec l'autre, grâce à son propre useState
              interne (voir PasswordField.jsx). */}
          <PasswordField
            id="password"
            label="Mot de passe"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="6 caractères minimum"
            // "new-password" (et non "current-password") : c'est la valeur
            // sémantique correcte pour un champ de CRÉATION de mot de
            // passe, elle indique au navigateur qu'il ne doit pas proposer
            // un mot de passe déjà enregistré, mais éventuellement en
            // suggérer un nouveau — comportement attendu sur un formulaire
            // d'inscription.
            autoComplete="new-password"
            error={fieldErrors.password}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirmer le mot de passe"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeholder="Ressaisissez votre mot de passe"
            autoComplete="new-password"
            error={fieldErrors.confirmPassword}
          />

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting && <span className="spinner" />}
            Créer mon compte
          </button>
        </form>

        <p className="auth-switch">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
