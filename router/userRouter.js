import express from "express"
import { changePassword, createUser, getUser, googlelogin, loginUser, sendOTP, updateUserProfile, verifyOTP} from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login", loginUser)
userRouter.post("/update-password",changePassword)
userRouter.post("/send-otp",sendOTP)
userRouter.post("/verify-otp",verifyOTP)
userRouter.post("/google-login",googlelogin)
userRouter.get("/profile", getUser)
userRouter.put("/",updateUserProfile)

export default userRouter;




