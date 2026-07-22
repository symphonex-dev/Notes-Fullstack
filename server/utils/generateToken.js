import jwt from "jsonwebtoken";

// Génère un JWT signé contenant l'id et l'email de l'utilisateur.
// Ce token est renvoyé au client après register/login, stocké côté
// front dans localStorage, puis renvoyé sur chaque requête protégée
// via l'en-tête "Authorization: Bearer <token>".
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};
