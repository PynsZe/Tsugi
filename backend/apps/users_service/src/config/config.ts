import {createServiceConfig} from "../../../../packages/config/config"
import generalConfig from "../../../../packages/config/config"

const config = createServiceConfig("USERS_SERVICE_PORT", generalConfig.services_config.ports.users)
export default config
