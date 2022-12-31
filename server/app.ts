// Import modules
import config from "config";
import express from "express";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import logger from "./utils/Logger";

// Import routes
import UserRouter from "./routes/User";
import SessionRouter from "./routes/Session";
import BlogRouter from "./routes/Blog";
import CommentRouter from "./routes/Comment";

// Initialize the project
const app = express();
const fb = initializeApp(config.get("backend.firebase.config"));
const database = getFirestore(fb);

// Middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use((req, res, next) => {
  next();

  res.on("finish", () => {
    res.statusCode.toString().startsWith("2")
      ? logger.info(
          `[${req.method.toUpperCase()}] [${req.socket.remoteAddress}] [${
            res.statusCode
          }] ${req.url}`
        )
      : logger.warn(
          `[${req.method.toUpperCase()}] [${req.socket.remoteAddress}] [${
            res.statusCode
          }] ${req.url}`
        );
  });
});

// Routes
app.use("/users", UserRouter);
app.use("/sessions", SessionRouter);
app.use("/blogs", BlogRouter);
app.use("/comments", CommentRouter);

export { database, app };
