import express from "express";
import {authRouter} from "./routes/auth.routes";
import {usersRouter} from "./routes/users.routes";
import swaggerUi from "swagger-ui-express";
// @ts-ignore
import swaggerJson from "./docs/swagger.json";
import {errorHandler} from "./middlewares/error.middleware";

export function createApp() {
	const app = express()
	app.use(express.json())

	app.use("/auth", authRouter)
	app.use("/users", usersRouter)

	app.use(errorHandler)

	app.get("/doc-json", (_req, res) => {
		return res.json(swaggerJson);
	});

	app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerJson));

	return app;
}
