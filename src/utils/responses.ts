import { Response } from "express";

export function success<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function error(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: Array<{ field: string; message: string }>,
) {
  const body: Record<string, unknown> = { success: false, error: { code, message } };
  if (details) (body.error as Record<string, unknown>).details = details;
  return res.status(status).json(body);
}

// Alias kept for any existing callers
export const fail = (
  res: Response,
  code: string,
  message: string,
  status: number,
) => error(res, status, code, message);
