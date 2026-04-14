import request from "supertest"
import mongoose, {Types} from "mongoose"
import {MongoMemoryServer} from "mongodb-memory-server"
import {createApp} from "../app"
import {AnimeEntryType, UserModel} from "../schema/user.schema"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "../config/config"
import type {Express} from "express"



jest.setTimeout(30000)

let app: Express
let mongod: MongoMemoryServer
let token: string
let badtoken:string
let headers: { Authorization: string }
let badheaders:{Authorization:string}
beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    await mongoose.connect(uri)
    app = createApp()
})

afterAll(async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.dropDatabase()
            await mongoose.disconnect()
        }
    } finally {
        if (mongod) {
            await mongod.stop()
        }
    }
})

afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
        await UserModel.deleteMany({})
    }
})

let user
beforeEach(async () => {
    await UserModel.deleteMany({})
    const result = await seedUserAndGetToken()
    token = result.token
    badtoken=token+"invalid"
    user =result.user
    headers = {
        Authorization: `Bearer ${token}`
    }
    badheaders={
        Authorization:`Bearer ${badtoken}`
    }
})

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const TEST_USER = {
    email: "test@example.com",
    username: "testuser",
    password: "password123",
}

const TEST_LIST = {
    animeId: 1,
    rating: 5,
    userComment: "good",
    status: "watching",
    isFavorite: true,
}

const Token_invalid_error={
    "error":"INVALID_TOKEN"
}


/** Creates a user in DB and returns a valid JWT */
async function seedUserAndGetToken() {
    const passwordHash = await bcrypt.hash(TEST_USER.password, 10)
    const user = await UserModel.create({
        email: TEST_USER.email,
        username: TEST_USER.username,
        passwordHash,
    })
    const token = jwt.sign(
        {sub: user._id, email: user.email, username: user.username},
        config.jwtSecret,
        {expiresIn: config.jwtExpiresIn},
    )
    return {user, token}
}
/* ================================================================== */
/*  USERS ROUTES  (/users)                                               */
/* ================================================================== */

describe("USERS — /users", () => {

    /* ===== User PROFILE ===== */
    describe("OWN PROFILE", () => {
        /* ===== Own Profile Actions (requires token) ===== */
        describe("GET /users/me", () => {
            it("should return user (200)", async () => {
                const res = await request(app)
                    .get("/users/me")
                    .set(headers)

                expect(res.status).toBe(200)
            })

            it("should return error UNAUTHORIZED (401)", async () => {
                const res = await request(app)
                    .get("/users/me")

                expect(res.status).toBe(401)
                expect(res.body.error).toBe("UNAUTHORIZED")
            })
            it("should return UNAUTHORIZED (401) if token is invalid",async ()=>{
                const res =await request(app)
                    .get("/users/me")
                    .set(badheaders)
                expect(res.status).toBe(401)
                expect(res.body).toEqual(Token_invalid_error)
            })


        })

        describe("PATCH /users/visibility", () => {
            it("should return error INVALID_INPUT (400)", async () => {
                const res = await request(app)
                    .patch("/users/me/visibility")
                    .set(headers)
                    .send({visibility: "pas"})

                expect(res.status).toBe(400)
                expect(res.body.error).toBe("INVALID_INPUT")
            })
            it("shold return users with  visiblity ghost (200)", async () => {

                const res = await request(app)
                    .patch("/users/me/visibility")
                    .set(headers)
                    .send({visibility: "ghost"})

                expect(res.status).toBe(200)

            })
            it('should return error UNAUTHORIZED ', async () => {
                const res = await request(app)
                    .patch("/users/me/visibility")
                    .send({visibility: "ghost"})

                expect(res.status).toBe(401)
                expect(res.body.error).toBe("UNAUTHORIZED")
            });
            it("should return INVALID_TOKEN (401) if token is invalid",async ()=>{
                const res =await request(app)
                    .patch("/users/me/visibility")
                    .set(badheaders)
                expect(res.status).toBe(401)
                expect(res.body).toEqual(Token_invalid_error)
            })


        })
    })

    /* ===== User List Actions ===== */
    describe("USER LIST", () => {

        describe("GET /users/me/list", () => {
            it("should return user's list (200)",async ()=>{
                const res =await request(app)
                    .get("/users/me/list")
                    .set(headers)

                expect(res.status).toBe(200)
                expect(Array.isArray(res.body.animeList)).toBe(true)
            })
            it("should return UNAUTHORIZED (401) if no token",async ()=>{
                const res =await request(app)
                    .get("/users/me/list")

                expect(res.status).toBe(401)
            })

            it("should return INVALID_TOKEN (401) if token is invalid",async ()=>{
                const res =await request(app)
                    .get("/users/me/list")
                    .set(badheaders)
                expect(res.status).toBe(401)
                expect(res.body).toEqual(Token_invalid_error)
            })
        })

        describe("PATCH /users/me/list", () => {
            it("should add  anime in list (200)",async ()=>{
                const res =await  request(app)
                    .patch("/users/me/list")
                    .set(headers)
                    .send(TEST_LIST)
                expect(res.status).toBe(200)
                expect(res.body.ok).toBe(true)
            })
            it("should  update anime in list (200)",async ()=>{


                const res =await  request(app)
                    .patch("/users/me/list")
                    .set(headers)
                    .send({...TEST_LIST, status: "completed"})

                expect(res.status).toBe(200)
                expect(res.body.ok).toBe(true)
            })
            it("should return UNAUTHORIZED (401) if no token",async ()=>{
                const res=await request(app)
                    .patch("/users/me/list")
                    .send(TEST_LIST)
                expect(res.status).toBe(401)
                expect(res.body.error).toBe("UNAUTHORIZED")
            })
            it("should return INVALID_INPUT (400) ",async ()=>{
                const res=await request(app)
                    .patch("/users/me/list")
                    .set(headers)
                    .send({rating:5})

                expect(res.status).toBe(400)
                expect(res.body.error).toBe("INVALID_INPUT")
            })
            it("should return INVALID_TOKEN (401) if token is invalid",async ()=>{
                const res =await request(app)
                    .patch("/users/me/list")
                    .set(badheaders)
                expect(res.status).toBe(401)
                expect(res.body).toEqual(Token_invalid_error)
            })

        })

        describe("DELETE /users/me/list/:id", () => {
            it("should delete anime from list by id (200)",async ()=>{
                const res=await request(app)
                    .delete("/users/me/list/1")
                    .set(headers)
                expect(res.status).toBe(200)
                expect(res.body.ok).toBe(true)
            })
            it("should return INVALID_PARAMS (400) for invalid id",async ()=>{
                const res = await request(app)
                    .delete("/users/me/list/abc")
                    .set(headers)

                expect(res.status).toBe(400)
            })
            it("should return UNAUTHORIZED (401) if no token",async ()=>{
                const res = await request(app)
                    .delete("/users/me/list/1")

                expect(res.status).toBe(401)
            })
            it("should return INVALID_TOKEN (401) if token is invalid",async ()=>{
                const res =await request(app)
                    .delete("/users/me/list/1")
                    .set(badheaders)
                expect(res.status).toBe(401)
                expect(res.body).toEqual(Token_invalid_error)
            })
        })

    })

    /* ===== User Favorites Actions ===== */
    describe("USER FAVORITES", () => {

        describe("GET /users/me/favorites", () => {
            it("should return user's favorites (200)",async ()=>{

                const res =await request(app)
                    .get("/users/me/favorites")
                    .set(headers)
                expect(res.status).toBe(200)
                expect(Array.isArray(res.body)).toBe(true)
            })


            it("should return UNAUTHORIZED (401) if no token",async ()=>{
                const res =await request(app)
                    .get("/users/me/favorites")
                expect(res.status).toBe(401)
                expect(res.body.error).toBe("UNAUTHORIZED")
            })
            it("should return INVALID_TOKEN (401) if token is invalid",async ()=>{
                const res =await request(app)
                    .get("/users/me/favorites")
                    .set(badheaders)
                expect(res.status).toBe(401)
                expect(res.body).toEqual(Token_invalid_error)
            })
        })

        describe("PUT /users/me/favorites/:id", () => {
            it("should add anime to favorites (200)",async ()=>{
                const res=await request(app)
                    .put("/users/me/favorites/1")
                    .set(headers)
                    .send({TEST_LIST})
                expect(res.status).toBe(200)
                expect(res.body.ok).toBe(true)
            })
            it("should return INVALID_PARAMS (400) for invalid id",async ()=>{
                const res=await request(app)
                    .put("/users/me/favorites/gr")
                    .set(headers)
                    .send({TEST_LIST})

                expect(res.status).toBe(400)
                expect(res.body.error).toBe("INVALID_PARAMS")

            })
            it("should return UNAUTHORIZED (401) if no token",async ()=>{
                const res=await request(app)
                    .put("/users/me/favorites/1")
                    .send({TEST_LIST})

                expect(res.status).toBe(401)
                expect(res.body.error).toBe("UNAUTHORIZED")
            })
            it("should return INVALID_TOKEN (401) if token is invalid",async ()=>{
                const res =await request(app)
                    .put("/users/me/favorites/1")
                    .set(badheaders)
                expect(res.status).toBe(401)
                expect(res.body).toEqual(Token_invalid_error)
            })

        })

        describe("DELETE /users/me/favorites/:id", () => {
            it("should remove anime from favorites (200)",async ()=>{
                await request(app)
                    .put("/users/me/favorites/1")
                    .set(headers)
                const res=await request(app)
                    .delete("/users/me/favorites/1")
                    .set(headers)

                expect(res.status).toBe(200)
                expect(res.body.ok).toBe(true)
            })
            it("should return INVALID_PARAMS (400) for invalid id",async ()=>{
                const res=await request(app)
                    .delete("/users/me/favorites/fir")
                    .set(headers)

                expect(res.status).toBe(400)
                expect(res.body.error).toBe("INVALID_PARAMS")
            })
            it("should return UNAUTHORIZED (401) if no token",async ()=>{
                const res =await request(app)
                    .delete("/users/me/favorites/1")

                expect(res.status).toBe(401)
                expect(res.body.error).toBe("UNAUTHORIZED")
            })
            it("should return INVALID_TOKEN (401) if token is invalid",async ()=>{
                const res =await request(app)
                    .delete("/users/me/favorites/1")
                    .set(badheaders)
                expect(res.status).toBe(401)
                expect(res.body).toEqual(Token_invalid_error)
            })

        })

    })
    /* ===== Other User Profile ===== */
    describe("OTHER USER PROFILE", () => {

        describe("GET /users/profile/:username", () => {
            it("should return user profile by username (200)",async ()=>{
                const res =await request(app)
                    .get(`/users/profile/${TEST_USER.username}`)

                expect(res.status).toBe(200)
                expect(res.body.username).toBe(TEST_USER.username)
            })
            it("should return error NOT_FOUND and message NO_USER_EXIST (404) for invalid username",async ()=>{
                const res =await request(app)
                    .get("/users/profile/TFR")



                expect(res.status).toBe(404)
                expect(res.body.error).toBe("NOT_FOUND")
                expect(res.body.message).toEqual("NO_USER_EXIST")
            })
        })

        describe("GET /users/profile/:username/favorites", () => {
            it("should return user's favorites by username (200)",async ()=>{
                const res =await request(app)
                    .get(`/users/profile/${TEST_USER.username}/favorites`)
                expect(Array.isArray(res.body)).toEqual(true)
                expect(res.status).toBe(200)
            })
            it("should return  error NOT_FOUND and message NO_USER_EXIST (404) for invalid username",async ()=>{
                const res=await request(app)
                    .get(`/users/profile/${574}/favorites`)

                expect(res.status).toBe(404)
                expect(res.body.error).toBe("NOT_FOUND")
                expect(res.body.message).toEqual("NO_USER_EXIST")
            })
        })

    })

})
