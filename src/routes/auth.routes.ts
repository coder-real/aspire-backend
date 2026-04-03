import { Router } from 'express';
import { studentLogin, adminLogin } from '../controllers/auth.controller';

const router = Router();

router.post('/login/student', studentLogin);
router.post('/login/admin', adminLogin);

export default router;
