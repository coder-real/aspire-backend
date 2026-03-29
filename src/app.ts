import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Health check — Railway and Vercel ping this
app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes will be mounted here in Phase 2
// app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

export default app;
