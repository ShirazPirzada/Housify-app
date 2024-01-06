import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import myApartmentRoutes from "./routes/apartments";
import cookieParser from "cookie-parser";
import path from "path";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
//.then(()=>console.log("Connected to db: ",process.env.MONGODB_CONNECTION_STRING));

const app = express();
app.use(cookieParser());
app.use(express.json()); //handles api response automatically converts them into json
app.use(express.urlencoded({ extended: true })); // Parses url
app.use(
  cors({
    origin: process.env.FRONTEND_URL, //Accept requests only from this url
    credentials: true,
  })
); //Security : Prevents some security threats. Helps in configuration for security

app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-apartments", myApartmentRoutes);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(3000, () => {
  console.log("Server running on localhost:3000");
});
