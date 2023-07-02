import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 
import connectDB from "./config/db.js"; 
import colors from "colors"; 
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"; 
import phoneRouter from "./routes/phoneRouter.js";
import userRouter from "./routes/userRouter.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); //using json data in the body

app.use(cors({
  origin: ['http://localhost:3000'], // this makes the frontend able to access the backend
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("API is running now...");
});

app.use("/api/phones", phoneRouter);
app.use("/api/users", userRouter);

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5001;
app.listen(
  PORT,
  console.log(
    `Server running on port ${PORT}, ${process.env.NODE_ENV} mode.`.yellow.bold
  )
);
