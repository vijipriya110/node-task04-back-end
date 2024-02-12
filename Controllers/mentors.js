import { client } from "../db.js";
import { ObjectId } from "bson";


export function getAllMentors(req){
    return client
    .db("basicdata")
    .collection("mentors")
    .find(req.query)
    .toArray()
}

export function getMentorsById(id){
    return client
    .db("basicdata")
    .collection("mentors")
    .findOne({_id: new ObjectId(id)})
}

export function addMentorsData(data){
    return client
    .db("basicdata")
    .collection("mentors")
    .insertOne(data)
    
}

export function updatedMentorsData(id, updatedData){
    return client
    .db("basicdata")
    .collection("mentors")
    .findOneAndUpdate({_id: new ObjectId(id)},{$set:updatedData})

}

export function deleteMentorData(id) {
    return client
    .db("basicdata")
    .collection("mentors")
    .deleteOne({_id: new ObjectId(id)})
}

