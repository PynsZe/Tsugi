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
    /*
      #swagger.tags = ['Catalog']
      #swagger.summary = 'Récupérer le catalogue'
      #swagger.parameters['Authorization'] = {
        in: 'header',
        required: true,
        type: 'string',
        description: 'Bearer token'
      }
      #swagger.parameters['page'] = {
        in: 'query',
        required: false,
        type: 'integer',
        example: 1
      }
      #swagger.responses[200] = {
        description: 'Liste des animes',
        schema: [
          { id: 1, title: 'Naruto', imageUrl: 'https://example.com/naruto.jpg' }
        ]
      }
      #swagger.responses[401] = {
        description: 'Token manquant ou invalide',
        schema: { error: 'UNAUTHORIZED' }
      }
      #swagger.responses[500] = {
        description: 'Erreur interne Gateway',
        schema: { error: 'INTERNAL_SERVER_ERROR' }
      }
    */
    handleGetCatalog,
);

router.get(
    "/top",
    /*
      #swagger.tags = ['Catalog']
      #swagger.summary = 'Récupérer le top du catalogue'
      #swagger.parameters['Authorization'] = {
        in: 'header',
        required: true,
        type: 'string',
        description: 'Bearer token'
      }
      #swagger.parameters['page'] = {
        in: 'query',
        required: false,
        type: 'integer',
        example: 1
      }
      #swagger.responses[200] = {
        description: 'Liste des animes les mieux notés',
        schema: [
          { id: 1, title: 'Naruto', imageUrl: 'https://example.com/naruto.jpg' }
        ]
      }
      #swagger.responses[401] = {
        description: 'Token manquant ou invalide',
        schema: { error: 'UNAUTHORIZED' }
      }
      #swagger.responses[500] = {
        description: 'Erreur interne Gateway',
        schema: { error: 'INTERNAL_SERVER_ERROR' }
      }
    */
    handleGetCatalogTop,
);

router.get(
    "/type/:q/top",
    /*
      #swagger.tags = ['Catalog']
      #swagger.summary = 'Récupérer le top du catalogue filtré par type'
      #swagger.parameters['Authorization'] = {
        in: 'header',
        required: true,
        type: 'string',
        description: 'Bearer token'
      }
      #swagger.parameters['q'] = {
        in: 'path',
        required: true,
        type: 'string',
        example: 'action'
      }
      #swagger.responses[200] = {
        description: 'Liste des animes filtrés',
        schema: [
          { id: 1, title: 'Naruto', imageUrl: 'https://example.com/naruto.jpg' }
        ]
      }
      #swagger.responses[401] = {
        description: 'Token manquant ou invalide',
        schema: { error: 'UNAUTHORIZED' }
      }
      #swagger.responses[500] = {
        description: 'Erreur interne Gateway',
        schema: { error: 'INTERNAL_SERVER_ERROR' }
      }
    */
    handleGetCatalogFiltered,
)

router.get(
    "/category/:q/top",
    /*
      #swagger.tags = ['Catalog']
      #swagger.summary = 'Récupérer le top du catalogue filtré par catégorie'
      #swagger.parameters['Authorization'] = {
        in: 'header',
        required: true,
        type: 'string',
        description: 'Bearer token'
      }
      #swagger.parameters['q'] = {
        in: 'path',
        required: true,
        type: 'string',
        example: 'action'
      }
      #swagger.responses[200] = {
        description: 'Liste des animes filtrés',
        schema: [
          { id: 1, title: 'Naruto', imageUrl: 'https://example.com/naruto.jpg' }
        ]
      }
      #swagger.responses[401] = {
        description: 'Token manquant ou invalide',
        schema: { error: 'UNAUTHORIZED' }
      }
      #swagger.responses[500] = {
        description: 'Erreur interne Gateway',
        schema: { error: 'INTERNAL_SERVER_ERROR' }
      }
    */
    handleGetCatalogFiltered,
)

router.get(
    "/type/:q",
    /*
      #swagger.tags = ['Catalog']
      #swagger.summary = 'Récupérer le catalogue filtré par type'
      #swagger.parameters['Authorization'] = {
        in: 'header',
        required: true,
        type: 'string',
        description: 'Bearer token'
      }
      #swagger.parameters['q'] = {
        in: 'path',
        required: true,
        type: 'string',
        example: 'action'
      }
      #swagger.parameters['page'] = {
        in: 'query',
        required: false,
        type: 'integer',
        example: 1
      }
      #swagger.responses[200] = {
        description: 'Liste des animes filtrés',
        schema: [
          { id: 1, title: 'Naruto', imageUrl: 'https://example.com/naruto.jpg' }
        ]
      }
      #swagger.responses[401] = {
        description: 'Token manquant ou invalide',
        schema: { error: 'UNAUTHORIZED' }
      }
      #swagger.responses[500] = {
        description: 'Erreur interne Gateway',
        schema: { error: 'INTERNAL_SERVER_ERROR' }
      }
    */
    handleGetCatalogFiltered,
)

router.get(
    "/category/:q",
    /*
      #swagger.tags = ['Catalog']
      #swagger.summary = 'Récupérer le catalogue filtré par catégorie'
      #swagger.parameters['Authorization'] = {
        in: 'header',
        required: true,
        type: 'string',
        description: 'Bearer token'
      }
      #swagger.parameters['q'] = {
        in: 'path',
        required: true,
        type: 'string',
        example: 'action'
      }
      #swagger.parameters['page'] = {
        in: 'query',
        required: false,
        type: 'integer',
        example: 1
      }
      #swagger.responses[200] = {
        description: 'Liste des animes filtrés',
        schema: [
          { id: 1, title: 'Naruto', imageUrl: 'https://example.com/naruto.jpg' }
        ]
      }
      #swagger.responses[401] = {
        description: 'Token manquant ou invalide',
        schema: { error: 'UNAUTHORIZED' }
      }
      #swagger.responses[500] = {
        description: 'Erreur interne Gateway',
        schema: { error: 'INTERNAL_SERVER_ERROR' }
      }
    */
    handleGetCatalogFiltered,
)

router.get(
    "/anime/id/:animeId",
    /*
      #swagger.tags = ['Catalog']
      #swagger.summary = 'Récupérer un anime par son ID'
      #swagger.parameters['Authorization'] = {
        in: 'header',
        required: true,
        type: 'string',
        description: 'Bearer token'
      }
      #swagger.parameters['animeId'] = {
        in: 'path',
        required: true,
        type: 'integer',
        example: 1
      }
      #swagger.responses[200] = {
        description: 'Anime trouvé',
        schema: {
          id: 1,
          title: 'Naruto',
          synopsis: '...',
          imageUrl: 'https://example.com/naruto.jpg'
        }
      }
      #swagger.responses[400] = {
        description: 'Entrée invalide',
        schema: { error: 'INVALID_INPUT' }
      }
      #swagger.responses[401] = {
        description: 'Token manquant ou invalide',
        schema: { error: 'UNAUTHORIZED' }
      }
      #swagger.responses[404] = {
        description: 'Anime non trouvé',
        schema: { error: 'NOT_FOUND', message: 'anime not found in Jikan API' }
      }
      #swagger.responses[500] = {
        description: 'Erreur interne Gateway',
        schema: { error: 'INTERNAL_SERVER_ERROR' }
      }
    */
    handleGetAnimeById,
);

router.get(
    "/anime/name/:q",
    /*
      #swagger.tags = ['Catalog']
      #swagger.summary = 'Rechercher des animes par nom'
      #swagger.parameters['Authorization'] = {
        in: 'header',
        required: true,
        type: 'string',
        description: 'Bearer token'
      }
      #swagger.parameters['q'] = {
        in: 'path',
        required: true,
        type: 'string',
        example: 'naruto'
      }
      #swagger.responses[200] = {
        description: 'Liste des animes correspondants',
        schema: [
          { id: 1, title: 'Naruto', imageUrl: 'https://example.com/naruto.jpg' }
        ]
      }
      #swagger.responses[400] = {
        description: 'Entrée invalide',
        schema: { error: 'INVALID_INPUT' }
      }
      #swagger.responses[401] = {
        description: 'Token manquant ou invalide',
        schema: { error: 'UNAUTHORIZED' }
      }
      #swagger.responses[500] = {
        description: 'Erreur interne Gateway',
        schema: { error: 'INTERNAL_SERVER_ERROR' }
      }
    */
    handleGetAnimeByName,
);

export default router;
