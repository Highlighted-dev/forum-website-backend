import request from "supertest";
import express from "express";
import sinon from "sinon";
import { describe, expect } from "@jest/globals";
import UserRoute from "./UserRoute";
import userModel from "../models/UserModel";
import discussionModel from "../models/DiscussionModel";
import messageModel from "../models/MessageModel";

const app = express();
app.use(express.json());
app.use(UserRoute);

describe("UserRoute", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should GET all users", async () => {
    const users = [{ name: "Johnny", bio: "Bio" }];
    sinon.stub(userModel, "find").resolves(users);

    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(users);
  });

  it("should GET a user by id", async () => {
    const user = { name: "John", bio: "Bio" };
    sinon.stub(userModel, "findById").resolves(user);

    const res = await request(app).get("/1234567890abcdef12345678");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(user);
  });

  it("should return 400 if wrong id is provided in GET request", async () => {
    const res = await request(app).get("/123");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid id");
  });

  it("should PUT (update) a user", async () => {
    const user = { name: "John", bio: "Bio" };
    sinon.stub(discussionModel, "updateMany").resolves();
    sinon.stub(messageModel, "updateMany").resolves();
    sinon.stub(userModel, "findByIdAndUpdate").resolves(user);

    const res = await request(app).put("/1234567890abcdef12345678").send(user);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(user);
  });

  it("should return 400 if name or bio is not provided in PUT request", async () => {
    const res = await request(app).put("/123").send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Name or bio are required");
  });
  it("should return 400 if name is not valid", async () => {
    const res = await request(app).put("/123").send({ name: "Jo" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Name or bio are required");
  });

  it("should return 500 if there is an error in GET request", async () => {
    sinon.stub(userModel, "find").throws();

    const res = await request(app).get("/");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Failed to retrieve users");
  });

  it("should return 500 if there is an error in PUT request", async () => {
    sinon.stub(discussionModel, "updateMany").resolves();
    sinon.stub(messageModel, "updateMany").resolves();
    sinon.stub(userModel, "findByIdAndUpdate").throws();

    const res = await request(app)
      .put("/123")
      .send({ name: "John", bio: "Bio" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Failed to update user");
  });
});
