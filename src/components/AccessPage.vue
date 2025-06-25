<template>
  <div class="access-page">
    <div class="access-card">
      <img :src="logo" alt="Young Scholars Logo" class="logo" />
      <h2 class="center-title">YOUNG SCHOLARS<br /><span class="subtitle">Center for Talented Youth</span></h2>
      <div class="info-list">

        <div class="info-item">
          <span class="icon">📄</span>
          <div>
            <div class="info-title">Scores</div>
            <div class="info-desc">When you finish the practice test, schedule a review meeting via Calendly.</div>
          </div>
        </div>
        <div class="info-item">
          <span class="icon">🦾</span>
          <div>
            <div class="info-title">Assistive Technology (AT)</div>
            <div class="info-desc">Be sure to practice with any AT you use for testing. If you configure your AT settings here, you may need to repeat this step on test day.</div>
          </div>
        </div>
        <div class="info-item">
          <span class="icon">🔒</span>
          <div>
            <div class="info-title">No Device Lock</div>
            <div class="info-desc">We don't lock your device during practice. On test day, you'll be blocked from using other programs or apps.</div>
          </div>
        </div>
      </div>
      <form class="access-form" @submit.prevent="submitForm">
        <div class="form-group">
          <label for="student-name">Name</label>
          <input id="student-name" v-model="name" required placeholder="Enter your name" />
        </div>
        <div class="form-group">
          <label for="student-email">Email</label>
          <input id="student-email" v-model="email" type="email" required placeholder="Enter your email" />
        </div>
        <label for="code">Please enter the access code:</label>
        <input id="code" v-model="code" required placeholder="" />
        <button type="submit">Submit</button>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import logo from '../assets/logo.png'

const emit = defineEmits(['access-granted'])

const name = ref('')
const email = ref('')
const code = ref('')
const error = ref('')

function submitForm() {
  if (code.value.trim() === 'iloveysi') {
    emit('access-granted', { name: name.value })
  } else {
    error.value = 'Invalid access code. Please try again.'
  }
}
</script>

<style scoped>
.access-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
}
.access-card {
  background: #fff;
  padding: 36px 32px 24px 32px;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.logo {
  width: 300px;
  max-width: 100%;
  margin-bottom: 8px;
}
.center-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}
.subtitle {
  font-size: 1.1rem;
  font-weight: 400;
  color: #222;
}
.info-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 18px;
}
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.icon {
  font-size: 1.5em;
  margin-top: 2px;
}
.info-title {
  font-weight: 600;
  font-size: 1.08em;
  margin-bottom: 2px;
}
.info-desc {
  font-size: 0.98em;
  color: #444;
}
.access-form {
  width: 100%;
  background: #fafbfc;
  border-radius: 10px;
  padding: 18px 16px 14px 16px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}
.access-form label {
  font-weight: 500;
  color: #222;
  margin-bottom: 2px;
}
.access-form input {
  padding: 8px 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  font-size: 15px;
}
.access-form button[type="submit"] {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 0;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
}
.error {
  color: #b94a48;
  font-size: 14px;
  margin-top: 6px;
  text-align: center;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.access-form .form-group + .form-group {
  margin-top: 8px;
}
</style> 