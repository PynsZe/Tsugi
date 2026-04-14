import mongoose from "mongoose"
import type {CatalogAnimeCacheDocument} from "../dto/catalog.dto";

const titleSchema = new mongoose.Schema(
	{
		main: {type: String, required: true},
		english: {type: String, default: ""},
		japanese: {type: String, default: ""},
		french: {type: String, default: ""}
	},
	{_id: false}
)

const quoteSchema = new mongoose.Schema(
	{
		id: {type: String, required: true},
		text: {type: String, default: ""},
		character: {type: String, default: ""}
	},
	{_id: false}
)

const animeInfoSchema = new mongoose.Schema(
	{
		seasonNumber: {type: Number, default: 0},
		episodeCount: {type: Number, default: 0},
		mediaType: {
			type: String,
			enum: ["anime", "film"],
			default: "anime"
		},
		categories: {type: [String], default: []},
		streaming: [
			{
				name: {type: String, required: true},
				url: {type: String, required: true}
			}
		]
	},
	{_id: false}
)

const animeSchema = new mongoose.Schema<CatalogAnimeCacheDocument>(
	{
		id: {
			type: Number,
			required: true,
			unique: true
		},

		sourceIds: {
			malId: {type: Number, required: true},
			aniListId: {type: Number}
		},

		title: {
			type: titleSchema,
			required: true
		},

		animeInfo: {
			type: animeInfoSchema,
			default: () => ({})
		},

		quotes: {
			type: [quoteSchema],
			default: []
		},

		imageUrl: {
			type: String,
			default: ""
		},

		trailer: {
			type: String,
			default: ""
		},

		synopsis: {
			type: String,
			default: ""
		},

		rating: {
			type: Number,
			default: 0
		},

		consistencyScore: {
			type: Number,
			default: 0
		},
		cacheMeta: {
			lastFetchedAt: {type: Date, default: Date.now},
			sources: [{type: String, default: "jikan"}]
		}
	},
	{
		timestamps: true
	}
)

export const CatalogModel = mongoose.model("Anime", animeSchema)
