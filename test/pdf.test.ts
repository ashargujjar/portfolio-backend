import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../app";
import UploadSkill from "../model/upload";

vi.mock("../middleware/Authenticate", () => ({
  default: (req: any, res: any, next: any) => next(),
}));

vi.mock("../model/upload", () => {
  const mockExists = vi.fn();
  const mockSave = vi.fn();
  class MockUploadSkill {
    publicUrl: string;
    publicId: string;
    constructor(publicUrl: string, publicId: string) {
      this.publicUrl = publicUrl;
      this.publicId = publicId;
    }
    exists = mockExists;
    save = mockSave;
    static getPdf = vi.fn();
    static deletePdf = vi.fn();
  }
  return {
    default: MockUploadSkill,
  };
});

describe("PDF Upload, Get, and Delete Endpoints", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/uploads/knowledge-pdf", () => {
    it("should return 200 and PDF info if it exists", async () => {
      const mockPdf = { publicUrl: "https://res.cloudinary.com/pdf", publicId: "pdf-123" };
      (UploadSkill.getPdf as any).mockResolvedValue(mockPdf);

      const response = await request(app).get("/api/uploads/knowledge-pdf");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Knowledge PDF fetched successfully",
        data: mockPdf,
      });
      expect(UploadSkill.getPdf).toHaveBeenCalledTimes(1);
    });

    it("should return 404 if no PDF exists", async () => {
      (UploadSkill.getPdf as any).mockResolvedValue(null);

      const response = await request(app).get("/api/uploads/knowledge-pdf");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("No knowledge PDF found");
    });
  });

  describe("POST /api/uploads/knowledge-pdf", () => {
    it("should return 400 if secure_url or public_id is missing", async () => {
      const response = await request(app)
        .post("/api/uploads/knowledge-pdf")
        .send({ secure_url: "https://res.cloudinary.com/pdf" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should delete existing and save new PDF successfully", async () => {
      const mockInstance = new UploadSkill("https://res.cloudinary.com/pdf", "pdf-123");
      (mockInstance.exists as any).mockResolvedValue({ publicId: "old-pdf-123" });
      (UploadSkill.deletePdf as any).mockResolvedValue({ publicId: "old-pdf-123" });
      const mockSaved = { publicUrl: "https://res.cloudinary.com/pdf", publicId: "pdf-123" };
      (mockInstance.save as any).mockResolvedValue(mockSaved);

      const response = await request(app)
        .post("/api/uploads/knowledge-pdf")
        .send({ secure_url: "https://res.cloudinary.com/pdf", public_id: "pdf-123" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: "Knowledge PDF saved successfully",
        data: mockSaved,
      });
      expect(UploadSkill.deletePdf).toHaveBeenCalledWith("old-pdf-123");
    });
  });

  describe("DELETE /api/uploads/knowledge-pdf", () => {
    it("should delete by public_id from req.body if provided", async () => {
      const mockDeleted = { publicUrl: "https://res.cloudinary.com/pdf", publicId: "pdf-123" };
      (UploadSkill.deletePdf as any).mockResolvedValue(mockDeleted);

      const response = await request(app)
        .delete("/api/uploads/knowledge-pdf")
        .send({ public_id: "pdf-123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Knowledge PDF deleted successfully",
        data: mockDeleted,
      });
      expect(UploadSkill.deletePdf).toHaveBeenCalledWith("pdf-123");
    });

    it("should query current PDF and delete it if no public_id in req.body", async () => {
      const mockCurrent = { publicUrl: "https://res.cloudinary.com/pdf", publicId: "pdf-456" };
      (UploadSkill.getPdf as any).mockResolvedValue(mockCurrent);
      (UploadSkill.deletePdf as any).mockResolvedValue(mockCurrent);

      const response = await request(app)
        .delete("/api/uploads/knowledge-pdf")
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(UploadSkill.getPdf).toHaveBeenCalledTimes(1);
      expect(UploadSkill.deletePdf).toHaveBeenCalledWith("pdf-456");
    });

    it("should return 400 if deletion fails", async () => {
      (UploadSkill.deletePdf as any).mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/uploads/knowledge-pdf")
        .send({ public_id: "pdf-error" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
