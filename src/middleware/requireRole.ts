import { Response, NextFunction } from "express";
import { AuthRequest } from "./verifyToken";

export function requireRole(role: "admin" | "student") {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "Insufficient permissions" },
      });
    }
    next();
  };
}
