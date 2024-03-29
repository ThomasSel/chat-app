import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../../app";
import { connect, disconnect } from "../testHelpers";
import User, { UserDocument } from "../../models/user";

describe("User routes", () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  describe("when a valid user is provided", () => {
    let response: request.Response, newUser: UserDocument | null;
    beforeAll(async () => {
      await User.deleteMany({});
      response = await request(app).post("/users").send({
        email: "test@test.com",
        username: "fakeUsername",
        password: "1234Password1234",
      });
      newUser = await User.findOne();
    });

    it("responds with 201 status code", () => {
      expect(response.statusCode).toEqual(201);
    });

    it("responds with message", () => {
      expect(response.body.message).toEqual("User created");
    });

    it("saves a user with the given email", () => {
      expect(newUser?.email).toEqual("test@test.com");
    });

    it("saves a user with the given username", () => {
      expect(newUser?.username).toEqual("fakeUsername");
    });

    it("saves a user with the given password", async () => {
      const passwordComp = await bcrypt.compare(
        "1234Password1234",
        newUser?.password ?? ""
      );
      expect(passwordComp).toBeTruthy();
    });
  });

  describe("when an invalid user is provided", () => {
    let response: request.Response;
    beforeAll(async () => {
      await User.deleteMany({});
      response = await request(app).post("/users").send({
        email: "",
        username: "",
        password: "",
      });
    });

    it("responds with a 400 status code", () => {
      expect(response.statusCode).toEqual(400);
    });

    it("responds with message", () => {
      expect(response.body.message).toEqual("Error - Invalid details");
    });

    it("doesn't add any users to the collection", async () => {
      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });
});
