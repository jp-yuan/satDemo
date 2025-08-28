<template>
  <div class="login-page">
    <div class="login-card">
      <img :src="logo" alt="Young Scholars Logo" class="logo" />
      <h1 v-if="!showCreateUser" class="page-title">Login to Young Scholars</h1>
      <h1 v-else class="page-title">Create Account</h1>
      <p class="page-subtitle">Center for Talented Youth</p>
      
      <form v-if="!showCreateUser" @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" v-model="email" required placeholder="Enter your email" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" v-model="password" required placeholder="Enter your password" />
        </div>
        <div class="form-buttons">
          <button type="button" class="secondary-btn" @click="showCreateUser = true" :disabled="isLoading">Create Account</button>
          <button type="submit" class="primary-btn" :disabled="isLoading">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
      
      <form v-else @submit.prevent="createUser" class="login-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" type="text" v-model="name" required placeholder="Enter your name" />
        </div>
        <div class="form-group">
          <label for="newEmail">Email</label>
          <input id="newEmail" type="email" v-model="newEmail" required placeholder="Enter your email" />
        </div>
        <div class="form-group">
          <label for="newPassword">Password</label>
          <input id="newPassword" type="password" v-model="newPassword" required placeholder="Enter your password" />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confrim Password</label>
          <input id="confirmPassword" type="password" v-model="confirmPassword" required placeholder="Enter your password again"/>
        </div>

        <div class="form-buttons">
          <button type="button" class="secondary-btn" @click="showCreateUser = false" :disabled="isLoading">Back to Login</button>
          <button type="submit" class="primary-btn" :disabled="isLoading">
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </div>
      </form>
      
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">{{ success }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../assets/logo.png'
import { supabase } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/authStore'

onMounted(() => {
  console.log('Login component mounted')
  console.log('Current route:', router.currentRoute.value.path)
  
  // Check if user is already authenticated using auth store
  if (isAuthenticated.value) {
    console.log('User already authenticated')
    // Redirect to introduction if already logged in
    router.push('/introduction')
  }
})

const router = useRouter()
const showCreateUser = ref(false)
const email = ref('')
const password = ref('')
const error = ref(null)
const success = ref(null)
const isLoading = ref(false)


// For create user form
const name = ref('')
const newEmail = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const createUser = async () => {
  error.value = null
  success.value = null
  isLoading.value = true
  try {
    if (!name.value || !newEmail.value || !newPassword.value) {
      throw new Error('Please fill in all fields')
    }
    
    if (newPassword.value.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }

    if (newPassword.value != confirmPassword.value){
      throw new Error('Confirm Password must match password')
    }
    
    // Create user with Supabase authentication
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: newEmail.value,
      password: newPassword.value,
      options: {
        data: {
          name: name.value
        }
      }
    })
    
    if (signUpError) {
      throw new Error(signUpError.message)
    }
    
    if (data.user) {
      success.value = `Account created successfully! Welcome, ${name.value}! Please check your email to verify your account.`
      
      // Reset fields
      name.value = ''
      newEmail.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
      showCreateUser.value = false
      
      // Redirect to SAT introduction page after a short delay
      setTimeout(() => {
        router.push('/introduction')
      }, 2000)
    }
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

const login = async () => {
  error.value = null
  success.value = null
  isLoading.value = true
  try {
    if (!email.value || !password.value) {
      throw new Error('Please fill in all fields')
    }
    
    // Login with Supabase authentication
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    
    if (signInError) {
      throw new Error(signInError.message)
    }
    
    if (data.user) {
      const userName = data.user.user_metadata?.name || email.value.split('@')[0]
      success.value = `Welcome back, ${userName}!`
      
      // Redirect to SAT introduction page after a short delay
      setTimeout(() => {
        router.push('/introduction')
      }, 1000)
    }
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}




</script>

<style scoped>
.login-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  overflow: auto;
  z-index: 1000;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.logo {
  width: 200px;
  max-width: 100%;
  margin-bottom: 10px;
}

.page-title {
  font-size: 2rem;
  color: #333;
  margin: 0;
  font-weight: bold;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 20px 0;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
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

.primary-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.primary-btn:disabled:hover {
  background: #ccc;
  transform: none;
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

.secondary-btn:disabled {
  color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}

.secondary-btn:disabled:hover {
  background: transparent;
  color: #ccc;
}

.error-message {
  color: #e74c3c;
  background: #fdf2f2;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  margin-top: 10px;
}

.success-message {
  color: #27ae60;
  background: #f0fdf4;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .form-buttons {
    flex-direction: column;
  }
  
  .logo {
    width: 150px;
  }
}
</style>