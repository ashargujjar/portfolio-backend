import "dotenv/config";
import express from "express";
import Routes from "./routes/routes";
import Cors from "cors";
const app = express();
app.use(
  Cors({
    origin: process.env.FRONT_END_URL,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());

app.use(Routes);
export default app;
