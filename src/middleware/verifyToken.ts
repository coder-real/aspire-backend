import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: {
        code: "MISSING_TOKEN",
        message: "Authorization header required",
      },
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: { code: "INVALID_TOKEN", message: "Token is invalid or expired" },
    });
  }
}
