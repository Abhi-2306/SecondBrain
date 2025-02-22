import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const userMiddleware: RequestHandler = (req, res, next) => {

    const header = req.headers["authorization"] as string | undefined;
    
    const decoded = jwt.verify(header as string, process.env.JWT_TOKEN as string);
    if (decoded && typeof decoded === 'object') {
        //@ts-ignore
        req.userId = decoded.userId;        
        next();
    } else {
        res.status(403).json({message: "User is not logged in"})
    }
}