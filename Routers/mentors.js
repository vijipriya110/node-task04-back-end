import express from "express";
import { addMentorsData, deleteMentorData, getAllMentors, getMentorsById, updatedMentorsData } from "../Controllers/mentors.js";

const router = express.Router();

//to get all mentors data
router.get("/all",async (req,res)=>{
    try {
        const mentors = await getAllMentors(req)
        if(mentors <= 0){
            res.status(400).json({data:"user not found"})
            return;
        }
        res.status(200).json({data:mentors})
    } catch (error) {
        console.log(error)
        res.status(500).json({data:"Internal server error"})
    }
})


// using query params

router.get("/:id",async (req,res)=>{
    try {
        const {id} = req.params;
        const mentors = await getMentorsById(id);
        // console.log(mentors)
        if(!mentors){
            res.status(400).json({data:"user not found"})
            return;
        }
        res.status(200).json({data:mentors})

    } catch (error) {
        console.log(error)
        res.status(500).json({data:"Internal server error"})
        
    }
})

// create new mentors data

router.post("/add",async (req,res)=>{
    try {
        const newMentor = req.body;
       
        if(!newMentor){
            res.status(400)
            .json({data :"user not found"})//mistake from .db("bsicdata")
            return;
        }
        const result = await addMentorsData(newMentor)
        res.status(200)
        .json({data:{result: result, message: "Added sucessfully"}})
    } catch (error) {
        console.log(error)
        res.status(500)
        .json({data:"internal server error"})//mistake from .collection(0)

        
    }
})

//edit mentor data by id and body

router.put("/edit/:id",async (req,res)=>{
    try {
        const {id} = req.params;
        const updatedData = req.body;
        
        if(!id || !updatedData){
            res.status(400).json({data:"user not found"})
            return;
    
        }
        const result = await updatedMentorsData(id, updatedData)
        res.status(200).json({data:{result: result, message: "Updated sucessfully"}})
    } catch (error) {
        console.log(error)
        res.status(500)
        .json({data:"internal server error"})//mistake from .collection(0)
        
    }

})

// delete a mentor data by using id

router.delete("/delete/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        if(!id){
            res.status(400).json({data:"data not found"})
            return;
        }
        const result = await deleteMentorData(id)
        res.status(200).json({data:{result :result,message:"delete sucessfully"}})
    } catch (error) {
        console.log(error)
        res.status(500).json({data:"Internal server error"})
    }
})

export const mentorsRouter = router
