// Express ne capture pas nativement les rejets de Promise dans les routes
// async : sans ce wrapper, une erreur dans un `await` ferait planter le
// process au lieu de passer au middleware d'erreurs. On enveloppe donc
// chaque controller avec asyncHandler(fn) plutôt que d'écrire un
// try/catch identique partout.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
