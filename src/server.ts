import express, { Express } from "express";

import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";

import cors, { CorsOptions } from "cors";
import { errorHandler, notFoundMiddleware } from "middleware";
import { registerRoutesV1 } from "api";
import dotenv from "dotenv";

const corsOptions: CorsOptions = {};

dotenv.config();

class App {
     express: Express;

     constructor() {
          this.express = express();
          this.middleware();
          this.connectDb();
          this.routes();
          this.useErrorHandler();
          this.useNotFoundMiddleware();
     }

     // Configure Express middleware.
     private middleware(): void {
          this.express.use(bodyParser.json());
          this.express.use(bodyParser.urlencoded({ extended: true }));
          this.express.use(cookieParser("secret"));
          this.express.use(
               cors({
                    // credentials: true,
                    origin: "*",
               })
          );
          this.express.use(morgan("dev"));
     }

     private useErrorHandler() {
          this.express.use(errorHandler);
     }

     private useNotFoundMiddleware() {
          this.express.use(notFoundMiddleware);
     }

     private routes(): void {
          registerRoutesV1(this.express);
     }

     private async connectDb() {
          await mongoose
               .connect(process.env.DB_PATH, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
               })
               .then(() => {
                    console.log("connected to database");
               })
               .catch((err) => {
                    console.log("Mongoose error", err);
               });
     }
}

const app = new App();
const server = app.express;

export default server;
