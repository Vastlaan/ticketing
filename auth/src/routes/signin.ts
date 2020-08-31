import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

const router = express.Router();

router.post("/api/users/signin", (req: Request, res: Response) => {
    res.send("Hi there from sign in process");
});

export { router as SigninRouter };
