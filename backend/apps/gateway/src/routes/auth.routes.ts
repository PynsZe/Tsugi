import {Router} from "express";
import {handleLogin, handleRegister, handleMe} from "../controllers/auth.controller";

const router = Router();

router.post(
  "/register",
	/**
	 * @openapi
	 * /auth/register:
	 *   post:
	 *     summary: Inscrire un utilisateur
	 *     tags:
	 *       - Auth
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - email
	 *               - username
	 *               - password
	 *             properties:
	 *               email:
	 *                 type: string
	 *                 description: Adresse email de l'utilisateur
	 *                 example: "test@mail.com"
	 *               username:
	 *                 type: string
	 *                 description: Nom d'utilisateur
	 *                 example: "unSuperNom"
	 *               password:
	 *                 type: string
	 *                 description: Mot de passe de l'utilisateur
	 *                 example: "m0nChienAMangerMonArm0ire"
	 *     responses:
	 *       201:
	 *         description: Utilisateur créé avec succès
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 id:
	 *                   type: string
	 *                   example: "64f1a2b3c4d5e6f7a8b9c0d1"
	 *                 username:
	 *                   type: string
	 *                   example: "unSuperNom"
	 *                 email:
	 *                   type: string
	 *                   example: "test@mail.com"
	 *       400:
	 *         description: Corps de requête invalide
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 error:
	 *                   type: string
	 *                   example: "INVALID_INPUT"
	 *       409:
	 *         description: Utilisateur déjà existant
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 error:
	 *                   type: string
	 *                   example: "CONFLICT"
	 *       500:
	 *         description: Erreur interne
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 error:
	 *                   type: string
	 *                   example: "INTERNAL_SERVER_ERROR"
	 */
  handleRegister,
);

router.post(
  "/login",
  /**
	 * @openapi
	 * /auth/login:
	 *   post:
	 *     summary: Connecter un utilisateur
	 *     tags:
	 *       - Auth
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - email
	 *               - password
	 *             properties:
	 *               email:
	 *                 type: string
	 *                 description: Adresse email de l'utilisateur
	 *                 example: "test@mail.com"
	 *               password:
	 *                 type: string
	 *                 description: Mot de passe de l'utilisateur
	 *                 example: "123456"
	 *     responses:
	 *       200:
	 *         description: Utilisateur authentifié
	 *       401:
	 *         description: Identifiants invalides
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 error:
	 *                   type: string
	 *                   example: "UNAUTHORIZED"
	 *       500:
	 *         description: Erreur interne Gateway
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 error:
	 *                   type: string
	 *                   example: "INTERNAL_SERVER_ERROR"
	 */
  handleLogin,
);

router.post(
  "/me",
  /**
	 * @openapi
	 * /auth/me:
	 *   post:
	 *     summary: Recuperer l'utilisateur courant
	 *     tags:
	 *       - Auth
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Informations utilisateur
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 sub:
	 *                   type: string
	 *                   example: "user-id"
	 *                 email:
	 *                   type: string
	 *                   example: "test@mail.com"
	 *                 username:
	 *                   type: string
	 *                   example: "john"
	 *       401:
	 *         description: Non autorise
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 error:
	 *                   type: string
	 *                   example: "UNAUTHORIZED"
	 *       500:
	 *         description: Erreur interne Gateway
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 error:
	 *                   type: string
	 *                   example: "INTERNAL_SERVER_ERROR"
	 */
  handleMe,
);

export default router;
