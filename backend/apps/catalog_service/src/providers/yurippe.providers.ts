import {base_url} from "../../../../packages/config/config"
import {YurippeQuoteResponseRaw, YurippeQuoteResponseRawSchema} from "../schema/rawFetch.schema"

export const baseUrl = base_url.yurippe;

export const YurippeProvider = {
    async fetchByAnime(anime: string): Promise<YurippeQuoteResponseRaw | null> {
        console.log(`Anime : ${anime}`);
        try {
            const encodedAnime = encodeURIComponent(anime)
            const res = await fetch(`${baseUrl}?show=${encodedAnime}&random=1`);

            if (!res.ok) {
                console.error(`Yurippe error: ${res.status}`)
                return null
            }

            const json: unknown = await res.json()

            const response = YurippeQuoteResponseRawSchema.safeParse(json)
            if (!response.success) {
                console.error("Invalid Yurippe response format:", response.error.format())
                return null
            }

            return response.data
        } catch (error) {
            console.error("Error fetching Yurippe response:", error);
            return null
        }

    }
}