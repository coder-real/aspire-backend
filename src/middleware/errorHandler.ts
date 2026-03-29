import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export interface AppError extends Error {
  status?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message =
    env.NODE_ENV === "production" && status === 500
      ? "An unexpected error occurred"
      : err.message;

  res.status(status).json({
    success: false,
    error: { code, message },
  });
}
