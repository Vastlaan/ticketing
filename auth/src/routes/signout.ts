import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
    // destroy cookies session and dump all contained data
    req.session = null;

    res.send({});
});

export { router as SignoutRouter };
