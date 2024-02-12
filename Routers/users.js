import express from "express";
import { addUser, generateJwtToken, getUser } from "../Controllers/users.js";
import bcrypt, { compare } from "bcrypt";

const router = express.Router()

router.post("/signup",async(req,res)=>{
    try {
        
        
        const user = await getUser(req.body.email)
        
        // create salt value 
        const salt = await bcrypt.genSalt(10); 


        if(!user){
            // encrypt the password by using salt
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // to store userInfo by use spread parmeter for password was hashed
        const hashedUser = await {...req.body, password:hashedPassword}
        // const userInfo = await req.body//(or)

        //to add userInfo to db 
        const result = await addUser(hashedUser)
            return res.status(200).json({result, data:"User Added Sucessfully"
            // password : req.body.password,
            // hashedPassword : hashedPassword,
            // salt : salt
            // userInfo : userInfo//(or)
            // userInfo : hashedUser
        })
            
        }
        return res.status(400).json({data:"Given email alredy exit"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({data:"Internal server error"})
        
    }

})

router.post("/login", async(req,res)=>{
    try {
        const user = await getUser(req.body.email);
        // is user is valid
        if(!user){
            return res.status(400).json({data:"Invalid (mail)Authorization.."})
        }
        // is password is valid
        const validPassword = await bcrypt.compare(req.body.password, user.password)

        if(!validPassword){
            return res.status(400).json({data:"Invlid (password)Authorization.."})
        }
        // to generate jwt token
        const token = generateJwtToken(user._id)
            return res.status(200).json({data:"loged in sucessfully",token : token})

        
       
    } catch (error) {
        console.log(error)
        res.status(500).json({data:"Internal server error", error : error})
        
    }
})

export const userRouter = router