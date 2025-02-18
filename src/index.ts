import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./db";
import dotenv from "dotenv";


dotenv.config();

const app = express();

app.use(express.json());


//db password:1uTd2RN67C9l07iN
connectDB();


app.post("/api/v1/signup", (req, res) => {
    
})

app.post("/api/v1/signin", (req, res) => {

})

app.post("/api/v1/content", (req, res) => {

})

app.get("/api/v1/content", (req, res) => {

})

app.delete("/api/v1/content/", (req, res) => {

})

app.post("/api/v1/brain/share", (req, res) => {

})

app.get("/api/v1/brain/:shareLink", (req, res) => {

})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
