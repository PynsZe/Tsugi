import type {NextFunction, Request, Response} from "express"
import * as handlers from "../services/users.service";
import {AnimeEntrySchema, IdSchema, UsernameSchema, visibilitySchema} from "../schema/userModifications.schema";


/** -------------------------- Me ------------------------------ */

export const handleGetMe = async (req: Request, res: Response, next: NextFunction) => {
	/*
#swagger.tags = ['User - Me']
	#swagger.summary = 'Get current user'

	#swagger.parameters['Authorization'] = {
		in: 'header',
		required: true,
		type: 'string',
		description: 'Bearer token'
	}

	#swagger.responses[200] = {
		description: 'User info',
		schema: {
			sub: 'user-id',
			email: 'test@mail.com',
			username: 'john'
		}
	}

	#swagger.responses[401] = {
		description: 'Unauthorized'
	}
*/
	try {
		if (!req.user) {
			return res.status(401).json({error: "UNAUTHORIZED"})
		}
		const user = await handlers.getMe(req.user.sub)
		res.status(200).json(user)
	} catch (error) {
		next(error)
	}
}

export const handleVisibilityChanges = async (req: Request, res: Response, next: NextFunction) => {
	/*
	#swagger.tags = ['User']
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
	  description: 'Utilisateur mis à jour',
	  schema: {
		username: 'john',
		profileVisibility: 'public'
	  }
	}

	#swagger.responses[400] = {
	  description: 'Entrée invalide',
	  schema: { error: 'INVALID_INPUT' }
	}

	#swagger.responses[401] = {
	  description: 'Unauthorized'
	}
	*/
	try {
		const parsed = visibilitySchema.safeParse(req.body)
		if (!parsed.success) {
			return res.status(400).json({error: "INVALID_INPUT"})
		}

		if (!req.user) {
			return res.status(401).json({error: "UNAUTHORIZED"})
		}
		const user = await handlers.setVisibilityChanges(parsed.data.visibility, req.user.sub)
		res.status(200).json(user)
	} catch (error) {
		next(error)
	}
}

/** ------------- List ------------- */

export const handleGetList = async (req: Request, res: Response, next: NextFunction) => {
	/*
#swagger.tags = ['User - List']
#swagger.description = 'Récupérer la liste des animes d'un utilisateur '

#swagger.parameters['sub'] = {
  in: 'path',
  description: 'Nom d’utilisateur',
  required: true,
  type: 'string',
  example: 'TestUsername'
}

#swagger.responses[200] = {
  description: 'Utilisateur trouvé',
  schema: {
	username: 'TestUsername',
	email:'test@gmail.com',
	profileVisibility:'public',

	imageUrl: 'https://example.com/avatar.png',
	animeList: [
	  {
		title: 'Naruto',
		status: 'watching'
	  }
	]
  }
}

#swagger.responses[400] = {
  description: 'Entrée invalide',
  schema: { error: 'INVALID_INPUT' }
}

#swagger.responses[404] = {
  description: 'Utilisateur non trouvé ou non visible',
  schema: { error: 'NO_USER_EXIST' }
}

#swagger.responses[500] = {
  description: 'Erreur interne',
  schema: { error: 'INTERNAL_ERROR' }
}
*/
	try {
		if (!req.user) {
			return res.status(401).json({error: "UNAUTHORIZED"})
		}
		const user = await handlers.getList(req.user.sub)
		res.status(200).json(user)
	} catch (error) {
		next(error)
	}
}

export const handleAddOrUpdateAnimeIntoList = async (req: Request, res: Response, next: NextFunction) => {
	/*
	#swagger.tags = ['User - List']
	#swagger.description = 'Ajoute ou modifie un anime dans la liste'

	#swagger.parameters['Authorization'] = {
	  in: 'header',
	  required: true,
	  type: 'string'
	}

	#swagger.parameters['body'] = {
	  in: 'body',
	  required: true,
	  schema: {
		animeId: 1,
		status: 'watching'
	  }
	}

	#swagger.responses[200] = {
	  description: 'Liste mise à jour'
	}

	#swagger.responses[400] = {
	  description: 'Entrée invalide',
	  schema: { error: 'INVALID_INPUT' }
	}

	#swagger.responses[401] = {
	  description: 'Unauthorized'
	}

	#swagger.responses[500] = {
	  description: 'Erreur interne'
	}
	*/
	const parsed = AnimeEntrySchema.safeParse(req.body)
	if (!parsed.success) {
		return res.status(400).json({error: "INVALID_INPUT"})
	}

	if (!req.user) {
		return res.status(401).json({error: "UNAUTHORIZED"})
	}

	const anime = parsed.data

	try {
		await handlers.addOrUpdateAnimeIntoList(anime, req.user.sub)
		res.status(200).json({ok: true})
	} catch (error) {
		next(error)
	}
}

export const handleDeleteFromListById = async (req: Request, res: Response, next: NextFunction) => {
	/*
#swagger.tags = ['User - List']
#swagger.description = 'Supprime un anime de la liste'

#swagger.parameters['Authorization'] = {
  in: 'header',
  required: true,
  type: 'string'
}

#swagger.parameters['body'] = {
  in: 'body',
  required: true,
  schema: {
	animeId: 1
  }
}

#swagger.responses[200] = {
  description: 'Anime supprimé'
}

#swagger.responses[400] = {
  description: 'Entrée invalide',
  schema: { error: 'INVALID_INPUT' }
}

#swagger.responses[401] = {
  description: 'Unauthorized'
}

#swagger.responses[500] = {
  description: 'Erreur interne'
}
*/
	try {
		const parsedEntry = IdSchema.safeParse(req.params)
		console.log(req.params)
		if (!parsedEntry.success) {
			return res.status(400).json({error: "INVALID_INPUT"})
		}

		if (!req.user) {
			return res.status(401).json({error: "UNAUTHORIZED"})
		}

		await handlers.deleteFromListById(parsedEntry.data.id, req.user.sub)

		res.status(200).json({ok: true});
	} catch (error) {
		next(error)
	}
}

/** ------------- Favorite ------------- */

export const handleGetFavorites = async (req: Request, res: Response, next: NextFunction) => {
	/*
#swagger.tags = ['User - Favorite']
#swagger.description = 'Récupérer les favoris de l’utilisateur connecté'

#swagger.parameters['Authorization'] = {
  in: 'header',
  required: true,
  type: 'string'
}

#swagger.responses[200] = {
  description: 'Liste des favoris',
  schema: {
	animeList: [
	  {
		title: 'Naruto'
	  }
	]
  }
}

#swagger.responses[401] = {
  description: 'Unauthorized'
}

#swagger.responses[500] = {
  description: 'Erreur interne'
}
*/
	try {
		if (!req.user) {
			return res.status(401).json({error: "UNAUTHORIZED"})
		}
		const user = await handlers.getFavorite(req.user.sub)
		res.status(200).json(user)
	} catch (error) {
		next(error)
	}
}

export const handleAddToFavoriteById = async (req: Request, res: Response, next: NextFunction) => {
	/*
		#swagger.tags = ['User - Favorite']
		#swagger.description = 'Ajoute un anime des favoris de l’utilisateur connecté. Si l'anime est présent, isFavorite est passé a true, sinon ajoute l'anime à la list avec des valeurs par défaut.'

		#swagger.security = [{
		  "bearerAuth": []
		}]

		#swagger.parameters['body'] = {
		  in: 'body',
		  description: 'Anime à modifier dans les favoris',
		  required: true,
		  schema: {
			animeId: '4224'
		  }
		}

		#swagger.responses[200] = {
		  description: 'Statut favori modifié avec succès'
		}

		#swagger.responses[400] = {
		  description: 'Entrée invalide',
		  schema: { error: 'INVALID_INPUT' }
		}

		#swagger.responses[401] = {
		  description: 'Non autorisé',
		  schema: { error: 'UNAUTHORIZED' }
		}

		#swagger.responses[404] = {
		  description: 'Utilisateur ou anime non trouvé',
		  schema: { error: 'NO_USER_EXIST' }
		}

		#swagger.responses[500] = {
		  description: 'Erreur interne',
		  schema: { error: 'INTERNAL_ERROR' }
		}
		*/
	console.log("CONTROLEUR APPELÉ OK")
	const parsed = IdSchema.safeParse(req.params)
	if (!parsed.success) {
		return res.status(400).json({error: "INVALID_INPUT"})
	}

	if (!req.user) {
		return res.status(401).json({error: "UNAUTHORIZED"})
	}

	try {
		await handlers.addToFavoriteById(parsed.data.id, req.user.sub)
		console.log("CONTROLEUR REPOND OK")
		res.status(200).json({ok: true})
	} catch (error) {
		console.log("CONTROLEUR CATCH ERROR")
		next(error)
	}
}

export const handleRemoveFromFavoriteById = async (req: Request, res: Response, next: NextFunction) => {
	/*
		#swagger.tags = ['User - Favorite']
		#swagger.description = 'Retire un anime des favoris de l’utilisateur connecté. Si l'anime est présent, isFavorite est passé a true, sinon ajoute l'anime à la list avec des valeurs par défaut.'

		#swagger.security = [{
		  "bearerAuth": []
		}]

		#swagger.parameters['body'] = {
		  in: 'body',
		  description: 'Anime à modifier dans les favoris',
		  required: true,
		  schema: {
			animeId: '4224'
		  }
		}

		#swagger.responses[200] = {
		  description: 'Statut favori modifié avec succès'
		}

		#swagger.responses[400] = {
		  description: 'Entrée invalide',
		  schema: { error: 'INVALID_INPUT' }
		}

		#swagger.responses[401] = {
		  description: 'Non autorisé',
		  schema: { error: 'UNAUTHORIZED' }
		}

		#swagger.responses[404] = {
		  description: 'Utilisateur ou anime non trouvé',
		  schema: { error: 'NO_USER_EXIST' }
		}

		#swagger.responses[404] = {
		  description: 'Utilisateur ou anime non trouvé',
		  schema: { error: 'ANIME_NOT_FOUND_IN_LIST' }
		}

		#swagger.responses[500] = {
		  description: 'Erreur interne',
		  schema: { error: 'INTERNAL_ERROR' }
		}
		*/
	const parsed = IdSchema.safeParse(req.params)
	if (!parsed.success) {
		return res.status(400).json({error: "INVALID_INPUT"})
	}

	if (!req.user) {
		return res.status(401).json({error: "UNAUTHORIZED"})
	}

	try {
		await handlers.removeFromFavoriteById(parsed.data.id, req.user.sub)
		res.status(200).json({ok: true})
	} catch (error) {
		next(error)
	}
}

/** -------------------------- Other user ------------------------------ */

export const handleUserGetByUsername = async (req: Request, res: Response, next: NextFunction) => {
	/*
#swagger.tags = ['User - Public']
#swagger.description = 'Récupérer les favoris par username'

#swagger.parameters['username'] = {
in: 'path',
required: true,
type: 'string'
}

#swagger.responses[200] = {
description: 'Favoris utilisateur',
schema: {
animeList: [
  {
	title: 'Naruto'
  }
]
}
}

#swagger.responses[400] = {
description: 'Entrée invalide',
schema: { error: 'INVALID_INPUT' }
}

#swagger.responses[404] = {
description: 'Utilisateur non trouvé',
schema: { error: 'NO_USER_EXIST' }
}

#swagger.responses[500] = {
description: 'Erreur interne'
}
*/
	try {
		const parsed = UsernameSchema.safeParse(req.params)
		if (!parsed.success) {
			return res.status(400).json({error: "INVALID_INPUT"})
		}

		const user = await handlers.getUserByUsername(parsed.data.username)
		res.status(200).json(user)
	} catch (error) {
		next(error)
	}
}

export const handleGetFavoritesByUsername = async (req: Request, res: Response, next: NextFunction) => {
	/*
		#swagger.tags = ['User - Public']

	#swagger.description = 'Récupérer la liste des favorits d'un utilisateur par son username'

	#swagger.parameters['username'] = {
	  in: 'path',
	  description: 'Nom d’utilisateur',
	  required: true,
	  type: 'string',
	  example: 'TestUsername'
	}

	#swagger.responses[200] = {
	  description: 'Utilisateur trouvé',
	  schema: {
		animeList: [
		  {
			title: 'Naruto',
			status: 'watching'
		  }
		]
	  }
	}

	#swagger.responses[404] = {
	  description: 'Entrée invalide',
	  schema: { error: 'INVALID_INPUT' }
	}

	#swagger.responses[404] = {
	  description: 'Utilisateur non trouvé ou non visible',
	  schema: { error: 'NO_USER_EXIST' }
	}

	#swagger.responses[500] = {
	  description: 'Erreur interne',
	  schema: { error: 'INTERNAL_ERROR' }
	}
	*/
	try {
		const parsed = UsernameSchema.safeParse(req.params)
		if (!parsed.success) {
			return res.status(400).json({error: "INVALID_INPUT"})
		}

		const user = await handlers.getFavoritesByUsername(parsed.data.username)
		res.status(200).json(user)
	} catch (error) {
		next(error)
	}
}
