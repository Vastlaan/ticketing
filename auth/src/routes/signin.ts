import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { User } from "../models/user";
import { requestValidator } from "../middlewares/request-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";

const router = express.Router();

router.post(
    "/api/users/signin",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Please provide a password"),
    ],
    requestValidator,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        // check if user exists in Database if not throw error
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw new BadRequestError("Invalid credentials");
        }
        // compare passwords (async) using our custom Password.compare method and assign result to boolean variable.
        const passwordsMatch = await Password.compare(
            existingUser.password,
            password
        );
        // if passowrds not matching throw error
        if (!passwordsMatch) {
            throw new BadRequestError("Invalid Credentials");
        }
        // create a token
        const jwtToken = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
            },
            process.env.JWT_KEY!
        );
        // apply jwt to cookie
        req.session = {
            jwt: jwtToken,
        };
        // send it back to client. We send existingUser which has the password properity reveald, but this will not be send
        // password and __v are removed from this object (check user model) while sending over JSON and _id is turned to id
        res.status(200).send(existingUser);
    }
);

export { router as SigninRouter };
