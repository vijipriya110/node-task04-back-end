import { client } from "../db.js";
import jwt from "jsonwebtoken"


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