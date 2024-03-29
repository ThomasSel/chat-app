import dotenv from "dotenv";
dotenv.config();

//Check for the correct environment variables
const expectedEnv = ["JWT_SECRET"];
expectedEnv.forEach((name) => {
  if (process.env[name] === undefined) {
    throw new Error(`The environment variable ${name} isn't set`);
  }
});

import http from "http";
import mongoose from "mongoose";

import wsServer from "./wsServer";
import app from "./app";

const mongoURL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/chatApp";
mongoose.connect(mongoURL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const port = parseInt(process.env.PORT || "8000");
const httpServer = http.createServer(app);

httpServer.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    wsServer.emit("connection", socket, req);
  });
});

httpServer.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
