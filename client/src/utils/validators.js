const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Chaque validateur renvoie soit `null` (champ valide), soit un message
// d'erreur prêt à afficher. Les formulaires appellent ces fonctions au
// submit pour construire leur objet d'erreurs, sans dupliquer la logique.

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return "Le nom doit contenir au moins 2 caractères.";
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email || !EMAIL_REGEX.test(email)) {
    return "Adresse email invalide.";
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return "Les mots de passe ne correspondent pas.";
  }
  return null;
};

export const validateTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return "Le titre est obligatoire.";
  }
  if (title.length > 200) {
    return "Le titre ne peut pas dépasser 200 caractères.";
  }
  return null;
};

// Extrait un message d'erreur lisible depuis une erreur Axios, avec
// repli sur un message générique si la réponse API est absente
// (ex : serveur injoignable, coupure réseau).
export const extractErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    "Une erreur est survenue. Veuillez réessayer."
  );
};
