import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { generateToken } from "../utils/generateToken.js";
import { findUserByEmail, createUser } from "../models/userModel.js";

const SALT_ROUNDS = 10;

// POST /api/auth/register
// Vérifie l'unicité de l'email, hache le mot de passe avec bcrypt (jamais
// stocké en clair), crée l'utilisateur, puis renvoie directement un token
// pour connecter l'utilisateur sans étape de login supplémentaire.
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new ApiError(409, "Un compte existe déjà avec cet email.");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({ name: name.trim(), email: normalizedEmail, passwordHash });

  const token = generateToken(user);

  // Le hash n'est jamais renvoyé : `user` ici ne contient que id/name/email/created_at.
  res.status(201).json({ user, token });
});

// POST /api/auth/login
// Recherche l'utilisateur par email, compare le mot de passe fourni au hash
// stocké via bcrypt.compare (jamais de comparaison en clair), puis renvoie
// un token si tout correspond. Le message d'erreur reste volontairement
// générique pour ne pas révéler si c'est l'email ou le mot de passe qui
// est incorrect (bonne pratique de sécurité).
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const userWithHash = await findUserByEmail(normalizedEmail);
  if (!userWithHash) {
    throw new ApiError(401, "Email ou mot de passe incorrect.");
  }

  const isMatch = await bcrypt.compare(password, userWithHash.password_hash);
  if (!isMatch) {
    throw new ApiError(401, "Email ou mot de passe incorrect.");
  }

  const { password_hash, ...user } = userWithHash; // on retire le hash avant de renvoyer
  const token = generateToken(user);

  res.status(200).json({ user, token });
});
