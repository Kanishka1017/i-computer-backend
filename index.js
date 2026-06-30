import express from 'express'
import mongoose from "mongoose"
import userRouter from './router/userRouter.js'
import productRouter from './router/productRouter.js'
import jwt from "jsonwebtoken"
import AuthorizaUser from './lib/jwtMiddleware.js'
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const mongoURI = process.env.MONGO_URI

mongoose.connect(mongoURI).then(
    ()=>{
        console.log("Conected to the MongoDB")
    }

).catch(
    (err)=>{
        console.log("Error:", err.message)
    }
)

const app = express()

//Midle ware
app.use(express.json())

app.use(cors ())

app.use(AuthorizaUser)

app.use("/api/user",userRouter)
app.use("/api/product", productRouter)

app.listen(3000,
    ()=>{
        console.log("Server is running on port 3000")
    }
)

