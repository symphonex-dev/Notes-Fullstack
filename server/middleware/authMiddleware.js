import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { findUserById } from "../models/userModel.js";

// Protège une route : exige un header "Authorization: Bearer <token>",
// vérifie sa signature/expiration, puis attache l'utilisateur correspondant
// sur req.user. Toute route CRUD des notes utilise ce middleware, ce qui
// garantit qu'il n'existe aucune route de notes accessible sans identité
// connue — condition nécessaire pour pouvoir ensuite filtrer par userId.
export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentification requise : token manquant.");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, "Token invalide ou expiré.");
  }

  const user = await findUserById(decoded.id);
  if (!user) {
    throw new ApiError(401, "Utilisateur introuvable pour ce token.");
  }

  req.user = user; // { id, name, email, created_at }
  next();
});
