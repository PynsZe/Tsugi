import { UserModel } from "../schema/user.schema";
import {
    getMe,
    setVisibilityChanges,
    getList,
    addOrUpdateAnimeIntoList,
    deleteFromListById,
    getFavorite,
    addToFavoriteById,
    removeFromFavoriteById,
    getUserByUsername,
    getFavoritesByUsername,
} from "../services/users.service";
import { NotFoundError, UnauthorizedError, ValidationError } from "@shared/errors/errors";
import type { VisibilityType, AnimeEntryType, UserType } from "../schema/user.schema";
import type { AnimeEntryInput } from "../schema/userModifications.schema";

// Mock the UserModel
jest.mock("../schema/user.schema");

describe("User Service", () => {
    const mockUserId = "507f1f77bcf86cd799439011";
    const mockUsername = "testuser";
    const mockAnimeId = 12345;

    const mockUser = {
        _id: mockUserId,
        username: mockUsername,
        email: "test@example.com",
        imageUrl: "https://example.com/image.jpg",
        animeList: [
            {
                animeId: mockAnimeId,
                rating: 8,
                userComment: "Great anime",
                status: "completed",
                isFavorite: false,
            },
            {
                animeId: 67890,
                rating: 9,
                userComment: "Amazing",
                status: "watching",
                isFavorite: true,
            },
        ],
        profileVisibility: "public" as VisibilityType,
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn().mockResolvedValue(true),
    };

    const mockUserWithoutAnime = {
        ...mockUser,
        animeList: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getMe", () => {
        it("should return user data when user exists", async () => {
            (UserModel.findById as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await getMe(mockUserId);

            expect(UserModel.findById).toHaveBeenCalledWith(mockUserId);
            expect(result).toEqual(mockUser);
        });

        it("should throw NotFoundError when user does not exist", async () => {
            (UserModel.findById as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(getMe(mockUserId)).rejects.toThrow(NotFoundError);
        });
    });

    describe("setVisibilityChanges", () => {
        it("should update profile visibility successfully", async () => {
            const mockVisibility = "private" as VisibilityType;
            const mockUserWithSave = {
                ...mockUser,
                profileVisibility: "public",
                save: jest.fn().mockResolvedValue(true),
            };

            (UserModel.findById as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUserWithSave),
            });

            await setVisibilityChanges(mockVisibility, mockUserId);

            expect(mockUserWithSave.profileVisibility).toBe(mockVisibility);
            expect(mockUserWithSave.save).toHaveBeenCalled();
        });

        it("should throw NotFoundError when user does not exist", async () => {
            (UserModel.findById as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(setVisibilityChanges("private" as VisibilityType, mockUserId)).rejects.toThrow(NotFoundError);
        });
    });

    describe("getList", () => {
        it("should return anime list when user exists", async () => {
            const expectedResult = { animeList: mockUser.animeList };
            (UserModel.findById as jest.Mock).mockResolvedValue(expectedResult);

            const result = await getList(mockUserId);

            expect(UserModel.findById).toHaveBeenCalledWith(mockUserId, { animeList: 1, _id: 0 });
            expect(result).toEqual(expectedResult);
        });

        it("should throw NotFoundError when user does not exist", async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue(null);

            await expect(getList(mockUserId)).rejects.toThrow(NotFoundError);
        });
    });

    describe("addOrUpdateAnimeIntoList", () => {
        const mockAnimeInput: Partial<AnimeEntryInput> = {
            animeId: mockAnimeId,
            rating: 10,
            userComment: "Updated comment",
            status: "completed",
            isFavorite: true,
        };

        it("should update existing anime entry", async () => {
            const mockUserWithSave = {
                ...mockUser,
                save: jest.fn().mockResolvedValue(true),
            };

            (UserModel.findById as jest.Mock).mockResolvedValue(mockUserWithSave);

            await addOrUpdateAnimeIntoList(mockAnimeInput, mockUserId);

            const existingEntry = mockUserWithSave.animeList[0]!;
            expect(existingEntry.rating).toBe(10);
            expect(existingEntry.userComment).toBe("Updated comment");
            expect(existingEntry.status).toBe("completed");
            expect(existingEntry.isFavorite).toBe(true);
            expect(mockUserWithSave.save).toHaveBeenCalled();
        });

        it("should add new anime entry when not existing", async () => {
            const newAnimeInput: Partial<AnimeEntryInput> = {
                animeId: 99999,
                rating: 7,
                userComment: "New anime",
                status: "watching",
                isFavorite: false,
            };
            const mockUserWithSave = {
                ...mockUser,
                animeList: [...mockUser.animeList],
                save: jest.fn().mockResolvedValue(true),
            };

            (UserModel.findById as jest.Mock).mockResolvedValue(mockUserWithSave);

            await addOrUpdateAnimeIntoList(newAnimeInput, mockUserId);

            expect(mockUserWithSave.animeList.length).toBe(3);
            expect(mockUserWithSave.save).toHaveBeenCalled();
        });

        it("should throw NotFoundError when user does not exist", async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue(null);

            await expect(addOrUpdateAnimeIntoList(mockAnimeInput, mockUserId)).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteFromListById", () => {
        it("should delete anime from list successfully", async () => {
            const mockUpdateResult = {
                matchedCount: 1,
                modifiedCount: 1,
            };

            (UserModel.updateOne as jest.Mock).mockResolvedValue(mockUpdateResult);

            await deleteFromListById(mockAnimeId, mockUserId);

            expect(UserModel.updateOne).toHaveBeenCalledWith(
                { _id: mockUserId },
                { $pull: { animeList: { animeId: mockAnimeId } } }
            );
        });

        it("should throw NotFoundError when user not found", async () => {
            const mockUpdateResult = {
                matchedCount: 0,
                modifiedCount: 0,
            };

            (UserModel.updateOne as jest.Mock).mockResolvedValue(mockUpdateResult);

            await expect(deleteFromListById(mockAnimeId, mockUserId)).rejects.toThrow(NotFoundError);
        });

        it("should throw UnauthorizedError when anime not found in list", async () => {
            const mockUpdateResult = {
                matchedCount: 1,
                modifiedCount: 0,
            };

            (UserModel.updateOne as jest.Mock).mockResolvedValue(mockUpdateResult);

            await expect(deleteFromListById(mockAnimeId, mockUserId)).rejects.toThrow(UnauthorizedError);
        });
    });

    describe("getFavorite", () => {
        it("should return favorite anime list", async () => {
            const expectedFavorites = mockUser.animeList.filter((a) => a.isFavorite);

            (UserModel.findById as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await getFavorite(mockUserId);

            expect(result).toEqual(expectedFavorites);
            expect(result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        animeId: 67890,
                        isFavorite: true,
                    }),
                ])
            );
        });

        it("should throw NotFoundError when user does not exist", async () => {
            (UserModel.findById as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(getFavorite(mockUserId)).rejects.toThrow(NotFoundError);
        });
    });

    describe("addToFavoriteById", () => {
        it("should mark existing anime as favorite", async () => {
            const mockUserWithSave = {
                ...mockUser,
                save: jest.fn().mockResolvedValue(true),
            };

            (UserModel.findById as jest.Mock).mockResolvedValue(mockUserWithSave);

            await addToFavoriteById(mockAnimeId, mockUserId);

            const existingEntry = mockUserWithSave.animeList[0]!;
            expect(existingEntry.isFavorite).toBe(true);
            expect(mockUserWithSave.save).toHaveBeenCalled();
        });

        it("should add new anime entry as favorite when not existing", async () => {
            const newAnimeId = 99999;
            const mockUserWithSave = {
                ...mockUser,
                animeList: [...mockUser.animeList],
                save: jest.fn().mockResolvedValue(true),
            };

            (UserModel.findById as jest.Mock).mockResolvedValue(mockUserWithSave);

            await addToFavoriteById(newAnimeId, mockUserId);

            expect(mockUserWithSave.animeList.length).toBe(3);
            const newEntry = mockUserWithSave.animeList.find((a) => a.animeId === newAnimeId);
            expect(newEntry?.isFavorite).toBe(true);
            expect(mockUserWithSave.save).toHaveBeenCalled();
        });

        it("should throw NotFoundError when user does not exist", async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue(null);

            await expect(addToFavoriteById(mockAnimeId, mockUserId)).rejects.toThrow(NotFoundError);
        });
    });

    describe("removeFromFavoriteById", () => {
        it("should remove anime from favorites", async () => {
            const favoriteAnimeId = 67890;
            const mockUserWithSave = {
                ...mockUser,
                save: jest.fn().mockResolvedValue(true),
            };

            (UserModel.findById as jest.Mock).mockResolvedValue(mockUserWithSave);

            await removeFromFavoriteById(favoriteAnimeId, mockUserId);

            const existingEntry = mockUserWithSave.animeList.find((a) => a.animeId === favoriteAnimeId);
            expect(existingEntry?.isFavorite).toBe(false);
            expect(mockUserWithSave.save).toHaveBeenCalled();
        });

        it("should throw NotFoundError when user does not exist", async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue(null);

            await expect(removeFromFavoriteById(mockAnimeId, mockUserId)).rejects.toThrow(NotFoundError);
        });

        it("should throw NotFoundError when anime not in list", async () => {
            const unknownAnimeId = 99999;
            const mockUserWithSave = {
                ...mockUser,
                save: jest.fn().mockResolvedValue(true),
            };

            (UserModel.findById as jest.Mock).mockResolvedValue(mockUserWithSave);

            await expect(removeFromFavoriteById(unknownAnimeId, mockUserId)).rejects.toThrow(NotFoundError);
        });
    });

    describe("getUserByUsername", () => {
        it("should return public profile with anime list", async () => {
            const publicUser = {
                ...mockUser,
                profileVisibility: "public" as VisibilityType,
            };

            (UserModel.findOne as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(publicUser),
            });

            const result = await getUserByUsername(mockUsername);

            expect(result).toEqual({
                username: publicUser.username,
                imageUrl: publicUser.imageUrl,
                animeList: publicUser.animeList,
            });
        });

        it("should return private profile without anime list", async () => {
            const privateUser = {
                ...mockUser,
                profileVisibility: "private" as VisibilityType,
            };

            (UserModel.findOne as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(privateUser),
            });

            const result = await getUserByUsername(mockUsername);

            expect(result).toEqual({
                username: privateUser.username,
                imageUrl: privateUser.imageUrl,
            });
            expect(result).not.toHaveProperty("animeList");
        });

        it("should throw NotFoundError for ghost profile", async () => {
            const ghostUser = {
                ...mockUser,
                profileVisibility: "ghost" as VisibilityType,
            };

            (UserModel.findOne as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(ghostUser),
            });

            await expect(getUserByUsername(mockUsername)).rejects.toThrow(NotFoundError);
        });

        it("should throw NotFoundError when user does not exist", async () => {
            (UserModel.findOne as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(getUserByUsername(mockUsername)).rejects.toThrow(NotFoundError);
        });
    });

    describe("getFavoritesByUsername", () => {
        it("should return favorites for public profile", async () => {
            const publicUser = {
                ...mockUser,
                profileVisibility: "public" as VisibilityType,
            };
            const expectedFavorites = publicUser.animeList.filter((a) => a.isFavorite);

            (UserModel.findOne as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(publicUser),
            });

            const result = await getFavoritesByUsername(mockUsername);

            expect(result).toEqual(expectedFavorites);
        });

        it("should throw UnauthorizedError for private profile", async () => {
            const privateUser = {
                ...mockUser,
                profileVisibility: "private" as VisibilityType,
            };

            (UserModel.findOne as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(privateUser),
            });

            await expect(getFavoritesByUsername(mockUsername)).rejects.toThrow(UnauthorizedError);
        });

        it("should throw NotFoundError for ghost profile", async () => {
            const ghostUser = {
                ...mockUser,
                profileVisibility: "ghost" as VisibilityType,
            };

            (UserModel.findOne as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(ghostUser),
            });

            await expect(getFavoritesByUsername(mockUsername)).rejects.toThrow(NotFoundError);
        });

        it("should throw NotFoundError when user does not exist", async () => {
            (UserModel.findOne as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(getFavoritesByUsername(mockUsername)).rejects.toThrow(NotFoundError);
        });
    });
});
