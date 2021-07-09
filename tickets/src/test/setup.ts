import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from 'jsonwebtoken'

let mongo: any

declare global {
    namespace NodeJS {
        interface GlobalThis {
            signup(): Promise<string[]>;
        }
    }
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


export const signup = () => {

    // Build a JWT payload
    const email = "test@test.com";
    const id = new mongoose.Types.ObjectId().toHexString()
    const payload = {email, id}

    // create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!)

    // build session object
    const session = {jwt: token}

    // turn it into json
    const jsonSession = JSON.stringify(session)

    // enconde JSON into base64
    const base64 = Buffer.from(jsonSession,).toString('base64')

    // return cookie with appropriate format
    const cookie = `express:sess=${base64}`
    return cookie;
  };