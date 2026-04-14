import type {VisibilityType} from "../schema/user.schema"
import {AnimeEntryType, UserModel, UserType} from "../schema/user.schema"
import {Me} from "../dto/user.dto";
import {NotFoundError, UnauthorizedError, ValidationError} from "../../../../packages/shared/errors/errors";
import {AnimeEntryInput} from "../schema/userModifications.schema";

/** -------------------------- Me ------------------------------ */

export const getMe = async (userId: string): Promise<Me> => {
    const user = await UserModel.findById(userId).select(
        "username email imageUrl animeList profileVisibility createdAt updatedAt"
    )
    if (user === null) {
        throw new NotFoundError();
    }

    return user
}

export const setVisibilityChanges = async (visibility: VisibilityType, userId: string): Promise<void> => {
    const user = await UserModel.findById(userId).select(
        "username email imageUrl animeList profileVisibility createdAt updatedAt"
    )
    if (user === null) {
        throw new NotFoundError();
    }

    user.profileVisibility = visibility
    await user.save()
}

export const getList = async (userId: string): Promise<Partial<Me>> => {
    const projection = {animeList: 1, _id: 0}

    const userList = await UserModel.findById(userId, projection)
    if (!userList) throw new NotFoundError();

    return userList
}

export const addOrUpdateAnimeIntoList = async (anime: Partial<AnimeEntryInput>, userId: string): Promise<void> => {
    const user = await UserModel.findById(userId)
    if (!user) {
        throw new NotFoundError("NO_USER_EXIST")
    }

    const existingEntry = user.animeList.find((entry) => entry.animeId === anime.animeId)

    if (existingEntry) {
        if (anime.rating !== undefined) existingEntry.rating = anime.rating
        if (anime.userComment !== undefined) existingEntry.userComment = anime.userComment
        if (anime.status !== undefined) existingEntry.status = anime.status
        if (anime.isFavorite !== undefined) existingEntry.isFavorite = anime.isFavorite
        if (anime.rating !== undefined) existingEntry.rating = anime.rating
    } else {
        user.animeList.push(anime)
    }

    await user.save()
}

export const deleteFromListById = async (animeId: number, userId: string): Promise<void> => {

    const data = await UserModel.updateOne(
        {_id: userId},
        {$pull: {animeList: {animeId: animeId}}}
    );

    if (data.matchedCount === 0) throw new NotFoundError();

    if (data.modifiedCount === 0) throw new UnauthorizedError();
}

/** ---------------------- FAVORITE SECTION ----------------------------- */

export const getFavorite = async (userId: string) => {
    const user = await UserModel.findById(userId).select(
        "username profileVisibility animeList"
    );
    if (!user) throw new NotFoundError();

    return user.animeList.filter(a => a.isFavorite);
}

export const addToFavoriteById = async (animeId: number, userId: string): Promise<void> => {
    const user = await UserModel.findById(userId)
    if (!user) {
        throw new NotFoundError("NO_USER_EXIST")
    }

    const existingEntry = user.animeList.find((entry) => entry.animeId === animeId)

    if (existingEntry) {
        existingEntry.isFavorite = true
    } else {
        user.animeList.push({
            animeId,
            isFavorite: true,
            status: "completed",
            userComment: "",
            rating: undefined,
        })
    }

    await user.save()
}

export const removeFromFavoriteById = async (animeId: number, userId: string): Promise<void> => {
    const user = await UserModel.findById(userId)
    if (!user) {
        throw new NotFoundError("NO_USER_EXIST")
    }

    const existingEntry = user.animeList.find((entry) => entry.animeId === animeId)

    if (existingEntry) {
        existingEntry.isFavorite = false
    } else {
        throw new NotFoundError('ANIME_NOT_FOUND_IN_LIST');
    }

    await user.save()
}
/** -------------------------- Other user ------------------------------ */

export const getUserByUsername = async (username: string): Promise<Partial<UserType>> => {
    const user = await UserModel
        .findOne({username: username})
        .select("username imageUrl animeList profileVisibility")

    if (!user) {
        throw new NotFoundError("NO_USER_EXIST")
    }

    switch (user.profileVisibility) {
        case "ghost":
            throw new NotFoundError();
        case "private":
            return {
                username: user.username,
                imageUrl: user.imageUrl
            }
        case "public":
            return {
                username: user.username,
                imageUrl: user.imageUrl,
                animeList: user.animeList
            }
        default:
            throw new ValidationError("INTERNAL_ERROR: No VISIBILITY")
    }
}

export const getFavoritesByUsername = async (username: string): Promise<Array<AnimeEntryType> | Array<undefined>> => {
    const user = await UserModel
        .findOne({username: username})
        .select("username imageUrl animeList profileVisibility")

    if (!user) {
        throw new NotFoundError("NO_USER_EXIST")
    }

    switch (user.profileVisibility) {
        case "ghost":
            throw new NotFoundError();
        case "private":
            throw new UnauthorizedError();
        case "public":
            return user.animeList.filter(a => a.isFavorite);
        default:
            throw new ValidationError("INTERNAL_ERROR: No VISIBILITY")
    }
}
