import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import db from "./config/db";
import postRoutes from "./routes/PostRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db();

app.use("/api/posts", postRoutes);

export default app;
