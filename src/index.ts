import express, { RequestHandler } from "express";
import mongoose from "mongoose";
import { connectDB, Content, Link, User } from "./db";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import generateToken from "./utils/jwt";
import { userMiddleware } from "./middleware";
import { random } from "./utils/random";


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

app.post("/api/v1/content", userMiddleware, (async (req, res) => {
    
    const { link, type, title } = req.body;
    const content = new Content(
        {
            link: link,
            type: type,
            title: title,
            //@ts-ignore
            userId: req.userId,
            tags: []
        }
    )
    await content.save();
    res.status(200).json({ message:"Content added Successfully"});

}) as RequestHandler)

app.get("/api/v1/content", userMiddleware, async (req, res) => {    
    //@ts-ignore
    const userId = req.userId;
    const content = await Content.find({ userId: userId }).populate("userId", "username");
    res.json({ content });

})

app.delete("/api/v1/content/", (req, res) => {
    const contentId = req.body.contentId;
    Content.deleteMany({
        contentId: contentId,
        //@ts-ignore
        userId:req.userId
    })
    res.status(200).json({message:"Content Deleted Successfully"})
})

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const { share } = req.body;
    if (share) {
        const isLinkExists = await Link.findOne({
            //@ts-ignore
            userId: req.userId
        })

        if (isLinkExists) {
            res.status(200).json({
                hash: isLinkExists.hash
            })
            return;
        }

        if (share) {
            const hash = random(10);
            const link = new Link({
                //@ts-ignore
                userId: req.userId,
                hash: hash,
            })
            await link.save();
            res.status(200).json({
                hash: hash
            })
        } else {
            Link.deleteMany({
                //@ts-ignore
                userId: req.userId
            })
            res.status(200).json({
                message: "Removed Link"
            })
        }
    }
    
    res.status(411).json({ message: "Invalid Input" });
})

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await Link.findOne({
        hash
    })
    if (!link) {
        res.status(411).json({ message: "Invalid Input" })
        return;
    }

    const content = await Content.findOne({
        userId: link.userId
    })

    const user = await User.findOne({
        _id: link.userId
    })

    res.status(200).json({
        username: user?.username,
        content: content
    });
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
