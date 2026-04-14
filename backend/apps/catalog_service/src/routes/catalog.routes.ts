import {Router} from "express"
import {getCatalogFiltered} from "../controllers/catalog.controller"
import {
    getAnimeById,
    getAnimeByName
} from "../controllers/catalog.controller"
import {errorHandler} from "../middlewares/error.middleware";
import {validateParams} from "../middlewares/validation.middleware";
import {GetAnimeParamsSchema, SearchQuerySchema} from "../schema/catalog.schema";

// import {requireAuth} from "../middlewares/gw.middleware";

export const catalogRouter = Router()

//catalog
catalogRouter.get("/", getCatalogFiltered)
catalogRouter.get("/top", getCatalogFiltered)

catalogRouter.get("/:kind(type|category)/:q/top", getCatalogFiltered)
catalogRouter.get("/:kind(type|category)/:q", getCatalogFiltered)

catalogRouter.get("/anime/id/:animeId", validateParams(GetAnimeParamsSchema), getAnimeById) // ID : number // OK
catalogRouter.get("/anime/name/:q", validateParams(SearchQuerySchema), getAnimeByName) // name : string // OK
