import express from "express"
import { changePassword, createUser, getUser, loginUser, updateUserProfile} from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login", loginUser)
userRouter.post("/update-password",changePassword)
userRouter.get("/profile", getUser)
userRouter.put("/",updateUserProfile)

export default userRouter;




