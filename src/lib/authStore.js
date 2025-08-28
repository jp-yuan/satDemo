import { ref } from 'vue'
import { supabase } from './supabase'

// Reactive user state
export const currentUser = ref(null)
export const isAuthenticated = ref(false)

// Initialize auth state
export const initializeAuth = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      currentUser.value = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0]
      }
      isAuthenticated.value = true
    } else {
      currentUser.value = null
      isAuthenticated.value = false
    }
  } catch (error) {
    console.error('Error initializing auth:', error)
    currentUser.value = null
    isAuthenticated.value = false
  }
}

// Listen for auth state changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    currentUser.value = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
    }
    isAuthenticated.value = true
  } else if (event === 'SIGNED_OUT') {
    currentUser.value = null
    isAuthenticated.value = false
  }
})

// Initialize auth on module load
initializeAuth()
