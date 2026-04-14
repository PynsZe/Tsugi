import mongoose from "mongoose";
import { createApp } from "./app";
import config from "./config/config";

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

async function main() {
  const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/animemanager";
  await mongoose.connect(mongoUri);

  // start server
  const app = createApp();
  app.listen(config.port, config.host, () => {
    console.log(
      `[auth_service] listening on http://${config.host}:${config.port}`,
    );
  });
}
