import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  // Keep uppercase keys on the object so existing imports keep working
  PORT: parseInt(process.env.PORT ?? "4000", 10),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  DATABASE_URL: required("DATABASE_URL"),
  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "24h",
  CORS_ORIGIN: required("CORS_ORIGIN"),
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS ?? "10", 10),
};
