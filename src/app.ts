import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import db from "./config/db";
import postRoutes from "./routes/PostRoutes";
import categoryRoutes from "./routes/CategoryRoutes";
import authRoutes from "./routes/AuthRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db();

app.use("/api/posts", postRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/v1/auth", authRoutes);

export default app;
