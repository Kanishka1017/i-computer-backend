import express from "express"
import { blockOrUnblockUser, changePassword, changeRoll, createUser, getAllUsers, getUser, googlelogin, loginUser, sendOTP, updateUserProfile, verifyOTP} from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login", loginUser)
userRouter.post("/update-password",changePassword)
userRouter.post("/send-otp",sendOTP)
userRouter.post("/verify-otp",verifyOTP)
userRouter.post("/google-login",googlelogin)
userRouter.post("/block-user",blockOrUnblockUser)
userRouter.post("/update-role",changeRoll)
userRouter.get("/profile", getUser)
userRouter.get("/all/:pageSize/:pageNumber",getAllUsers)
userRouter.put("/",updateUserProfile)

export default userRouter;




