import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import OTP from "../models/otp.js";
import nodemailer from "nodemailer";
import axios from "axios";

dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port : 587,
    secure: false,
    auth: {
        user: "kanishkarathnayaka2021@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD
    }
})
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
                        } , process.env.JWT_SECRET,
                    )

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

export function getUser(req , res){
    if(req.user == null){
        res.status(401).json({message:"Unotherized"})
        return;
    }
    res.json({
        email : req.user.email,
        firstName : req.user.firstName,
        lastName : req.user.lastName,
        role : req.user.role,
        image : req.user.image,
        isEmailVerified : req.user.isEmailVerified
    })
}

export async function updateUserProfile(req , res){

    if(req.user == null){
        res.status(401).json({message : "Unathorized"})
        return;
    }
    try{

    await User.updateOne({email : req.user.email}, {firstName : req.body.firstName, lastName : req.body.lastName, image : req.body.image})

    const user = await User.findOne({email : req.user.email})
    const token = jwt.sign({
                            email : user.email,
                            firstName : user.firstName,
                            lastName : user.lastName,
                            role : user.role,
                            image : user.image,
                            isEmailVerified : user.isEmailVerified
                        } , process.env.JWT_SECRET,
                    );  

    res.json({message: "profile update successfull", token: token}) 
                    
    }catch(error){
        res.status(500).json({message : "Error updating profile",error : error})
    }
}

export async function changePassword(req , res){

    if(req.user == null){
        res.status(401).json({message : "Unathorized"})
        return;
    }

    try{

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);

        await User.updateOne({email : req.user.email}, {password : hashedPassword})
        res.status(200).json({message : "Password changed successfully"})

    }catch(error){
        res.status(500).json({message : "Error changing password",error : error})
    }
}

export function isAdmin(req){
    if(req.user == null){
        return false
    }
    if(req.user.role == "admin"){
        return true
    }else{
        return false
    }
}

export async function sendOTP(req, res){
    
    try{
        const user = await User.findOne({email: req.body.email})

        if(user == null){
            res.status(404).json({message:"User with given email not found"})
            return;
        }

        //Genarete Random Number here
        //OTP between 10000 and 99999

        const otp = Math.floor(10000 + Math.random() * 90000)

        await OTP.deleteMany({email : req.body.email})

        const newOTP = new OTP({
            email : req.body.email,
            otp : otp
        })

        await newOTP.save();

        const message = {
            from : "kanishkarathnayaka2021@gmail.com",
            to : req.body.email,
            subject : "Your OTP for password reset",
            text : "Your OTP for Password reset is "+otp +". It is valide for 10 Minites." 
        }

        transporter.sendMail(message, (error, info) =>{
            if(error){
                console.log("Error sending email", error)
                res.status(500).json({message:"Error sending OTP", error: error})
            }else{
                console.log("Email send successfully", info.response)
                res.json({message:"OTP send successfully"})
            }
        })

    }catch(error){
        res.status(500).json({message:"Error sending OTP", error : error})
    }

}

export async function verifyOTP(req, res){

    try{
        const otpCode = req.body.otp
        const email = req.body.email
        const newPassword = req.body.newPassword

        const otpRecord = await OTP.findOne({email : email})

        if(otpRecord == null){
            res.status(404).json({message :"OTP not found for the given email"})
            return
        }

        if(otpRecord.otp != otpCode){
            res.status(400).json({message :"Invalide OTP"})
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        await User.updateOne({email : email}, {password : hashedPassword})

        await OTP.deleteOne({email : email})

        res.json({message : "Password reset successfully"})

    }catch(error){
        res.status(500).json({message:"Error verifying OTP",error: error})
    }
}

export async function googlelogin(req, res){
    try{

        const googleresponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
            headers: {
                Authorization: "Bearer "+req.body.token
            }
        })

        console.log(googleresponse)

        const user = await User.findOne({email : googleresponse.data.email})

        if(user == null){
            const newUser = new User({
                email: googleresponse.data.email,
                firstName: googleresponse.data.given_name,
                lastName: googleresponse.data.family_name,
                password: "google-login",
                image: googleresponse.data.picture,
                isEmailVerified: true
            })
            await newUser.save();

            const token = jwt.sign(
                        {
                            email : newUser.email,
                            firstName : newUser.firstName,
                            lastName : newUser.lastName,
                            role : newUser.role,
                            image : newUser.image,
                            isEmailVerified : newUser.isEmailVerified
                        } , 
                        process.env.JWT_SECRET,
                    );  
        }else{
            const token = jwt.sign({
                            email : user.email,
                            firstName : user.firstName,
                            lastName : user.lastName,
                            role : user.role,
                            image : user.image,
                            isEmailVerified : user.isEmailVerified
                        } , process.env.JWT_SECRET,
                    );
                    res.json({
                        message:"Login Successfull",
                        token: token,
                        role: user.role
                    });
                }
    }catch(error){
        res.status(500).json({message: "Error login with google", error: error})
    }
}