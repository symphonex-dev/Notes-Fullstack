// Pool de connexions PostgreSQL partagé par toute l'application.
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Si DATABASE_URL est définie (en production / sur Render), on l'utilise.
// Sinon, on repasse sur les variables locales (PGUSER, PGHOST, etc.)
const isProduction = process.env.NODE_ENV === "production" || process.env.DATABASE_URL;

export const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false, // Indispensable pour la connexion sécurisée sur Render
        },
        max: 10,
        idleTimeoutMillis: 30000,
      }
    : {
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT) || 5432,
        database: process.env.PGDATABASE,
        max: 10,
        idleTimeoutMillis: 30000,
      }
);

// Log si la connexion échoue au démarrage
pool.on("error", (err) => {
  console.error("Erreur inattendue sur une connexion PostgreSQL inactive :", err);
});

/**
 * Helper d'exécution des requêtes SQL sécurisées ($1, $2, ...)
 */
export const query = (text, params) => pool.query(text, params);