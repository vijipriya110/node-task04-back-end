import jwt from "jsonwebtoken";

export async function isAuthenicated (req,res,next){
    const token = req.headers["x-auth-token"]
        // console.log("token....",token)
        if(!token){
            return res.status(400).json({data:"Invalid athorization"})
        }
        jwt.verify(token, process.env.SECRETKEY)
        next()

        


}
