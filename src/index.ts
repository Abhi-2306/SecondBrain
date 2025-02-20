import express, { RequestHandler } from "express";
import mongoose from "mongoose";
import { connectDB, User } from "./db";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import generateToken from "./utils/jwt";


dotenv.config();

const app = express();

app.use(express.json());


 connectDB();


app.post("/api/v1/signup", (async (req, res) => {

    try {
        const { username, password } = req.body;
    
        if (username.length < 3 || username.length > 10) {
            return res.status(411).json({ message: "Username length should be 3-10 characters long" });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        if (!passwordRegex.test(password)) {
            return res.status(411).json({
                message: "Password must be 8-20 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            });
        }
    
        const isUserExists = await User.findOne({ username });
        if (isUserExists) {
            return res.status(403).json({ message: "Username already exists" });
        }
        if (!process.env.SALT) {
            throw new Error("SALT is not found");
        }
        const salt: number = parseInt(process.env.SALT);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ username: username, password: hashedPassword });
        await user.save();
        res.status(200).json({ message: "Signup Successfull" });
    }
    catch (e) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}) as RequestHandler)

app.post("/api/v1/signin",(async (req, res) => {
    try {
        const { username, password } = req.body;

        if (username.length < 3 || username.length > 10) {
            return res.status(411).json({ message: "Username length should be 3-10 characters long" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(403).json({ message: "User doesn't exit" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(403).json({ message: "Invalid Password" });
        }

        const token = generateToken(user._id.toString());
        
        res.cookie("jwt", token, {
            httpOnly: true,   
            expires: new Date(Date.now() + 3600000),
        });
        res.status(200).json({ message: "Login Successful" });

    }
    catch (e) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
})as RequestHandler)

app.post("/api/v1/content",(async (req, res) => {
    
}) as RequestHandler)

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
