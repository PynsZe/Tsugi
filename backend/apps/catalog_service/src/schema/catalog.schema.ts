import {z} from "zod"

export const GetAnimeParamsSchema = z.object({
	animeId: z.coerce.number().int().positive()
})

export const SearchQuerySchema = z.object({
	q: z.string().min(1)
})