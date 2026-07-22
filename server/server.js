import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { pool } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// On vérifie la connexion PostgreSQL AVANT d'ouvrir le port HTTP : mieux
// vaut échouer immédiatement avec un message clair que de démarrer une API
// qui plantera à la première requête.
pool
  .query("SELECT 1")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ API Notes démarrée sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Impossible de se connecter à PostgreSQL :", err.message);
    process.exit(1);
  });
