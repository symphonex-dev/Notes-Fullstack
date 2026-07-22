// Erreur "métier" enrichie d'un statusCode HTTP.
// Permet aux controllers de faire `throw new ApiError(404, "Note introuvable")`
// et au middleware d'erreurs global de savoir exactement quoi renvoyer.
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}
