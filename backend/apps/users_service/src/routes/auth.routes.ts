import {Router} from "express"
import {login, me, register, test} from "../controllers/auth.controller"
import {requireAuth} from "../middlewares/auth.middleware";
import {errorHandler} from "../middlewares/error.middleware";
import {validateData} from "../middlewares/validation.middleware";
import {RegisterSchema, LoginSchema} from "../schema/auth.schema";

export const authRouter = Router()
//test
authRouter.get("/test", test)

//auth
authRouter.post("/register", validateData(RegisterSchema), register, errorHandler);
authRouter.post("/login", validateData(LoginSchema), login, errorHandler);
authRouter.get("/me", requireAuth, me)


