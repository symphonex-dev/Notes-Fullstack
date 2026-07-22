import { query } from "../config/db.js";

// RÈGLE DE SÉCURITÉ CENTRALE : chaque fonction ci-dessous prend un userId
// et l'inclut dans la clause WHERE de la requête SQL. Ce n'est jamais fait
// "en plus" côté JS après coup : c'est PostgreSQL lui-même qui ne renvoie
// et ne modifie jamais une ligne n'appartenant pas à l'utilisateur.

/** Liste toutes les notes d'un utilisateur, les plus récemment modifiées en premier. */
export const findNotesByUser = async (userId) => {
  const result = await query(
    `SELECT id, title, content, user_id AS "userId", created_at AS "createdAt", updated_at AS "updatedAt"
     FROM notes
     WHERE user_id = $1
     ORDER BY updated_at DESC`,
    [userId]
  );
  return result.rows;
};

/** Récupère une note précise, uniquement si elle appartient à userId. */
export const findNoteByIdAndUser = async (noteId, userId) => {
  const result = await query(
    `SELECT id, title, content, user_id AS "userId", created_at AS "createdAt", updated_at AS "updatedAt"
     FROM notes
     WHERE id = $1 AND user_id = $2`,
    [noteId, userId]
  );
  return result.rows[0] || null;
};

/** Crée une note rattachée à userId. */
export const createNote = async ({ title, content, userId }) => {
  const result = await query(
    `INSERT INTO notes (title, content, user_id)
     VALUES ($1, $2, $3)
     RETURNING id, title, content, user_id AS "userId", created_at AS "createdAt", updated_at AS "updatedAt"`,
    [title, content, userId]
  );
  return result.rows[0];
};

/**
 * Met à jour une note. La clause WHERE id = $3 AND user_id = $4 garantit
 * qu'aucune ligne n'est modifiée si la note n'appartient pas à userId :
 * dans ce cas `rowCount` vaut 0 et le controller renvoie une 404.
 */
export const updateNote = async (noteId, userId, { title, content }) => {
  const result = await query(
    `UPDATE notes
     SET title = $1, content = $2
     WHERE id = $3 AND user_id = $4
     RETURNING id, title, content, user_id AS "userId", created_at AS "createdAt", updated_at AS "updatedAt"`,
    [title, content, noteId, userId]
  );
  return result.rows[0] || null;
};

/** Supprime une note, uniquement si elle appartient à userId. */
export const deleteNote = async (noteId, userId) => {
  const result = await query(
    "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id",
    [noteId, userId]
  );
  return result.rowCount > 0;
};
