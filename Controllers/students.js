import { client } from "../db.js";
import { ObjectId } from "bson";




export function getAllStudents(req){
    return client
    .db("basicdata")
    .collection("students")
    .find(req.query)
    .toArray()
} 


export function getStudentById(id){
    return client
    .db("basicdata")
    .collection("students")
    .findOne({_id: new ObjectId(id)})
}

export function addStudentsData(data){
    return client
    .db("basicdata")
    .collection("students")
    .insertOne(data)
    
 
}

export function updatedStudentsData(id, updatedData){
    return client
    .db("basicdata")
    .collection("students")
    .findOneAndUpdate({_id: new ObjectId(id)},{$set:updatedData})

}

export function deleteStudentData(id) {
    return client
    .db("basicdata")
    .collection("students")
    .deleteOne({_id: new ObjectId(id)})
}