import {Router} from "express";
import {
    handleGetAnimeById,
    handleGetAnimeByName,
    handleGetCatalog,
    handleGetCatalogFiltered,
    handleGetCatalogTop
} from "../controllers/catalog.controller";
import {requireAuth} from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get(
    "/",
    /**
     * @openapi
     * /catalog:
     *   get:
     *     summary: Recuperer le catalogue
     *     tags:
     *       - Catalog
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         required: false
     *         schema:
     *           type: integer
     *         example: 1
     *     responses:
     *       200:
     *         description: Liste des animes
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     example: 1
     *                   title:
     *                     type: string
     *                     example: "Naruto"
     *                   imageUrl:
     *                     type: string
     *                     example: "https://example.com/naruto.jpg"
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
    handleGetCatalog,
);

router.get(
    "/top",
    /**
     * @openapi
     * /catalog/top:
     *   get:
     *     summary: Recuperer le top du catalogue
     *     tags:
     *       - Catalog
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         required: false
     *         schema:
     *           type: integer
     *         example: 1
     *     responses:
     *       200:
     *         description: Liste des animes les mieux notes
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     example: 1
     *                   title:
     *                     type: string
     *                     example: "Naruto"
     *                   imageUrl:
     *                     type: string
     *                     example: "https://example.com/naruto.jpg"
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
    handleGetCatalogTop,
);

router.get(
    "/type/:q/top",
    /**
     * @openapi
     * /catalog/type/{q}/top:
     *   get:
     *     summary: Recuperer le top du catalogue filtre par type
     *     tags:
     *       - Catalog
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: q
     *         required: true
     *         schema:
     *           type: string
     *         example: "action"
     *     responses:
     *       200:
     *         description: Liste des animes filtres
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     example: 1
     *                   title:
     *                     type: string
     *                     example: "Naruto"
     *                   imageUrl:
     *                     type: string
     *                     example: "https://example.com/naruto.jpg"
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
    handleGetCatalogFiltered,
)

router.get(
    "/category/:q/top",
    /**
     * @openapi
     * /catalog/category/{q}/top:
     *   get:
     *     summary: Recuperer le top du catalogue filtre par categorie
     *     tags:
     *       - Catalog
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: q
     *         required: true
     *         schema:
     *           type: string
     *         example: "action"
     *     responses:
     *       200:
     *         description: Liste des animes filtres
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     example: 1
     *                   title:
     *                     type: string
     *                     example: "Naruto"
     *                   imageUrl:
     *                     type: string
     *                     example: "https://example.com/naruto.jpg"
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
    handleGetCatalogFiltered,
)

router.get(
    "/type/:q",
    /**
     * @openapi
     * /catalog/type/{q}:
     *   get:
     *     summary: Recuperer le catalogue filtre par type
     *     tags:
     *       - Catalog
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: q
     *         required: true
     *         schema:
     *           type: string
     *         example: "action"
     *       - in: query
     *         name: page
     *         required: false
     *         schema:
     *           type: integer
     *         example: 1
     *     responses:
     *       200:
     *         description: Liste des animes filtres
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     example: 1
     *                   title:
     *                     type: string
     *                     example: "Naruto"
     *                   imageUrl:
     *                     type: string
     *                     example: "https://example.com/naruto.jpg"
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
    handleGetCatalogFiltered,
)

router.get(
    "/category/:q",
    /**
     * @openapi
     * /catalog/category/{q}:
     *   get:
     *     summary: Recuperer le catalogue filtre par categorie
     *     tags:
     *       - Catalog
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: q
     *         required: true
     *         schema:
     *           type: string
     *         example: "action"
     *       - in: query
     *         name: page
     *         required: false
     *         schema:
     *           type: integer
     *         example: 1
     *     responses:
     *       200:
     *         description: Liste des animes filtres
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     example: 1
     *                   title:
     *                     type: string
     *                     example: "Naruto"
     *                   imageUrl:
     *                     type: string
     *                     example: "https://example.com/naruto.jpg"
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
    handleGetCatalogFiltered,
)

router.get(
    "/anime/id/:animeId",
    /**
     * @openapi
     * /catalog/anime/id/{animeId}:
     *   get:
     *     summary: Recuperer un anime par son ID
     *     tags:
     *       - Catalog
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: animeId
     *         required: true
     *         schema:
     *           type: integer
     *         example: 1
     *     responses:
     *       200:
     *         description: Anime trouve
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 title:
     *                   type: string
     *                   example: "Naruto"
     *                 synopsis:
     *                   type: string
     *                   example: "..."
     *                 imageUrl:
     *                   type: string
     *                   example: "https://example.com/naruto.jpg"
     *       400:
     *         description: Entree invalide
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
     *         description: Anime non trouve
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
     *                   example: "anime not found in Jikan API"
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
    handleGetAnimeById,
);

router.get(
    "/anime/name/:q",
    /**
     * @openapi
     * /catalog/anime/name/{q}:
     *   get:
     *     summary: Rechercher des animes par nom
     *     tags:
     *       - Catalog
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: q
     *         required: true
     *         schema:
     *           type: string
     *         example: "naruto"
     *     responses:
     *       200:
     *         description: Liste des animes correspondants
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     example: 1
     *                   title:
     *                     type: string
     *                     example: "Naruto"
     *                   imageUrl:
     *                     type: string
     *                     example: "https://example.com/naruto.jpg"
     *       400:
     *         description: Entree invalide
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
    handleGetAnimeByName,
);

export default router;
