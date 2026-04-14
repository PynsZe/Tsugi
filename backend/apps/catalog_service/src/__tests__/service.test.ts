import * as catalogService from "../services/catalog.service"
import * as catalogModel from "../schema/anime.schema"
import * as fetchUtils from "../utils/fetch.util"
import {JikanProvider} from "../providers/jikan.providers"
import {YurippeProvider} from "../providers/yurippe.providers"
import {NotFoundError} from "@shared/errors/errors"

// setup
beforeEach(() => {
	jest.clearAllMocks()
})

afterEach(() => {
	jest.restoreAllMocks()
})

/* ---------------- MOCKS ---------------- */

jest.mock("../schema/anime.schema", () => ({
	CatalogModel: {
		findOne: jest.fn(),
		create: jest.fn(),
		findOneAndUpdate: jest.fn(),
	},
}))

jest.mock("../providers/jikan.providers", () => ({
	JikanProvider: {
		fetchByAnimeId: jest.fn(),
		fetchWithQuery: jest.fn(),
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

// Mock the mapper to avoid TypeErrors
jest.mock("../mappers/catalog.mapper", () => ({
	toCatalogAnimePublicDto: jest.fn((anime) => ({
		id: anime.id,
		title: anime.title,
		cacheMeta: anime.cacheMeta || {sources: []},
		animeInfo: anime.animeInfo || {},
	})),
	mapJikanToCatalogAnime: jest.fn((data) => ({
		id: data.mal_id,
		title: {main: data.title},
		animeInfo: {},
		cacheMeta: {sources: []},
	})),
	mapYurippeQuotesToDto: jest.fn((quotes) => ({
		quotes: quotes?.map((q: any) => ({text: q.quote, character: q.character})) || [],
	})),
	mergeJikanAndYurippeToDto: jest.fn((a, b) => ({...a, ...b})),
	buildCatalogAnimeDtoFromPatch: jest.fn((patch) => patch),
	toCatalogAnimeCacheDocument: jest.fn((dto) => dto),
}))

const MockedModel = catalogModel.CatalogModel as jest.Mocked<typeof catalogModel.CatalogModel>
const MockedJikan = JikanProvider as jest.Mocked<typeof JikanProvider>
const MockedYurippe = YurippeProvider as jest.Mocked<typeof YurippeProvider>
const MockedNeedRefresh = fetchUtils.needRefresh as jest.Mock

/* ================================================= */
/*  recoverOrFetchAnimeById                           */
/* ================================================= */

describe("recoverOrFetchAnimeById", () => {
	it("should return cached anime if fresh", async () => {
		const mockAnime = {
			id: 1,
			title: {main: "Cached Anime"},
			cacheMeta: {sources: []},
		}

		MockedModel.findOne.mockResolvedValue(mockAnime as any)
		MockedNeedRefresh.mockReturnValue(false)

		const result = await catalogService.recoverOrFetchAnimeById(1)

		expect(result?.title.main).toBe("Cached Anime")
		expect(MockedJikan.fetchByAnimeId).not.toHaveBeenCalled()
	})

	it("should fetch and create if not in DB", async () => {
		MockedModel.findOne.mockResolvedValue(null)

		MockedJikan.fetchByAnimeId.mockResolvedValue({
			data: {
				mal_id: 2,
				title: "New Anime",
				images: {jpg: {image_url: ""}},
			},
		} as any)

		MockedYurippe.fetchByAnime.mockResolvedValue([{quote: "Hello", character: "Hero"}] as any)

		MockedModel.create.mockResolvedValue({id: 2, cacheMeta: {sources: []}} as any)

		const result = await catalogService.recoverOrFetchAnimeById(2)

		expect(MockedJikan.fetchByAnimeId).toHaveBeenCalledWith(2)
		expect(MockedModel.create).toHaveBeenCalled()
		expect(result?.id).toBe(2)
	})

	it("should throw NotFoundError if Jikan returns null", async () => {
		MockedModel.findOne.mockResolvedValue(null)
		MockedJikan.fetchByAnimeId.mockResolvedValue(null)

		await expect(catalogService.recoverOrFetchAnimeById(999)).rejects.toThrow(NotFoundError)
	})

	it("should update existing anime if refresh needed", async () => {
		const existing = {id: 3, title: {main: "Old"}, cacheMeta: {sources: []}}

		MockedModel.findOne.mockResolvedValue(existing as any)
		MockedNeedRefresh.mockReturnValue(true)

		MockedJikan.fetchByAnimeId.mockResolvedValue({
			data: {mal_id: 3, title: "Updated", images: {jpg: {image_url: ""}}},
		} as any)

		MockedModel.findOneAndUpdate.mockResolvedValue({
			id: 3,
			title: {main: "Updated"},
			cacheMeta: {sources: []},
		} as any)

		const result = await catalogService.recoverOrFetchAnimeById(3)

		expect(MockedModel.findOneAndUpdate).toHaveBeenCalled()
		expect(result?.title.main).toBe("Updated")
	})
})

/* ================================================= */
/*  recoverOrFetchAnimeCatalog                        */
/* ================================================= */

describe("recoverOrFetchAnimeCatalog", () => {
	it("should return empty array if no data", async () => {
		MockedJikan.fetchWithQuery.mockResolvedValue(null)

		const result = await catalogService.recoverOrFetchAnimeCatalog("q", "test")

		expect(result).toEqual([])
	})

	it("should return mixed cached + fetched data", async () => {
		MockedJikan.fetchWithQuery.mockResolvedValue({
			data: [
				{mal_id: 1, title: "Cached", images: {jpg: {image_url: ""}}},
				{mal_id: 2, title: "New", images: {jpg: {image_url: ""}}},
			],
		} as any)

		MockedModel.findOne
			.mockResolvedValueOnce({id: 1, title: {main: "Cached"}, cacheMeta: {sources: []}} as any)
			.mockResolvedValueOnce(null)

		MockedJikan.fetchAnimeStreamingById.mockResolvedValue({data: []} as any)
		MockedYurippe.fetchByAnime.mockResolvedValue(null)

		MockedModel.findOneAndUpdate.mockResolvedValue({
			id: 2,
			title: {main: "New"},
			cacheMeta: {sources: []},
		} as any)

		const result = await catalogService.recoverOrFetchAnimeCatalog("q", "test")

		expect(result.length).toBe(2)
	})
})

/* ================================================= */
/*  getAnimeListByName                                */
/* ================================================= */

describe("getAnimeListByName", () => {
	it("should return anime list by name", async () => {
		MockedJikan.fetchWithQuery.mockResolvedValue({
			data: [
				{mal_id: 1, title: "Naruto", images: {jpg: {image_url: ""}}},
			],
		} as any)

		MockedModel.findOne.mockResolvedValue({
			id: 1,
			title: {main: "Naruto"},
			cacheMeta: {sources: []},
		} as any)

		const result = await catalogService.getAnimeListByName("Naruto")

		expect(MockedJikan.fetchWithQuery).toHaveBeenCalledWith("q", "Naruto", false, 1)
		expect(result.length).toBe(1)
	})

	it("should return empty array when no results", async () => {
		MockedJikan.fetchWithQuery.mockResolvedValue(null)

		const result = await catalogService.getAnimeListByName("unknown-anime-xyz")

		expect(result).toEqual([])
	})
})