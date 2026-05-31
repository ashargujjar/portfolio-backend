import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import app from "../app";
import { generateCloudinarySecret } from "../utils/cloudinarySignature";
import * as cloudinarySignatureModule from "../utils/cloudinarySignature";

describe("------ generateCloudinarySecret()-----", () => {
  it("it should generwate the signature of the cloudinary", async () => {
    const timeStamp = Math.round(new Date().getTime() / 1000);

    const secret = generateCloudinarySecret(timeStamp);
    expect(secret).toBeDefined();
  });
});

describe("------ POST /api/uploads/signature -----", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the Cloudinary signature payload with a timestamp field", async () => {
    vi.spyOn(
      cloudinarySignatureModule,
      "generateCloudinarySecret",
    ).mockReturnValue("signed-payload");

    process.env.CLOUDINARY_CLOUD_NAME = "demo-cloud";
    process.env.CLOUDINARY_API_KEY = "demo-key";
    process.env.CLOUDINARY_FOLDER = "knowledge-base";

    const response = await request(app).post("/api/uploads/signature");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "signature fetched successfully",
      data: {
        timestamp: expect.any(Number),
        signature: "signed-payload",
        cloudName: "demo-cloud",
        apiKey: "demo-key",
        folder: "knowledge-base",
      },
    });
    expect(response.body.data).not.toHaveProperty("timeStamp");
  });
});
