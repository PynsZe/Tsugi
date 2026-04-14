import request from "supertest"
import type {Express} from "express"
import {createApp} from "../app"

describe("USERS GATEWAY — /api/v0/users", () => {
    let app: Express
    const BASE_URL = "/api/v0/users"

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

    describe("GET /me", () => {
        it("should return user (200)", async () => {
            mockFetch(200, {
                sub: "123",
                email: "test@example.com",
                username: "testuser"
            })

            const res = await request(app)
                .get(`${BASE_URL}/me`)
                .set("Authorization", "Bearer fake-token")

            expect(res.status).toBe(200)
            expect(res.body.username).toBe("testuser")
        })
    })

    describe("PATCH /me/visibility", () => {
        it("should update visibility (200)", async () => {
            mockFetch(200, {ok: true})

            const res = await request(app)
                .patch(`${BASE_URL}/me/visibility`)
                .set("Authorization", "Bearer fake-token")
                .send({visibility: "ghost"})

            expect(res.status).toBe(200)
            expect(res.body.ok).toBe(true)
        })
    })

    describe("GET /me/list", () => {
        it("should return user's list (200)", async () => {
            mockFetch(200, {animeList: []})

            const res = await request(app)
                .get(`${BASE_URL}/me/list`)
                .set("Authorization", "Bearer fake-token")

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body.animeList)).toBe(true)
        })
    })

    describe("PATCH /me/list", () => {
        it("should patch list (200)", async () => {
            mockFetch(200, {ok: true})

            const res = await request(app)
                .patch(`${BASE_URL}/me/list`)
                .set("Authorization", "Bearer fake-token")
                .send({
                    animeId: 1,
                    rating: 5,
                    userComment: "good",
                    status: "watching",
                    isFavorite: true,
                })

            expect(res.status).toBe(200)
            expect(res.body.ok).toBe(true)
        })
    })

    describe("DELETE /me/list/:id", () => {
        it("should delete anime from list (200)", async () => {
            mockFetch(200, {ok: true})

            const res = await request(app)
                .delete(`${BASE_URL}/me/list/1`)
                .set("Authorization", "Bearer fake-token")

            expect(res.status).toBe(200)
            expect(res.body.ok).toBe(true)
        })
    })

    describe("GET /me/favorites", () => {
        it("should return favorites (200)", async () => {
            mockFetch(200, [])

            const res = await request(app)
                .get(`${BASE_URL}/me/favorites`)
                .set("Authorization", "Bearer fake-token")

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
        })
    })

    describe("PUT /me/favorites/:id", () => {
        it("should add favorite (200)", async () => {
            mockFetch(200, {ok: true})

            const res = await request(app)
                .put(`${BASE_URL}/me/favorites/1`)
                .set("Authorization", "Bearer fake-token")

            expect(res.status).toBe(200)
            expect(res.body.ok).toBe(true)
        })
    })

    describe("DELETE /me/favorites/:id", () => {
        it("should remove favorite (200)", async () => {
            mockFetch(200, {ok: true})

            const res = await request(app)
                .delete(`${BASE_URL}/me/favorites/1`)
                .set("Authorization", "Bearer fake-token")

            expect(res.status).toBe(200)
            expect(res.body.ok).toBe(true)
        })
    })

    describe("GET /profile/:username", () => {
        it("should return profile by username (200)", async () => {
            mockFetch(200, {username: "testuser"})

            const res = await request(app)
                .get(`${BASE_URL}/profile/testuser`)

            expect(res.status).toBe(200)
            expect(res.body.username).toBe("testuser")
        })
    })

    describe("GET /profile/:username/favorites", () => {
        it("should return favorites by username (200)", async () => {
            mockFetch(200, [])

            const res = await request(app)
                .get(`${BASE_URL}/profile/testuser/favorites`)

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
        })
    })
})