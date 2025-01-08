import express from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Successfully Connected to MongoDB!");
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();

app.use(cookieParser());

app.use(express.json({ limit: false }));
app.use(express.urlencoded({ limit: false, extended: true }));

app.use((req, res, next) => {
  console.log(req.body);
  next();
});

// api route
// app.get('/test', (req, res) => {
//     // res.send('Hello World!');
//     res.json({
//         message: 'hello world'
//     })
// })
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);
app.use('/api/uploads', express.static('./api/uploads'));

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = `uploads/${filename}`;
  res.sendFile(filePath);
});

const server = http.createServer(app);
server.listen(3000, () => {
  console.log("Server listening on port 3000!!!");
});

//error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    statusCode,
    message,
    success: false,
  });
});