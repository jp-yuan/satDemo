import { supabase } from './supabase.js'

export async function fetchQuestions() {
  try {
    const questions = {
      module1: [],
      module2: [],
      module3: [],
      module4: []
    }

    // Fetch module 1
    const { data: Session1Module1, error: error1 } = await supabase
      .from("SATRW")
      .select("*")
      .eq("test_number", "1")
      .eq("module_number", 1)

    if (error1) {
      throw new Error(`Error fetching module 1: ${error1.message}`)
    }

    if (Session1Module1) {
      Session1Module1.forEach((question) => {
        questions.module1.push({
          texts: [{text: question.question_prompt}],
          prompt: question.question_question,
          choices: parseChoices(question.choices),
          module: "Reading and Writing Module 1",
        })
      })
    }

    console.log('Module 1 questions loaded:', questions.module1.length)

    // Fetch module 2
    const { data: Session1Module2, error: error2 } = await supabase
      .from("SATRW")
      .select("*")
      .eq("test_number", "1")
      .eq("module_number", 2)

    if (error2) {
      throw new Error(`Error fetching module 2: ${error2.message}`)
    }

    if (Session1Module2) {
      Session1Module2.forEach((question) => {
        questions.module2.push({
          texts: [{text: question.question_prompt}],
          prompt: question.question_question,
          choices: parseChoices(question.choices),
          module: "Reading and Writing Module 2",
        })
      })
    }

    console.log('Module 2 questions loaded:', questions.module2.length)

    return questions
  } catch (error) {
    console.error('Error in fetchQuestions:', error)
    throw error
  }
}

function parseChoices(choiceString) {
  try {
    // Replace single quotes with double quotes so JSON.parse works
    const jsonReady = choiceString.replace(/'/g, '"');
    return JSON.parse(jsonReady);
  } catch (err) {
    console.error("Error parsing choices:", err);
    return [];
  }
}