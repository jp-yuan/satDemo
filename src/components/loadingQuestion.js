import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generic loader for JSONL
export function loadJsonl(filePath) {
  const fullPath = path.resolve(__dirname, filePath);
  const text = fs.readFileSync(fullPath, "utf-8");
  return text
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
}

// Load questions.jsonl
const questions = loadJsonl("../assets/rw_questions.jsonl");

// Print results
console.log("Loaded questions:");
questions.forEach((q) => {
  console.log("--------------")
  console.log(`Prompt:${q.question_prompt}`)
  console.log(`Q${q.question_id}: ${q.question_question}`);
  console.log(`   Choices:\n${q.question_choices.join("\n")}`);
});
