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
    <div class="question-prompt">{{ question.prompt }}</div>
    <div class="choices">
      <button
        v-for="(choice, idx) in question.choices"
        :key="idx"
        class="choice-btn"
        :class="{ selected: selectedAnswer === idx }"
        @click="$emit('select-answer', idx)"
      >
        <span class="choice-letter">{{ String.fromCharCode(65 + idx) }}</span>
        <span class="choice-text">{{ choice }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  questionNumber: Number,
  question: Object,
  selectedAnswer: Number,
  isFlagged: Boolean
})

defineEmits(['select-answer', 'toggle-flag'])
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
</style> 