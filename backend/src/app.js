import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import journalRoutes from "./routes/journalRoutes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Journal API is running" });
});

app.use("/api/journal", journalRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;