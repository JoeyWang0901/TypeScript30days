import "reflect-metadata";
import { DataSource } from "typeorm";
import { Todo } from "../entities/Todo";
import { User } from "../entities/User";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Todo, User],
  synchronize: false, // 開發階段建議 true，正式環境請改成 false
  logging: true,
  ssl: { rejectUnauthorized: false },
  migrations: process.env.NODE_ENV === "production"
  ? [__dirname + "/../migrations/*.js"]
  : ["src/migrations/**/*.ts"], // 📁 migration 檔案路徑
  migrationsTableName: "migrations_history", // 📊 migration 歷史記錄表名稱
});
