import {Router} from "express";
import {handleLogin, handleRegister, handleMe} from "../controllers/auth.controller";

const router = Router();

router.post(
  "/register",
  /*
	#swagger.tags = ['Auth']
	#swagger.summary = 'Inscrire un utilisateur'
	#swagger.parameters['body'] = {
	  in: 'body',
	  required: true,
	  schema: {
		email: 'test@mail.com',
		name: 'unSuperNom',
		password: 'm0nChienAMangerMonArm0ire'
	  }
	}
	#swagger.responses[201] = {
	  description: 'Utilisateur créé'
	}
	#swagger.responses[400] = {
	  description: 'Corps invalide',
	  schema: { error: 'INVALID_INPUT' }
	}
	#swagger.responses[409] = {
	  description: 'Utilisateur déjà existant',
	  schema: { error: 'CONFLICT' }
	}
	#swagger.responses[500] = {
	  description: 'Erreur interne Gateway',
	  schema: { error: 'INTERNAL_SERVER_ERROR' }
	}
  */
  handleRegister,
);

router.post(
  "/login",
  /*
	#swagger.tags = ['Auth']
	#swagger.summary = 'Connecter un utilisateur'
	#swagger.parameters['body'] = {
	  in: 'body',
	  required: true,
	  schema: {
		email: 'test@mail.com',
		password: '123456'
	  }
	}
	#swagger.responses[200] = {
	  description: 'Utilisateur authentifié'
	}
	#swagger.responses[401] = {
	  description: 'Identifiants invalides',
	  schema: { error: 'UNAUTHORIZED' }
	}
	#swagger.responses[500] = {
	  description: 'Erreur interne Gateway',
	  schema: { error: 'INTERNAL_SERVER_ERROR' }
	}
  */
  handleLogin,
);

router.post(
  "/me",
  /*
	#swagger.tags = ['Auth']
	#swagger.summary = 'Récupérer l\'utilisateur courant'
	#swagger.parameters['Authorization'] = {
	  in: 'header',
	  required: true,
	  type: 'string',
	  description: 'Bearer token'
	}
	#swagger.responses[200] = {
	  description: 'Informations utilisateur',
	  schema: {
		sub: 'user-id',
		email: 'test@mail.com',
		username: 'john'
	  }
	}
	#swagger.responses[401] = {
	  description: 'Non autorisé',
	  schema: { error: 'UNAUTHORIZED' }
	}
	#swagger.responses[500] = {
	  description: 'Erreur interne Gateway',
	  schema: { error: 'INTERNAL_SERVER_ERROR' }
	}
  */
  handleMe,
);

export default router;
