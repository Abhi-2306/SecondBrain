import mongoose, { Types } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined");
    }
    await mongoose.connect(process.env.MONGODB_URI);
}


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

const User = mongoose.model("User", userSchema);
module.exports = User;

const tagSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true }
});

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;

const contentTypes = ['image', 'video', 'article', 'audio'];

const contentSchema = new mongoose.Schema({
    link: { type: String, required: true },
    type: { type: String, required: true, enum: contentTypes },
    title: { type: String, required: true, },
    tags: [{ type: Types.ObjectId, ref: 'Tag' }],
    userId: { type: Types.ObjectId, ref: 'User', required: true },
});

const Content = mongoose.model("Content", contentSchema);
module.exports = Content;


const linkSchema = new mongoose.Schema({
    hash: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
});

const Link = mongoose.model("Link", linkSchema);
module.exports = Link;
