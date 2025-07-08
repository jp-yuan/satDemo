<template>
  <div class="session-page">
    <div class="session-header">
      <h2>{{ sessionTitle }}</h2>
      <p>{{ sessionDescription }}</p>
    </div>
    
    <div class="module-grid">
      <div 
        v-for="module in modules" 
        :key="module.id"
        class="module-card" 
        :class="{ active: currentModule === module.id }" 
        @click="$emit('change-module', module.id)"
      >
        <h3>{{ module.title }}</h3>
        <p>{{ module.type }}</p>
        <div class="module-status">
          <span v-if="moduleProgress[module.id] > 0" class="progress">
            {{ moduleProgress[module.id] }}/{{ module.questionCount }}
          </span>
          <span v-else class="not-started">Not Started</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sessionTitle: String,
  sessionDescription: String,
  modules: Array,
  currentModule: String,
  moduleProgress: Object
})

defineEmits(['change-module'])
</script>

<style scoped>
.session-page {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.session-header {
  text-align: center;
  margin-bottom: 40px;
}

.session-header h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 16px;
}

.session-header p {
  font-size: 16px;
  color: #666;
  max-width: 600px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  max-width: 800px;
  width: 100%;
}

.module-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.module-card:hover {
  border-color: #1976d2;
  background: #e3f2fd;
}

.module-card.active {
  border-color: #1976d2;
  background: #bbdefb;
}

.module-card h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.module-card p {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.module-status {
  font-size: 14px;
  font-weight: bold;
}

.module-status .progress {
  color: #43a047;
}

.module-status .not-started {
  color: #999;
}
</style> 