import jwt from "jsonwebtoken";
export default function AuthorizaUser(req, res, next){
        console.log("Request received")

        const header = req.header("Authorization")

        if(header != null){
            const token = header.replace("Bearer ","")
            console.log(token)

            jwt.verify(token, "i-computers-54", 
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