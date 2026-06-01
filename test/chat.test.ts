import "dotenv/config";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../app";

// Mock LLMResponse to avoid making external OpenAI calls during tests
vi.mock("../services/agent", () => {
  return {
    LLMResponse: vi.fn().mockResolvedValue("Mocked AI response for testing"),
  };
});

describe("POST /api/chat", () => {
  it("should return a successful response with mock AI answer", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({ question: "Tell me about Ashar's React skills." });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBe("Mocked AI response for testing");
  });

  it("should fail if no question is provided", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Question not found");
  });

  it("should fail if the question exceeds 60 words", async () => {
    const longQuestion = Array(61).fill("word").join(" ");
    const res = await request(app)
      .post("/api/chat")
      .send({ question: longQuestion });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Question cannot exceed 60 words");
  });
});
