<template>
  <div class="question-nav">
    <button
      v-for="(question, idx) in questions"
      :key="idx"
      class="question-nav-btn"
      :class="{ 
        active: currentQuestion === idx, 
        answered: answers[idx] !== null, 
        flagged: flaggedQuestions[idx] 
      }"
      @click="$emit('jump-to-question', idx)"
    >
      {{ idx + 1 }}
      <span
        class="flag-icon"
        :class="{ flagged: flaggedQuestions[idx] }"
        @click.stop="$emit('toggle-flag', idx)"
        title="Flag this question"
      >
        <svg v-if="flaggedQuestions[idx]" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 2v12h2v-4h7.382l-1.447 2.894A1 1 0 0 0 11.764 15H14a1 1 0 0 0 .894-1.447l-2-4A1 1 0 0 0 12 9H4V2H2zm2 2v5h7.382l2 4H11.764l1.447-2.894A1 1 0 0 0 12 9H4V4z"/>
        </svg>
        <svg v-else width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M2 2v12h2v-4h7.382l-1.447 2.894A1 1 0 0 0 11.764 15H14a1 1 0 0 0 .894-1.447l-2-4A1 1 0 0 0 12 9H4V2H2z"/>
        </svg>
      </span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  questions: Array,
  currentQuestion: Number,
  answers: Array,
  flaggedQuestions: Array
})

defineEmits(['jump-to-question', 'toggle-flag'])
</script>

<style scoped>
.question-nav {
  background-color: #333;
  overflow: hidden;
  display: flex;
  justify-content: center;
  gap: 2px;
  margin: 18px 0 0 0;
  padding: 8px 0;
}

.question-nav-btn {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
  font-weight: bold;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  border-radius: 4px;
  margin: 0 2px;
  position: relative;
  min-width: 50px;
}

.question-nav-btn:hover {
  background-color: #ddd;
  color: black;
}

.question-nav-btn.active {
  background-color: #04AA6D;
  color: white;
}

.question-nav-btn.answered {
  border: 2px solid #43a047;
}

.question-nav-btn.flagged {
  border: 2px solid #e57373;
  background-color: rgba(229, 115, 115, 0.1);
}

.question-nav-btn.flagged:hover {
  background-color: rgba(229, 115, 115, 0.2);
}

.flag-icon {
  position: absolute;
  top: 2px;
  right: 2px;
  cursor: pointer;
  color: #bbb;
  transition: color 0.2s;
  font-size: 10px;
}

.flag-icon.flagged {
  color: #e57373;
}

.flag-icon:hover {
  color: #e57373;
}
</style> 