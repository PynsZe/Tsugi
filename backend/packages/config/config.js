"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.createServiceConfig = exports.apiLengthLimit = exports.apiRateLimit = exports.animeFreshnessDuration = exports.base_url = exports.services = void 0;
const toNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
const baseConfig = {
    host: process.env.HOST || "0.0.0.0",
    nodeEnv: process.env.NODE_ENV || "development",
    jwtSecret: (process.env.JWT_SECRET || "JWT_SECRET"),
    jwtExpiresIn: ((_a = process.env.JWT_EXPIRES_IN) !== null && _a !== void 0 ? _a : "1h")
};
exports.services = {
    auth: `http://localhost:${toNumber(process.env.AUTH_SERVICE_PORT, 3001)}`,
    users: `http://localhost:${toNumber(process.env.AUTH_SERVICE_PORT, 3001)}`,
    catalog: `http://localhost:${toNumber(process.env.CATALOG_SERVICE_PORT, 3002)}`,
    recommendation: `http://localhost:${toNumber(process.env.RECOMMENDATION_SERVICE_PORT, 3003)}`,
    planning: `http://localhost:${toNumber(process.env.PLANNING_SERVICE_PORT, 3004)}`
};
exports.base_url = {
    jikan: process.env.JIKAN_API_URL || "https://api.jikan.moe/v4",
    yurippe: process.env.YURIPPE_API_URL || "https://yurippe.vercel.app/api/quotes"
};
exports.animeFreshnessDuration = toNumber(process.env.ANIME_FRESHNESS_DURATION, 24 * 60 * 60 * 1000);
exports.apiRateLimit = toNumber(process.env.API_RATE_LIMIT, 1050);
exports.apiLengthLimit = toNumber(process.env.API_LENGTH_LIMIT, 5);
const createServiceConfig = (portEnvName, defaultPort) => (Object.assign(Object.assign({}, baseConfig), { port: toNumber(process.env[portEnvName], defaultPort) }));
exports.createServiceConfig = createServiceConfig;
exports.config = Object.assign(Object.assign({}, baseConfig), { port: toNumber(process.env.PORT, 3000), services: exports.services,
    base_url: exports.base_url,
    animeFreshnessDuration: exports.animeFreshnessDuration,
    apiRateLimit: exports.apiRateLimit,
    apiLengthLimit: exports.apiLengthLimit });
exports.default = exports.config;
//# sourceMappingURL=config.js.map