import express from "express";
import { addStudentsData, deleteStudentData, getAllStudents, getStudentById, updatedStudentsData } from "../Controllers/students.js";


const router = express.Router();

//to get student data
router.get("/all",async (req,res)=>{
    try {
        
        if( req.query.experience ){
            req.query.experience = +req.query.experience;
        }
        if( req.query.taskCompletion ){
            req.query.taskCompletion = +req.query.taskCompletion;
        }
        const students = await getAllStudents(req)
        if(students <= 0){
        res.status(400).json({data :"user not fount"})//mistake from .db("bsicdata")
        return;
    }
    res.status(200).json({data:students})
     
    } catch (error) {
        console.log(error)
        res.status(500).json({data:"internal server error"})//mistake from .collection(0)
    }
   

})

// using query params

router.get("/:id",async (req,res)=>{
    try {
        const {id} = req.params;
        const students = await getStudentById(id);
        if(!students){
            res.status(400).json({data :"user not found"})//mistake from .db("bsicdata")
            return;
        }
        res.status(200).json({data:students})
         
        } catch (error) {
            console.log(error)
            res.status(500).json({data:"internal server error"})//mistake from .collection(0)
        }
})

//create new student data
router.post("/add",async (req,res)=>{
    try {
        const newStudent = req.body;
       
        if(!newStudent){
            res.status(400)
            .json({data :"user not found"})//mistake from .db("bsicdata")
            return;
        }
        const result = await addStudentsData(newStudent)
        res.status(200)
        .json({data:{result: result, message: "Added sucessfully"}})
    } catch (error) {
        console.log(error)
        res.status(500)
        .json({data:"internal server error"})//mistake from .collection(0)

        
    }
})
//edit student data

router.put("/edit/:id",async (req,res)=>{
    try {
        const {id} = req.params;
        const updatedData = req.body;
        
        if(!id || !updatedData){
            res.status(400).json({data:"user not found"})
            return;
    
        }
        const result = await updatedStudentsData(id, updatedData)
        res.status(200).json({data:{result: result, message: "Updated sucessfully"}})
    } catch (error) {
        console.log(error)
        res.status(500)
        .json({data:"internal server error"})//mistake from .collection(0)
        
    }

})

// delete a student data by using id 
router.delete("/delete/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        if(!id){
            res.status(400).json({data:"data not found"})
            return;
        }
        const result = await deleteStudentData(id)
        res.status(200).json({data:{result :result,message:"delete sucessfully"}})
    } catch (error) {
        console.log(error)
        res.status(500).json({data:"Internal server error"})
    }
})
export const studentsRouter = router
