<template>
  <div v-if="show" class="confirmation-overlay" @click="handleOverlayClick">
    <div class="confirmation-dialog" @click.stop>
      <div class="dialog-header">
        <h3>Confirm Test Start</h3>
      </div>
      <div class="dialog-content">
        <div class="warning-icon">⚠️</div>
        <p class="warning-text">
          <strong>Are you ready to start the {{ moduleType }} test?</strong>
        </p>
        <p class="info-text">
          Clicking "Start Test" will begin the timer immediately and it <strong>will not stop</strong> until the test is complete.
        </p>
        <ul class="warning-list">
          <li>Make sure you have cleared your workspace</li>
          <li>Have your scratch paper and pencil ready</li>
          <li>You cannot pause or restart the timer</li>
          <li>You can return to instructions using the navigation menu</li>
        </ul>
      </div>
      <div class="dialog-actions">
        <button class="cancel-btn" @click="handleCancel">Cancel</button>
        <button class="confirm-btn" @click="handleConfirm">Start Test</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  moduleType: {
    type: String,
    default: 'test'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleOverlayClick = () => {
  emit('cancel')
}
</script>

<style scoped>
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

.confirm-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .confirmation-dialog {
    width: 95%;
    margin: 20px;
  }
  
  .dialog-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .confirm-btn {
    width: 100%;
  }
}
</style>
