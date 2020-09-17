import { app } from "../../app";
import request from "supertest";

it("Checks if the signup is possible with valid credentials", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(201);
    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(200);
    expect(response.get("Set-Cookie")).toBeDefined();
});
it("Checks if the signup is not possible with invalid credentials", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(201);
    // invalid password
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "passwordssee",
        })
        .expect(400);
    // invalid email
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@tet.com",
            password: "password",
        })
        .expect(400);
});
