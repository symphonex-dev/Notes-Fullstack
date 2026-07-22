import { query } from "../config/db.js";

// Toutes les requêtes utilisent des paramètres préparés ($1, $2...) :
// `pg` échappe et type les valeurs lui-même, donc aucune concaténation
// de chaîne SQL n'apparaît jamais dans ce fichier.

/**
 * Recherche un utilisateur par email (utilisé pour login + vérification
 * d'unicité à l'inscription). Renvoie aussi le hash du mot de passe car
 * cette fonction sert en interne à l'authentification.
 */
export const findUserByEmail = async (email) => {
  const result = await query(
    "SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] || null;
};

/**
 * Recherche un utilisateur par id, sans le hash du mot de passe.
 * Utilisé pour reconstituer req.user côté middleware d'authentification.
 */
export const findUserById = async (id) => {
  const result = await query(
    "SELECT id, name, email, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Insère un nouvel utilisateur. Le mot de passe arrive déjà haché par
 * bcrypt (le hachage est fait dans le controller, pas ici) : le modèle ne
 * manipule jamais de mot de passe en clair.
 */
export const createUser = async ({ name, email, passwordHash }) => {
  const result = await query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, passwordHash]
  );
  return result.rows[0];
};
