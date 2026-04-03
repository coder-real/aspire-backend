import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import schoolsRoutes from "./routes/schools.routes";
import studentsRoutes from "./routes/students.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Health check — Railway and Vercel ping this
app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Auth routes
app.use("/api/v1/auth", authRoutes);

// Schools routes
app.use("/api/v1/schools", schoolsRoutes);

// Students routes
app.use("/api/v1/students", studentsRoutes);

// Admin routes
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);

export default app;
