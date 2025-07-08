<template>
  <div class="header-bar">
    <span class="compass">● Young Scholars Testing Center</span>
    <div class="jump-to">
      <span>JUMP TO:</span>
      <select class="jump-select" :value="currentSession" @change="changeSession">
        <option value="session1">Session 1</option>
        <option value="session2">Session 2</option>
      </select>
      <select class="jump-select" :value="currentModule" @change="changeModule" :disabled="showInstructions">
        <option value="module1">Reading and Writing Module 1</option>
        <option value="module2">Reading and Writing Module 2</option>
        <option value="module3">Math Module 1</option>
        <option value="module4">Math Module 2</option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentSession: String,
  currentModule: String,
  showInstructions: Boolean
})

const emit = defineEmits(['change-session', 'change-module'])

function changeSession(event) {
  emit('change-session', event.target.value)
}

function changeModule(event) {
  emit('change-module', event.target.value)
}
</script>

<style scoped>
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

.compass {
  color: #b94a48;
  font-size: 14px;
}

.jump-to {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.jump-select {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 14px;
}

.jump-select:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style> 