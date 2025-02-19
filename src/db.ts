import mongoose, { Types } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("Error: MONGODB_URI is not defined in .env");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

export const User = mongoose.model("User", userSchema);

const tagSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true }
});

export const Tag = mongoose.model("Tag", tagSchema);

const contentTypes = ['image', 'video', 'article', 'audio'];

const contentSchema = new mongoose.Schema({
    link: { type: String, required: true },
    type: { type: String, required: true, enum: contentTypes },
    title: { type: String, required: true, },
    tags: [{ type: Types.ObjectId, ref: 'Tag' }],
    userId: { type: Types.ObjectId, ref: 'User', required: true },
});

export const Content = mongoose.model("Content", contentSchema);


const linkSchema = new mongoose.Schema({
    hash: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
});

export const Link = mongoose.model("Link", linkSchema);
