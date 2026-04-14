import path from "node:path";
import {promises as fs} from "node:fs";
import swaggerAutogen from "swagger-autogen";
import config from "@config/config"

const outputFile = path.resolve(__dirname, "swagger.json");
const requiredPrefix = config.base_url.api;
const endpointsFiles = [
	path.resolve(__dirname, "../app.ts"),
	path.resolve(__dirname, "../routes/auth.routes.ts"),
	path.resolve(__dirname, "../routes/users.routes.ts"),
	path.resolve(__dirname, "../routes/catalog.routes.ts"),
];

const doc = {
	info: {
		title: "Gateway API",
		description: "Documentation Swagger du service gateway",
	},
	servers: [
		{url: `http://localhost:3000${requiredPrefix}`}
	],
	consumes: ["application/json"],
	produces: ["application/json"],
};

const ignoredPaths = [
	`${config.base_url.api}/doc/spec/gateway.json`,
	"/doc/spec/gateway.json"
];
const routeRoots = ["/auth", "/users", "/catalog", "/doc"];

swaggerAutogen({openapi: "3.0.0"})(outputFile, endpointsFiles, doc)
	.then(async () => {
		const rawSpec = await fs.readFile(outputFile, "utf8");
		const spec = JSON.parse(rawSpec) as {
			paths?: Record<string, unknown>,
			servers?: Array<{ url: string }>
		};

		if (spec.paths) {
			const normalizedPaths = Object.fromEntries(
				Object.entries(spec.paths).map(([pathKey, value]) => {
					const normalizedKey = pathKey.startsWith("config.base_url.api")
						? pathKey.replace("config.base_url.api", requiredPrefix)
						: pathKey;

					if (normalizedKey.startsWith(requiredPrefix)) {
						return [normalizedKey, value];
					}

					if (routeRoots.some((root) => normalizedKey.startsWith(root))) {
						return [`${requiredPrefix}${normalizedKey}`, value];
					}

					return [normalizedKey, value];
				}),
			);

			for (const ignoredPath of ignoredPaths) {
				delete normalizedPaths[ignoredPath];
			}

			spec.paths = Object.fromEntries(
				Object.entries(normalizedPaths)
					.filter(([pathKey]) => pathKey.startsWith(requiredPrefix))
					.map(([pathKey, value]) => {
						const relativePath = pathKey.slice(requiredPrefix.length) || "/";
						return [relativePath.startsWith("/") ? relativePath : `/${relativePath}`, value];
					}),
			);

			spec.servers = [{url: `http://localhost:3000${requiredPrefix}`}];
		}

		await fs.writeFile(outputFile, `${JSON.stringify(spec, null, 2)}\n`, "utf8");
		console.log(`[SWAGGER] generated at ${outputFile}`);
	})
	.catch((error: unknown) => {
		console.error("[SWAGGER] generation failed", error);
		process.exit(1);
	});
