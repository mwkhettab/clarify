import { Request, Response } from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileTypeFromBuffer } from "file-type";
import {
  transcribeAudio,
  generateStudyMaterial,
} from "../services/openai.service";
import { StudyOutput } from "../types";
import { Logger } from "../utils/logger";

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const TEMP_DIR = path.join(process.cwd(), "uploads/tmp");

fs.mkdir(TEMP_DIR, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("audio/")) {
      return cb(new Error("Only audio files are allowed"));
    }
    cb(null, true);
  },
}).single("lecture");

export const lectureController = (req: Request, res: Response) => {
  upload(req, res, async (err: any) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const type = await fileTypeFromBuffer(req.file.buffer);
      if (!type || !type.mime.startsWith("audio/")) {
        return res
          .status(400)
          .json({ error: "Invalid or unsupported audio file" });
      }

      const safeFileName = `${Date.now()}-${crypto
        .randomBytes(8)
        .toString("hex")}.${type.ext}`;
      const tempFilePath = path.join(TEMP_DIR, safeFileName);

      await fs.writeFile(tempFilePath, req.file.buffer, { flag: "wx" });

      const transcript = await transcribeAudio(tempFilePath);
      const studyOutput: StudyOutput = await generateStudyMaterial(transcript);

      res.status(200).json(studyOutput);
    } catch (error: any) {
      Logger.error(`Lecture processing failed: ${error.message}`);
      res.status(500).json({ error: "Failed to process lecture" });
    } finally {
      if (req.file) {
        const files = await fs.readdir(TEMP_DIR);
        for (const file of files) {
          if (file.includes(req.file.filename)) {
            try {
              await fs.unlink(path.join(TEMP_DIR, file));
            } catch {}
          }
        }
      }
    }
  });
};
