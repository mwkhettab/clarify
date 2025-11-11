import OpenAI from "openai";
import { StudyOutput } from "../types";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateStudyMaterial(
  lectureText: string
): Promise<StudyOutput> {
  const prompt = `
You are an expert study assistant. I will provide a lecture transcript. Your task is to convert it into practical, actionable study material a student can immediately use.
If the transcript is very short or does not contain any useful information, return the following default response:
{
  "lectureTitle": "No Content Available",
  "summary": "The provided lecture transcript does not contain sufficient information to generate study material.",
  "studyActivities": [],
  "questions": [],
  "studyPlan": []
}
  
Otherwise, analyze the lecture transcript and extract the key concepts. Then, create the following structured JSON output:

Return **only raw JSON**, without any Markdown code blocks, explanations, or extra text. The JSON should have these fields:

{
  "lectureTitle": "A concise, descriptive title for the lecture",
  "summary": "A concise, plain-language summary highlighting the key points",
  "studyActivities": ["Exercises or activities to practice each key concept"],
  "questions": [
    {
      "question": "A short-answer or problem-solving question",
      "answer": "Optional: correct answer or step-by-step solution"
    }
  ],
  "studyPlan": ["Step-by-step, actionable steps to master the material efficiently"]
}

Lecture: """${lectureText}"""
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a concise, practical study assistant.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 1500,
  });

  let content = response.choices[0].message?.content || "";

  content = content.replace(/```(json)?\n?([\s\S]*?)```/gi, "$2").trim();

  try {
    const data = JSON.parse(content) as StudyOutput;
    data.transcript = lectureText;
    return data;
  } catch (error) {
    console.error("Failed to parse AI response as JSON:", content);
    throw new Error("Failed to parse AI response as JSON");
  }
}

export async function transcribeAudio(filePath: string) {
  const stream = fs.createReadStream(filePath);
  const response = await openai.audio.transcriptions.create({
    file: stream,
    model: "whisper-1",
    response_format: "text",
  });
  return response;
}
