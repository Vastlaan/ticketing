import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

let mongo: any;
declare global {
    function signup(): Promise<string[]>;
}


// this function belongs to jest (as it is jest setup file) and is run before any test will begin
beforeAll(async () => {
    // create fake JWT_KEY in process.env
    process.env.JWT_KEY = "8084ewu0r00w";
    //create in memory database
    // *Remember this is because we split index.js and app.js.
    // We only test our app and mongoose is initialized in index.ts file
    mongo = new MongoMemoryServer();
    //retrive its url
    const mongoUri = await mongo.getUri();
    console.log(mongoUri);

    //connect to newly created server
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    //get all the mongo collections and delete data within them
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    //close connection with database
    await mongo.stop();

    await mongoose.connection.close();
});

global.signup = async () => {
    const email = "test@test.com";
    const password = "password";

    const response = await request(app)
        .post("/api/users/signup")
        .send({ email, password })
        .expect(201);
    const cookie = response.get("Set-Cookie");
    return cookie;
};
