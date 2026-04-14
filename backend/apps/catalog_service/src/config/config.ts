import {createServiceConfig} from "../../../../packages/config/config"
import generalConfig from "../../../../packages/config/config"

const config = createServiceConfig("CATALOG_SERVICE_PORT", generalConfig.services_config.ports.catalog)
export default config