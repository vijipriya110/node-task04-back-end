import express from "express";
import dotenv from "dotenv";
import { studentsRouter } from "./Routers/students.js";
import { mentorsRouter } from "./Routers/mentors.js";
import cors from "cors";
import { userRouter } from "./Routers/users.js";
import { isAuthenicated } from "./Authntication/auth.js";
// configure the enviornment
dotenv.config();
const PORT = process.env.PORT

const app = express();
app.use(express.json())//middlewareee
app.use(cors());

app.use("/students",isAuthenicated,studentsRouter)
app.use("/mentors",mentorsRouter)
app.use("/users", userRouter)


// listen to server

app.listen(PORT, ()=>console.log(`Sever started in localhost:${PORT}`))