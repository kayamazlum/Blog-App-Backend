import { RequestHandler, Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/config";

export const verifyToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ error: "Access Denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;

    if (typeof decoded === "object" && "id" in decoded) {
      req.user = { id: decoded.id as string };
    } else {
      throw new Error("Invalid token payload.");
    }
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};
