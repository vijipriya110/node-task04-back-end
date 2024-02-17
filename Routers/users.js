import express from "express";
import { addUser, generateJwtToken, getToken, getUser, sendEmail, updatedUserData, } from "../Controllers/users.js";
import bcrypt, { compare } from "bcrypt";
import crypto from "crypto";
import { getTestMessageUrl } from "nodemailer";

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
        // const user = await getUser(req.body.email)
        // const {id} = req.params
        // const userId = await getUserById(user._id)

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


    } catch (error) {
        console.log(error)
        res.status(500).json({ data: "Internal server error", error: error })

    }
})

router.get("/logout", async (req, res) => {
    try {
        //find auth token
        const token = req.headers["x-auth-token"];
        // console.log(token)

        // remove auth token
        const removeToken = req.headers[" "];
        console.log(removeToken)

        if (!removeToken)

            return res.status(200).json({ data: "Loggedout sucessfully..!" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ data: "Internal server error", error: error })

    }
})

router.post("/forgotpassword", async (req, res) => {
    try {
        // find user
        const user = await getUser(req.body.email)
        if (!user)
            return res.status(400).send("user with given email doesn't exist");

        var token = generateJwtToken(user._id)
        if (token) token = undefined;

        console.log(token)

        //  generte  random token

        const restToken = crypto.randomBytes(32).toString('hex')
        const resetUser = await { ...user._id, restToken: restToken }

        // return res.status(200).json({data:"sucess",resetUser})

        //link
        const resetUrl = `${req.protocol}://${req.get('host')}/users/reset-new-password/${restToken}/${user._id}`;
        console.log(resetUrl);

        const msg = `this is reset url  \n\n${resetUrl}\n\n`
        await sendEmail({
            email: user.email,
            subject: 'this is sub',
            msg: msg

        })
        return res.status(200).json({ data: "Mail send sucessfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ data: "Internal server error", error: error })
    }
})

router.post("/reset-new-password/:token/:id", async (req, res) => {
    try {
        // check the reset token is valid
        const { resetToken } = req.params

        const reciveToken = await getToken(resetToken);
        if (!reciveToken)

            return res.status(400).send("link was expired");

        const user = await getUser(req.body.email);

        // is user is valid
        if (!user) {
            return res.status(400).json({ data: "Invalid (mail)Authorization.." })
        }
        
        //to change the new password

        user.email = req.body.email
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        user.resetToken = undefined;
        user.passwordChngedAtTime = Date.now();


        //to generate hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const hashedUser = await { ...req.body, password: hashedPassword }

        const validPassword = await bcrypt.compare(req.body.password, hashedPassword)
        if (!validPassword) {
            return res.status(200).json({ data: "Invlid (password)Authorization.." })
        }
        //update the newpassword 
        const { id } = req.params;
        const updatedData = hashedUser;

        if (!id || !updatedData) {
            res.status(400).json({ data: "user not found" })
            return;

        }
        const result = await updatedUserData(id, updatedData)

        const logintoken = generateJwtToken(user._id)
        return res.status(200).json({ data: "reset sucessfully..!", result, token: logintoken, hashedPassword })



    } catch (error) {
        console.log(error)
        res.status(500).json({ data: "Internal server error", error: error })

    }
})

// router.get("/updatepassword",async(req,res)=>{
//     try {

//         const user = await getUser(req.)
//         if(!user){
//             return res.status(400).send("user doesn't exist");
//         }


//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ data: "Internal server error", error: error })

//     }
// })



export const userRouter = router