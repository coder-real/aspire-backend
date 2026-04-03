import { Response, NextFunction } from "express";
import { createStudent, listStudents } from "../services/students.service";
import { uploadResults } from "../services/results.service";
import { AuthRequest } from "../middleware/verifyToken";
import { success } from "../utils/responses";

export async function addStudent(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { schoolId } = req.user!;
    const { fullName, regNumber, class: className, email, password } = req.body;

    if (!fullName || !regNumber || !className || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message:
            "fullName, regNumber, class, email and password are all required",
        },
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Password must be at least 8 characters",
        },
      });
    }

    const student = await createStudent(
      schoolId,
      String(fullName).trim(),
      String(regNumber).trim(),
      String(className).trim(),
      String(email).trim(),
      String(password),
    );

    return success(res, { student }, 201);
  } catch (err) {
    next(err);
  }
}

export async function uploadStudentResults(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { schoolId } = req.user!;
    const { studentId, term, session, results } = req.body;

    if (!studentId || !term || !session || !results) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "studentId, term, session and results are all required",
        },
      });
    }

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "results must be a non-empty array",
        },
      });
    }

    if (results.length > 20) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Cannot upload more than 20 results at once",
        },
      });
    }

    const data = await uploadResults(
      String(studentId),
      schoolId,
      schoolId,
      String(term).trim(),
      String(session).trim(),
      results,
    );

    return success(res, data, 201);
  } catch (err) {
    next(err);
  }
}

export async function getStudents(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { schoolId } = req.user!;
    const search = req.query.search as string | undefined;
    const className = req.query.class as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 20;

    const data = await listStudents(schoolId, search, className, page, limit);
    return success(res, data);
  } catch (err) {
    next(err);
  }
}
