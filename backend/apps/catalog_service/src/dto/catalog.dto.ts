// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export type QuoteDto = {
	id: string
	text: string
	character: string
}

export type CatalogAnimeDto = {
	id: number
	sourceIds: {
		malId: number
		aniListId?: number  // no provider
	}
	title: {
		main: string
		english: string
		japanese: string
		french?: string  // no provider
	}
	animeInfo: {
		seasonNumber?: number // no provider
		episodeCount: number
		mediaType: "anime" | "film"
		categories: string[]
		streaming: { name: string, url: string }[]
	}
	quotes: {  // provided bu yurippe
		id: string
		text: string
		character: string
	}[]
	imageUrl: string
	trailer: string
	synopsis: string
	rating: number
	consistencyScore: number  // no provider / calculed
	cacheMeta: {
		sources: string[]
	}
}

export type JikanCatalogAnimePatch = Omit<
	CatalogAnimeDto,
	"quotes" | "consistencyScore" | "cacheMeta" | "animeInfo" | "title"
> & {
	title?: Omit<CatalogAnimeDto["title"], "french">
	animeInfo?: Omit<CatalogAnimeDto["animeInfo"], "seasonNumber">
}

export type CatalogAnimeCacheDocument = Omit<CatalogAnimeDto, "cacheMeta"> & {
	cacheMeta: {
		sources: string[]
		lastFetchedAt: Date
	}
	createdAt?: Date
	updatedAt?: Date
}