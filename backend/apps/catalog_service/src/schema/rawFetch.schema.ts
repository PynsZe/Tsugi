import {z} from "zod"

/** ------------------------------ YURIPPE ------------------------------ */

export const YurippeQuoteRawSchema = z.object({
	_id: z.string(),
	character: z.string(),
	show: z.string(),
	quote: z.string()
})
export const YurippeQuoteResponseRawSchema = z.array(YurippeQuoteRawSchema)

export type YurippeQuoteRaw = z.infer<typeof YurippeQuoteRawSchema>
export type YurippeQuoteResponseRaw = z.infer<typeof YurippeQuoteResponseRawSchema>

/** ------------------------------ JIKAN ------------------------------ */
/** ----------------- anime schema ----------------- */

const rawGenreLike = z.object({
	mal_id: z.number(),
	name: z.string(),
})

export const JikanAnimeRawSchema = z.object({
	mal_id: z.number(),
	url: z.url(),
	trailer: z.object({
		url: z.string().nullable().optional(),
		embed_url: z.string().nullable().optional(),
	}),
	images: z.object({
		jpg: z.object({
			image_url: z.string().nullable().optional(),
		}).optional(),
		webp: z.object({
			image_url: z.string().nullable().optional(),
		}).optional(),
	}).optional(),
	title: z.string(),
	title_english: z.string().nullable().optional(),
	title_japanese: z.string().nullable().optional(),
	type: z.string().nullable().optional(),   // media type (anime or film)
	episodes: z.number().nullable().optional(),
	score: z.number().nullable().optional(),
	synopsis: z.string().nullable().optional(),
	genres: z.array(rawGenreLike).default([]),
	themes: z.array(rawGenreLike).default([]),
	streaming: z.array(z.object({
		name: z.string(),
		url: z.string(),
	})).optional(),
})
export type JikanAnimeRaw = z.infer<typeof JikanAnimeRawSchema>

/** ----------------- response schema ----------------- */

export const JikanAnimeRawResponseSearchSchema = z.object({
	data: z.array(JikanAnimeRawSchema),
})
export type JikanAnimeRawResponseSearch = z.infer<typeof JikanAnimeRawResponseSearchSchema>

export const JikanAnimeRawResponseByIdSchema = z.object({
	data: JikanAnimeRawSchema
})
export type JikanAnimeRawResponseById = z.infer<typeof JikanAnimeRawResponseByIdSchema>


const JikanStreamingById = z.object({
	name: z.string(),
	url: z.string()
})
export const JikanStreamingRawResponseByIdSchema = z.object({
	data: z.array(JikanStreamingById)
})

export type JikanStreamingRawResponseById = z.infer<typeof JikanStreamingRawResponseByIdSchema>
