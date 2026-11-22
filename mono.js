import express from 'express';
import {MongoClient.ObjectId} from 'mongodb';
const MONGO_URI="mongodb://admin:admin123@localhost:27017";
const dbName="booksDB";
const client = new MongoClient(MONGO_URI);
let db;
client.connect().then(1)=>{
    db=client.db(dbName);
    console.log("Connected to database:${dbName}");
}.catch(err=>{
    console.error("failed to connect to the database",err);
});
const app=express();
app.use(express.json());
app.post("/api/v1/books",(req,res)=>{
        db.collection("books").insertOne(req.body).then(result=>{
            res.status(201).json({message:"Book created successfully",data:{_id:result.insertedId,...req.body}})
            }).catch(err=>{
                res.status(500).json({message:"Failed to create book",error:err.message});
            }       
        
});
app.get("/api/v1/books",(req,res)=>{
    const {category}=req.query;
    const query=category?{category}: {};
    db.collection("books").find(query).toArray().then(result=>{
        res.status(200).json({message:"Books fetched successfully",data:result})
    }).catch(err=>{
        res.status(500).json({message:"Problem in fetching books",error:err.message});
    })
});
app.get("/api/v1/books/:id",(req,res)=>{
    const {id}=req.params;  
    db.collection("books").findOne({_id:new ObjectId(id)}).then(result=>{
        if(!result){
            return res.status(404).json({message:"Book not found"});
        }
        res.status(200).json({message:"Book fetched successfully",data:result});
    }).catch(err=>{
        res.status(500).json({message:"Problem in fetching book details",error:err.message});
    })
});
app.put("/api/v1/books/:id",(req,res)=>{
    const {id}=req.params; 
    const updatedBooks=req.body;
    db.collection("books").updateOne({_id:new ObjectId(id)},{$set:updatedBooks}).then(result=>{
        if(result.matchedCount===0){
            return res.status(404).json({message:"Book not found"});
        }
        res.status(200).json({message:"Book updated successfully",data:{...updatedBooks,_id:new ObjectId(id)}});
    }).catch(err=>{
        res.status(500).json({message:"Problem in updating book",error:err.message});
    })
});
