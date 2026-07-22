import { useState } from "react";

// ============================================================================
// POURQUOI CE COMPOSANT EXISTE :
// Le formulaire de connexion a 1 champ mot de passe, celui d'inscription en
// a 2 (mot de passe + confirmation). Plutôt que de copier-coller 3 fois le
// même bloc <input type="password" + bouton œil>, on l'isole ici une seule
// fois. C'est le principe DRY (Don't Repeat Yourself) : si un jour on veut
// changer le comportement du bouton œil, on le change à un seul endroit.
//
// COMPARAISON JS vanille vs React :
// En JS vanille, on ferait souvent : document.querySelectorAll('.toggle-eye')
// puis on boucle pour attacher un addEventListener à chaque bouton, en
// gérant soi-même quel input correspond à quel bouton (souvent via des
// data-attributes ou du DOM traversal). Ici, chaque <PasswordField> a son
// propre état `visible` totalement indépendant (via useState) : pas besoin
// de retrouver "quel bouton correspond à quel champ", React s'en occupe
// automatiquement grâce à l'encapsulation du composant.
// ============================================================================

/**
 * Icônes "œil" / "œil barré", dessinées en SVG à la main pour rester
 * cohérentes avec le style "trait fin" déjà utilisé sur les icônes de
 * NoteCard (stroke="currentColor", strokeWidth=2). Pas de dépendance
 * externe ajoutée : ça reste "Plug & Play" sans toucher au package.json.
 */
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.3 5.2A10.9 10.9 0 0 1 12 5c7 0 10.5 7 10.5 7a13.5 13.5 0 0 1-3.1 4.05M6.4 6.4C3.7 8.1 1.5 12 1.5 12a13.6 13.6 0 0 0 5.6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Champ de mot de passe avec bouton "afficher / masquer" intégré.
 *
 * @param {string} id - id/name du champ (utilisé aussi pour htmlFor du label)
 * @param {string} label - texte du <label>
 * @param {string} value - valeur contrôlée (React controlled input)
 * @param {(e) => void} onChange - handler de changement
 * @param {string} placeholder
 * @param {string} autoComplete - ex: "current-password" ou "new-password"
 * @param {string|null} error - message d'erreur de validation à afficher
 */
export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
}) {
  // `visible` pilote uniquement le `type` de l'input : "password" masque
  // la saisie nativement, "text" l'affiche en clair. On ne réinvente rien,
  // on bascule juste l'attribut HTML standard.
  const [visible, setVisible] = useState(false);

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>

      {/* Ce conteneur est positionné en `relative` pour que le bouton œil
          puisse se positionner en `absolute` PAR RAPPORT À LUI (et non par
          rapport à toute la page) — c'est la technique CSS classique pour
          placer une icône "dans" un champ de saisie. */}
      <div className="password-field">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          // Ces trois attributs demandent aux gestionnaires de mots de passe
          // tiers (1Password, LastPass, Bitwarden) de ne pas s'incruster
          // dans ce champ. Ils sont respectés par ces extensions, mais —
          // par honnêteté — le gestionnaire NATIF de Chrome/Firefox/Edge
          // n'expose aucun attribut officiel permettant de désactiver sa
          // propre bulle "Gérer les mots de passe" : c'est une décision du
          // navigateur, pas du site. Le vrai correctif possible côté site,
          // c'est justement `name` + `autoComplete` corrects (ci-dessus),
          // qui aident le navigateur à identifier le bon rôle du champ.
          data-lpignore="true"
          data-1p-ignore="true"
          data-bwignore="true"
        />

        <button
          type="button"
          className="password-toggle-btn"
          onClick={() => setVisible((current) => !current)}
          // tabIndex={-1} : on retire ce bouton de l'ordre de tabulation
          // clavier. Sinon, en remplissant le formulaire au clavier (Tab),
          // l'utilisateur tomberait dessus entre deux champs, ce qui casse
          // le flux naturel de saisie pour un simple bouton d'affichage.
          tabIndex={-1}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
