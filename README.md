# 🚀 Notes App

Une application full stack de prise de notes où chaque utilisateur crée un compte sécurisé et gère sa propre collection de notes, avec recherche instantanée et sauvegarde en base de données.

## 🔗 Démo en ligne
👉 [Voir le projet en direct](https://notes-fullstack-symphonex.vercel.app)

## ✨ Fonctionnalités clés
* Inscription et connexion sécurisées, avec mots de passe hachés via bcrypt et jamais stockés en clair
* Authentification par token JWT, avec routes protégées côté client et côté serveur
* Création, modification et suppression de notes (CRUD complet)
* Isolation totale des données : chaque utilisateur ne peut voir et modifier que ses propres notes
* Recherche instantanée dans les notes, par titre et par contenu
* Tri automatique des notes par date de dernière modification
* Fenêtre de confirmation avant toute suppression, pour éviter les erreurs
* Notifications visuelles (toasts) pour informer l'utilisateur du résultat de ses actions
* Validation des données côté serveur (format email, longueur du mot de passe, titre obligatoire)

## 🛠️ Tech Stack
* **Frontend :** React, Vite, React Router DOM, Axios, Context API
* **Backend :** Node.js, Express, PostgreSQL, JWT, bcrypt
* **Déploiement :** Vercel (Frontend), Render (Backend)

## 💻 Installation & Lancement en local
1. Cloner le dépôt :
   `git clone https://github.com/symphonex-dev/Notes-Fullstack.git`
2. Installer les dépendances du frontend :
   `cd client && npm install`
3. Installer les dépendances du backend :
   `cd server && npm install`
4. Configurer les variables d'environnement : dupliquer les fichiers `.env.example` en `.env` dans `client/` et dans `server/`, puis renseigner les identifiants PostgreSQL et le secret JWT
5. Initialiser la base de données PostgreSQL :
   `npm run db:init`
6. Lancer le backend :
   `npm run dev`
7. Lancer le frontend (dans un second terminal) :
   `npm run dev`