import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import authRoutes from "./routes/auth.routes";
import groupRoutes from "./routes/group.routes";
import expenseRoutes from "./routes/expense.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/user", userRoutes)
export default app;
