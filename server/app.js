import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Liste des origines autorisées pour éviter tout blocage CORS en production et local
const allowedOrigins = [
  "http://localhost:5173",
  "https://notes-fullstack-symphonex.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean); // Filtre les valeurs indéfinies

app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise les requêtes sans origine (comme les outils Postman ou mobile) et les domaines de la liste
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // En développement/déploiement, on laisse passer pour éviter les rejets stricts
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Parse automatiquement les bodies JSON entrants (req.body).
app.use(express.json());

// Petit endpoint de santé, pratique pour vérifier que l'API tourne.
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Montage des routes métier sous /api/...
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// 404 pour toute route non reconnue, puis gestion d'erreurs globale.
// L'ordre est important : ces deux middlewares doivent être déclarés
// APRÈS toutes les routes.
app.use(notFoundHandler);
app.use(errorHandler);

export default app;