import request from "supertest"
import type {Express} from "express"
import {createApp} from "../app"

jest.mock("../middlewares/auth.middleware", () => ({
    requireAuth: (_req: any, _res: any, next: any) => next()
}))
    
describe("CATALOG GATEWAY — /catalog", () => {
    let app: Express

    beforeAll(async () => {
        app = createApp()
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    /* ------------------------------------------------------------------ */
    /*  HELPERS                                                           */
    /* ------------------------------------------------------------------ */

    function mockFetch(status: number, data: any) {
        global.fetch = jest.fn().mockResolvedValue({
            status,
            json: async () => data
        } as Response)
    }

    /* ---------- GET /catalog ---------- */
    describe("GET /catalog", () => {
        it("should return catalog list (200)", async () => {
            mockFetch(200, [
                { title: { main: "Naruto" } },
                { title: { main: "Your Name" } }
            ])

            const res = await request(app).get("/api/v0/catalog")

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBe(2)
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/catalog"),
                { method: "GET" }
            )
        })

        it("should return empty when no data (200)", async () => {
            mockFetch(200, [])

            const res = await request(app).get("/api/v0/catalog")

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBe(0)
        })
    })

    /* ---------- GET /catalog/top ---------- */
    describe("GET /catalog/top", () => {
        it("should return top catalog list (200)", async () => {
            mockFetch(200, [
                { title: { main: "Your Name" }, rating: 9 },
                { title: { main: "Naruto" }, rating: 8 }
            ])

            const res = await request(app).get("/api/v0/catalog/top")

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBe(2)
            expect(res.body[0].title.main).toBe("Your Name")
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/catalog/top"),
                { method: "GET" }
            )
        })
    })

    /* ---------- GET /catalog/type/:q ---------- */
    describe("GET /catalog/type/:q", () => {
        it("should return animes filtered by type 'anime' (200)", async () => {
            mockFetch(200, [
                { title: { main: "Naruto" }, animeInfo: { mediaType: "anime" } }
            ])

            const res = await request(app).get("/api/v0/catalog/type/anime")

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBe(1)
            expect(res.body[0].title.main).toBe("Naruto")
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/catalog/type/anime"),
                { method: "GET" }
            )
        })

        it("should return empty array for unknown type (200)", async () => {
            mockFetch(200, [])

            const res = await request(app).get("/api/v0/catalog/type/ova")

            expect(res.status).toBe(200)
            expect(res.body).toEqual([])
        })
    })

    /* ---------- GET /catalog/type/:q/top ---------- */
    describe("GET /catalog/type/:q/top", () => {
        it("should return top filtered animes by type (200)", async () => {
            mockFetch(200, [
                { title: { main: "Naruto" }, rating: 8 }
            ])

            const res = await request(app).get("/api/v0/catalog/type/anime/top")

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBe(1)
            expect(res.body[0].title.main).toBe("Naruto")
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/catalog/type/anime/top"),
                { method: "GET" }
            )
        })
    })

    /* ---------- GET /catalog/category/:q ---------- */
    describe("GET /catalog/category/:q", () => {
        it("should return animes by category (200)", async () => {
            mockFetch(200, [
                { title: { main: "Naruto" }, animeInfo: { categories: ["action"] } }
            ])

            const res = await request(app).get("/api/v0/catalog/category/action")

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBe(1)
            expect(res.body[0].title.main).toBe("Naruto")
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/catalog/category/action"),
                { method: "GET" }
            )
        })

        it("should return empty array for unknown category (200)", async () => {
            mockFetch(200, [])

            const res = await request(app).get("/api/v0/catalog/category/horreur")

            expect(res.status).toBe(200)
            expect(res.body).toEqual([])
        })
    })

    /* ---------- GET /catalog/anime/id/:animeId ---------- */
    describe("GET /catalog/anime/id/:animeId", () => {
        it("should return anime by id (200)", async () => {
            mockFetch(200, { id: 1, title: { main: "Naruto" } })

            const res = await request(app).get("/api/v0/catalog/anime/id/1")

            expect(res.status).toBe(200)
            expect(res.body.title.main).toBe("Naruto")
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/catalog/anime/id/1"),
                { method: "GET" }
            )
        })

        it("should return 404 for unknown id", async () => {
            mockFetch(404, { error: "Anime not found" })

            const res = await request(app).get("/api/v0/catalog/anime/id/9999")

            expect(res.status).toBe(404)
            expect(res.body).toEqual({ error: "Anime not found" })
        })
    })

    /* ---------- GET /catalog/anime/name/:q ---------- */
    describe("GET /catalog/anime/name/:q", () => {
        it("should return anime by name (200)", async () => {
            mockFetch(200, [
                { title: { main: "Naruto" } }
            ])

            const res = await request(app).get("/api/v0/catalog/anime/name/Naruto")

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBe(1)
            expect(res.body[0].title.main).toBe("Naruto")
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/catalog/anime/name/Naruto"),
                { method: "GET" }
            )
        })

        it("should return empty array for unknown name (200)", async () => {
            mockFetch(200, [])

            const res = await request(app).get("/api/v0/catalog/anime/name/Unknown")

            expect(res.status).toBe(200)
            expect(res.body).toEqual([])
        })
    })
})