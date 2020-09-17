import request from "supertest";
import { app } from "../../app";

it("Returns status 201 on request to signup route with valid credentials", async () => {
    // below code is depends on supertest implementation when returning request jest will automaticlly await it
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "michal@kungfu.it",
            password: "kalabonge2",
        })
        .expect(201);
});
it("Returns status 400 on request to signup route with invalid email", async () => {
    // below code is depends on supertest implementation when returning request jest will automaticlly await it
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "kungfu.it",
            password: "kalabonge2",
        })
        .expect(400);
});
it("Returns status 400 on request to signup route with invalid password", async () => {
    // below code is depends on supertest implementation when returning request jest will automaticlly await it
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "michal@kungfu.it",
            password: "ka",
        })
        .expect(400);
});
it("Returns status 400 on request without credentials", async () => {
    // no password
    await request(app).post("/api/users/signup").send({
        email: "dkfj@tiie.ee",
    });
    // no email
    return request(app)
        .post("/api/users/signup")
        .send({
            password: "kadfdsdfsf",
        })
        .expect(400);
});

it("Disallows duplicate email", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(201);
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "sometpass",
        })
        .expect(409);
});

it("Checks the Set-Cookie header is send back after login", async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(201);
    // retrive Set-Cookie header with get method and expect to be defined
    expect(response.get("Set-Cookie")).toBeDefined();
});
