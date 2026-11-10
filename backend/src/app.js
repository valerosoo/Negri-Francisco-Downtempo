import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { config } from "./config/env.js";

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
