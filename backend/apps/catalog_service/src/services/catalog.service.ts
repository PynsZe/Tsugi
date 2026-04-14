import {CatalogModel} from "../schema/anime.schema"
import {JikanProvider} from "../providers/jikan.providers";
import {
	buildCatalogAnimeDtoFromPatch,
	mapJikanToCatalogAnime,
	mapYurippeQuotesToDto,
	mergeJikanAndYurippeToDto,
	toCatalogAnimeCacheDocument,
	toCatalogAnimePublicDto
} from "../mappers/catalog.mapper";
import {CatalogAnimeDto} from "../dto/catalog.dto";
import {YurippeProvider} from "../providers/yurippe.providers";
import {needRefresh} from "../utils/fetch.util";
import {NotFoundError} from "../../../../packages/shared/errors/errors";
import {apiRateLimit} from "../../../../packages/config/config";
import Bottleneck from "bottleneck"
import {logger} from "../../../../packages/config/logger";

/** APIs ratelimit to avoid 429 and crash  */
const jikanLimiter = new Bottleneck({
	minTime: apiRateLimit,   // 1 req/s
	maxConcurrent: 1
})

const yurippeLimiter = new Bottleneck({
	maxConcurrent: 3,
	minTime: 150 // marge de sécurité au cas ou vercel soit pas content
})


/**
 * Returns the CatalogAnimeDto for the requested ID.
 *
 * @param animeId - Desired anime ID
 *
 * @returns CatalogAnimeDto filled with jikan data and if found yurippe quote
 */
export async function recoverOrFetchAnimeById(
	animeId: number
): Promise<CatalogAnimeDto | undefined> {
	logger.debug("started searching into DB");

	const existingAnime = await CatalogModel.findOne({id: animeId});

	if (existingAnime && !needRefresh(existingAnime)) {
		logger.debug("found fresh anime in DB");
		return toCatalogAnimePublicDto(existingAnime);
	}

	logger.debug("started searching into Jikan");

	const jikanData = await JikanProvider.fetchByAnimeId(animeId);
	if (!jikanData) {
		throw new NotFoundError("anime not found in Jikan API")
	}

	const jikanPatch = mapJikanToCatalogAnime(jikanData.data);
	if (!jikanPatch.title?.main) {
		throw new NotFoundError("anime fetched from jikan invalid")
	}

	const yurippeData = await YurippeProvider.fetchByAnime(jikanPatch.title.main);
	logger.debug("fetch yurippe OK");

	let animeDto: CatalogAnimeDto;

	if (!yurippeData) {
		animeDto = buildCatalogAnimeDtoFromPatch(jikanPatch);
	} else {
		logger.debug("fetch anime OK");
		const yurippeDto = mapYurippeQuotesToDto(yurippeData);
		logger.debug("DTOs patches OK");

		animeDto = mergeJikanAndYurippeToDto(
			buildCatalogAnimeDtoFromPatch(jikanPatch),
			yurippeDto
		);
	}

	logger.debug("DTO OK");

	const animeCache = toCatalogAnimeCacheDocument(animeDto);
	logger.debug("Anime cache OK");

	if (existingAnime) {
		const updatedAnime = await CatalogModel.findOneAndUpdate(
			{id: animeId},
			animeCache,
			{returnDocument: 'after'}
		);
		logger.debug("update anime OK");
		if (!updatedAnime) {
			throw new NotFoundError("error during the anime creation in database")
		}
		return toCatalogAnimePublicDto(updatedAnime);
	}

	const createdAnime = await CatalogModel.create(animeCache);
	logger.debug("create anime OK");

	return (createdAnime);
}

/**
 * Returns a list of 25 CatalogAnimeDto bases on the query.
 *
 * @remarks
 * base for getAnimeListByName, getAnimeListByType, getAnimeListByCategory
 *
 * @param queryType - "q" for research by name | "type" for type | "category" for category
 * @param queryValue - query value passed by the user input through "q" param
 * @param needTop - if true, do not use other params. Fetch top anime from jikan
 * @param page - ask a specified page of the request
 *
 * @returns CatalogAnimeDto filled with jikan data and if found yurippe quote
 */
async function recoverOrFetchAnimeWithQuery(queryType: string, queryValue: string, needTop: boolean = false, page: number = 1): Promise<CatalogAnimeDto[]> {
	const jikanData = await JikanProvider.fetchWithQuery(queryType, queryValue, needTop, page)
	if (!jikanData?.data?.length) {
		return []
	}

	const requestedCatalog: CatalogAnimeDto[] = []

	for (const anime of jikanData.data) {
		try {
			const existingAnime = await CatalogModel.findOne({id: anime.mal_id})
			if (existingAnime && !needRefresh(existingAnime)) {
				requestedCatalog.push(toCatalogAnimePublicDto(existingAnime));
				logger.debug("recover anime OK");
				continue;
			}

			const jikanPatch = mapJikanToCatalogAnime(anime)

			const mainTitle = jikanPatch.title?.main
			if (!mainTitle) {
				continue
			}

			const [jikanStreaming, yurippeData] = await Promise.all([
				jikanLimiter
					.schedule(() => JikanProvider.fetchAnimeStreamingById(jikanPatch.id))
					.catch(() => null),

				yurippeLimiter
					.schedule(() => YurippeProvider.fetchByAnime(mainTitle))
					.catch(() => null),
			])

			if (jikanPatch.animeInfo && jikanStreaming?.data) {
				jikanPatch.animeInfo.streaming = jikanStreaming.data
			}

			const baseDto = buildCatalogAnimeDtoFromPatch(jikanPatch)

			const animeDto = yurippeData
				? mergeJikanAndYurippeToDto(baseDto, mapYurippeQuotesToDto(yurippeData))
				: baseDto
			const animeCache = toCatalogAnimeCacheDocument(animeDto)

			const savedAnime = await CatalogModel.findOneAndUpdate(
				{id: anime.mal_id},
				{$set: animeCache},
				{
					returnDocument: 'after',
					upsert: true,
					runValidators: true,
					setDefaultsOnInsert: true,
				}
			)
			requestedCatalog.push(toCatalogAnimePublicDto(savedAnime))
		} catch (error) {
			console.warn({animeId: anime.mal_id, error}, "Anime processing failed")
		}
	}

	return requestedCatalog
}

/**
 * Returns a list of 25 CatalogAnimeDtofor a given name.
 *
 * @param name - name of the anime searched
 *
 * @returns CatalogAnimeDto filled with jikan data and if found yurippe quote
 */
export async function getAnimeListByName(name: string) {
	return await recoverOrFetchAnimeWithQuery("q", name)
}


export async function recoverOrFetchAnimeCatalog(queryType: string = "", queryValue: string = "", top: boolean = false, page: number = 1) {
	return await recoverOrFetchAnimeWithQuery(queryType, queryValue, top, page)
}
