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
        :questionKey="questionRenderKey"
        :flagKey="flagRenderKey"
        :question-number="currentQuestion + 1"
        :question="getCurrentQuestions()[currentQuestion]"
        :selected-answer="getCurrentAnswers()[currentQuestion]"
        :is-flagged="getCurrentFlaggedQuestions()[currentQuestion]"
        @select-answer="selectAnswer"
        @toggle-flag="() => toggleFlag(currentQuestion)"
      />


      />
    </div>

    <!-- Question Navigation Panel -->
    <div>
      <QuestionNavigation
        v-if="!showInstructions && currentModule"
        :questionNavKey="questionNavRenderKey"
        :questions="getCurrentQuestions()"
        :current-question="currentQuestion"
        :answers="getCurrentAnswers()"
        :flagged-questions="getCurrentFlaggedQuestions()"
        @jump-to-question="jumpToQuestion"
        @toggle-flag="toggleFlag"
      />
     </div>

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

const questionRenderKey = ref(0);
const flagRenderKey = ref(0);
const questionNavRenderKey = ref(0);

// Parse CSV data
const parsed = Papa.parse(csvData, {
  header: true,
  skipEmptyLines: true
})

// Parse real questions from CSV data
const parseRealQuestions = () => {
  const questions = {
    module1: [],
    module2: [],
    module3: [],
    module4: []
  }
  
  parsed.data.forEach((row, index) => {
    if (row.Question && row.module) {
      // More robust way to get choices - try different possible column names
      const getChoice = (row, choiceNum) => {
        const possibleNames = [
          `answer ${choiceNum}`,
          `answer ${choiceNum} `,
          `Answer ${choiceNum}`,
          `Answer ${choiceNum} `,
          `choice ${choiceNum}`,
          `Choice ${choiceNum}`
        ]
        
        for (const name of possibleNames) {
          if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
            return row[name]
          }
        }
        return ''
      }
      
      const choiceA = getChoice(row, 1)
      const choiceB = getChoice(row, 2)
      const choiceC = getChoice(row, 3)
      const choiceD = getChoice(row, 4)
      
      const question = {
        texts: [{ text: row.Question }],
        prompt: row.Prompt || '',
        choices: [choiceA, choiceB, choiceC, choiceD],
        correct: row.answer || 'A',
        module: row.module,
        graph: row.Graph && row.Graph !== 'N/A' ? row.Graph : null
      }
      
      // Assign to appropriate module based on CSV data, limiting to 27 questions per module
      if (row.module === 'Reading and Writing Module 1' && questions.module1.length < 27) {
        questions.module1.push(question)
      } else if (row.module === 'Reading and Writing Module 2' && questions.module2.length < 27) {
        questions.module2.push(question)
      } else if (row.module === 'Math Module 1') {
        questions.module3.push(question)
      } else if (row.module === 'Math Module 2') {
        questions.module4.push(question)
      }
    }
  })
  
  // Ensure Module 2 has exactly 27 questions by adding placeholder questions if needed
  while (questions.module2.length < 27) {
    const placeholderNumber = questions.module2.length + 1
    const placeholderQuestion = {
      texts: [{ text: `Placeholder Question ${placeholderNumber} - This is a sample question for Reading and Writing Module 2. Please replace with actual question content.` }],
      prompt: 'Which choice best completes the text?',
      choices: [
        'A) Placeholder choice A',
        'B) Placeholder choice B', 
        'C) Placeholder choice C',
        'D) Placeholder choice D'
      ],
      correct: 'A',
      module: 'Reading and Writing Module 2',
      graph: null
    }
    questions.module2.push(placeholderQuestion)
  }
  
  // Log final counts for verification
  console.log('Question counts loaded:')
  console.log('Module 1 (Reading and Writing):', questions.module1.length, 'questions')
  console.log('Module 2 (Reading and Writing):', questions.module2.length, 'questions')
  console.log('Module 3 (Math):', questions.module3.length, 'questions')
  console.log('Module 4 (Math):', questions.module4.length, 'questions')
  
  return questions
}

// Questions for each module (using real data from CSV)
const moduleQuestions = parseRealQuestions()

// Answers for each module (dynamically sized based on actual questions)
const moduleAnswers = {
  module1: Array(moduleQuestions.module1.length).fill(null),
  module2: Array(moduleQuestions.module2.length).fill(null),
  module3: Array(moduleQuestions.module3.length).fill(null),
  module4: Array(moduleQuestions.module4.length).fill(null)
}

// Flagged questions for each module (dynamically sized based on actual questions)
const moduleFlaggedQuestions = {
  module1: Array(moduleQuestions.module1.length).fill(false),
  module2: Array(moduleQuestions.module2.length).fill(false),
  module3: Array(moduleQuestions.module3.length).fill(false),
  module4: Array(moduleQuestions.module4.length).fill(false)
}

// Module progress tracking
const moduleProgress = ref({
  module1: 0,
  module2: 0,
  module3: 0,
  module4: 0
})

// Session module configurations (with actual question counts)
const session1Modules = [
  { id: 'module1', title: 'Module 1', type: 'Reading and Writing', questionCount: moduleQuestions.module1.length },
  { id: 'module2', title: 'Module 2', type: 'Reading and Writing', questionCount: moduleQuestions.module2.length }
]

const session2Modules = [
  { id: 'module3', title: 'Module 1', type: 'Math', questionCount: moduleQuestions.module3.length },
  { id: 'module4', title: 'Module 2', type: 'Math', questionCount: moduleQuestions.module4.length }
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
  questionRenderKey.value += 1;
  questionNavRenderKey.value += 1;
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
  flagRenderKey.value += 1;
  questionNavRenderKey.value += 1;
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
  padding: 12px 0 4px 0;
  text-align: center;
  font-size: 12px;
  color: #888;
  border-top: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  gap: 4px;
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