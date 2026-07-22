import { ApiError } from "../utils/ApiError.js";

/** Déclenché quand aucune route ne correspond : transforme en 404 propre. */
export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route introuvable : ${req.method} ${req.originalUrl}`));
};

/**
 * Middleware d'erreurs global (4 arguments = signature reconnue par Express).
 * Centralise la mise en forme JSON de TOUTE erreur de l'application, pour
 * qu'un throw dans un controller ne fasse jamais planter le serveur et
 * ne renvoie jamais une pile d'erreur brute au client.
 */
export const errorHandler = (err, req, res, next) => {
  // Erreur métier explicite (ApiError) : on connaît le bon statusCode.
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Violation de contrainte PostgreSQL (ex: email déjà utilisé si jamais
  // la validation applicative avait été contournée) : code '23505' = unique_violation.
  if (err.code === "23505") {
    return res.status(409).json({ message: "Cette ressource existe déjà." });
  }

  // Toute autre erreur imprévue : log complet côté serveur pour le debug,
  // mais message générique côté client pour ne pas fuiter de détails internes.
  console.error("Erreur non gérée :", err);
  return res.status(500).json({ message: "Erreur interne du serveur." });
};
