import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

export const requestValidator = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // reading results of validation process
    const errors = validationResult(req);
    // if not empty then not valid
    if (!errors.isEmpty()) {
        // // now when we set up errorHandler middleware we send the request further to the middleware by throwing new error
        // // when new Error is thrown, express passes new function (err, req, res, next) to the next step, which is our errorHandler
        // // whatever message is passed as parameter will be assign to the message properity of err object
        // throw new Error("Invalid email or password");
        throw new RequestValidationError(errors.array());
    }

    next();
};
