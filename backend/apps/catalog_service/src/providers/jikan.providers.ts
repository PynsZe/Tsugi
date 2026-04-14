// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {apiLengthLimit, base_url} from "../../../../packages/config/config"
import {
    JikanAnimeRawResponseById,
    JikanAnimeRawResponseByIdSchema,
    JikanAnimeRawResponseSearch,
    JikanAnimeRawResponseSearchSchema,
    JikanStreamingRawResponseById, JikanStreamingRawResponseByIdSchema
} from "../schema/rawFetch.schema";

export const baseUrl = base_url.jikan;

export const JikanProvider = {
    async fetchWithQuery(queryType: string, queryValue: string, needTop: boolean, page: number): Promise<JikanAnimeRawResponseSearch | null> {
        try {
            const needTopValue = needTop ? "/top" : ""
            const encodedAnime = encodeURIComponent(queryValue)
            console.log(`fetched URL : ${baseUrl}${needTopValue}/anime?${queryType}=${encodedAnime}&page=${page}&limit=${apiLengthLimit}`)
            const res = await fetch(`${baseUrl}${needTopValue}/anime?${queryType}=${encodedAnime}&page=${page}&limit=${apiLengthLimit}`);

            if (!res.ok) {
                console.error(`Jikan error: ${res.status}`)
                return null
            }

            const json: unknown = await res.json()
            const response = JikanAnimeRawResponseSearchSchema.safeParse(json)
            if (!response.success) {
                console.error(`Jikan error:`)
                console.dir(response.error.issues, {depth: null})
                return null
            }

            return response.data
        } catch (error) {
            console.error("Error fetching Jikan response:", error);
            return null
        }

    },

    async fetchAnimeStreamingById(animeId: number): Promise<JikanStreamingRawResponseById | null> {
        try {
            const res = await fetch(`${baseUrl}/${animeId}/streaming`);

            if (!res.ok) {
                console.error(`Jikan error: ${res.status}`)
                return null
            }

            const json: unknown = await res.json()
            const response = JikanStreamingRawResponseByIdSchema.safeParse(json)
            if (!response.success) {
                console.error(`Jikan error:`)
                console.dir(response.error.issues, {depth: null})
                return null
            }

            return response.data
        } catch (error) {
            console.error("Error fetching Jikan response:", error);
            return null
        }
    },

    async fetchByAnimeId(anime: number): Promise<JikanAnimeRawResponseById | null> {
        try {
            const res = await fetch(`${baseUrl}/anime/${anime}/full`);

            if (!res.ok) {
                console.error(`Jikan error: ${res.status}`)
                return null
            }

            const json: unknown = await res.json()

            const response = JikanAnimeRawResponseByIdSchema.safeParse(json)
            if (!response.success) {
                console.error("Invalid Jikan response format:", response.error.format())
                return null
            }

            return response.data
        } catch (error) {
            console.error("Error fetching Jikan response:", error);
            return null
        }

    }
}