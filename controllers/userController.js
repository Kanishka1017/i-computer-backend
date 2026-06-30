import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
export async function createUser(req , res){
        const hashedPassword = bcrypt.hashSync(req.body.password,10)

    const user = new User(
        {
            email : req.body.email,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            password : hashedPassword,
            role : req.body.role

        });
    try{

        await user.save();
        res.json({message : "User Create Successfull"});

    }catch (error) {
    res.json({message : "Error Creating User", error: error})
    }
}

export function loginUser(req,res){

        User.findOne(
            {
                "email" : req.body.email
            }
        ).then(
            (user)=>{
               
                if(user==null){
                    res.status(404).json({
                        message : "User with given email not found"
                    })
                }

                else{
                    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)
                    
                    if(isPasswordValid){

                        const token = jwt.sign({
                            email : user.email,
                            firstName : user.firstName,
                            lastName : user.lastName,
                            role : user.role,
                            image : user.image,
                            isEmailVerified : user.isEmailVerified
                        } , process.env.JWT_SECRET)

                        console.log(token)

                        console.log({
                            email : user.email,
                            firstName : user.firstName,
                            lastName : user.lastName,
                            role : user.role,
                            image : user.image,
                            isEmailVerified : user.isEmailVerified
                        })

                        res.json({
                            message : "Login Successful",
                            token: token,
                            role : user.role,
                        })
                    }

                    else{
                       res.status(401).json({
                        message : "Invalid Password"
                       })
                    }
                }

            }
        ).catch(
            (error)=>{
                console.log(error)
                res.status(500).json({message : "Internal server error"})
            }
        )

}

export function isAdmin(req){
    if(req.user.role == null){
        return false
    }
    if(req.role == "admin"){
        return true
    }else{
        return false
    }
}