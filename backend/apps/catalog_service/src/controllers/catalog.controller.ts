import type {Request, Response, NextFunction} from "express"

import {
    getAnimeListByName,
    recoverOrFetchAnimeById,
    recoverOrFetchAnimeCatalog
} from "../services/catalog.service";
import {GetAnimeParamsSchema, SearchQuerySchema} from "../schema/catalog.schema";

/** -------------------------- By ID ----------------------------- */

export const getAnimeById = async (req: Request, res: Response, next: NextFunction) => {
    /*
    #swagger.tags = ['Catalog']
    #swagger.summary = 'Récupérer un anime par son ID'

    #swagger.parameters['animeId'] = {
      in: 'path',
      description: 'ID de l\'anime',
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

    #swagger.responses[404] = {
      description: 'Anime non trouvé',
      schema: { error: 'Anime not found' }
    }

    #swagger.responses[500] = {
      description: 'Erreur interne'
    }
    */
    try {
        const parsed = GetAnimeParamsSchema.safeParse(req.params);
        if (!parsed.success) {
            return res.status(400).json({error: "INVALID_INPUT"})
        }
        const anime = await recoverOrFetchAnimeById(parsed.data.animeId);
        if (!anime) {
            return res.status(404).json({error: "Anime not found"});
        }
        return res.status(200).json(anime);
    } catch (error) {
        next(error)
    }
}

/** -------------------------- By filter ----------------------------- */


export const getCatalogFiltered = async (req: Request, res: Response, next: NextFunction) => {
    /*
    #swagger.tags = ['Catalog']
    #swagger.summary = 'Récupérer le catalogue filtré'

    #swagger.parameters['kind'] = {
      in: 'path',
      description: 'Type de filtre (ex: genre)',
      required: false,
      type: 'string',
      example: 'genre'
    }

    #swagger.parameters['q'] = {
      in: 'path',
      description: 'Valeur du filtre',
      required: false,
      type: 'string',
      example: 'action'
    }

    #swagger.parameters['page'] = {
      in: 'query',
      description: 'Numéro de page',
      required: false,
      type: 'integer',
      example: 1
    }

    #swagger.responses[200] = {
      description: 'Liste des animes',
      schema: [
        {
          id: 1,
          title: 'Naruto',
          imageUrl: 'https://example.com/naruto.jpg'
        }
      ]
    }

    #swagger.responses[500] = {
      description: 'Erreur interne'
    }
    */
    try {
        const kind = req.params.kind ?? ""
        const q = req.params.q ?? ""
        const isTop = req.path.endsWith("/top")
        const pageNumber = parseInt(req.query.page as string) || 1;

        const requestedCatalog = await recoverOrFetchAnimeCatalog(kind, q, isTop, pageNumber)
        if (!requestedCatalog) {
            return res.status(200).json(requestedCatalog ?? [])
        }
        res.json(requestedCatalog);
    } catch (error) {
        next(error)
    }
}


export const getAnimeByName = async (req: Request, res: Response, next: NextFunction) => {
    /*
    #swagger.tags = ['Catalog']
    #swagger.summary = 'Rechercher des animes par nom'

    #swagger.parameters['q'] = {
      in: 'path',
      description: 'Terme de recherche',
      required: true,
      type: 'string',
      example: 'naruto'
    }

    #swagger.responses[200] = {
      description: 'Liste des animes correspondants',
      schema: [
        {
          id: 1,
          title: 'Naruto',
          imageUrl: 'https://example.com/naruto.jpg'
        }
      ]
    }

    #swagger.responses[400] = {
      description: 'Entrée invalide',
      schema: { error: 'INVALID_INPUT' }
    }

    #swagger.responses[500] = {
      description: 'Erreur interne'
    }
    */
    try {
        const parsed = SearchQuerySchema.safeParse(req.params);
        if (!parsed.success) {
            return res.status(400).json({error: "INVALID_INPUT"})
        }

        const requestedCatalog = await getAnimeListByName(parsed.data.q)
        if (!requestedCatalog) {
            return res.status(200).json(requestedCatalog ?? [])
        }
        res.json(requestedCatalog);
    } catch (error) {
        next(error)
    }
}
