<template>
  <div class="sat-demo">
    <!-- Header Bar -->
    <HeaderBar 
      :current-session="currentSession"
      :current-module="currentModule"
      :show-instructions="showInstructions"
      @change-session="changeSession"
      @change-module="changeModule"
    />

    <!-- Session Title -->
    <div class="section-title">
      <span class="section section-left">{{ getSessionTitle() }}</span>
      <span class="section-timer"><Timer v-if="showTimer" :minutes="minutes" :seconds="seconds" /></span>
    </div>

    <!-- Session 1 Page -->
    <SessionPage 
      v-if="currentSession === 'session1' && !showInstructions"
      :session-title="'Session 1: Reading and Writing'"
      :session-description="'This session contains two modules. You will complete Module 1 first, then Module 2.'"
      :modules="session1Modules"
      :current-module="currentModule"
      :module-progress="moduleProgress"
      @change-module="changeModule"
    />

    <!-- Session 2 Page -->
    <SessionPage 
      v-if="currentSession === 'session2' && !showInstructions"
      :session-title="'Session 2: Math'"
      :session-description="'This session contains two modules. You will complete Module 1 first, then Module 2.'"
      :modules="session2Modules"
      :current-module="currentModule"
      :module-progress="moduleProgress"
      @change-module="changeModule"
    />

    <!-- Instructions Page -->
    <InstructionsBox 
      v-if="showInstructions"
      :title="getModuleInstructionsTitle()"
      :module-type="getModuleType()"
    />

    <!-- Main Content: Question and Answers -->
    <div v-else-if="!showInstructions && currentModule" class="main-content">
      <div class="question-texts">
        <template v-for="(text, idx) in getCurrentQuestions()[currentQuestion].texts" :key="idx">
          <div class="text-block">
            <div class="text-title">Text {{ idx + 1 }}</div>
            <div class="text-body">
              <template v-if="typeof text === 'object' && text !== null">
                <div v-if="text.text">{{ text.text }}</div>
                <img v-if="getCurrentQuestions()[currentQuestion].graph" :src="getCurrentQuestions()[currentQuestion].graph" alt="Graph" class="question-img" />
              </template>
              <template v-else>
                {{ text }}
              </template>
            </div>
          </div>
        </template>
      </div>
      
      <QuestionArea
        :question-number="currentQuestion + 1"
        :question="getCurrentQuestions()[currentQuestion]"
        :selected-answer="getCurrentAnswers()[currentQuestion]"
        :is-flagged="getCurrentFlaggedQuestions()[currentQuestion]"
        @select-answer="selectAnswer"
        @toggle-flag="toggleFlag(currentQuestion)"
      />
    </div>

    <!-- Question Navigation Panel -->
    <QuestionNavigation
      v-if="!showInstructions && currentModule"
      :questions="getCurrentQuestions()"
      :current-question="currentQuestion"
      :answers="getCurrentAnswers()"
      :flagged-questions="getCurrentFlaggedQuestions()"
      @jump-to-question="jumpToQuestion"
      @toggle-flag="toggleFlag"
    />

    <!-- Navigation Buttons -->
    <div class="nav-buttons">
      <button v-if="!showInstructions && currentModule" class="prev-btn" :disabled="currentQuestion === 0" @click="prevQuestion">Prev</button>
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
import { ref, defineProps, computed } from 'vue'
import Timer from './Timer.vue'
import HeaderBar from './HeaderBar.vue'
import SessionPage from './SessionPage.vue'
import QuestionArea from './QuestionArea.vue'
import QuestionNavigation from './QuestionNavigation.vue'
import InstructionsBox from './InstructionsBox.vue'
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
const currentSession = ref('session1')
const currentModule = ref('module1')

// Parse CSV data
const parsed = Papa.parse(csvData, {
  header: true,
  skipEmptyLines: true
})

// Create questions for each module (in a real app, you'd have separate data)
const createModuleQuestions = (moduleType, count = 5) => {
  return Array.from({ length: count }, (_, i) => ({
    texts: [{ text: `Sample ${moduleType} question ${i + 1} text. This is a placeholder for the actual question content.` }],
    prompt: `Sample ${moduleType} question ${i + 1} prompt.`,
    choices: [
      `Choice A for question ${i + 1}`,
      `Choice B for question ${i + 1}`,
      `Choice C for question ${i + 1}`,
      `Choice D for question ${i + 1}`
    ],
    correct: 'A',
    module: moduleType,
    graph: null
  }))
}

// Questions for each module
const moduleQuestions = {
  module1: createModuleQuestions('Reading and Writing', 5),
  module2: createModuleQuestions('Reading and Writing', 5),
  module3: createModuleQuestions('Math', 5),
  module4: createModuleQuestions('Math', 5)
}

// Answers for each module
const moduleAnswers = {
  module1: Array(5).fill(null),
  module2: Array(5).fill(null),
  module3: Array(5).fill(null),
  module4: Array(5).fill(null)
}

// Flagged questions for each module
const moduleFlaggedQuestions = {
  module1: Array(5).fill(false),
  module2: Array(5).fill(false),
  module3: Array(5).fill(false),
  module4: Array(5).fill(false)
}

// Module progress tracking
const moduleProgress = ref({
  module1: 0,
  module2: 0,
  module3: 0,
  module4: 0
})

// Session module configurations
const session1Modules = [
  { id: 'module1', title: 'Module 1', type: 'Reading and Writing', questionCount: 5 },
  { id: 'module2', title: 'Module 2', type: 'Reading and Writing', questionCount: 5 }
]

const session2Modules = [
  { id: 'module3', title: 'Module 1', type: 'Math', questionCount: 5 },
  { id: 'module4', title: 'Module 2', type: 'Math', questionCount: 5 }
]

// Helper functions
function getCurrentQuestions() {
  return moduleQuestions[currentModule.value] || []
}

function getCurrentAnswers() {
  return moduleAnswers[currentModule.value] || []
}

function getCurrentFlaggedQuestions() {
  return moduleFlaggedQuestions[currentModule.value] || []
}

function getSessionTitle() {
  const sessionNames = {
    session1: 'Session 1: Reading and Writing',
    session2: 'Session 2: Math'
  }
  return sessionNames[currentSession.value] || 'Digital SAT'
}

function getModuleInstructionsTitle() {
  const moduleNames = {
    module1: 'Reading and Writing Module 1 Test Directions',
    module2: 'Reading and Writing Module 2 Test Directions',
    module3: 'Math Module 1 Test Directions',
    module4: 'Math Module 2 Test Directions'
  }
  return moduleNames[currentModule.value] || 'Test Directions'
}

function getModuleType() {
  const moduleTypes = {
    module1: 'Reading and Writing',
    module2: 'Reading and Writing',
    module3: 'Math',
    module4: 'Math'
  }
  return moduleTypes[currentModule.value] || 'Test'
}

function changeSession(session) {
  currentSession.value = session
  if (session === 'session1') {
    currentModule.value = 'module1'
  } else {
    currentModule.value = 'module3'
  }
  showInstructions.value = true
  currentQuestion.value = 0
}

function changeModule(module) {
  currentModule.value = module
  showInstructions.value = true
  currentQuestion.value = 0
}

function selectAnswer(idx) {
  const currentAnswers = getCurrentAnswers()
  currentAnswers[currentQuestion.value] = idx
  
  // Update progress
  const answeredCount = currentAnswers.filter(answer => answer !== null).length
  moduleProgress.value[currentModule.value] = answeredCount
}

function nextOrStart() {
  if (showInstructions.value) {
    showInstructions.value = false
  } else if (currentQuestion.value < getCurrentQuestions().length - 1) {
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
  showInstructions.value = false
}

function toggleFlag(idx) {
  const currentFlagged = getCurrentFlaggedQuestions()
  currentFlagged[idx] = !currentFlagged[idx]
  console.log(currentFlagged)
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

.question-img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 12px 0;
}
</style> 