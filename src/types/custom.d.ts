import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string }; // JWT'deki user bilgisi
    }
  }
}
