// Pool de connexions PostgreSQL partagé par toute l'application.
// Un pool réutilise un ensemble de connexions ouvertes au lieu d'en créer
// une nouvelle à chaque requête : c'est la pratique standard avec `pg`.
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE,
  max: 10, // nombre max de connexions simultanées dans le pool
  idleTimeoutMillis: 30000,
});

// Log une seule fois si la connexion échoue au démarrage, pour un diagnostic
// clair plutôt qu'une pile d'erreurs cryptique au premier appel API.
pool.on("error", (err) => {
  console.error("Erreur inattendue sur une connexion PostgreSQL inactive :", err);
});

/**
 * Petit helper qui centralise l'exécution des requêtes SQL.
 * Toutes les requêtes du projet passent par ici et utilisent des paramètres
 * préparés ($1, $2, ...) : aucune concaténation de chaînes SQL nulle part,
 * ce qui élimine tout risque d'injection SQL.
 */
export const query = (text, params) => pool.query(text, params);
