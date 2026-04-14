/** @type {import("jest").Config} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/src"],
	moduleNameMapper: {
		"^@shared/(.*)$": "<rootDir>/../../packages/shared/$1",
		"^@config/(.*)$": "<rootDir>/../../packages/config/$1",
	},
	testTimeout: 30000,
};

