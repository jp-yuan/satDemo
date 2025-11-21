<template>
  <div class="question-area">
    <div class="question-header">
      <div class="question-number">{{ questionNumber }}</div>
      <button
        class="flag-btn"
        :class="{ flagged: isFlagged }"
        @click="$emit('toggle-flag')"
        title="Flag this question for review"
      >
        <svg v-if="isFlagged" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 2v12h2v-4h7.382l-1.447 2.894A1 1 0 0 0 11.764 15H14a1 1 0 0 0 .894-1.447l-2-4A1 1 0 0 0 12 9H4V2H2zm2 2v5h7.382l2 4H11.764l1.447-2.894A1 1 0 0 0 12 9H4V4z"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M2 2v12h2v-4h7.382l-1.447 2.894A1 1 0 0 0 11.764 15H14a1 1 0 0 0 .894-1.447l-2-4A1 1 0 0 0 12 9H4V2H2z"/>
        </svg>
        {{ isFlagged ? 'Unflag' : 'Flag' }}
      </button>
    </div>
    
    <!-- Question prompt with HTML rendering -->
    <div class="question-prompt" v-html="question.prompt"></div>
    
    <!-- Multiple choice questions -->
    <div v-if="showMultipleChoice" class="choices">
      <button
        v-for="(choice, idx) in displayChoices"
        :key="idx"
        class="choice-btn"
        :class="{ selected: selectedAnswer === idx }"
        @click="$emit('select-answer', idx)"
      >
        <span class="choice-letter">{{ String.fromCharCode(65 + idx) }}</span>
        <span class="choice-text" v-html="choice"></span>
      </button>
    </div>
    
    <!-- Short answer questions -->
    <div v-else class="short-answer">
      <input
        type="text"
        :value="selectedAnswer"
        @input="$emit('input-answer', $event.target.value)"
        placeholder="Enter your answer"
        class="answer-input"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  questionNumber: Number,
  question: Object,
  selectedAnswer: [Number, String],
  isFlagged: Boolean
})

defineEmits(['select-answer', 'input-answer', 'toggle-flag'])

// Determine if this is a multiple choice question
const showMultipleChoice = computed(() => {
  // For math modules, check is_multiple_choice field
  if (props.question.is_multiple_choice !== undefined) {
    return props.question.is_multiple_choice
  }
  // For Reading/Writing modules, show choices if they exist
  return props.question.choices && props.question.choices.length > 0
})

// Get the appropriate choices to display
const displayChoices = computed(() => {
  // For math modules with HTML choices
  if (props.question.choices_raw) {
    try {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = props.question.choices_raw
      const choiceElements = tempDiv.querySelectorAll('li')
      const choices = []
      
      choiceElements.forEach(li => {
        const choiceText = li.innerHTML
        if (choiceText.trim()) {
          choices.push(choiceText)
        }
      })
      
      return choices
    } catch (error) {
      console.error('Error parsing HTML choices:', error)
      return []
    }
  }
  // For Reading/Writing modules with regular choices
  return props.question.choices || []
})
</script>

<style scoped>
.question-area {
  flex: 3;
  background: #fff;
  border-left: 2px solid #e0e0e0;
  padding-left: 32px;
  display: flex;
  flex-direction: column;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.question-number {
  font-size: 20px;
  font-weight: bold;
  color: #000;
}

.question-prompt {
  font-size: 16px;
  margin-bottom: 18px;
  color: #000;
  font-weight: 500;
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

.choice-btn.selected {
  background: #1976d2;
  color: #fff;
  border-color: #1976d2;
}

.choice-letter {
  font-weight: bold;
  margin-right: 8px;
}

.flag-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.flag-btn:hover {
  background: #e0e0e0;
}

.flag-btn.flagged {
  background: #ffebee;
  border-color: #e57373;
  color: #d32f2f;
}

.short-answer {
  margin-top: 18px;
}

.answer-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #222;
  border-radius: 6px;
  font-size: 16px;
  background: #fff;
  transition: border-color 0.2s;
}

.answer-input:focus {
  outline: none;
  border-color: #1976d2;
}

/* Math expression styling */
.question-prompt math,
.choice-text math {
  font-family: 'Times New Roman', serif;
  font-style: italic;
}

.question-prompt mfrac,
.choice-text mfrac {
  display: inline-block;
  text-align: center;
  vertical-align: middle;
}

.question-prompt msup,
.choice-text msup {
  font-size: 0.8em;
  vertical-align: super;
}

.question-prompt msub,
.choice-text msub {
  font-size: 0.8em;
  vertical-align: sub;
}
</style> 