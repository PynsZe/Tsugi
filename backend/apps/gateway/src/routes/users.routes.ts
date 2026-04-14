import { Router } from "express";
import {
  handleAddFavorite,
  handleDeleteFromList,
  handleGetFavorites,
  handleGetFavoritesByUsername,
  handleGetList,
  handleGetMe,
  handleGetProfileByUsername,
  handlePatchList,
  handlePatchVisibility,
  handleRemoveFavorite,
} from "../controllers/users.controller";

export const router = Router();

router.get(
  "/me",
  /**
   * @openapi
   * /users/me:
   *   get:
   *     summary: Recuperer le profil de l'utilisateur connecte
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Profil utilisateur
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   example: "67e57ac2f5a2a6f0af0b62d0"
   *                 username:
   *                   type: string
   *                   example: "john"
   *                 email:
   *                   type: string
   *                   example: "john@mail.com"
   *                 imageUrl:
   *                   type: string
   *                   example: "https://example.com/avatar.png"
   *                 profileVisibility:
   *                   type: string
   *                   example: "public"
   *                 animeList:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       animeId:
   *                         type: integer
   *                         example: 4224
   *                       status:
   *                         type: string
   *                         example: "watching"
   *                       isFavorite:
   *                         type: boolean
   *                         example: true
   *                       userComment:
   *                         type: string
   *                         example: ""
   *                       rating:
   *                         type: integer
   *                         example: 8
   *                 createdAt:
   *                   type: string
   *                   example: "2026-01-01T10:00:00.000Z"
   *                 updatedAt:
   *                   type: string
   *                   example: "2026-01-01T10:00:00.000Z"
   *       401:
   *         description: Token manquant ou invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "UNAUTHORIZED"
   *       404:
   *         description: Utilisateur introuvable
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "NOT_FOUND"
   *                 message:
   *                   type: string
   *                   example: "Not found"
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
  handleGetMe,
);
router.patch(
  "/me/visibility",
  /**
   * @openapi
   * /users/me/visibility:
   *   patch:
   *     summary: Modifier la visibilite du profil
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - visibility
   *             properties:
   *               visibility:
   *                 type: string
   *                 example: "public"
   *     responses:
   *       200:
   *         description: Mise a jour effectuee
   *       400:
   *         description: Corps invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "INVALID_INPUT"
   *       401:
   *         description: Token manquant ou invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "UNAUTHORIZED"
   *       404:
   *         description: Utilisateur introuvable
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "NOT_FOUND"
   *                 message:
   *                   type: string
   *                   example: "Not found"
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
  handlePatchVisibility,
);

router.get(
  "/me/list",
  /**
   * @openapi
   * /users/me/list:
   *   get:
   *     summary: Recuperer la liste utilisateur
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Liste recuperee
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 animeList:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       animeId:
   *                         type: integer
   *                         example: 4224
   *                       status:
   *                         type: string
   *                         example: "watching"
   *                       isFavorite:
   *                         type: boolean
   *                         example: true
   *                       userComment:
   *                         type: string
   *                         example: ""
   *                       rating:
   *                         type: integer
   *                         example: 8
   *       401:
   *         description: Token manquant ou invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "UNAUTHORIZED"
   *       404:
   *         description: Utilisateur introuvable
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "NOT_FOUND"
   *                 message:
   *                   type: string
   *                   example: "Not found"
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
  handleGetList,
);
router.patch(
  "/me/list",
  /**
   * @openapi
   * /users/me/list:
   *   patch:
   *     summary: Ajouter ou modifier un anime dans la liste
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - animeId
   *               - status
   *             properties:
   *               animeId:
   *                 type: integer
   *                 example: 4224
   *               rating:
   *                 type: integer
   *                 example: 8
   *               userComment:
   *                 type: string
   *                 example: ""
   *               status:
   *                 type: string
   *                 example: "watching"
   *               isFavorite:
   *                 type: boolean
   *                 example: false
   *     responses:
   *       200:
   *         description: Liste mise a jour
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 ok:
   *                   type: boolean
   *                   example: true
   *       400:
   *         description: Corps invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "INVALID_INPUT"
   *       401:
   *         description: Token manquant ou invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "UNAUTHORIZED"
   *       404:
   *         description: Utilisateur introuvable
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "NOT_FOUND"
   *                 message:
   *                   type: string
   *                   example: "NO_USER_EXIST"
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
  handlePatchList,
);
router.delete(
  "/me/list/:id",
  /**
   * @openapi
   * /users/me/list/{id}:
   *   delete:
   *     summary: Supprimer un anime de la liste
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de l'anime a supprimer
   *         example: 4224
   *     responses:
   *       200:
   *         description: Anime supprime
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 ok:
   *                   type: boolean
   *                   example: true
   *       400:
   *         description: Parametre id invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "INVALID_PARAMS"
   *                 details:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       path:
   *                         type: string
   *                         example: "id"
   *                       message:
   *                         type: string
   *                         example: "Number must be greater than 0"
   *       401:
   *         description: Token manquant ou action non autorisee
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "UNAUTHORIZED"
   *       404:
   *         description: Utilisateur introuvable
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "NOT_FOUND"
   *                 message:
   *                   type: string
   *                   example: "Not found"
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
  handleDeleteFromList,
);

router.get(
  "/me/favorites",
  /**
   * @openapi
   * /users/me/favorites:
   *   get:
   *     summary: Recuperer les favoris du profil connecte
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Liste des favoris
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   animeId:
   *                     type: integer
   *                     example: 4224
   *                   status:
   *                     type: string
   *                     example: "watching"
   *                   isFavorite:
   *                     type: boolean
   *                     example: true
   *                   userComment:
   *                     type: string
   *                     example: ""
   *                   rating:
   *                     type: integer
   *                     example: 8
   *       401:
   *         description: Token manquant ou invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "UNAUTHORIZED"
   *       404:
   *         description: Utilisateur introuvable
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "NOT_FOUND"
   *                 message:
   *                   type: string
   *                   example: "Not found"
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
  handleGetFavorites,
);
router.put(
  "/me/favorites/:id",
  /**
   * @openapi
   * /users/me/favorites/{id}:
   *   put:
   *     summary: Ajouter un anime aux favoris
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de l'anime a ajouter aux favoris
   *         example: 4224
   *     responses:
   *       200:
   *         description: Favori ajoute ou mis a jour
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 ok:
   *                   type: boolean
   *                   example: true
   *       400:
   *         description: Parametre id invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "INVALID_PARAMS"
   *                 details:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       path:
   *                         type: string
   *                         example: "id"
   *                       message:
   *                         type: string
   *                         example: "Number must be greater than 0"
   *       401:
   *         description: Token manquant ou invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "UNAUTHORIZED"
   *       404:
   *         description: Utilisateur introuvable
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "NOT_FOUND"
   *                 message:
   *                   type: string
   *                   example: "NO_USER_EXIST"
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
  handleAddFavorite,
);
router.delete(
  "/me/favorites/:id",
  /**
   * @openapi
   * /users/me/favorites/{id}:
   *   delete:
   *     summary: Retirer un anime des favoris
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de l'anime a retirer des favoris
   *         example: 4224
   *     responses:
   *       200:
   *         description: Favori retire
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 ok:
   *                   type: boolean
   *                   example: true
   *       400:
   *         description: Parametre id invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "INVALID_PARAMS"
   *                 details:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       path:
   *                         type: string
   *                         example: "id"
   *                       message:
   *                         type: string
   *                         example: "Number must be greater than 0"
   *       401:
   *         description: Token manquant ou invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "UNAUTHORIZED"
   *       404:
   *         description: Utilisateur introuvable ou anime absent
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "NOT_FOUND"
   *                 message:
   *                   type: string
   *                   example: "ANIME_NOT_FOUND_IN_LIST"
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
  handleRemoveFavorite,
);

router.get(
  "/profile/:username",
  /**
   * @openapi
   * /users/profile/{username}:
   *   get:
   *     summary: Recuperer un profil public par username
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: username
   *         required: true
   *         schema:
   *           type: string
   *         example: "john"
   *     responses:
   *       200:
   *         description: Profil utilisateur
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 username:
   *                   type: string
   *                   example: "john"
   *                 imageUrl:
   *                   type: string
   *                   example: "https://example.com/avatar.png"
   *                 animeList:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       animeId:
   *                         type: integer
   *                         example: 4224
   *                       status:
   *                         type: string
   *                         example: "watching"
   *                       isFavorite:
   *                         type: boolean
   *                         example: true
   *                       userComment:
   *                         type: string
   *                         example: ""
   *                       rating:
   *                         type: integer
   *                         example: 8
   *       400:
   *         description: Parametre username invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "INVALID_PARAMS"
   *                 details:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       path:
   *                         type: string
   *                         example: "username"
   *                       message:
   *                         type: string
   *                         example: "Required"
   *       404:
   *         description: Utilisateur introuvable ou profil ghost
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "NOT_FOUND"
   *                 message:
   *                   type: string
   *                   example: "NO_USER_EXIST"
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
  handleGetProfileByUsername,
);
router.get(
  "/profile/:username/favorites",
  /**
   * @openapi
   * /users/profile/{username}/favorites:
   *   get:
   *     summary: Recuperer les favoris d'un profil public
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: username
   *         required: true
   *         schema:
   *           type: string
   *         example: "john"
   *     responses:
   *       200:
   *         description: Favoris
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   animeId:
   *                     type: integer
   *                     example: 4224
   *                   status:
   *                     type: string
   *                     example: "watching"
   *                   isFavorite:
   *                     type: boolean
   *                     example: true
   *                   userComment:
   *                     type: string
   *                     example: ""
   *                   rating:
   *                     type: integer
   *                     example: 8
   *       400:
   *         description: Parametre username invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "INVALID_PARAMS"
   *                 details:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       path:
   *                         type: string
   *                         example: "username"
   *                       message:
   *                         type: string
   *                         example: "Required"
   *       401:
   *         description: Profil prive
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "UNAUTHORIZED"
   *                 message:
   *                   type: string
   *                   example: "Unauthorized"
   *       404:
   *         description: Utilisateur introuvable ou profil ghost
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "NOT_FOUND"
   *                 message:
   *                   type: string
   *                   example: "NO_USER_EXIST"
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
  handleGetFavoritesByUsername,
);

export default router;
