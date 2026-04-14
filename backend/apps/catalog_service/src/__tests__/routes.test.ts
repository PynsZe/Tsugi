import request from "supertest"
import mongoose from "mongoose"
import {MongoMemoryServer} from "mongodb-memory-server"
import type {Express} from "express"
import {createApp} from "../app"
import {CatalogModel} from "../schema/anime.schema"

jest.setTimeout(30000)

jest.mock("../providers/jikan.providers", () => ({
	JikanProvider: {
		fetchWithQuery: jest.fn(),
		fetchByAnimeId: jest.fn(),
		fetchAnimeStreamingById: jest.fn(),
	},
}))

jest.mock("../providers/yurippe.providers", () => ({
	YurippeProvider: {
		fetchByAnime: jest.fn(),
	},
}))

jest.mock("../utils/fetch.util", () => ({
	needRefresh: jest.fn(),
}))

import {JikanProvider} from "../providers/jikan.providers"
import {YurippeProvider} from "../providers/yurippe.providers"
import {needRefresh} from "../utils/fetch.util"

const mockFetchWithQuery = JikanProvider.fetchWithQuery as jest.Mock
const mockFetchByAnimeId = JikanProvider.fetchByAnimeId as jest.Mock
const mockFetchAnimeStreamingById = JikanProvider.fetchAnimeStreamingById as jest.Mock
const mockFetchByAnime = YurippeProvider.fetchByAnime as jest.Mock
const mockNeedRefresh = needRefresh as jest.Mock

/* ==================== LIFECYCLE ==================== */

let app: Express
let mongod: MongoMemoryServer

beforeAll(async () => {
	mongod = await MongoMemoryServer.create()
	await mongoose.connect(mongod.getUri())
	app = createApp()
})

afterAll(async () => {
	await mongoose.disconnect()
	await mongod.stop()
})

beforeEach(() => {
	mockFetchWithQuery.mockResolvedValue({data: []})
	mockFetchByAnimeId.mockResolvedValue(null)
	mockFetchAnimeStreamingById.mockResolvedValue({data: []})
	mockFetchByAnime.mockResolvedValue(null)
	mockNeedRefresh.mockReturnValue(false)
})

afterEach(async () => {
	await CatalogModel.deleteMany({})
	jest.clearAllMocks()
})

/* ==================== FIXTURES ==================== */

const SAMPLE_ANIME = {
	id: 1,
	sourceIds: {malId: 20},
	title: {main: "Naruto", english: "Naruto", japanese: "ナルト", french: "Naruto"},
	animeInfo: {
		seasonNumber: 1,
		episodeCount: 220,
		mediaType: "anime" as const,
		categories: ["action", "aventure"],
		streaming: [{name: "Crunchyroll", url: "https://www.crunchyroll.com"}],
	},
	imageUrl: "https://example.com/naruto.jpg",
	trailer: "https://youtube.com/watch?v=123",
	rating: 8,
	cacheMeta: {sources: []},
}

const SAMPLE_FILM = {
	id: 2,
	sourceIds: {malId: 32281},
	title: {main: "Your Name", english: "Your Name", japanese: "君の名は", french: "Your Name"},
	animeInfo: {
		seasonNumber: 0,
		episodeCount: 1,
		mediaType: "film" as const,
		categories: ["romance", "drame"],
		streaming: [{name: "Netflix", url: "https://www.netflix.com"}],
	},
	imageUrl: "https://example.com/yourname.jpg",
	rating: 9,
	cacheMeta: {sources: []},
}

async function seedCatalog() {
	await CatalogModel.create([SAMPLE_ANIME, SAMPLE_FILM])
}

function jikanResult(malId: number, title: string) {
	return {mal_id: malId, title, images: {jpg: {image_url: ""}}}
}

/* ==================== TESTS ==================== */

describe("CATALOG — /catalog", () => {


	describe("GET /catalog", () => {
		it("should return catalog list (200)", async () => {
			await seedCatalog()
			mockFetchWithQuery.mockResolvedValue({
				data: [jikanResult(1, "Naruto"), jikanResult(2, "Your Name")],
			})

			const res = await request(app).get("/catalog/")
			expect(res.status).toBe(200)
			expect(res.body).toHaveLength(2)
		})

		it("should return empty when no data (200)", async () => {
			const res = await request(app).get("/catalog/")
			expect(res.status).toBe(200)
			expect(res.body).toEqual([])
		})
	})

	describe("GET /catalog/type/:animeType", () => {
		beforeEach(seedCatalog)

		it("should filter by type 'anime' (200)", async () => {
			mockFetchWithQuery.mockResolvedValue({data: [jikanResult(1, "Naruto")]})

			const res = await request(app).get("/catalog/type/anime")
			expect(res.status).toBe(200)
			expect(res.body).toHaveLength(1)
			expect(res.body[0].title.main).toBe("Naruto")
		})

		it("should filter by type 'film' (200)", async () => {
			mockFetchWithQuery.mockResolvedValue({data: [jikanResult(2, "Your Name")]})

			const res = await request(app).get("/catalog/type/film")
			expect(res.status).toBe(200)
			expect(res.body).toHaveLength(1)
			expect(res.body[0].title.main).toBe("Your Name")
		})

		it("should return empty for unknown type (200)", async () => {
			const res = await request(app).get("/catalog/type/ova")
			expect(res.status).toBe(200)
			expect(res.body).toEqual([])
		})
	})

	describe("GET /catalog/anime/id/:animeId", () => {
		beforeEach(seedCatalog)

		it("should return anime by id (200)", async () => {
			const res = await request(app).get("/catalog/anime/id/1")
			expect(res.status).toBe(200)
			expect(res.body.title.main).toBe("Naruto")
		})

		it("should return 404 for unknown id", async () => {
			const res = await request(app).get("/catalog/anime/id/9999")
			expect(res.status).toBe(404)
			expect(res.body.error).toBe("NOT_FOUND")
		})
	})

	describe("GET /catalog/anime/name/:animeName", () => {
		beforeEach(seedCatalog)

		it("should return anime by name (200)", async () => {
			mockFetchWithQuery.mockResolvedValue({data: [jikanResult(1, "Naruto")]})

			const res = await request(app).get("/catalog/anime/name/Naruto")
			expect(res.status).toBe(200)
			expect(res.body).toHaveLength(1)
			expect(res.body[0].title.main).toBe("Naruto")
		})

		it("should be case-insensitive", async () => {
			mockFetchWithQuery.mockResolvedValue({data: [jikanResult(1, "Naruto")]})

			const res = await request(app).get("/catalog/anime/name/naruto")
			expect(res.status).toBe(200)
			expect(res.body).toHaveLength(1)
			expect(res.body[0].title.main).toBe("Naruto")
		})

		it("should return empty for unknown name (200)", async () => {
			const res = await request(app).get("/catalog/anime/name/Unknown")
			expect(res.status).toBe(200)
			expect(res.body).toEqual([])
		})
	})

	describe("GET /catalog/category/:animeCategory", () => {
		beforeEach(seedCatalog)

		it("should return animes by category (200)", async () => {
			mockFetchWithQuery.mockResolvedValue({data: [jikanResult(1, "Naruto")]})

			const res = await request(app).get("/catalog/category/action")
			expect(res.status).toBe(200)
			expect(res.body).toHaveLength(1)
			expect(res.body[0].title.main).toBe("Naruto")
		})

		it("should return empty for unknown category (200)", async () => {
			const res = await request(app).get("/catalog/category/horreur")
			expect(res.status).toBe(200)
			expect(res.body).toEqual([])
		})
	})
})