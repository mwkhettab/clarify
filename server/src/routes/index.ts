import { Router, Request, Response } from "express";
import lectureRoutes from "./lecture.routes";
import { generalRateLimiter } from "../middleware/rateLimiter";
const router = Router();

router.use("/lecture", lectureRoutes);
router.get("/status", generalRateLimiter, (req: Request, res: Response) => {
  res.json({ message: "Status OK" });
});

export default router;
