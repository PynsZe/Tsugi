import {CatalogAnimeCacheDocument} from "../dto/catalog.dto";
import {animeFreshnessDuration} from "../../../../packages/config/config";


const MAX_CACHE_AGE_MS = animeFreshnessDuration

export function needRefresh(anime: CatalogAnimeCacheDocument): boolean {
	return !(anime &&
		Date.now() - new Date(anime.cacheMeta.lastFetchedAt).getTime() < MAX_CACHE_AGE_MS);

}
