import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import "dotenv/config";
import bodyParser from "body-parser";

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Connection
const DB_CONNECTION = process.env.DB_CONNECTION;
const PORT = process.env.PORT;

mongoose
  .connect(DB_CONNECTION)
  .then(() => {
    console.log("App is connected to DB");

    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// routes

import SchoolRoutes from "./routes/SchoolRoutes.js";
import BldgRoutes from "./routes/BldgRoutes.js";
app.use("/schools", SchoolRoutes);
app.use("/", BldgRoutes);
