import { Response, NextFunction } from 'express';
import { AuthRequest } from './verifyToken';

/**
 * Ensures the school referenced in the request body or params
 * matches the school embedded in the authenticated user's JWT.
 * Apply after authenticateToken on any route that scopes to a school.
 */
export function schoolScope(req: AuthRequest, res: Response, next: NextFunction) {
  const schoolCode =
    (req.body?.schoolCode as string | undefined) ||
    (req.params?.schoolCode as string | undefined);

  if (
    schoolCode &&
    req.user?.schoolCode &&
    schoolCode.toUpperCase() !== req.user.schoolCode.toUpperCase()
  ) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'SCHOOL_MISMATCH',
        message: "You do not have access to this school's resources",
      },
    });
  }

  next();
}
