import {UserType} from "../schema/user.schema";

export type Me = Omit<UserType,
	"passwordHash"> & {
	createdAt: Date
	updatedAt: Date
}
