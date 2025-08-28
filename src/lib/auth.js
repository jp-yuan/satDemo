import { supabase } from './supabase'

// Auth utilities for logout and user management
// Note: Authentication state is managed by authStore.js
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
    return { success: true }
  } catch (error) {
    console.error('Error logging out:', error)
    return { success: false, error: error.message }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      throw error
    }
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// isAuthenticated is now provided by authStore.js
