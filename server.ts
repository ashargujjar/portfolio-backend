import "dotenv/config";
import express from "express";
import Cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import Routes from "./routes/routes";
import { connectDb } from "./db/db";

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

// Apply rate limiting to API routes
app.use("/api", limiter);

/* ---------------- API ROUTES ---------------- */
app.use("/api", Routes);

/* ---------------- SERVER STARTUP ---------------- */
// Safely parse the port to avoid Type assignment/NaN issues
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const startServer = async () => {
  try {
    // Assuming connectDb expects a callback function to run after successful connection
    await connectDb(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server successfully running on port ${PORT}`);
      });
    });
  } catch (error) {
    console.error(
      "❌ Failed to start the server due to database error:",
      error,
    );
    process.exit(1);
  }
};

void startServer();
