import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


const Authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid token format. Use 'Bearer <token>'" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token not provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as string;
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        next();
    } catch (error) {
        console.error("Error authenticating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export default Authenticate