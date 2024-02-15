import { client } from "../db.js";
import jwt from "jsonwebtoken"
import crypto from "crypto-js";
import nodemailer from "nodemailer";


export function getUser(userEmail){
    return client
    .db("basicdata")
    .collection("users")
    .findOne({email:userEmail})
}

export function addUser(userInfo){
    return client
    .db("basicdata")
    .collection("users")
    .insertOne(userInfo)
}

export function generateJwtToken(id){
    return jwt.sign({id}, process.env.SECRETKEY,{expiresIn:"30d"})

}
export function getToken(token){
    return client
    .db("basicdata")
    .collection("users")
    .findOne(token)

}





export function logoutUser(token){
    return client
    .db("basicdata")
    .collection("users")
    .deleteOne(token)

}

export function getUserId(id){
    return client
    .db("basicdata")
    .collection("users")
    .findOne({id})

}

// export function resetPassword(){
    
//     const token = crypto.randomBytes
//     const resetPasswordToken = crypto.createHash
//     return resetPasswordToken, token

    
// }



export const sendEmail = async (options) => {

        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "4f928d6d661db1",
              pass: "9475d405515a1a"
            }
          });
        

          var mailOptions = {
            from: 'youremail@gmail.com',
            to: 'friend@yahoo.com',
            subject: options.subject,
            text: options.msg
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
   
};





