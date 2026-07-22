import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middleware/validateMiddleware.js";

const router = Router();

// Ces deux routes sont volontairement publiques (pas de middleware `protect`) :
// c'est justement leur rôle de délivrer le token qui donnera accès au reste de l'API.
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

export default router;
