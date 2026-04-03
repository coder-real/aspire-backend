import { Request, Response, NextFunction } from 'express';
import { getSchools, getSchoolConfig } from '../services/schools.service';
import { success } from '../utils/responses';

export async function listSchools(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const search = req.query.search as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

    const data = await getSchools(search, limit);
    return success(res, data);
  } catch (err) {
    next(err);
  }
}

export async function schoolConfig(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const code = req.params.code as string;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'School code is required' },
      });
    }

    const school = await getSchoolConfig(code);
    return success(res, { school });
  } catch (err) {
    next(err);
  }
}
