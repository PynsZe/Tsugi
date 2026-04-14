import {z} from "zod"

export const IdSchema = z.object({
	id: z.coerce.number().int().positive()
})

export const UsernameSchema = z.object({
	username: z.string()
})

export const AnimeEntrySchema = z.object({
	animeId: z.number().int().positive(),
	rating: z.number().min(0).max(10).optional(),
	userComment: z.string().default(""),
	status: z
		.enum(["watching", "completed", "dropped", "plan_to_watch", "on_hold"])
		.default("plan_to_watch"),
	isFavorite: z.boolean().default(false)
})

export type AnimeEntryInput = z.infer<typeof AnimeEntrySchema>


export const visibilitySchema = z.object({
	visibility: z.enum(["ghost", "private", "public"]),
})