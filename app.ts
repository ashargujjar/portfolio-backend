import "dotenv/config";
import express from "express";
import Routes from "./routes/routes";
import Cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";

const app = express();

/* ---------------- TRUST PROXY (for deployment) ---------------- */
app.set("trust proxy", 1);

/* ---------------- SECURITY ---------------- */
app.use(helmet());
app.disable("x-powered-by");

/* ---------------- CORS ---------------- */
app.use(
  Cors({
    origin: process.env.FRONT_END_URL,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

/* ---------------- BODY PARSER ---------------- */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

/* ---------------- NOSQL INJECTION PROTECTION ---------------- */
app.use(mongoSanitize());

/* ---------------- RATE LIMITING ---------------- */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, try again later.",
  },
});

// Apply only to API routes
app.use("/api", limiter);

/* ---------------- API ROUTES ---------------- */
app.use("/api", Routes);

/* ---------------- FRONTEND (React Build Fix) ---------------- */
const __dirname = path.resolve();

// Serve React build (adjust if your frontend folder name is different)
app.use(express.static(path.join(__dirname, "client/dist")));

// FIX: React Router refresh issue
app.get("*", (req, res) => {
  // If request starts with /api, don't handle it here
  if (req.path.startsWith("/api")) return;

  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

export default app;
