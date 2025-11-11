import { Request, Response, NextFunction } from "express";
import { Logger } from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.info(`${req.ip} - ${req.method} ${req.url}`);
  next();
};
