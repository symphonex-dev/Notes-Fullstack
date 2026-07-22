import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// CORS : seule l'origine du frontend (CLIENT_URL) est autorisée à appeler
// cette API depuis un navigateur. Sans ce middleware, React ne pourrait
// pas faire de requêtes vers l'API (port différent = origine différente).
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
