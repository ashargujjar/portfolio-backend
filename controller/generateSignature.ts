import { Request, Response } from "express";
import { generateCloudinarySecret } from "../utils/cloudinarySignature";

export const generateSignature = async (req: Request, res: Response) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = generateCloudinarySecret(timestamp);

    res.status(200).json({
      success: true,
      message: "signature fetched successfully",
      data: {
        timestamp,
        signature,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder: process.env.CLOUDINARY_FOLDER,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate signature",
    });
  }
};
