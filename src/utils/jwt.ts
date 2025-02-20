import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (userId: string) => {
    if (!process.env.JWT_TOKEN) {
        throw new Error("JWT Token not found");
    }
    return jwt.sign({ userId }, process.env.JWT_TOKEN, { expiresIn: "1h" });
}

export default generateToken;