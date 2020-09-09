import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { UserExistsError } from "../errors/user-exists-error";
import { requestValidator } from "../middlewares/request-validator";

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
    // logic of validation catched above errors (if exist) moved to middleware requestValidator
    requestValidator,
    async (req: Request, res: Response) => {
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
        // generating jwt takes two arguments, acctually token we want to create, and secret key for future validation
        const userJWT = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_KEY! //exclamation mark inform TS about that this varibale is defined (there is a check condition while app starts up in index.ts)
        );
        // storing jwt to cookie-session object
        req.session = {
            jwt: userJWT,
        };
        //actually saving the created user
        await user.save();
        // returning succesful response
        //  We send user which has the password properity reveald, but this will not be send
        // password and __v are removed from this object (check user model) while sending over JSON and _id is turned to id
        res.status(201).send(user);
    }
);

export { router as SignupRouter };
