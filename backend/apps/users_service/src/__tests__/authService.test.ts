import * as authService from "../services/auth.service"
import * as userModel from "../schema/user.schema"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {ConflictError, InternalServerError, NotFoundError, UnauthorizedError, ValidationError} from "@shared/errors/errors"

// setup
beforeEach(() => {
    jest.clearAllMocks()
})

afterEach(() => {
    jest.restoreAllMocks()
})

// mocks
jest.mock("jsonwebtoken", () => ({
    __esModule: true,
    default: {
        sign: jest.fn().mockReturnValue("mocked-token"),
    },
}))

jest.mock("../schema/user.schema", () => ({
    UserModel: {
        countDocuments: jest.fn(),
        create: jest.fn(),
        findOne: jest.fn(),
    },
}))

jest.mock("bcryptjs", () => ({
    __esModule: true,
    default: {
        hash: jest.fn(),
        compare: jest.fn(),
    },
}))

//DATA
const testUser = {
    email: "test@example.com",
    username: "testuser",
    password: "password123",
}

// TESTS UNITAIRES
describe("registerUser", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    /* ------- register successful ------- */
    it("should register a new user", async () => {
        (userModel.UserModel.countDocuments as jest.Mock)
            .mockResolvedValueOnce(0) // email inexistant
            .mockResolvedValueOnce(0);
        (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
        (userModel.UserModel.create as jest.Mock).mockResolvedValue(undefined);

        await expect(authService.registerUser(testUser)).resolves.toBeUndefined()

        expect(userModel.UserModel.countDocuments).toHaveBeenCalledWith({
            email: testUser.email,
        })

        expect(bcrypt.hash).toHaveBeenCalledWith(testUser.password, 10)

        expect(userModel.UserModel.create).toHaveBeenCalledWith({
            email: testUser.email,
            username: testUser.username,
            passwordHash: "hashed-password",
        })
    })

    /* ------- register denied : user already registered ------- */
    it("should throw ConflictError - email conflict", async () => {
        (userModel.UserModel.countDocuments as jest.Mock)
            .mockResolvedValueOnce(1) // email inexistant
            .mockResolvedValueOnce(0);

        await expect(authService.registerUser(testUser)).rejects.toThrow(ConflictError);

        expect(userModel.UserModel.countDocuments).toHaveBeenCalledWith({
            email: testUser.email,
        })
        expect(userModel.UserModel.countDocuments).toHaveBeenCalledTimes(2)
    })

    /* ------- register denied : user already registered ------- */
    it("should throw ConflictError - username conflict", async () => {
        (userModel.UserModel.countDocuments as jest.Mock)
            .mockResolvedValueOnce(0) // email inexistant
            .mockResolvedValueOnce(1);

        await expect(authService.registerUser(testUser)).rejects.toThrow(ConflictError);

        expect(userModel.UserModel.countDocuments).toHaveBeenCalledWith({
            username: testUser.username
        })
        expect(userModel.UserModel.countDocuments).toHaveBeenCalledTimes(2)
    })


    /* ------- register denied : invalid input ------- */
    it("should throw ValidationError for invalid input", async () => {
        const invalidUser = { email: "invalid", username: "", password: "" };

        await expect(authService.registerUser(invalidUser as any)).rejects.toThrow(ValidationError);
    })

    /* ------- register denied : user insertion in DB error ------- */
    it("should throw InternalServerError on DB error", async () => {
        (userModel.UserModel.countDocuments as jest.Mock).mockResolvedValue(0);
        (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
        (userModel.UserModel.create as jest.Mock).mockRejectedValue(new Error("DB Error"));

        await expect(authService.registerUser(testUser)).rejects.toThrow(InternalServerError);
    })

})

// TESTS UNITAIRES - loginUser
describe("loginUser", () => {
    const testLoginUser = {
        email: "test@example.com",
        password: "password123",
    }

    const mockDbUser = {
        _id: "user-id-123",
        email: "test@example.com",
        username: "testuser",
        passwordHash: "hashed-password",
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    /* ------- login successful ------- */
    it("should login and return token", async () => {
        (userModel.UserModel.findOne as jest.Mock).mockResolvedValue(mockDbUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const result = await authService.loginUser(testLoginUser)

        expect(userModel.UserModel.findOne).toHaveBeenCalledWith({ email: testLoginUser.email })
        expect(bcrypt.compare).toHaveBeenCalledWith(testLoginUser.password, mockDbUser.passwordHash)
        expect(result).toHaveProperty("accessToken")
        expect(result.tokenType).toBe("Bearer")
    })

    /* ------- login denied : invalid input ------- */
    it("should throw ValidationError for invalid input", async () => {
        const invalidLogin = { email: "invalid", password: "" };

        await expect(authService.loginUser(invalidLogin as any)).rejects.toThrow(ValidationError)
    })

    /* ------- login denied : user not found ------- */
    it("should throw NotFoundError when user not found", async () => {
        (userModel.UserModel.findOne as jest.Mock).mockResolvedValue(null);

        await expect(authService.loginUser(testLoginUser)).rejects.toThrow(NotFoundError)

        expect(userModel.UserModel.findOne).toHaveBeenCalledWith({ email: testLoginUser.email })
    })

    /* ------- login denied : wrong password ------- */
    it("should throw UnauthorizedError for wrong password", async () => {
        (userModel.UserModel.findOne as jest.Mock).mockResolvedValue(mockDbUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(authService.loginUser(testLoginUser)).rejects.toThrow(UnauthorizedError)

        expect(bcrypt.compare).toHaveBeenCalledWith(testLoginUser.password, mockDbUser.passwordHash)
    })
})