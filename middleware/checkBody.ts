import { NextFunction, Request, Response } from "express";

export const CheckBody = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ success: false, message: "body is required" });
  }
  next();
};
