<template>
  <div class="break-page">
    <div class="break-content">
      <div class="break-icon">☕</div>
      <h2>Break Time!</h2>
      <p class="break-message">
        You have completed Session 1: Reading and Writing. 
        Take a moment to rest before continuing to Session 2: Math.
      </p>
      <div class="break-details">
        <div class="detail-item">
          <span class="detail-label">Session 1 Complete:</span>
          <span class="detail-value">Reading and Writing</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Next Session:</span>
          <span class="detail-value">Math</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Time Remaining:</span>
          <span class="detail-value">Take your time</span>
        </div>
      </div>
      <button class="continue-btn" @click="$emit('continue')">
        Continue to Session 2: Math
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['continue'])
</script>

<style scoped>
.break-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.break-content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.break-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

h2 {
  color: #2c3e50;
  font-size: 32px;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.break-message {
  color: #555;
  font-size: 18px;
  line-height: 1.6;
  margin: 0 0 30px 0;
}

.break-details {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin: 30px 0;
  text-align: left;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #6c757d;
}

.detail-value {
  font-weight: 600;
  color: #2c3e50;
}

.continue-btn {
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.continue-btn:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
}

.continue-btn:active {
  transform: translateY(0);
}
</style>
