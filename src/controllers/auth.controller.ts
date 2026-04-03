import { Request, Response, NextFunction } from 'express';
import { loginStudent, loginAdmin } from '../services/auth.service';
import { success } from '../utils/responses';

export async function studentLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { schoolCode, regNumber, password } = req.body;

    // Basic presence validation
    if (!schoolCode || !regNumber || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'schoolCode, regNumber and password are required',
        },
      });
    }

    const result = await loginStudent(
      String(schoolCode).trim(),
      String(regNumber).trim(),
      String(password)
    );

    return success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function adminLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { schoolCode, email, password } = req.body;

    if (!schoolCode || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'schoolCode, email and password are required',
        },
      });
    }

    const result = await loginAdmin(
      String(schoolCode).trim(),
      String(email).trim().toLowerCase(),
      String(password)
    );

    return success(res, result);
  } catch (err) {
    next(err);
  }
}
