import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

// express recognize number of parameters passed to the middleware
// and in case there are 4 params it assumes it is an error handler
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({
            errors: err.serializeErrors(),
        });
    }

    // in case of other type of error, probably internal server error
    return res.status(500).send({
        errors: [
            {
                message: "Ups, something went wrong", // or err.message if this error comes from throw new Error('some msg')
            },
        ],
    });
};
