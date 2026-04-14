import request from "supertest"
import type {Express} from "express"
import {createApp} from "../app"

describe("AUTH GATEWAY — /api/v0/auth", () => {
    let app: Express
    const BASE_URL = "/api/v0/auth"

    beforeAll(async () => {
        app = createApp()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    function mockFetch(status: number, data: any) {
        global.fetch = jest.fn().mockResolvedValue({
            status,
            json: async () => data
        } as Response)
    }

    describe("POST /register", () => {
        it("should register a new user (201)", async () => {
            mockFetch(201, {message: "USER_CREATED"})

            const res = await request(app)
                .post(`${BASE_URL}/register`)
                .send({
                    email: "test@example.com",
                    username: "testuser",
                    password: "password123",
                })

            expect(res.status).toBe(201)
            expect(res.body).toEqual({message: "USER_CREATED"})
        })
    })

    describe("POST /login", () => {
        it("should login with correct credentials", async () => {
            mockFetch(201, {
                accessToken: "fake-token",
                tokenType: "Bearer",
                sub: "123",
                expiresIn: "1h",
            })

            const res = await request(app)
                .post(`${BASE_URL}/login`)
                .send({
                    email: "test@example.com",
                    password: "password123",
                })

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty("accessToken")
        })
    })

    describe("POST /me", () => {
        it("should return current user", async () => {
            mockFetch(200, {
                sub: "123",
                email: "test@example.com",
                username: "testuser",
            })

            const res = await request(app)
                .post(`${BASE_URL}/me`)
                .set("Authorization", "Bearer fake-token")

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("email", "test@example.com")
        })
    })
})