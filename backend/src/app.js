import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import journalRoutes from "./routes/journalRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/journal", journalRoutes);

const clientBuildPath = path.join(__dirname, "../../client/build");
app.use(express.static(clientBuildPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    return res.sendFile(path.join(clientBuildPath, "index.html"));
  }
  next();
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;