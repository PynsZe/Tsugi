import mongoose from "mongoose";
import { createApp } from "./app";
import config from "./config/config";
import generalConfig from "../../../packages/config/config";
import jwt from "jsonwebtoken"
import * as auth_service from "../../users_service/src/services/auth.service"

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

async function main() {
  try {
    await mongoose.connect(generalConfig.uri.mongo);
    await auth_service.registerUser({email: "supertest@example.com", username: "supertestuser", password: "password123"});
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
  const token = await auth_service.loginUser({email: "supertest@example.com", password: "password123"});

  // start server
  const app = createApp();
  app.listen(config.port, config.host, () => {
    console.log(
      `[auth_service] listening on http://${config.host}:${config.port}`,
    );
    console.log(token)
  });
}
