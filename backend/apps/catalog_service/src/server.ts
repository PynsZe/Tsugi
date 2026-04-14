import {createApp} from "./app";
import config from "./config/config";
import sharedConfig from "../../../packages/config/config"
import mongoose from "mongoose";


main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});

async function main() {
	await mongoose.connect(sharedConfig.uri.mongo);
	const app = createApp();
	app.listen(config.port, config.host, () => {
		console.log(
			`[catalogue_service] listening on http://${config.host}:${config.port}`,
		);
	});
}
