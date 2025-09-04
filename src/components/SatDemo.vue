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
      <span class="section-timer"><Timer v-if="showTimer" :minutes="minutes" :seconds="seconds" :start-timer="timerStarted" @finished="handleTimerFinished" /></span>
    </div>



    <!-- Instructions Page -->
    <InstructionsBox 
      v-if="showInstructions && !showBreakPage"
      :title="getModuleInstructionsTitle()"
      :module-type="getModuleType()"
    />

    <!-- Break Page -->
    <BreakPage 
      v-if="showBreakPage"
      @continue="continueToSession2"
    />

    <!-- Loading State -->
    <div v-if="isLoadingQuestions" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading questions...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="questionsError" class="error-container">
      <h3>Error Loading Questions</h3>
      <p>{{ questionsError }}</p>
      <button @click="loadQuestions" class="retry-btn">Retry</button>
    </div>

    <!-- Main Content: Question and Answers -->
    <div v-else-if="!showInstructions && !showBreakPage && currentModule && !isLoadingQuestions" class="main-content">
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
        v-if="!showInstructions && !showBreakPage && currentModule"
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
      <button v-if="!showInstructions && !showBreakPage && currentModule" class="prev-btn" :disabled="currentQuestion === 0" @click="prevQuestion">Prev</button>
      <button 
        v-if="!showInstructions && !showBreakPage && currentModule && !isLastQuestion"
        class="next-btn" 
        @click="nextOrStart"
      >
        Next
      </button>
      <button 
        v-if="showInstructions && !showBreakPage"
        class="next-btn start-test-btn"
        @click="nextOrStart"
      >
        Start Test
      </button>
      <button 
        v-if="!showInstructions && !showBreakPage && currentModule && isLastQuestion"
        class="submit-btn"
        @click="handleSubmit"
      >
        {{ isLastModuleInSession ? 'Submit & Next Session' : 'Submit & Next Module' }}
      </button>
    </div>

    <!-- Footer -->
    <div class="footer">
      <span>{{ props.studentName }}</span>
      <span class="info">SAT® is a registered trademark owned by the College Board, PSAT/NMSQT® is a registered trademark of the College Board and National Merit Scholarship Corporation, neither of which was involved in the production of, nor do they endorse, these materials.</span>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog 
      :show="showConfirmationDialog"
      :module-type="getModuleType()"
      @confirm="confirmTestStart"
      @cancel="cancelTestStart"
    />

    <!-- Submit Confirmation Dialog -->
    <div v-if="showSubmitConfirmation" class="confirmation-overlay" @click="cancelSubmit">
      <div class="confirmation-dialog" @click.stop>
        <div class="dialog-header">
          <h3>Confirm Submit</h3>
        </div>
        <div class="dialog-content">
          <div class="warning-icon">📝</div>
          <p class="warning-text">
            <strong>Are you sure you want to submit this module?</strong>
          </p>
          <p class="info-text">
            You will not be able to return to this module once submitted.
          </p>
          <ul class="warning-list">
            <li>All your answers will be saved</li>
            <li>You cannot go back to change answers</li>
            <li>The timer will stop</li>
            <li>You will move to the next {{ isLastModuleInSession ? 'session' : 'module' }}</li>
          </ul>
        </div>
        <div class="dialog-actions">
          <button class="cancel-btn" @click="cancelSubmit">Cancel</button>
          <button class="confirm-btn submit-confirm-btn" @click="confirmSubmit">Submit Module</button>
        </div>
      </div>
    </div>

    <!-- Module Transition Notification -->
    <div v-if="showModuleTransition" class="module-transition">
      <div class="transition-content">
        <h3>Module Complete</h3>
        <p>{{ getTransitionMessage() }}</p>
      </div>
    </div>

    <!-- Debug Panel (remove in production) -->
    <div v-if="showDebugPanel" class="debug-panel">
      <h4>Debug Panel</h4>
      <p>Current Session: {{ currentSession }}</p>
      <p>Current Module: {{ currentModule }}</p>
      <p>Questions Count: {{ getCurrentQuestions().length }}</p>
      <p>Current Question: {{ currentQuestion }}</p>
      <button @click="debugSwitchToMath">Switch to Math Session</button>
      <button @click="saveToLocalStorage">Save Progress Now</button>
      <button @click="loadFromLocalStorage">Load Progress Now</button>
      <button @click="clearLocalStorage">Clear Progress</button>
      <button @click="showDebugPanel = false">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Timer from './Timer.vue'
import HeaderBar from './HeaderBar.vue'

import QuestionArea from './QuestionArea.vue'
import QuestionNavigation from './QuestionNavigation.vue'
import InstructionsBox from './InstructionsBox.vue'
import ConfirmationDialog from './ConfirmationDialog.vue'
import BreakPage from './BreakPage.vue'
import Papa from 'papaparse'
import csvData from '../assets/data.csv?raw'
import { supabase } from '../lib/supabase'    
import { fetchQuestions } from '../lib/loadingQuestion.js'

const props = defineProps({
  studentName: { type: String, default: 'Demo Student' }
})

// Debug: Log the student name
console.log('Student name received:', props.studentName)

// Debug: Test localStorage availability
console.log('localStorage available:', typeof localStorage !== 'undefined')
if (typeof localStorage !== 'undefined') {
  console.log('localStorage test - setting test value')
  localStorage.setItem('test_key', 'test_value')
  console.log('localStorage test - retrieved value:', localStorage.getItem('test_key'))
}

// LocalStorage functions for saving user progress
const STORAGE_KEYS = {
  ANSWERS: 'sat_demo_answers',
  FLAGGED: 'sat_demo_flagged',
  PROGRESS: 'sat_demo_progress',
  CURRENT_QUESTION: 'sat_demo_current_question',
  CURRENT_SESSION: 'sat_demo_current_session',
  CURRENT_MODULE: 'sat_demo_current_module',
  TIMER_STARTED: 'sat_demo_timer_started'
}

function saveToLocalStorage() {
  try {
    console.log('Saving to localStorage...')
    console.log('Current answers:', moduleAnswers.value)
    console.log('Current question:', currentQuestion.value)
    console.log('Current session:', currentSession.value)
    console.log('Current module:', currentModule.value)
    
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(moduleAnswers.value))
    localStorage.setItem(STORAGE_KEYS.FLAGGED, JSON.stringify(moduleFlaggedQuestions.value))
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(moduleProgress.value))
    localStorage.setItem(STORAGE_KEYS.CURRENT_QUESTION, currentQuestion.value.toString())
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, currentSession.value)
    localStorage.setItem(STORAGE_KEYS.CURRENT_MODULE, currentModule.value)
    localStorage.setItem(STORAGE_KEYS.TIMER_STARTED, timerStarted.value.toString())
    
    // Verify the save worked
    const savedAnswers = localStorage.getItem(STORAGE_KEYS.ANSWERS)
    console.log('Verification - saved answers:', savedAnswers)
    console.log('Progress saved to localStorage successfully')
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

function loadFromLocalStorage() {
  try {
    console.log('Attempting to load from localStorage...')
    console.log('Questions loaded - module1 length:', moduleQuestions.value.module1.length)
    
    // Only load if questions are available
    if (moduleQuestions.value.module1.length === 0) {
      console.log('Questions not loaded yet, skipping localStorage load')
      return
    }

    // Load answers
    const savedAnswers = localStorage.getItem(STORAGE_KEYS.ANSWERS)
    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers)
      // Only load if the saved data structure matches current questions
      if (parsedAnswers.module1 && parsedAnswers.module1.length === moduleQuestions.value.module1.length) {
        moduleAnswers.value = parsedAnswers
        console.log('Answers loaded from localStorage:', moduleAnswers.value)
      }
    }

    // Load flagged questions
    const savedFlagged = localStorage.getItem(STORAGE_KEYS.FLAGGED)
    if (savedFlagged) {
      const parsedFlagged = JSON.parse(savedFlagged)
      // Only load if the saved data structure matches current questions
      if (parsedFlagged.module1 && parsedFlagged.module1.length === moduleQuestions.value.module1.length) {
        moduleFlaggedQuestions.value = parsedFlagged
        console.log('Flagged questions loaded from localStorage:', moduleFlaggedQuestions.value)
      }
    }

    // Load progress
    const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS)
    if (savedProgress) {
      moduleProgress.value = JSON.parse(savedProgress)
      console.log('Progress loaded from localStorage:', moduleProgress.value)
    }

    // Load current question
    const savedCurrentQuestion = localStorage.getItem(STORAGE_KEYS.CURRENT_QUESTION)
    if (savedCurrentQuestion) {
      const questionNum = parseInt(savedCurrentQuestion)
      // Only load if the question number is valid for current module
      if (questionNum >= 0 && questionNum < getCurrentQuestions().length) {
        currentQuestion.value = questionNum
        console.log('Current question loaded from localStorage:', currentQuestion.value)
      }
    }

    // Load current session
    const savedCurrentSession = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION)
    if (savedCurrentSession) {
      currentSession.value = savedCurrentSession
      console.log('Current session loaded from localStorage:', currentSession.value)
    }

    // Load current module
    const savedCurrentModule = localStorage.getItem(STORAGE_KEYS.CURRENT_MODULE)
    if (savedCurrentModule) {
      currentModule.value = savedCurrentModule
      console.log('Current module loaded from localStorage:', currentModule.value)
    }

    // Load timer started state
    const savedTimerStarted = localStorage.getItem(STORAGE_KEYS.TIMER_STARTED)
    if (savedTimerStarted) {
      timerStarted.value = savedTimerStarted === 'true'
      console.log('Timer started state loaded from localStorage:', timerStarted.value)
    }

    // If we have saved data, we're continuing a test, so show instructions
    if (savedAnswers || savedCurrentQuestion) {
      showInstructions.value = true
      console.log('Continuing previous test session')
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
  }
}

function clearLocalStorage() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    console.log('LocalStorage cleared')
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

const showTimer = true
const minutes = 43
const seconds = 22

const showInstructions = ref(true)
const timerStarted = ref(false)
const currentQuestion = ref(0)
const currentSession = ref('session1')
const currentModule = ref('module1')
const showConfirmationDialog = ref(false)
const showModuleTransition = ref(false)
const showSubmitConfirmation = ref(false)
const showDebugPanel = ref(false)
const showBreakPage = ref(false)

const questionRenderKey = ref(0);
const flagRenderKey = ref(0);
const questionNavRenderKey = ref(0);

// Computed properties for navigation
const isLastQuestion = computed(() => {
  const currentQuestions = getCurrentQuestions()
  return currentQuestion.value === currentQuestions.length - 1
})

const isLastModuleInSession = computed(() => {
  if (currentSession.value === 'session1') {
    return currentModule.value === 'module2'
  } else {
    return currentModule.value === 'module4'
  }
})

// Parse CSV data
const parsed = Papa.parse(csvData, {
  header: true,
  skipEmptyLines: true
})

/*
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
  }

)
  
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
*/

// Initialize questions as empty - will be loaded asynchronously
const moduleQuestions = ref({
  module1: [],
  module2: [],
  module3: [],
  module4: []
})

// Loading state
const isLoadingQuestions = ref(true)
const questionsError = ref(null)

// Load questions asynchronously
const loadQuestions = async () => {
  try {
    isLoadingQuestions.value = true
    questionsError.value = null
    const questions = await fetchQuestions()
    moduleQuestions.value = questions
    initializeModuleData() // Initialize answers and flagged questions
    console.log('Questions loaded successfully:', questions)
  } catch (error) {
    console.error('Error loading questions:', error)
    questionsError.value = error.message || 'Failed to load questions'
  } finally {
    isLoadingQuestions.value = false
  }
}

// Watch for when questions are loaded to load saved data
watch(() => moduleQuestions.value.module1.length, (newLength) => {
  if (newLength > 0) {
    console.log('Questions loaded, now loading saved data')
    loadFromLocalStorage()
  }
})

// Load questions when component mounts
onMounted(async () => {
  await loadQuestions()
})


// Answers for each module (dynamically sized based on actual questions)
const moduleAnswers = ref({
  module1: [],
  module2: [],
  module3: [],
  module4: []
})

// Flagged questions for each module (dynamically sized based on actual questions)
const moduleFlaggedQuestions = ref({
  module1: [],
  module2: [],
  module3: [],
  module4: []
})

// Initialize answers and flagged questions when questions are loaded
const initializeModuleData = () => {
  moduleAnswers.value = {
    module1: Array(moduleQuestions.value.module1.length).fill(null),
    module2: Array(moduleQuestions.value.module2.length).fill(null),
    module3: Array(moduleQuestions.value.module3.length).fill(null),
    module4: Array(moduleQuestions.value.module4.length).fill(null)
  }
  
  moduleFlaggedQuestions.value = {
    module1: Array(moduleQuestions.value.module1.length).fill(false),
    module2: Array(moduleQuestions.value.module2.length).fill(false),
    module3: Array(moduleQuestions.value.module3.length).fill(false),
    module4: Array(moduleQuestions.value.module4.length).fill(false)
  }
}

// Module progress tracking
const moduleProgress = ref({
  module1: 0,
  module2: 0,
  module3: 0,
  module4: 0
})



// Helper functions
function getCurrentQuestions() {
  const questions = moduleQuestions.value[currentModule.value] || []
  console.log('Getting questions for module:', currentModule.value, 'Questions count:', questions.length)
  return questions
}

function getCurrentAnswers() {
  return moduleAnswers.value[currentModule.value] || []
}

function getCurrentFlaggedQuestions() {
  return moduleFlaggedQuestions.value[currentModule.value] || []
}

function getSessionTitle() {
  const sessionNames = {
    session1: 'Session 1: Reading and Writing',
    session2: 'Session 2: Math'
  }
  const title = sessionNames[currentSession.value] || 'Digital SAT'
  console.log('Session title for', currentSession.value, ':', title)
  return title
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

function getTransitionMessage() {
  if (currentModule.value === 'module1') {
    return 'Moving to Reading and Writing Module 2...'
  } else if (currentModule.value === 'module2') {
    return 'Moving to Math Session...'
  } else if (currentModule.value === 'module3') {
    return 'Moving to Math Module 2...'
  } else if (currentModule.value === 'module4') {
    return 'Test Complete!'
  }
  return 'Moving to next module...'
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
  timerStarted.value = false
}

function changeModule(module) {
  currentModule.value = module
  showInstructions.value = true
  currentQuestion.value = 0
  timerStarted.value = false
}

function selectAnswer(idx) {
  const currentAnswers = getCurrentAnswers()
  currentAnswers[currentQuestion.value] = idx
  
  // Update progress
  const answeredCount = currentAnswers.filter(answer => answer !== null).length
  moduleProgress.value[currentModule.value] = answeredCount
  questionRenderKey.value += 1;
  questionNavRenderKey.value += 1;
  
  // Save to localStorage
  saveToLocalStorage()
}

function nextOrStart() {
  if (showInstructions.value) {
    // Show confirmation dialog before starting the test
    showConfirmationDialog.value = true
  } else if (currentQuestion.value < getCurrentQuestions().length - 1) {
    currentQuestion.value++
    // Save to localStorage
    saveToLocalStorage()
  }
}

function confirmTestStart() {
  showConfirmationDialog.value = false
  showInstructions.value = false
  timerStarted.value = true
  // The timer will start when timerStarted becomes true
  
  // Save to localStorage
  saveToLocalStorage()
}

function cancelTestStart() {
  showConfirmationDialog.value = false
  // User stays on instructions page
}

function handleTimerFinished() {
  // Show transition notification
  showModuleTransition.value = true
  
  // Auto-advance to next module when timer ends
  setTimeout(() => {
    if (currentModule.value === 'module1') {
      // Move to module 2
      currentModule.value = 'module2'
      showInstructions.value = true
      currentQuestion.value = 0
      timerStarted.value = false
      showModuleTransition.value = false
    } else if (currentModule.value === 'module2') {
      // Move to session 2, module 3
      currentSession.value = 'session2'
      currentModule.value = 'module3'
      showInstructions.value = true
      currentQuestion.value = 0
      timerStarted.value = false
      showModuleTransition.value = false
    } else if (currentModule.value === 'module3') {
      // Move to module 4
      currentModule.value = 'module4'
      showInstructions.value = true
      currentQuestion.value = 0
      timerStarted.value = false
      showModuleTransition.value = false
    } else if (currentModule.value === 'module4') {
      // Test complete - could show completion screen
      showModuleTransition.value = false
      alert('Test Complete! All modules finished.')
    }
  }, 2000) // Show transition for 2 seconds
}

function resetTimer() {
  // Reset timer to initial values for the new module
  // This will be handled by the Timer component when startTimer becomes false then true
}

function handleSubmit() {
  // Show submit confirmation dialog
  showSubmitConfirmation.value = true
}

function confirmSubmit() {
  showSubmitConfirmation.value = false
  
  // Stop the timer
  timerStarted.value = false
  
  // Show transition notification
  showModuleTransition.value = true
  
  setTimeout(() => {
    console.log('Current module before transition:', currentModule.value)
    console.log('Current session before transition:', currentSession.value)
    
    if (currentModule.value === 'module1') {
      // Move to module 2
      currentModule.value = 'module2'
      showInstructions.value = true
      currentQuestion.value = 0
      showModuleTransition.value = false
    } else if (currentModule.value === 'module2') {
      // Show break page before moving to session 2
      console.log('Showing break page before session 2')
      showBreakPage.value = true
      showModuleTransition.value = false
    } else if (currentModule.value === 'module3') {
      // Move to module 4
      currentModule.value = 'module4'
      showInstructions.value = true
      currentQuestion.value = 0
      showModuleTransition.value = false
    } else if (currentModule.value === 'module4') {
      // Test complete
      showModuleTransition.value = false
      clearLocalStorage() // Clear saved data when test is complete
      alert('Test Complete! All modules finished.')
    }
  }, 2000) // Show transition for 2 seconds
}

function cancelSubmit() {
  showSubmitConfirmation.value = false
}

function continueToSession2() {
  showBreakPage.value = false
  currentSession.value = 'session2'
  currentModule.value = 'module3'
  showInstructions.value = true
  currentQuestion.value = 0
  timerStarted.value = false
  console.log('Continuing to Session 2 - Session:', currentSession.value, 'Module:', currentModule.value)
  
  // Save to localStorage
  saveToLocalStorage()
}

function debugSwitchToMath() {
  console.log('Debug: Switching to Math session')
  currentSession.value = 'session2'
  currentModule.value = 'module3'
  showInstructions.value = true
  currentQuestion.value = 0
  timerStarted.value = false
  console.log('Debug: After switch - Session:', currentSession.value, 'Module:', currentModule.value)
}

// Debug keyboard shortcut
function handleKeyPress(event) {
  if (event.ctrlKey && event.key === 'd') {
    showDebugPanel.value = !showDebugPanel.value
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
})

function prevQuestion() {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
    // Save to localStorage
    saveToLocalStorage()
  }
}

function jumpToQuestion(idx) {
  currentQuestion.value = idx
  showInstructions.value = false
  
  // Save to localStorage
  saveToLocalStorage()
}

function toggleFlag(idx) {
  const currentFlagged = getCurrentFlaggedQuestions()
  currentFlagged[idx] = !currentFlagged[idx]
  console.log(currentFlagged)
  flagRenderKey.value += 1;
  questionNavRenderKey.value += 1;
  
  // Save to localStorage
  saveToLocalStorage()
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

.start-test-btn {
  background: #d32f2f !important;
  font-weight: 600;
  padding: 10px 28px;
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
  animation: pulse 2s infinite;
}

.submit-btn {
  background: #2e7d32 !important;
  color: white !important;
  font-weight: 600;
  padding: 10px 28px;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
  animation: submitPulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(211, 47, 47, 0.5);
  }
  100% {
    box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
  }
}

@keyframes submitPulse {
  0% {
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(46, 125, 50, 0.5);
  }
  100% {
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
  }
}

.module-transition {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
}

.transition-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.transition-content h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 24px;
}

.transition-content p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.confirmation-dialog {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dialog-header {
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e1e5e9;
}

.dialog-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
  font-weight: 600;
}

.dialog-content {
  padding: 24px;
  text-align: center;
}

.warning-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.warning-text {
  font-size: 18px;
  color: #d32f2f;
  margin: 0 0 16px 0;
  font-weight: 500;
}

.info-text {
  font-size: 16px;
  color: #555;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.warning-list {
  text-align: left;
  margin: 20px 0;
  padding-left: 20px;
}

.warning-list li {
  margin: 8px 0;
  color: #666;
  line-height: 1.4;
}

.dialog-actions {
  padding: 0 24px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 12px 24px;
  border: 2px solid #e1e5e9;
  background: white;
  color: #666;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #f8f9fa;
  border-color: #ced4da;
}

.confirm-btn {
  padding: 12px 24px;
  border: none;
  background: #d32f2f;
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-btn:hover {
  background: #b71c1c;
  transform: translateY(-1px);
}

.submit-confirm-btn {
  background: #2e7d32 !important;
}

.submit-confirm-btn:hover {
  background: #1b5e20 !important;
}

.debug-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  z-index: 3000;
  max-width: 300px;
}

.debug-panel h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.debug-panel p {
  margin: 5px 0;
  font-size: 12px;
}

.debug-panel button {
  margin: 5px;
  padding: 5px 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0084ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 20px;
  text-align: center;
  padding: 20px;
}

.error-container h3 {
  color: #d32f2f;
  margin: 0;
}

.error-container p {
  color: #666;
  margin: 0;
}

.retry-btn {
  background: #0084ff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #0066cc;
}
</style> 