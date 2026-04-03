import { Router } from "express";
import { myProfile, myResults } from "../controllers/students.controller";
import { authenticate } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.get("/me/profile", authenticate, requireRole("student"), myProfile);
router.get("/me/results", authenticate, requireRole("student"), myResults);

export default router;
