import { ApiError } from "../utils/ApiError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valide le payload d'inscription : nom, email, mot de passe. */
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Le nom doit contenir au moins 2 caractères.");
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push("Adresse email invalide.");
  }
  if (!password || password.length < 6) {
    errors.push("Le mot de passe doit contenir au moins 6 caractères.");
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors.join(" "));
  }
  next();
};

/** Valide le payload de connexion : email + mot de passe présents. */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push("Adresse email invalide.");
  }
  if (!password) {
    errors.push("Le mot de passe est requis.");
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors.join(" "));
  }
  next();
};

/** Valide le payload de création/modification d'une note. */
export const validateNote = (req, res, next) => {
  const { title } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("Le titre est obligatoire.");
  } else if (title.length > 200) {
    errors.push("Le titre ne peut pas dépasser 200 caractères.");
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors.join(" "));
  }
  next();
};
