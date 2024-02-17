import express from "express";
import { addUser, generateJwtToken, getToken, getUser, sendEmail, updatedUserData, } from "../Controllers/users.js";
import bcrypt, { compare } from "bcrypt";
import crypto from "crypto";
import { Console } from "console";


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
        // find user
        const user = await getUser(req.body.email);

        // is user is valid
        if (!user) {
            return res.status(400).json({ data: "Invalid (mail)Authorization.." })
        }

        // is password is valid
        const validPassword = await bcrypt.compare(req.body.password, user.password)

        // is password is Notvalid
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
        const token = req.headers["x-auth-token"]
        // console.log(token)
        const removeToken =  req.headers[" "]
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

        // find token
        var token = generateJwtToken(user._id)
        if (token) token = undefined;


        //  generte  random token
        const restToken = crypto.randomBytes(32).toString('hex')
        const resetUser = await { ...user._id, restToken: restToken }

        // return res.status(200).json({data:"sucess",resetUser})


        //link

        const resetUrl = `${req.protocol}://${req.get('host')}/users/rest-new-password/${restToken}/${user._id}`;
        console.log(resetUrl);

        const msg = `this is reset url  \n\n${resetUrl}\n\n`

        await sendEmail({
            email: user.email,
            subject: 'this is sub',
            msg: msg

        })

        return res.status(200).json({ data: "Email send Sucessfully" })


    } catch (error) {
        console.log(error)
        res.status(500).json({ data: "Internal server error", error: error })

    }
})

router.post("/rest-new-password/:token/:id", async (req, res) => {
    try {
        // reset link is valid 
        const { resetToken } = req.params

        const reciveToken = await getToken(resetToken);

        if (!reciveToken)
            return res.status(400).send("The link was expired");

        // find user
        const user = await getUser(req.body.email);

        // is user is valid
        if (!user) {
            return res.status(400).json({ data: "Invalid (mail)Authorization.." })
        }
        // to change password here
        user.email = req.body.email
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        user.resetToken = undefined;
        user.passwordChngedAtTime = Date.now();


        // generate has password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const hashedUser = await { ...req.body, password: hashedPassword }

        //if check validpassword by using bcrypt
        const validPassword = await bcrypt.compare(req.body.password, hashedPassword)
        if (!validPassword) {
            return res.status(200).json({ data: "Invlid (password)Authorization.." })
        }
        // to update the reset password
        const { id } = req.params;
        const updatedData = hashedUser;

        if (!id || !updatedData) {
            res.status(400).json({ data: "user not found" })
            return;

        }
        const result = await updatedUserData(id, updatedData)

        const logintoken = generateJwtToken(user._id)
        return res.status(200).json({ data: "Reset Password sucessfully", result, token: logintoken, hashedPassword })

    } catch (error) {
        console.log(error)
        res.status(500).json({ data: "Internal server error", error: error })

    }
})



export const userRouter = router