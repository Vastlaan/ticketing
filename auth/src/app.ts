import express from "express";
import { json } from "body-parser";
import "express-async-errors"; //handles asynchronous errors as syncronous
import cookieSession from "cookie-session";
import { CurrentUserRouter } from "./routes/current-user";
import { SignupRouter } from "./routes/signup";
import { SigninRouter } from "./routes/signin";
import { SignoutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
// express trust nginx proxy
app.set("trust proxy", true);

app.use(json());
app.use(
    cookieSession({
        // turn out the encryption of the cookie (JWT is already encrypted) to simplify reading it accross multiple services running different languages
        signed: false,
        // require https connection to use the cookie
        secure: true,
    })
);

app.use(CurrentUserRouter);
app.use(SigninRouter);
app.use(SignoutRouter);
app.use(SignupRouter);

// app.all listens to all type of http requests; thanks to express-async-errors we don't have to handle async errors ourselves
app.all("*", async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
