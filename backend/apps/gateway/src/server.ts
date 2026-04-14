import {createApp} from "./app";
import config from "./config/config";
import {needAuth} from "../../../packages/config/config";


main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});

async function main() {
	// start server
	const app = createApp();
	app.listen(config.port, config.host, () => {
		console.log(
			`[GATEWAY] listening on http://${config.host}:${config.port}, needAuth=${needAuth}`,
		);
	});
}
