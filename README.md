# Notes — Application Full Stack

Application de gestion de notes personnelles. Chaque utilisateur crée un compte,
se connecte, et gère ses propres notes (créer / modifier / supprimer / rechercher)
en toute confidentialité : personne ne peut accéder aux notes d'un autre compte.

---

## 1. Technologies

| Couche          | Technologie                          |
|------------------|---------------------------------------|
| Frontend         | React 18, Vite, React Router 6, Axios |
| Backend          | Express.js (Node.js, ESM)              |
| Base de données  | PostgreSQL                              |
| Authentification | JWT (jsonwebtoken), bcrypt              |
| Style            | CSS natif (variables CSS, Grid/Flexbox) |

---

## 2. Architecture

```
notes-fullstack/
├── client/                     # Frontend React + Vite
│   ├── src/
│   │   ├── components/         # Composants réutilisables (NoteCard, Navbar, Modal...)
│   │   ├── pages/               # Login, Register, Dashboard, NotFound
│   │   ├── hooks/                # useAuth, useToast, useNotes
│   │   ├── services/             # Couche API (api.js, authService.js, notesService.js)
│   │   ├── context/               # AuthContext, ToastContext
│   │   ├── utils/                  # Validation, formatage de dates
│   │   ├── styles/                  # Design tokens + feuilles CSS par section
│   │   ├── assets/
│   │   ├── App.jsx                   # Routage
│   │   └── main.jsx                  # Point d'entrée
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── server/                      # Backend Express
│   ├── controllers/              # authController, notesController
│   ├── routes/                    # authRoutes, notesRoutes
│   ├── middleware/                 # authMiddleware (JWT), validateMiddleware, errorMiddleware
│   ├── models/                      # userModel, noteModel (requêtes SQL préparées)
│   ├── config/                       # db.js (pool PostgreSQL)
│   ├── utils/                         # ApiError, asyncHandler, generateToken
│   ├── database/                       # init.sql (schéma complet)
│   ├── app.js                            # Configuration Express (CORS, routes, erreurs)
│   ├── server.js                          # Point d'entrée (démarrage HTTP)
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 3. Installation

Prérequis : Node.js 18+, npm, PostgreSQL 14+ installé et démarré localement.

```bash
# 1. Backend
cd server
npm install

# 2. Frontend
cd ../client
npm install
```

---

## 4. Configuration (variables d'environnement)

### `server/.env`

Copier `server/.env.example` en `server/.env` et renseigner vos propres valeurs :

```env
PORT=5000
NODE_ENV=development

PGUSER=notes_user
PGPASSWORD=votre_mot_de_passe
PGHOST=localhost
PGPORT=5432
PGDATABASE=notes_db

JWT_SECRET=une_valeur_longue_et_aleatoire
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

Pour générer un `JWT_SECRET` solide :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### `client/.env`

Copier `client/.env.example` en `client/.env` :

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 5. Base de données PostgreSQL

Créer la base et l'utilisateur (adapter les identifiants à votre configuration) :

```bash
psql -U postgres -c "CREATE USER notes_user WITH PASSWORD 'votre_mot_de_passe';"
psql -U postgres -c "CREATE DATABASE notes_db OWNER notes_user;"
```

Initialiser le schéma (tables `users` et `notes`, contraintes, index) :

```bash
cd server
psql -U notes_user -d notes_db -f database/init.sql
```

Le script `init.sql` est idempotent : il peut être relancé à tout moment pour
recréer le schéma depuis zéro (il supprime puis recrée les tables).

### Schéma

**`users`** : `id`, `name`, `email` (unique), `password_hash`, `created_at`
**`notes`** : `id`, `title`, `content`, `user_id` (FK → `users.id`, `ON DELETE CASCADE`), `created_at`, `updated_at`

Index : `idx_users_email`, `idx_notes_user_id`, `idx_notes_user_updated` (composite,
utilisé par le tri "notes les plus récentes en premier"). Un trigger PostgreSQL
maintient automatiquement `updated_at` à chaque `UPDATE`.

---

## 6. Scripts npm

### Backend (`server/`)
| Script         | Commande             | Description                          |
|----------------|-----------------------|----------------------------------------|
| `npm start`    | `node server.js`      | Démarre l'API en mode production       |
| `npm run dev`  | `node --watch server.js` | Démarre l'API avec rechargement auto |

### Frontend (`client/`)
| Script           | Commande        | Description                        |
|------------------|------------------|--------------------------------------|
| `npm run dev`    | `vite`           | Serveur de développement (port 5173) |
| `npm run build`  | `vite build`     | Build de production dans `dist/`     |
| `npm run preview`| `vite preview`   | Sert le build de production en local |

---

## 7. Lancement du projet

Deux terminaux séparés sont nécessaires (le backend ne sert pas le frontend, et inversement).

**Terminal 1 — Backend :**
```bash
cd server
npm run dev
# ✅ API Notes démarrée sur http://localhost:5000
```

**Terminal 2 — Frontend :**
```bash
cd client
npm run dev
# ➜  Local: http://localhost:5173/
```

Ouvrir ensuite **http://localhost:5173** dans le navigateur.

> Le déploiement (Vercel, Render, Netlify...) n'est pas couvert par ce projet :
> il est conçu pour fonctionner uniquement en local.

---

## 8. Fonctionnalités

### Authentification
- Inscription (nom, email, mot de passe) avec validation complète et hachage bcrypt
- Connexion avec JWT, stocké côté client dans `localStorage`
- Le token est ajouté automatiquement en en-tête `Authorization: Bearer <token>`
  sur chaque requête privée (intercepteur Axios dans `services/api.js`)
- Déconnexion (suppression du token + redirection)
- Route protégée (`/dashboard`) : redirection automatique vers `/login` si non connecté

### Notes (CRUD complet)
- Création, modification (via modale), suppression (avec confirmation) d'une note
- Liste des notes strictement limitée à l'utilisateur connecté
- Recherche instantanée côté client, sur le titre et le contenu
- États de chargement (spinners), messages d'erreur, toasts de succès
- Interface responsive (320 px → 1440 px), sobre et professionnelle

### Sécurité
- Mots de passe jamais stockés ni renvoyés en clair (bcrypt, `password_hash` exclu de toutes les réponses API)
- Toutes les routes de notes protégées par middleware JWT
- Chaque requête CRUD est filtrée par `user_id` **au niveau SQL** : impossible de
  lire, modifier ou supprimer la note d'un autre utilisateur (retour `404`)
- Requêtes SQL exclusivement préparées (`$1, $2...`) : aucune concaténation, donc
  aucune injection SQL possible
- Middleware d'erreurs global côté serveur : aucune fuite de pile d'erreur brute

---

## 9. Vérifications effectuées avant livraison

Le backend a été testé de bout en bout contre une vraie base PostgreSQL locale :
inscription, doublon d'email rejeté (409), connexion (bon et mauvais mot de passe),
accès aux notes sans token (401), CRUD complet, tentative d'un utilisateur B de
lire/modifier/supprimer une note appartenant à l'utilisateur A (404 à chaque fois),
token invalide (401), route inexistante (404). Le frontend a été compilé avec
`vite build` sans erreur, et tous les imports/exports ont été vérifiés.

---

## 10. Révision UX/UI — Formulaires & Dashboard

Cette section documente une passe d'optimisation UX/UI appliquée **uniquement au
frontend** (`client/`) : aucune route API, logique métier ou variable
d'environnement n'a été modifiée. Le dossier `server/` est strictement identique
à la version précédente (vérifié par diff avant livraison).

### Fichiers modifiés ou ajoutés
- `client/src/components/PasswordField.jsx` **(nouveau)** — champ mot de passe
  réutilisable avec bouton afficher/masquer (icône œil), utilisé par Login et
  Register.
- `client/src/pages/Login.jsx` — placeholder email harmonisé, attributs
  `name`/`autoComplete` corrigés, lien factice "Mot de passe oublié ?".
- `client/src/pages/Register.jsx` — mêmes corrections d'attributs sur l'email,
  bouton œil sur les 2 champs mot de passe.
- `client/src/components/SearchBar.jsx` — icône loupe intégrée.
- `client/src/pages/Dashboard.jsx` — compteur de notes déplacé sous un nouveau
  titre de page "Notes".
- `client/src/hooks/useNotes.js` — la note modifiée est désormais replacée en
  tête de liste côté client (voir détail ci-dessous).
- `client/src/styles/auth.css` / `client/src/styles/dashboard.css` — styles
  associés à tout ce qui précède.

### Détails et points d'attention

**Popups natives du navigateur ("Gérer les mots de passe" / "Utiliser un mot de
passe généré")** : les attributs `name` (qui manquaient auparavant) et
`autoComplete` corrects (`email`, `current-password`, `new-password` selon le
contexte) ont été ajoutés — c'est ce qui aide le navigateur à identifier
correctement le rôle de chaque champ et limite ces bulles. Des attributs
`data-lpignore` / `data-1p-ignore` / `data-bwignore` ont aussi été ajoutés pour
les gestionnaires de mots de passe tiers (1Password, LastPass, Bitwarden).
**Point de transparence** : le gestionnaire de mots de passe *natif* de Chrome/
Firefox/Edge ne propose aucun attribut officiel permettant à un site de
désactiver totalement sa propre bulle — c'est une décision du navigateur, pas
du site. Le correctif ci-dessus traite la cause la plus fréquente, sans
garantie à 100 % selon la version du navigateur.

**Tri des notes par date de modification** : la requête SQL (`ORDER BY
updated_at DESC`) était déjà correctement en place côté backend (avec trigger
PostgreSQL et index dédiés) — aucun changement n'y a été nécessaire. En
revanche, le frontend remplaçait la note modifiée "à sa place" dans la liste en
mémoire (sans re-trier), ce qui fait qu'elle ne remontait visuellement en haut
qu'après un rechargement complet de la page. `useNotes.js` a donc été ajusté
pour replacer immédiatement la note mise à jour en tête de liste côté client,
afin que le résultat corresponde réellement à l'objectif demandé.

**Confirmation du mot de passe (Register)** : le placeholder `••••••••` de ce
champ a aussi été remplacé (par "Ressaisissez votre mot de passe"), pour rester
cohérent avec la correction appliquée au champ mot de passe de la page de
connexion — même défaut visuel, même correctif.

### Vérifications effectuées pour cette révision
- `npm run build` (Vite) exécuté sans erreur après toutes les modifications.
- Diff complet du dossier `server/` contre la version précédente : **0 différence**.
- Vérification croisée : chaque classe CSS utilisée dans le JSX modifié possède
  bien sa définition correspondante dans les feuilles de style (aucune classe
  orpheline).
- Aucune dépendance ajoutée à `package.json` (icônes en SVG natif, pas de
  librairie externe) : le projet reste "Plug & Play" tel que demandé.
