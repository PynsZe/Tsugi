import type { Secret, SignOptions } from "jsonwebtoken";

export interface AppConfig {
  port: number;
  host: string;
  nodeEnv: string;
  jwtSecret: Secret;
  jwtExpiresIn: SignOptions["expiresIn"];
}

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const baseConfig = {
  host: process.env.HOST || "0.0.0.0",
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: (process.env.JWT_SECRET || "JWT_SECRET") as Secret,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN ??
    "1h") as SignOptions["expiresIn"],
};

export const services_config = {
	hosts: {
		users: process.env.USERS_SERVICE_HOST || "localhost",
		catalog: process.env.CATALOG_SERVICE_HOST || "localhost",
		recommendation: process.env.RECOMMENDATION_SERVICE_HOST || "localhost",
		planning: process.env.PLANNING_SERVICE_HOST || "localhost",
	},
	ports:{
		users: toNumber(process.env.USERS_SERVICE_PORT, 5001),
		catalog: toNumber(process.env.CATALOG_SERVICE_PORT, 5002),
		recommendation: toNumber(process.env.RECOMMENDATION_SERVICE_PORT, 5003),
		planning: toNumber(process.env.PLANNING_SERVICE_PORT, 5004),
	}
}

export const services = {
  users: `http://${services_config.hosts.users}:${services_config.ports.users}`,
  catalog: `http://${services_config.hosts.catalog}:${services_config.ports.catalog}`,
  recommendation: `http://${services_config.hosts.recommendation}:${services_config.ports.recommendation}`,
  planning: `http://${services_config.hosts.planning}:${services_config.ports.planning}`,
};

const version = 1;

export const base_url = {
  api: "/api/v" + version,
  jikan: process.env.JIKAN_API_URL || "https://api.jikan.moe/v4",
  yurippe:
    process.env.YURIPPE_API_URL || "https://yurippe.vercel.app/api/quotes",
};

const uri = {
  mongo: process.env.MONGO_URI || "mongodb://localhost:27017/animemanager",
};

export const animeFreshnessDuration = toNumber(
  process.env.ANIME_FRESHNESS_DURATION,
  24 * 60 * 60 * 1000,
);
export const apiRateLimit = toNumber(process.env.API_RATE_LIMIT, 1050);
export const apiLengthLimit = toNumber(process.env.API_LENGTH_LIMIT, 5);

export const createServiceConfig = (
  portEnvName: string,
  defaultPort: number,
): AppConfig => ({
  ...baseConfig,
  port: toNumber(process.env[portEnvName], defaultPort),
});

export const config = {
  ...baseConfig,
  port: toNumber(process.env.PORT, 3000),
  services_config,
  services,
  base_url,
  animeFreshnessDuration,
  apiRateLimit,
  apiLengthLimit,
  version,
  uri,
};

export const needAuth = toNumber(process.env.NEED_AUTHENTICATION, 1) === 1;

export default config;
