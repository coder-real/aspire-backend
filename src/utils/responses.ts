import { Response } from "express";

export function success<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function fail(
  res: Response,
  code: string,
  message: string,
  status: number,
) {
  return res.status(status).json({
    success: false,
    error: { code, message },
  });
}
