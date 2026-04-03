import { Response, NextFunction } from "express";
import {
  getStudentProfile,
  getStudentResults,
} from "../services/students.service";
import { AuthRequest } from "../middleware/verifyToken";
import { success } from "../utils/responses";

export async function myProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, schoolId } = req.user!;
    const profile = await getStudentProfile(userId, schoolId);
    return success(res, { student: profile });
  } catch (err) {
    next(err);
  }
}

export async function myResults(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, schoolId } = req.user!;
    const term = req.query.term as string | undefined;
    const session = req.query.session as string | undefined;
    const data = await getStudentResults(userId, schoolId, term, session);
    return success(res, data);
  } catch (err) {
    next(err);
  }
}
