import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
    email: string;
    id: string;
}
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // check if actual token on cookie session exists
    // TS must know if there is session object on request, if we forget to implement the cookie-session middleware
    // if(!req.session){
    //     throw new BadRequestError('Ups, something went wrong.')
    // }
    // but we can shortcut it by using ? on session properity like this: req.session?.jwt
    if (!req.session?.jwt) {
        return next();
    }
    try {
        const payload = jwt.verify(
            req.session.jwt,
            process.env.JWT_KEY!
        ) as UserPayload;
        req.currentUser = payload;
    } catch (e) {}

    return next();
};
