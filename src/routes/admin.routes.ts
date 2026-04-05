import { Router } from "express";
import {
  addStudent,
  uploadStudentResults,
  getStudents,
} from "../controllers/admin.controller";
import { authenticate } from "../middleware/verifyToken";
import { requireRole } from "../middleware/requireRole";
import { validate } from "../middleware/validate";
import { createStudentSchema, uploadResultsSchema } from "../schemas/admin.schemas";

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireRole("admin"));

router.post("/students", validate(createStudentSchema), addStudent);
router.post("/results", validate(uploadResultsSchema), uploadStudentResults);
router.get("/students", getStudents);

export default router;
