<template>
  <div class="sat-demo">
    <!-- Header Bar -->
    <div class="header-bar">
      <span class="compass">● Young Scholars Testing Center</span>
      <button class="resume-btn">Resume Tour</button>
      <button class="end-btn">End Demo Section</button>
      <div class="jump-to">
        <span>JUMP TO:</span>
        <button class="jump-btn">Reading and Writing ▼</button>
      </div>
    </div>

    <!-- Section Title -->
    <div class="section-title">
      <span class="section section-left">Section: Reading and Writing</span>
      <span class="section-timer"><Timer v-if="showTimer" :minutes="minutes" :seconds="seconds" /></span>
    </div>

  
    <!-- Question Navigation Panel -->
    <div class="question-nav">
      <button
        v-for="(q, idx) in questions.value"
        :key="idx"
        class="question-nav-btn"
        :class="{ active: currentQuestion === idx, answered: answers.value[idx] !== null }"
        @click="jumpToQuestion(idx)"
      >
        {{ idx + 1 }}
      </button>
    </div>

    <!-- Instructions Page -->
    <div v-if="showInstructions" class="instructions-box">
      <h2>Reading &amp; Writing Test Directions</h2>
      <p><strong>This demo displays a shortened version of the Reading &amp; Writing Test. You will have 15 minutes before the demo advances to the next section. You can return to this section using the JUMP TO menu in the top right of the screen.</strong></p>
      <p>Clear your workstation of everything except your computer, scratch paper, and pencil.</p>
      <p>SECTION DIRECTIONS: The following screen contains instructions about the Reading &amp; Writing Test. That screen is not part of the scored questions, but it is included in your total time. You can return to the instructions at any time by selecting the question navigation button at the bottom center of your screen and clicking on Instr in the question list.</p>
      <p>Select the <strong>Next</strong> button to proceed.</p>
      <p><strong>If you do not select Next, your test will automatically begin when the timer ends.</strong></p>
    </div>

    <!-- Main Content: Question and Answers -->
    <div v-else class="main-content">
      <div class="question-texts">
        <template v-for="(text, idx) in questions[currentQuestion].texts" :key="idx">
          <div class="text-block">
            <div class="text-title">Text {{ idx + 1 }}</div>
            <div class="text-body">
              <template v-if="typeof text === 'object' && text !== null">
                <div v-if="text.text">{{ text.text }}</div>
                <img v-if="questions[currentQuestion].graph" :src="questions[currentQuestion].graph" alt="Graph" class="question-img" />
              </template>
              <template v-else>
                {{ text }}
              </template>
            </div>
          </div>
        </template>
      </div>
      <div class="question-area">
        <div class="question-number">{{ currentQuestion + 1 }}</div>
        <div class="question-prompt">{{ questions[currentQuestion].prompt }}</div>
        <div class="choices">
          <button
            v-for="(choice, idx) in questions[currentQuestion].choices"
            :key="idx"
            class="choice-btn"
            :class="{ selected: answers[currentQuestion] === idx }"
            @click="selectAnswer(idx)"
          >
            <span class="choice-letter">{{ String.fromCharCode(65 + idx) }}</span>
            <span class="choice-text">{{ choice }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="nav-buttons">
      <button v-if="!showInstructions" class="prev-btn" :disabled="currentQuestion === 0" @click="prevQuestion">Prev</button>
      <button class="next-btn" @click="nextOrStart">Next</button>
    </div>

    <!-- Footer -->
    <div class="footer">
      <span>{{ props.studentName }}</span>
      <span class="info">SAT® is a registered trademark owned by the College Board, PSAT/NMSQT® is a registered trademark of the College Board and National Merit Scholarship Corporation, neither of which was involved in the production of, nor do they endorse, these materials.</span>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import Timer from './Timer.vue'
import Papa from 'papaparse'
import csvData from '../assets/data.csv?raw'

const props = defineProps({
  studentName: { type: String, default: 'Demo Student' }
})

const showTimer = true
const minutes = 43
const seconds = 22

const showInstructions = ref(true)
const currentQuestion = ref(0)

const parsed = Papa.parse(csvData, {
  header: true,
  skipEmptyLines: true
})
const questions = ref(parsed.data.map(row => ({
  texts: [{ text: row.Question }],
  prompt: row.Prompt,
  choices: [
    row['answer 1']?.trim(),
    row['answer 2 ']?.trim(),
    row['answer 3']?.trim(),
    row['answer 4']?.trim()
  ].filter(Boolean),
  correct: row.answer,
  module: row.module,
  graph: row.Graph && row.Graph !== 'N/A' ? row.Graph : null
})))
const answers = ref(Array(questions.value.length).fill(null))

function selectAnswer(idx) {
  answers.value[currentQuestion.value] = idx
  console.log(answers.value)
}

function nextOrStart() {
  if (showInstructions.value) {
    showInstructions.value = false
  } else if (currentQuestion.value < questions.value.length - 1) {
    currentQuestion.value++
  }
}
function prevQuestion() {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
  }
}

function jumpToQuestion(idx) {
  currentQuestion.value = idx
}
</script>

<style scoped>
.sat-demo {
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #fff;
  min-height: 100vh;
  min-width: 100vw;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}
.header-bar {
  background: #d6e1f5;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  position: relative;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
}
.title {
  font-weight: bold;
  font-size: 20px;
  margin-right: 16px;
}
.resume-btn, .end-btn, .jump-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 14px;
  margin-left: 8px;
  cursor: pointer;
  font-size: 14px;
}
.end-btn {
  background: #0b3556;
}
.jump-to {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
}
.section-title {
  padding: 12px 20px 0 20px;
  font-size: 16px;
  font-weight: bold;
  color: #222;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  justify-content: center;
}
.section-left {
  position: absolute;
  left: 20px;
  font-weight: bold;
}
.section-timer {
  font-size: 18px;
  font-weight: bold;
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
}
.compass {
  color: #b94a48;
  font-size: 14px;
}
.main-content {
  display: flex;
  flex-direction: row;
  gap: 32px;
  padding: 24px 32px 0 32px;
  flex: 1 1 auto;
}
.question-texts {
  flex: 2;
  padding-right: 32px;
}
.text-block {
  margin-bottom: 24px;
}
.text-title {
  font-weight: bold;
  margin-bottom: 4px;
}
.text-body {
  font-size: 16px;
  color: #222;
}
.question-area {
  flex: 3;
  background: #fff;
  border-left: 2px solid #e0e0e0;
  padding-left: 32px;
  display: flex;
  flex-direction: column;
}
.question-number {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
}
.question-prompt {
  font-size: 16px;
  margin-bottom: 18px;
}
.choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.choice-btn {
  display: flex;
  align-items: flex-start;
  background: #fff;
  border: 1px solid #222;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 16px;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s, border 0.2s;
  gap: 12px;
}
.choice-btn:hover {
  background: #e3f0ff;
  border-color: #1976d2;
}
.choice-letter {
  font-weight: bold;
  margin-right: 8px;
}
.nav-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 32px 0 0;
  width: 100%;
  box-sizing: border-box;
}
.prev-btn, .next-btn {
  background: #b3d4fc;
  color: #222;
  border: none;
  border-radius: 20px;
  padding: 8px 24px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
}
.next-btn {
  background: #0084ff;
  color: #fff;
}
.footer {
  margin-top: auto;
  padding: 24px 0 8px 0;
  text-align: center;
  font-size: 14px;
  color: #888;
  border-top: 1px dashed #ccc;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
}
.info {
  font-size: 12px;
  color: #888;
}
.instructions-box {
  background: #f9f9f9;
  border-top: 1px dashed #ccc;
  border-bottom: 1px dashed #ccc;
  margin: 0;
  padding: 20px 30px;
  font-size: 16px;
  color: #222;
  width: 100%;
  box-sizing: border-box;
  flex: 1 0 auto;
}
.instructions-box h2 {
  margin-top: 0;
  font-size: 20px;
}
.instructions-box p {
  margin: 10px 0;
}
.choice-btn.selected {
  background: #1976d2;
  color: #fff;
  border-color: #1976d2;
}
.question-img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 12px 0;
}
.question-nav {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 18px 0 0 0;
}
.question-nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #1976d2;
  background: #fff;
  color: #1976d2;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
}
.question-nav-btn.active {
  background: #1976d2;
  color: #fff;
}
.question-nav-btn.answered {
  border-color: #43a047;
}
</style> 