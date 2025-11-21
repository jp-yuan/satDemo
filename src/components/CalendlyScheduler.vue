<template>
  <div class="calendly-page">
    <div class="calendly-content">
      <div class="completion-icon">✅</div>
      <h2>Test Complete!</h2>
      <p class="completion-message">
        Congratulations on completing the Digital SAT practice test! 
        Please schedule an initial meeting for your test review.
      </p>
      <div class="calendly-wrapper">
        <div 
          class="calendly-inline-widget" 
          :data-url="calendlyUrl"
          style="min-width:320px;height:700px;"
        ></div>
      </div>
      <button class="skip-btn" @click="$emit('skip')">
        Skip for Now
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  calendlyUrl: {
    type: String,
    default: 'https://calendly.com/your-calendly-link' // Replace with actual Calendly URL
  }
})

defineEmits(['skip'])

onMounted(() => {
  // Load Calendly widget script if not already loaded
  if (!document.querySelector('script[src*="calendly"]')) {
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.head.appendChild(script)
  }
})
</script>

<style scoped>
.calendly-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.calendly-content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  width: 100%;
}

.completion-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

h2 {
  color: #2c3e50;
  font-size: 32px;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.completion-message {
  color: #555;
  font-size: 18px;
  line-height: 1.6;
  margin: 0 0 30px 0;
}

.calendly-wrapper {
  margin: 30px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.calendly-inline-widget {
  width: 100%;
  border: none;
}

.skip-btn {
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.skip-btn:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.skip-btn:active {
  transform: translateY(0);
}
</style>

