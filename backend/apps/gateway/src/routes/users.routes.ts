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
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Récupérer le profil de l\'utilisateur connecté'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      required: true,
      type: 'string',
      description: 'Bearer token'
    }
    #swagger.responses[200] = {
      description: 'Profil utilisateur',
      schema: {
        _id: '67e57ac2f5a2a6f0af0b62d0',
        username: 'john',
        email: 'john@mail.com',
        imageUrl: 'https://example.com/avatar.png',
        profileVisibility: 'public',
        animeList: [{ animeId: 4224, status: 'watching', isFavorite: true, userComment: '', rating: 8 }],
        createdAt: '2026-01-01T10:00:00.000Z',
        updatedAt: '2026-01-01T10:00:00.000Z'
      }
    }
    #swagger.responses[401] = {
      description: 'Token manquant ou invalide',
      schema: { error: 'UNAUTHORIZED' }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur introuvable',
      schema: { error: 'NOT_FOUND', message: 'Not found' }
    }
    #swagger.responses[500] = {
      description: 'Erreur interne Gateway',
      schema: { error: 'INTERNAL_SERVER_ERROR' }
    }
    */
  handleGetMe,
);
router.patch(
  "/me/visibility",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Modifier la visibilité du profil'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      required: true,
      type: 'string',
      description: 'Bearer token'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        visibility: 'public'
      }
    }
    #swagger.responses[200] = {
      description: 'Mise à jour effectuée (réponse null)',
      schema: null
    }
    #swagger.responses[400] = {
      description: 'Corps invalide',
      schema: { error: 'INVALID_INPUT' }
    }
    #swagger.responses[401] = {
      description: 'Token manquant ou invalide',
      schema: { error: 'UNAUTHORIZED' }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur introuvable',
      schema: { error: 'NOT_FOUND', message: 'Not found' }
    }
    #swagger.responses[500] = {
      description: 'Erreur interne Gateway',
      schema: { error: 'INTERNAL_SERVER_ERROR' }
    }
    */
  handlePatchVisibility,
);

router.get(
  "/me/list",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Récupérer la liste utilisateur'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      required: true,
      type: 'string',
      description: 'Bearer token'
    }
    #swagger.responses[200] = {
      description: 'Liste récupérée',
      schema: {
        animeList: [{ animeId: 4224, status: 'watching', isFavorite: true, userComment: '', rating: 8 }]
      }
    }
    #swagger.responses[401] = {
      description: 'Token manquant ou invalide',
      schema: { error: 'UNAUTHORIZED' }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur introuvable',
      schema: { error: 'NOT_FOUND', message: 'Not found' }
    }
    #swagger.responses[500] = {
      description: 'Erreur interne Gateway',
      schema: { error: 'INTERNAL_SERVER_ERROR' }
    }
    */
  handleGetList,
);
router.patch(
  "/me/list",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Ajouter ou modifier un anime dans la liste'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      required: true,
      type: 'string',
      description: 'Bearer token'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        animeId: 4224,
        rating: 8,
        userComment: '',
        status: 'watching',
        isFavorite: false
      }
    }
    #swagger.responses[200] = {
      description: 'Liste mise à jour',
      schema: { ok: true }
    }
    #swagger.responses[400] = {
      description: 'Corps invalide',
      schema: { error: 'INVALID_INPUT' }
    }
    #swagger.responses[401] = {
      description: 'Token manquant ou invalide',
      schema: { error: 'UNAUTHORIZED' }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur introuvable',
      schema: { error: 'NOT_FOUND', message: 'NO_USER_EXIST' }
    }
    #swagger.responses[500] = {
      description: 'Erreur interne Gateway',
      schema: { error: 'INTERNAL_SERVER_ERROR' }
    }
    */
  handlePatchList,
);
router.delete(
  "/me/list/:id",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Supprimer un anime de la liste'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      required: true,
      type: 'string',
      description: 'Bearer token'
    }
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'ID de l\'anime à supprimer'
    }
    #swagger.responses[200] = {
      description: 'Anime supprimé',
      schema: { ok: true }
    }
    #swagger.responses[400] = {
      description: 'Paramètre id invalide',
      schema: {
        error: 'INVALID_PARAMS',
        details: [{ path: 'id', message: 'Number must be greater than 0' }]
      }
    }
    #swagger.responses[401] = {
      description: 'Token manquant/invalide ou action non autorisée',
      schema: { error: 'UNAUTHORIZED' }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur introuvable',
      schema: { error: 'NOT_FOUND', message: 'Not found' }
    }
    #swagger.responses[500] = {
      description: 'Erreur interne Gateway',
      schema: { error: 'INTERNAL_SERVER_ERROR' }
    }
    */
  handleDeleteFromList,
);

router.get(
  "/me/favorites",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Récupérer les favoris du profil connecté'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      required: true,
      type: 'string',
      description: 'Bearer token'
    }
    #swagger.responses[200] = {
      description: 'Liste des favoris',
      schema: [
        { animeId: 4224, status: 'watching', isFavorite: true, userComment: '', rating: 8 }
      ]
    }
    #swagger.responses[401] = {
      description: 'Token manquant ou invalide',
      schema: { error: 'UNAUTHORIZED' }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur introuvable',
      schema: { error: 'NOT_FOUND', message: 'Not found' }
    }
    #swagger.responses[500] = {
      description: 'Erreur interne Gateway',
      schema: { error: 'INTERNAL_SERVER_ERROR' }
    }
    */
  handleGetFavorites,
);
router.put(
  "/me/favorites/:id",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Ajouter un anime aux favoris'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      required: true,
      type: 'string',
      description: 'Bearer token'
    }
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'ID de l\'anime à ajouter aux favoris'
    }
    #swagger.responses[200] = {
      description: 'Favori ajouté/mis à jour',
      schema: { ok: true }
    }
    #swagger.responses[400] = {
      description: 'Paramètre id invalide',
      schema: {
        error: 'INVALID_PARAMS',
        details: [{ path: 'id', message: 'Number must be greater than 0' }]
      }
    }
    #swagger.responses[401] = {
      description: 'Token manquant ou invalide',
      schema: { error: 'UNAUTHORIZED' }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur introuvable',
      schema: { error: 'NOT_FOUND', message: 'NO_USER_EXIST' }
    }
    #swagger.responses[500] = {
      description: 'Erreur interne Gateway',
      schema: { error: 'INTERNAL_SERVER_ERROR' }
    }
    */
  handleAddFavorite,
);
router.delete(
  "/me/favorites/:id",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Retirer un anime des favoris'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      required: true,
      type: 'string',
      description: 'Bearer token'
    }
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'ID de l\'anime à retirer des favoris'
    }
    #swagger.responses[200] = {
      description: 'Favori retiré',
      schema: { ok: true }
    }
    #swagger.responses[400] = {
      description: 'Paramètre id invalide',
      schema: {
        error: 'INVALID_PARAMS',
        details: [{ path: 'id', message: 'Number must be greater than 0' }]
      }
    }
    #swagger.responses[401] = {
      description: 'Token manquant ou invalide',
      schema: { error: 'UNAUTHORIZED' }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur introuvable ou anime absent',
      schema: { error: 'NOT_FOUND', message: 'ANIME_NOT_FOUND_IN_LIST' }
    }
    #swagger.responses[500] = {
      description: 'Erreur interne Gateway',
      schema: { error: 'INTERNAL_SERVER_ERROR' }
    }
    */
  handleRemoveFavorite,
);

router.get(
  "/profile/:username",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Récupérer un profil public par username'
    #swagger.parameters['username'] = {
      in: 'path',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Profil utilisateur (si private: animeList absent)',
      schema: {
        username: 'john',
        imageUrl: 'https://example.com/avatar.png',
        animeList: [{ animeId: 4224, status: 'watching', isFavorite: true, userComment: '', rating: 8 }]
      }
    }
    #swagger.responses[400] = {
      description: 'Paramètre username invalide',
      schema: {
        error: 'INVALID_PARAMS',
        details: [{ path: 'username', message: 'Required' }]
      }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur introuvable ou profil ghost',
      schema: { error: 'NOT_FOUND', message: 'NO_USER_EXIST' }
    }
    #swagger.responses[500] = {
      description: 'Erreur interne Gateway',
      schema: { error: 'INTERNAL_SERVER_ERROR' }
    }
    */
  handleGetProfileByUsername,
);
router.get(
  "/profile/:username/favorites",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Récupérer les favoris d\'un profil public'
    #swagger.parameters['username'] = {
      in: 'path',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Favoris (uniquement si profil public)',
      schema: [
        { animeId: 4224, status: 'watching', isFavorite: true, userComment: '', rating: 8 }
      ]
    }
    #swagger.responses[400] = {
      description: 'Paramètre username invalide',
      schema: {
        error: 'INVALID_PARAMS',
        details: [{ path: 'username', message: 'Required' }]
      }
    }
    #swagger.responses[401] = {
      description: 'Profil privé',
      schema: { error: 'UNAUTHORIZED', message: 'Unauthorized' }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur introuvable ou profil ghost',
      schema: { error: 'NOT_FOUND', message: 'NO_USER_EXIST' }
    }
    #swagger.responses[500] = {
      description: 'Erreur interne Gateway',
      schema: { error: 'INTERNAL_SERVER_ERROR' }
    }
    */
  handleGetFavoritesByUsername,
);

export default router;
