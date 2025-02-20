import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["authorization"] as string | undefined;
        if (!token) return res.status(401).json({ message: "No token available" });
        if (!process.env.JWT_TOKEN) return res.status(401).json({ message: "No jwt secret key" });
        const decoded = jwt.verify(token, process.env.JWT_TOKEN as string);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(403).json({ message: "Invalid Token" });
    }
}