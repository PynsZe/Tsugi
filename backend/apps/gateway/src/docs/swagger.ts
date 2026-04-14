import swaggerJSDoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "node:path";
import config from "../../../../packages/config/config";

export const setupSwagger = (app: Express): void => {
	const options: swaggerJSDoc.Options = {
		definition: {
			openapi: "3.0.0",
			info: {
				title: "Gateway API",
				version: "1.0.0",
				description: "Documentation du service gateway",
			},
			servers: [
				{ url: `http://localhost:5000${config.base_url.api}` }
			],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
					},
				},
			},
		},
		apis: [
			path.join(__dirname, "../routes/*.ts"),
			path.join(__dirname, "../routes/*.js"),
		],
	};

	const swaggerSpec = swaggerJSDoc(options);
	app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
