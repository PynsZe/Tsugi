import mongoose from "mongoose"

const animeEntrySchema = new mongoose.Schema(
	{
		animeId: {type: Number, required: true},
		rating: {type: Number, min: 0, max: 10, default: undefined},
		userComment: {type: String, default: ""},
		status: {
			type: String,
			enum: ["watching", "completed", "dropped", "plan_to_watch", "on_hold"],
			default: "plan_to_watch"
		},
		isFavorite: {
			type: Boolean,
			default: false
		}
	},
	{_id: false}
)

export type AnimeEntryType = mongoose.InferSchemaType<typeof animeEntrySchema>


const visibilityValues = ["ghost", "private", "public"] as const
export type VisibilityType = typeof visibilityValues[number]

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true
		},
		// show anime list or not
		profileVisibility: {
			type: String,
			enum: visibilityValues, // ghost : 404     /     private username, pp        /      public : private + animeList
			default: "public",
			required: true
		},
		passwordHash: {
			type: String,
			required: true
		},
		imageUrl: {
			type: String,
			default: ""
		},
		animeList: {
			type: [animeEntrySchema],
			default: []
		},
	},
	{
		timestamps: true
	}
)

export type UserType = mongoose.InferSchemaType<typeof userSchema>

export const UserModel = mongoose.model("User", userSchema)