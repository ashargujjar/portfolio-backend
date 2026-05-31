import { Request, Response } from "express";
import UploadSkill from "../model/upload";
import { ApiResponse } from "../utils/apiResponse";
import { generateId, ragQueue } from "../services/que";

export const uploadKnowledgePdf = async (req: Request, res: Response) => {
  try {
    const { secure_url, public_id } = req.body;

    if (!secure_url || !public_id) {
      throw new Error("secure_url and public_id are required");
    }
    const job = await ragQueue.add("process-for-rag", {
      cloudinaryUrl: secure_url,
      documentId: generateId(),
      uploadedAt: new Date().toISOString(),
    });
    const pdf = new UploadSkill(secure_url, public_id);
    const exists = await pdf.exists();

    if (exists) {
      const deleted = await UploadSkill.deletePdf(exists.publicId);
      if (!deleted) {
        throw new Error("Failed to delete existing knowledge PDF");
      }
    }

    const saved = await pdf.save();
    const response = ApiResponse(
      true,
      "Knowledge PDF saved successfully",
      saved,
    );
    return res.status(201).json(response);
  } catch (error) {
    const response =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(response);
  }
};
export const deletePdf = async (req: Request, res: Response) => {
  try {
    let { public_id } = req.body;

    if (!public_id) {
      const pdf = await UploadSkill.getPdf();
      if (!pdf) {
        throw new Error("No knowledge PDF found to delete");
      }
      public_id = pdf.publicId;
    }

    const deleted = await UploadSkill.deletePdf(public_id);
    if (!deleted) {
      throw new Error("Failed to delete knowledge PDF");
    }

    const response = ApiResponse(
      true,
      "Knowledge PDF deleted successfully",
      deleted,
    );
    return res.status(200).json(response);
  } catch (error) {
    const response =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(response);
  }
};
export const getPdf = async (req: Request, res: Response) => {
  try {
    const pdf = await UploadSkill.getPdf();
    if (!pdf) {
      return res.status(404).json(ApiResponse(false, "No knowledge PDF found"));
    }
    const response = ApiResponse(
      true,
      "Knowledge PDF fetched successfully",
      pdf,
    );
    return res.status(200).json(response);
  } catch (error) {
    const response =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(response);
  }
};
