import request from "supertest";
import { app } from "../../app";

it("Checks the returned current user object after sending req with valid cookie", async () => {
    // this signup helper function is declared in test/setup.ts file
    const cookie = await global.signup();

    const response = await request(app)
        .get("/api/users/currentuser")
        .set("Cookie", cookie)
        .send()
        .expect(200);
    expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("Checks the returned current user is null after unauthenticated request", async () => {
    const response = await request(app)
        .get("/api/users/currentuser")
        .send()
        .expect(200);
    expect(response.body.currentUser).toEqual(null);
});
