import {Router} from "express"
import {
	handleAddOrUpdateAnimeIntoList, handleAddToFavoriteById,
	handleDeleteFromListById,
	handleUserGetByUsername,
	handleGetFavorites,
	handleGetFavoritesByUsername,
	handleGetList,
	handleGetMe, handleRemoveFromFavoriteById,
	handleVisibilityChanges
} from "../controllers/users.controller"
import {requireAuth} from "../middlewares/auth.middleware";
import {validateParams} from "../middlewares/validation.middleware";
import {IdSchema, UsernameSchema} from "../schema/userModifications.schema";

export const usersRouter = Router()

// own profile actions (use token)
usersRouter.get("/me", requireAuth, handleGetMe); // OK

usersRouter.patch("/me/visibility", requireAuth, handleVisibilityChanges)

// list
usersRouter.get("/me/list", requireAuth, handleGetList); // OK
usersRouter.patch("/me/list", requireAuth, handleAddOrUpdateAnimeIntoList); // OK
usersRouter.delete("/me/list/:id", validateParams(IdSchema), requireAuth, handleDeleteFromListById);

// favorites
usersRouter.get("/me/favorites", requireAuth, handleGetFavorites); // OK
usersRouter.put("/me/favorites/:id", validateParams(IdSchema), requireAuth, handleAddToFavoriteById); // OK
usersRouter.delete("/me/favorites/:id", validateParams(IdSchema), requireAuth, handleRemoveFromFavoriteById); // OK


// get another user
usersRouter.get("/profile/:username", validateParams(UsernameSchema), handleUserGetByUsername);
usersRouter.get("/profile/:username/favorites", validateParams(UsernameSchema), handleGetFavoritesByUsername);

