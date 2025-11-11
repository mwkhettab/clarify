import express from "express";
import "dotenv/config";
import routes from "./routes";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import { Logger } from "./utils/logger";
import helmet from "helmet";
import compression from "compression";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(compression());
app.disable("x-powered-by");

app.use(requestLogger);

// API Routes
app.use("/api", routes);

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  Logger.info(`Server is running on http://localhost:${PORT}`);
});
