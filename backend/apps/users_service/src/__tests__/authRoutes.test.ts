import request from "supertest"
import mongoose from "mongoose"
import {MongoMemoryServer} from "mongodb-memory-server"
import {createApp} from "../app"
import {UserModel} from "../schema/user.schema"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "../config/config"
import type {Express} from "express"

let app: Express
let mongod: MongoMemoryServer

const TEST_USER = {
	email: "auth_test@example.com",
	username: "authtester",
	password: "password123",
}

beforeAll(async () => {
	mongod = await MongoMemoryServer.create()
	await mongoose.connect(mongod.getUri())
	app = createApp()
})

afterAll(async () => {
	await mongoose.disconnect()
	await mongod.stop()
})

afterEach(async () => {
	await UserModel.deleteMany({})
})

/* ================================================================== */
/* AUTH ROUTES (/auth)                                               */
/* ================================================================== */

describe("AUTH — /auth", () => {

	/* ===== POST /register ===== */
	describe("POST /auth/register", () => {
		it("should create a new user (200/201)", async () => {
			const res = await request(app)
				.post("/auth/register")
				.send(TEST_USER)

			expect([200, 201]).toContain(res.status)
			expect(res.body).toEqual({ok: true})
		})

		it("should return INVALID_INPUT (400) if fields are missing", async () => {
			const res = await request(app)
				.post("/auth/register")
				.send({email: "invalid"})

			expect(res.status).toBe(400)
		})

		it("should return error if email already exists", async () => {

			await UserModel.create({
				email: TEST_USER.email,
				username: "different",
				passwordHash: "hash"
			})

			const res = await request(app)
				.post("/auth/register")
				.send(TEST_USER)

			expect(res.status).toBeGreaterThanOrEqual(400)
		})
	})

	/* ===== POST /login ===== */
	describe("POST /auth/login", () => {
		beforeEach(async () => {
			const hash = await bcrypt.hash(TEST_USER.password, 10)
			await UserModel.create({
				email: TEST_USER.email,
				username: TEST_USER.username,
				passwordHash: hash
			})
		})

		it("should login and return a token (201)", async () => {
			const res = await request(app)
				.post("/auth/login")
				.send({
					email: TEST_USER.email,
					password: TEST_USER.password
				})

			expect(res.status).toBe(201)
			expect(res.body.accessToken).toBeDefined()
			expect(res.body.tokenType).toBe("Bearer")
		})

		it("should return error for invalid credentials (401)", async () => {
			const res = await request(app)
				.post("/auth/login")
				.send({
					email: TEST_USER.email,
					password: "wrongpassword"
				})

			expect(res.status).toBe(401)
		})
	})

	/* ===== GET /me ===== */
	describe("GET /auth/me", () => {
		let token: string

		beforeEach(async () => {
			const hash = await bcrypt.hash(TEST_USER.password, 10)
			const user = await UserModel.create({
				email: TEST_USER.email,
				username: TEST_USER.username,
				passwordHash: hash
			})
			token = jwt.sign(
				{sub: user._id, email: user.email, username: user.username},
				config.jwtSecret,
				{expiresIn: '1h'}
			)
		})

		it("should return current user info (200)", async () => {
			const res = await request(app)
				.get("/auth/me")
				.set("Authorization", `Bearer ${token}`)

			expect(res.status).toBe(200)
			expect(res.body.email).toBe(TEST_USER.email)
			expect(res.body.username).toBe(TEST_USER.username)
		})

		it("should return 401 without token", async () => {
			const res = await request(app).get("/auth/me")
			expect(res.status).toBe(401)
		})

		it("should return 401 with malformed token", async () => {
			const res = await request(app)
				.get("/auth/me")
				.set("Authorization", "Bearer invalid-token-string")

			expect(res.status).toBe(401)
		})
	})

	/* ===== GET /test ===== */
	describe("GET /auth/test", () => {
		it("should return test response (200)", async () => {
			const res = await request(app).get("/auth/test")
			expect(res.status).toBe(200)
		})
	})
})