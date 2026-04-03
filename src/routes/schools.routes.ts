import { Router } from 'express';
import { listSchools, schoolConfig } from '../controllers/schools.controller';

const router = Router();

router.get('/', listSchools);
router.get('/:code/config', schoolConfig);

export default router;
