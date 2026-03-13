import request from "supertest";
import app from "../app.js";

describe("Journal API", () => {

  test("GET / should return API running message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Journal API is running" });
  });

  test("POST /api/journal should create an entry", async () => {
    const res = await request(app)
      .post("/api/journal")
      .send({
        userId: "testuser",
        ambience: "rain",
        text: "Testing journal entry"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.userId).toBe("testuser");
  });

  test("GET /api/journal/:userId should return entries", async () => {
    const res = await request(app).get("/api/journal/testuser");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  test("POST /api/journal should fail without userId", async () => {
  const res = await request(app)
    .post("/api/journal")
    .send({
      text: "Missing userId"
    });

  expect(res.statusCode).toBe(400);
});
test("POST /api/journal/analyze should return cached result second time", async () => {
  const create = await request(app)
    .post("/api/journal")
    .send({
      userId: "cacheUser",
      text: "Walking in nature made me peaceful"
    });

  const journalId = create.body.id;

  const first = await request(app)
    .post("/api/journal/analyze")
    .send({ journalId });

  const second = await request(app)
    .post("/api/journal/analyze")
    .send({ journalId });

  expect(second.body.cached).toBe(true);
});
});