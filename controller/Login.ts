import { Request, Response } from "express";
import { userSchema } from "../schema/schema";
import { ApiResponse } from "../utils/apiResponse";
import jwt from "jsonwebtoken";
export const login = async (req: Request, res: Response) => {
  const { username, pin } = req.body;

  try {
    if (!username || !pin) {
      return res.status(400).json({ message: "Username and pin required" });
    }

    const user = await userSchema.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const compare = user.pin === pin;
    if (!compare) {
      return res.status(401).json({ message: "Invalid pin" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    return res
      .status(200)
      .json(ApiResponse(true, "User logged in successfully", { token }));
  } catch (error) {
    return res.status(500).json(ApiResponse(false, "Internal server error"));
  }
};
