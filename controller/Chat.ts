import { Request, Response } from "express";
import { LLMResponse } from "../services/agent";
import { ApiResponse } from "../utils/apiResponse";

export const PostChatQuestion = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) {
      throw new Error("Question not found");
    }
    const words = question.trim().split(/\s+/).filter(Boolean);
    if (words.length > 60) {
      throw new Error("Question cannot exceed 60 words");
    }
    const response = await LLMResponse(question);
    const resp = ApiResponse(true, "Response fetched successfully", response);
    return res.status(200).json(resp);
  } catch (error) {
    const resp =
      error instanceof Error
        ? ApiResponse(false, error.message)
        : ApiResponse(false, "Internal server error");
    return res.status(400).json(resp);
  }
};
