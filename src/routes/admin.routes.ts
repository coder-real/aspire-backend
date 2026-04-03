import { Router } from "express";
import {
  addStudent,
  uploadStudentResults,
  getStudents,
} from "../controllers/admin.controller";
import { authenticate } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.use(authenticate, requireRole("admin"));

router.post("/students", addStudent);
router.post("/results", uploadStudentResults);
router.get("/students", getStudents);

export default router;
