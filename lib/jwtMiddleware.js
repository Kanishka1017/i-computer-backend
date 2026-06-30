import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()
export default function AuthorizaUser(req, res, next){
        console.log("Request received")

        const header = req.header("Authorization")

        if(header != null){
            const token = header.replace("Bearer ","")
            console.log(token)

            jwt.verify(token, process.env.JWT_SECRET, 
                (err, decoded)=>{
                    if(decoded == null){
                        res.status(401).json({
                            message : "Invalide Token please Login Again"
                        })
                    }else{
                        req.user = decoded
                        next()
                    }
                    }
                )
            }else{
                next()
            }
        }