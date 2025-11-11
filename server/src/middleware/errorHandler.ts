import { NextFunction, Request, Response } from "express";
import { Logger } from "../utils/logger";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.error(`Error processing ${req.method} ${req.url} - ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
};
