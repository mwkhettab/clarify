import { Router } from "express";
import { lectureController } from "../controllers/lecture.controller";
import { processRateLimiter } from "../middleware/rateLimiter";
const router = Router();

router.post("/process", processRateLimiter, lectureController);

export default router;
