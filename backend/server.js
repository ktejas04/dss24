import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from './config/mongodb.config.js';
import userRouter from './routes/user.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.use(express.json()); //The json response from FE to BE is parsed using this
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded form data

connectDB();

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
    res.send("Hello, World!");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})