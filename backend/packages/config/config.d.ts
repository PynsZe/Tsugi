import type { Secret, SignOptions } from "jsonwebtoken";
export interface AppConfig {
    port: number;
    host: string;
    nodeEnv: string;
    jwtSecret: Secret;
    jwtExpiresIn: SignOptions["expiresIn"];
}
export declare const services: {
    auth: string;
    users: string;
    catalog: string;
    recommendation: string;
    planning: string;
};
export declare const base_url: {
    jikan: string;
    yurippe: string;
};
export declare const animeFreshnessDuration: number;
export declare const apiRateLimit: number;
export declare const apiLengthLimit: number;
export declare const createServiceConfig: (portEnvName: string, defaultPort: number) => AppConfig;
export declare const config: {
    port: number;
    services: {
        auth: string;
        users: string;
        catalog: string;
        recommendation: string;
        planning: string;
    };
    base_url: {
        jikan: string;
        yurippe: string;
    };
    animeFreshnessDuration: number;
    apiRateLimit: number;
    apiLengthLimit: number;
    host: string;
    nodeEnv: string;
    jwtSecret: Secret;
    jwtExpiresIn: SignOptions["expiresIn"];
};
export default config;
//# sourceMappingURL=config.d.ts.map