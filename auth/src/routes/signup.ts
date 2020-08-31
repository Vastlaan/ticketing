import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { RequestValidationError } from "../errors/request-validation-error";
import { UserExistsError } from "../errors/user-exists-error";

const router = express.Router();

router.post(
    "/api/users/signup",
    //validating request with express-validator (body function comes out there)
    [
        body("email").isEmail().withMessage("Email is not valid"),
        body("password")
            .trim()
            .isLength({ min: 6, max: 20 })
            .withMessage("Password must be between 6 and 20 characters."),
    ],
    async (req: Request, res: Response) => {
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
        //retriving already validated email and password
        const { email, password } = req.body;
        //check if user already exitsts
        const existingUser = await User.findOne({ email });
        // if not exists than existingUser is null
        console.log(existingUser);
        if (existingUser) {
            throw new UserExistsError();
        }
        //creating user
        const user = User.build({ email, password });
        // generating jwt
        const userJWT = jwt.sign(
            { id: user.id, email: user.email },
            "jfj020jofjWREW39392jewjejow"
        );
        // storing jwt to cookie-session object
        req.session = {
            jwt: userJWT,
        };
        //actually saving the created user
        await user.save();
        // returning succesful response
        res.status(201).end();
    }
);

export { router as SignupRouter };
