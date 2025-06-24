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
                <img v-if="text.img" :src="text.img" alt="Question Image" class="question-img" />
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
      <span>Demo Student</span>
      <span class="info">SAT® is a registered trademark owned by the College Board, PSAT/NMSQT® is a registered trademark of the College Board and National Merit Scholarship Corporation, neither of which was involved in the production of, nor do they endorse, these materials.</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Timer from './Timer.vue'

const showTimer = true
const minutes = 43
const seconds = 22

const showInstructions = ref(true)

const questions = [
  {
    texts: [
      `As California faces another drought, urban residents have been called upon to do their part. About 62 gallons of water per week is needed for every one hundred square feet of grassy lawn. The average backyard is about 1,500 square feet. Add the front yard, and multiply by all the houses in a city. When residents cut down on their lawn watering, the effect is cumulative. It adds up to millions of gallons of water saved per week.`,
      `The California Department of Water Resources reports that agriculture (farmland) accounts for 29% of all water use during a wet year. During a dry year, that figure more than doubles, claiming a staggering 61%. In contrast, urban water use ranges from just 8% during a wet year to 11% during a dry one. These figures make sense when considering that most water usage for urban dwellers happens indoors. Lawn watering—which fluctuates from wet years to dry years—is a small piece of the pie.`
    ],
    prompt: `Based on the texts, how would the author of Text 2 most likely describe the view presented in Text 1?`,
    choices: [
      'It is compelling and supports the data from the California Department of Water Resources report.',
      'It is accurate, but it lacks context provided by the data from the California Department of Water Resources report.',
      'It is plausible, but it contradicts the data from the California Department of Water Resources report.',
      'It is probably only applicable to water usage patterns during wet years and does not address the data from the California Department of Water Resources report.'
    ]
  },
  {
    texts: [
      "Text 1: The city's new recycling program has been a huge success. In the first month alone, residents recycled over 100 tons of material, reducing landfill waste by 20%.",
      "Text 2: While the city's recycling program has made progress, some materials are still ending up in landfills. Continued education and outreach are needed to further improve recycling rates."
    ],
    prompt: `Based on the texts, what is the main difference between the perspectives of the two authors?`,
    choices: [
      "The author of Text 1 is more optimistic about the program's success than the author of Text 2.",
      "The author of Text 2 believes the program is unnecessary.",
      "The author of Text 1 thinks recycling rates are too low.",
      "The author of Text 2 is unaware of the program's results."
    ]
  }
]

const currentQuestion = ref(0)
const answers = ref(Array(questions.length).fill(null))

function selectAnswer(idx) {
  answers.value[currentQuestion.value] = idx
  console.log(answers.value)
}

function nextOrStart() {
  if (showInstructions.value) {
    showInstructions.value = false
  } else if (currentQuestion.value < questions.length - 1) {
    currentQuestion.value++
  }
}
function prevQuestion() {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
  }
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
</style> 