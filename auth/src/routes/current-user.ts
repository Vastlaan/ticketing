import express, { Request, Response } from "express";
import { currentUser } from "@itcontext/ticketing-common";

const router = express.Router();

router.get(
    "/api/users/currentuser",
    currentUser,
    (req: Request, res: Response) => {
        // now as we verified in our currentUser middleware if token at request exists and is valid (or not)
        // we just send the currentUser properity to the client
        res.send({ currentUser: req.currentUser || null });
    }
);

export { router as CurrentUserRouter };
