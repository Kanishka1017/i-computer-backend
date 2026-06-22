import express from 'express'
import mongoose from "mongoose"
import userRouter from './router/userRouter.js'
import productRouter from './router/productRouter.js'
import jwt from "jsonwebtoken"
import AuthorizaUser from './lib/jwtMiddleware.js'


const mongoURI = "mongodb://testuser:Test1234@ac-onwqjst-shard-00-00.zgjnxjn.mongodb.net:27017,ac-onwqjst-shard-00-01.zgjnxjn.mongodb.net:27017,ac-onwqjst-shard-00-02.zgjnxjn.mongodb.net:27017/mydb?authSource=admin&replicaSet=atlas-ega32u-shard-0&tls=true"

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

app.use(AuthorizaUser)

app.use("/user",userRouter)
app.use("/product", productRouter)

app.listen(3000,
    ()=>{
        console.log("Server is running on port 3000")
    }
)

