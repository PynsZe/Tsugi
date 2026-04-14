import express from "express"
import {catalogRouter} from "./routes/catalog.routes"
import {errorHandler} from "./middlewares/error.middleware";
import swaggerUi from "swagger-ui-express";
// @ts-ignore
import swaggerJson from "./docs/swagger.json";

// import { errorMiddleware } from "./middlewares/error.middleware"

export function createApp() {
	const app = express()
	app.use(express.json())

	app.use("/catalog", catalogRouter)
	app.get("/doc-json", (_req, res) => {
		return res.json(swaggerJson)
	})
	app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerJson))
	app.use(errorHandler)
	return app
}
