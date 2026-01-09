import express from "express";
import cors from "cors";
import { config } from "dotenv";
export const app = express();
config();
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_API_URL,
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("Healthy ");
});
