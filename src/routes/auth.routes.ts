import { Router } from 'express';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/verifyToken';
import { studentLoginSchema, adminLoginSchema } from '../schemas/auth.schemas';
import { studentLogin, adminLogin, logout } from '../controllers/auth.controller';

const router = Router();

router.post('/login/student', validate(studentLoginSchema), studentLogin);
router.post('/login/admin',   validate(adminLoginSchema),   adminLogin);
router.post('/logout',        authenticate,                 logout);

export default router;
