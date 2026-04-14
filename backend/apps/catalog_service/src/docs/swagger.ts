import path from "node:path";
import swaggerAutogen from "swagger-autogen";

const outputFile = path.resolve(__dirname, "swagger.json");
const endpointsFiles = [
  path.resolve(__dirname, "../app.ts"),
  path.resolve(__dirname, "../routes/catalog.routes.ts"),
  path.resolve(__dirname, "../controllers/catalog.controller.ts"),
];

const doc = {
  info: {
    title: "Catalog Service API",
    description: "Documentation Swagger du catalog service",
  },
  host: "localhost:3002",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log(`[SWAGGER] generated at ${outputFile}`);
  })
  .catch((error: unknown) => {
    console.error("[SWAGGER] generation failed", error);
    process.exit(1);
  });
