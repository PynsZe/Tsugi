import {z} from "zod"

export const deleteToListSchema = z.object({
	animeId: z.coerce.number().int().positive()
})