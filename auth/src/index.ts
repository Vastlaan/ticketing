import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
    if (!process.env.JWT_KEY || !process.env.MONGO_URI) {
        throw new Error("The JWT_KEY environmental varible must be defined");
    }
    try {
        // use mongoose.connect('') for single db or mongoose.createConnection('') for multiple db
        // both take a mongodb:// URI, or the parameters host, database, port, options
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error(err);
    }
    const PORT = 3000 || process.env.PORT;

    app.listen(PORT, () => {
        console.log(`App is listening on port: ${PORT} !`);
    });
};

start();
