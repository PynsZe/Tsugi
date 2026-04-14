import express from "express";
import {errorHandler} from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import catalogRoutes from "./routes/catalog.routes";
import swaggerUi from "swagger-ui-express";
import swaggerJson from "./docs/swagger.json";
import config from "../../../packages/config/config";

export function createApp() {
	const app = express();
	app.use(express.json());

	app.use(config.base_url.api + "/auth", authRoutes);
	app.use(config.base_url.api + "/users", errorHandler, usersRoutes);
	app.use(config.base_url.api + "/catalog", catalogRoutes);

	app.get(
		config.base_url.api + "/doc/spec/gateway.json",
		/* #swagger.ignore = true */
		(_req, res) => {
			return res.json(swaggerJson);
		},
	);

	app.use(
		config.base_url.api + "/doc",
		swaggerUi.serve,
		swaggerUi.setup(swaggerJson, {
			explorer: false,
		}),
	);

	app.get(
		"/doc/spec/gateway.json",
		/* #swagger.ignore = true */
		(_req, res) => {
			return res.redirect(config.base_url.api + "/doc/spec/gateway.json");
		},
	);

	app.use("/doc", (_req, res) => {
		return res.redirect(config.base_url.api + "/doc");
	});

	app.use(errorHandler);
	return app;
}
