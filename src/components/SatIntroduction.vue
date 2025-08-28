<template>
  <div class="intro-page">
    <!-- Left Sidebar Navigation -->
    <nav class="sidebar">
      <div class="sidebar-header">
        <img :src="logo" alt="Young Scholars Logo" class="sidebar-logo" />
        <h3 class="sidebar-title">Young Scholars</h3>
      </div>
      
      <div class="sidebar-user">
        <div class="user-avatar">👤</div>
        <div class="user-info">
                  <p class="user-name">{{ currentUser?.name || 'Student' }}</p>
        <p class="user-email">{{ currentUser?.email || 'student@example.com' }}</p>
        </div>
      </div>

      <ul class="nav-menu">
        <li class="nav-item active">
          <a href="#" class="nav-link">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">Dashboard</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" @click.prevent="startTest" class="nav-link">
            <span class="nav-icon">📝</span>
            <span class="nav-text">Practice Test</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" @click.prevent="viewDemo" class="nav-link">
            <span class="nav-icon">🎯</span>
            <span class="nav-text">Demo Test</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" @click.prevent="viewProgress" class="nav-link">
            <span class="nav-icon">📊</span>
            <span class="nav-text">Progress</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" @click.prevent="viewResources" class="nav-link">
            <span class="nav-icon">📚</span>
            <span class="nav-text">Resources</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="#" @click.prevent="viewSettings" class="nav-link">
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">Settings</span>
          </a>
        </li>
      </ul>

      <div class="sidebar-footer">
        <button @click="logout" class="sidebar-logout">
          <span class="logout-icon">🚪</span>
          <span class="logout-text">Logout</span>
        </button>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="main-content">
      <div class="content-header">
        <h1 class="page-title">Free SAT Practice Test</h1>
        <p class="page-subtitle">Center for Talented Youth - Young Scholars Initiative</p>
      </div>

      <div class="content-body">
        <div class="welcome-section">
          <p class="welcome-text">Welcome, {{ currentUser?.name || 'Student' }}!</p>
        </div>

        <div class="test-overview">
          <h2 class="section-title">Test Overview</h2>
          <div class="overview-grid">
            <div class="overview-item">
              <div class="item-icon">⏱️</div>
              <h3>Duration</h3>
              <p>3 hours total</p>
              <ul>
                <li>Reading: 65 minutes</li>
                <li>Writing: 35 minutes</li>
                <li>Math: 80 minutes</li>
              </ul>
            </div>
            <div class="overview-item">
              <div class="item-icon">📝</div>
              <h3>Questions</h3>
              <p>154 total questions</p>
              <ul>
                <li>Reading: 52 questions</li>
                <li>Writing: 44 questions</li>
                <li>Math: 58 questions</li>
              </ul>
            </div>
            <div class="overview-item">
              <div class="item-icon">📊</div>
              <h3>Scoring</h3>
              <p>400-1600 scale</p>
              <ul>
                <li>Evidence-Based Reading: 200-800</li>
                <li>Math: 200-800</li>
                <li>Detailed score report</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="instructions-section">
          <h2 class="section-title">Important Instructions</h2>
          <div class="instructions-list">
            <div class="instruction-item">
              <div class="instruction-icon">🖥️</div>
              <div class="instruction-content">
                <h4>Test Environment</h4>
                <p>This is a practice test that simulates the actual SAT experience. Find a quiet, distraction-free environment.</p>
              </div>
            </div>
            <div class="instruction-item">
              <div class="instruction-icon">⏰</div>
              <div class="instruction-content">
                <h4>Timing</h4>
                <p>Each section is timed. The timer will automatically submit your answers when time runs out.</p>
              </div>
            </div>
            <div class="instruction-item">
              <div class="instruction-icon">📋</div>
              <div class="instruction-content">
                <h4>Navigation</h4>
                <p>You can navigate between questions within each section, but you cannot go back to previous sections.</p>
              </div>
            </div>
            <div class="instruction-item">
              <div class="instruction-icon">💾</div>
              <div class="instruction-content">
                <h4>Progress</h4>
                <p>Your progress is automatically saved. You can pause and resume the test if needed.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="preparation-tips">
          <h2 class="section-title">Preparation Tips</h2>
          <div class="tips-container">
            <div class="tip-section">
              <h4>Before You Start</h4>
              <ul>
                <li>Have scratch paper ready for math calculations</li>
                <li>Use a calculator for the math section</li>
                <li>Ensure your device is fully charged</li>
                <li>Close other applications and browser tabs</li>
              </ul>
            </div>
            <div class="tip-section">
              <h4>During the Test</h4>
              <ul>
                <li>Read questions carefully</li>
                <li>Manage your time wisely</li>
                <li>Answer every question (no penalty for guessing)</li>
                <li>Use the process of elimination</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="action-section">
          <h3 class="action-title">Ready to Begin?</h3>
          <p class="action-description">Click the button below to start your free SAT practice test. Good luck!</p>
          <div class="action-buttons">
            <button @click="startTest" class="primary-btn">Start Practice Test</button>
            <button @click="viewDemo" class="secondary-btn">View Demo First</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../assets/logo.png'
import { supabase } from '@/lib/supabase'
import { currentUser, isAuthenticated } from '@/lib/authStore'

const router = useRouter()

onMounted(() => {
  // User data is now managed by the auth store
  // No need to manually fetch user data here
})

const startTest = () => {
  // Navigate to the actual SAT test component
  router.push('/sat-test')
}

const viewDemo = () => {
  // Navigate to a demo/test component
  router.push('/sat-demo')
}

const viewProgress = () => {
  // Navigate to progress page
  router.push('/progress')
}

const viewResources = () => {
  // Navigate to resources page
  router.push('/resources')
}

const viewSettings = () => {
  // Navigate to settings page
  alert('Settings page coming soon!')
}

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<style scoped>
.intro-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  background: #f5f7fa;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

/* Sidebar Navigation */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
}

.sidebar-logo {
  width: 60px;
  height: auto;
  margin-bottom: 10px;
}

.sidebar-title {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
  font-weight: bold;
}

.sidebar-user {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e9ecef;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1rem;
  color: #333;
  margin: 0 0 4px 0;
  font-weight: 600;
}

.user-email {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: #f8f9fa;
  color: #667eea;
  border-left-color: #667eea;
}

.nav-item.active .nav-link {
  background: #e3f2fd;
  color: #667eea;
  border-left-color: #667eea;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
}

.nav-text {
  font-size: 0.95rem;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #e9ecef;
}

.sidebar-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.3s ease;
}

.sidebar-logout:hover {
  background: #c82333;
}

.logout-icon {
  font-size: 1.1rem;
}

/* Main Content Area */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: #f5f7fa;
}

.content-header {
  background: white;
  padding: 30px 40px;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
}

.content-body {
  flex: 1;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.page-title {
  font-size: 2.5rem;
  color: #333;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.welcome-section {
  margin-bottom: 30px;
  text-align: center;
}

.welcome-text {
  font-size: 1.3rem;
  color: #667eea;
  font-weight: 600;
  margin: 0;
}

.section-title {
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 15px 0;
  font-weight: bold;
}

.test-overview {
  width: 100%;
  margin-bottom: 20px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.overview-item {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.overview-item:hover {
  border-color: #667eea;
  background: #e3f2fd;
}

.item-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.overview-item h3 {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 8px 0;
  font-weight: bold;
}

.overview-item p {
  color: #666;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.overview-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.overview-item li {
  color: #666;
  margin: 5px 0;
  padding-left: 15px;
  position: relative;
  font-size: 0.9rem;
}

.overview-item li:before {
  content: "•";
  color: #667eea;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.instructions-section {
  width: 100%;
  margin-bottom: 20px;
}

.instructions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
}

.instruction-item {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  transition: all 0.3s ease;
}

.instruction-item:hover {
  border-color: #667eea;
  background: #e3f2fd;
}

.instruction-icon {
  font-size: 1.5rem;
  margin-top: 2px;
}

.instruction-content h4 {
  font-size: 1rem;
  color: #333;
  margin: 0 0 5px 0;
  font-weight: bold;
}

.instruction-content p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.preparation-tips {
  width: 100%;
  margin-bottom: 20px;
}

.tips-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.tip-section {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  text-align: left;
  transition: all 0.3s ease;
}

.tip-section:hover {
  border-color: #667eea;
  background: #e3f2fd;
}

.tip-section h4 {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.tip-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tip-section li {
  color: #666;
  margin: 8px 0;
  padding-left: 20px;
  position: relative;
  font-size: 0.9rem;
}

.tip-section li:before {
  content: "✓";
  color: #27ae60;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.action-section {
  width: 100%;
  margin-bottom: 20px;
}

.action-title {
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.action-description {
  color: #666;
  margin: 0 0 20px 0;
  font-size: 1rem;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.secondary-btn {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: #667eea;
  color: white;
}

.logout-section {
  margin-top: 10px;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .intro-page {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  
  .sidebar-header {
    padding: 15px;
  }
  
  .sidebar-user {
    padding: 15px;
  }
  
  .nav-menu {
    display: flex;
    overflow-x: auto;
    padding: 10px 0;
  }
  
  .nav-item {
    flex-shrink: 0;
  }
  
  .nav-link {
    flex-direction: column;
    gap: 5px;
    padding: 10px 15px;
    min-width: 80px;
    text-align: center;
  }
  
  .nav-text {
    font-size: 0.8rem;
  }
  
  .sidebar-footer {
    padding: 15px;
  }
  
  .main-content {
    height: calc(100vh - 200px);
  }
  
  .content-header {
    padding: 20px;
  }
  
  .content-body {
    padding: 20px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .overview-grid {
    grid-template-columns: 1fr;
  }
  
  .tips-container {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .instruction-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
