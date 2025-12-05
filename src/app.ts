import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/db";
import todoRoutes from "./routes/todoRoutes";
import authRoutes from "./routes/authRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import dotenv from "dotenv";
import logger from "./utils/logger";
import pinoHttp from "pino-http";

dotenv.config();

const app = express();
app.use(express.json());

// 測試不同級別的日誌
logger.info("這是一般資訊");
logger.debug("這是除錯訊息");
logger.warn("這是警告");
logger.error("這是錯誤");

app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

app.use(pinoHttp({ logger }));

app.get("/", (req, res) => {
  res.send("Hello, iThome 2025!");
});

const PORT = process.env.PORT || 3000;
AppDataSource.initialize()
  .then(() => {
    logger.info("Database connected");
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
