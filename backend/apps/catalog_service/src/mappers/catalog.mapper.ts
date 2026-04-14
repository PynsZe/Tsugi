import type { CatalogAnimeCacheDocument, CatalogAnimeDto } from "../dto/catalog.dto";
import { JikanCatalogAnimePatch, QuoteDto } from "../dto/catalog.dto";
import type { JikanAnimeRaw, YurippeQuoteRaw } from "../schema/rawFetch.schema";

/** ------------------------------ YURIPPE ------------------------------ */

export function mapYurippeQuoteToDto(raw: YurippeQuoteRaw): QuoteDto {
	return {
		id: raw._id,
		character: raw.character,
		text: raw.quote
	}
}

export function mapYurippeQuotesToDto(rawQuotes: YurippeQuoteRaw[]): QuoteDto[] {
	return rawQuotes.map(mapYurippeQuoteToDto)
}

/** ------------------------------ JIKAN ------------------------------ */

function mapJikanTypeToMediaType(type?: string | null): "anime" | "film" {
	if (!type) return "anime"

	if (type.toLowerCase() === "movie") {
		return "film"
	}

	return "anime"
}

function uniqueStrings(values: string[]): string[] {
	return [...new Set(values.filter(Boolean))]
}

export function mapJikanToCatalogAnime(raw: JikanAnimeRaw): JikanCatalogAnimePatch {
	const genreNames = raw.genres?.map((g) => g.name) ?? []
	const themeNames = raw.themes?.map((t) => t.name) ?? []

	return {
		id: raw.mal_id,
		sourceIds: {
			malId: raw.mal_id,
		},
		title: {
			main: raw.title,
			english: raw.title_english ?? "",
			japanese: raw.title_japanese ?? "",
		},
		animeInfo: {
			episodeCount: raw.episodes ?? 0,
			mediaType: mapJikanTypeToMediaType(raw.type),
			categories: uniqueStrings([...genreNames, ...themeNames]),
			streaming: raw.streaming || []
		},
		imageUrl: raw.images?.jpg?.image_url ?? raw.images?.webp?.image_url ?? "",
		trailer: raw.trailer?.embed_url ?? raw.trailer?.url ?? "",
		synopsis: raw.synopsis ?? "",
		rating: raw.score ?? 0,
	}
}

/** ------------------------------ Other ------------------------------ */
export function toCatalogAnimePublicDto(
	anime: CatalogAnimeCacheDocument
): CatalogAnimeDto {
	return {
		id: anime.id,
		sourceIds: anime.sourceIds,
		title: anime.title,
		animeInfo: anime.animeInfo,
		quotes: anime.quotes,
		imageUrl: anime.imageUrl,
		trailer: anime.trailer,
		synopsis: anime.synopsis,
		rating: anime.rating,
		consistencyScore: anime.consistencyScore,
		cacheMeta: {
			sources: anime.cacheMeta.sources
		}
	};
}

export function buildCatalogAnimeDtoFromPatch(jikanPatch: JikanCatalogAnimePatch): CatalogAnimeDto {
	if (!jikanPatch.title) {
		throw new Error("Missing title")
	}

	if (!jikanPatch.animeInfo) {
		throw new Error("Missing animeInfo")
	}

	return {
		...jikanPatch,
		title: {
			...jikanPatch.title,
			french: undefined
		},
		animeInfo: {
			...jikanPatch.animeInfo,
			seasonNumber: undefined
		},
		quotes: [],
		consistencyScore: 5,
		cacheMeta: {
			sources: ["jikan"]
		}
	}
}

export function mergeJikanAndYurippeToDto(
	baseDto: CatalogAnimeDto,
	yurippeQuotes: QuoteDto[]
): CatalogAnimeDto {
	return {
		...baseDto,
		quotes: yurippeQuotes,
		consistencyScore: 7,
		cacheMeta: {
			sources: ["jikan", "yurippe"]
		}
	}
}

/**
 * map the internal dto to the mongoose schemùa (only add date that will not be accessible to users)
 */
export function toCatalogAnimeCacheDocument(
	dto: CatalogAnimeDto
): CatalogAnimeCacheDocument {
	return {
		...dto,
		cacheMeta: {
			...dto.cacheMeta,
			lastFetchedAt: new Date()
		}
	}
}