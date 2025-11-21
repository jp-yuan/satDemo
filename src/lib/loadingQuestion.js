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



    // Fetch module 3
    const { data: Session1Module3, error: error3 } = await supabase
      .from("questions")
      .select("*")
      .eq("test_number", "1")
      .eq("module_number", 3)

    if (error3) {
      throw new Error(`Error fetching module 3: ${error3.message}`)
    }

    if (Session1Module3) {
      Session1Module3.forEach((question) => {
        questions.module3.push({
          texts: [{text: question.question_prompt}],
          prompt: question.question_prompt,  // HTML prompt
          choices_raw: question.question_choices,  // HTML choices
          is_multiple_choice: question.is_multiple_choice,  // Boolean flag
          correct_answer: question.correct_answer,  // Correct answer
          module: "Math Module 1",
        })
      })
    }

    console.log('Module 3 questions loaded:', questions.module3.length)

    // Fetch module 4
    const { data: Session1Module4, error: error4 } = await supabase
      .from("questions")
      .select("*")
      .eq("test_number", "1")
      .eq("module_number", 4)

    if (error4) {
      throw new Error(`Error fetching module 4: ${error4.message}`)
    }

    if (Session1Module4) {
      Session1Module4.forEach((question) => {
        questions.module4.push({
          texts: [{text: question.question_prompt}],
          prompt: question.question_prompt,  // HTML prompt
          choices_raw: question.question_choices,  // HTML choices
          is_multiple_choice: question.is_multiple_choice,  // Boolean flag
          correct_answer: question.correct_answer,  // Correct answer
          module: "Math Module 2",
        })
      })
    }

    console.log('Module 4 questions loaded:', questions.module4.length)

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