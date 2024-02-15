import express from "express";
import { addUser, generateJwtToken,  getToken,  getUser, getUserId, logoutUser, sendEmail,   } from "../Controllers/users.js";
import bcrypt, { compare } from "bcrypt";
import crypto from "crypto";
// import { getTestMessageUrl } from "nodemailer";

const router = express.Router()

router.post("/signup", async (req, res) => {
    try {


        const user = await getUser(req.body.email)

        // create salt value 
        const salt = await bcrypt.genSalt(10);


        if (!user) {
            // encrypt the password by using salt
            const hashedPassword = await bcrypt.hash(req.body.password, salt)

            // to store userInfo by use spread parmeter for password was hashed
            const hashedUser = await { ...req.body, password: hashedPassword }
            // const userInfo = await req.body//(or)

            //to add userInfo to db 
            const result = await addUser(hashedUser)
            return res.status(200).json({
                result, data: "User Added Sucessfully"
                // password : req.body.password,
                // hashedPassword : hashedPassword,
                // salt : salt
                // userInfo : userInfo//(or)
                // userInfo : hashedUser
            })

        }
        return res.status(400).json({ data: "Given email alredy exit" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ data: "Internal server error" })

    }

})

router.post("/login", async (req, res) => {
    try {
        const user = await getUser(req.body.email);
        // is user is valid
        if (!user) {
            return res.status(400).json({ data: "Invalid (mail)Authorization.." })
        }
        // is password is valid
        const validPassword = await bcrypt.compare(req.body.password, user.password)

        if (!validPassword) {
            return res.status(400).json({ data: "Invlid (password)Authorization.." })
        }
        // to generate jwt token
        const token = generateJwtToken(user._id)
        return res.status(200).json({ data: "loged in sucessfully", token: token })

        //to remove token

    } catch (error) {
        console.log(error)
        res.status(500).json({ data: "Internal server error", error: error })

    }
})

router.get("/logout", async (req, res) => {
    try {
        const token = await logoutUser(req.body.token)
        if (token) {
            return res.status(200).json({ data: "token is available", token: token })
        }
        if (!token)
            // const removeToken = await logoutUser(token)
            return res.status(200).json({ data: "removed sucessfully..!" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ data: "Internal server error", error: error })

    }
})

//  router.post("/forgot", async (req, res) => {
//     try {
//         const user = await getUser(req.body.email)
//         if (!user)
//             return res.status(400).send("user with given email doesn't exist");
        
//         const resetToken = await resetPassword(user.email)

//         const reseturl = `${req.protocol}://${req.get('host')}/users/reset/${resetToken}`;

//         const msg = `${reseturl} \n\n url received`

//         sendEmail({
//             email: user.email,
//             subject: "ram password recovery",
//             msg
//         })

//         return res.status(200).json({ data: `email send to ${user.email}` })


//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ data: "Internal server error", error: error })

//     }
// }) 
router.post("/forgotpassword",async(req,res)=>{
try {
      // find user
    const user = await getUser(req.body.email)
    if (!user)
    return res.status(400).send("user with given email doesn't exist");

    //generte  random token
    const restToken = crypto.randomBytes(32)

    const enResetToken = crypto.createHash('sha256').update(restToken).digest('hex')

    // console.log(restToken, enResetToken)
    // const result = await addUser(enResetToken)

    // return res.status(200).json({data:"tnk gen done",enResetToken:enResetToken})

    //link

    const resetUrl = `${req.protocol}://${req.get('host')}/users/forgotpassword/${enResetToken}`;
    console.log(resetUrl)

    const msg = `this is reset url  \n\n${resetUrl}\n\n`

    await sendEmail({
        email: user.email,
        subject:'this is sub',
        msg : msg
        
    });

    return res.status(200).json({data:"the email send"})
    
    
} catch (error) {
    console.log(error)
        res.status(500).json({ data: "Internal server error", error: error })
    
}
})





export const userRouter = router