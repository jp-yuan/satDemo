import './assets/main.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Login from './components/Login.vue'
import SatIntroduction from './components/SatIntroduction.vue'
import { isAuthenticated } from './lib/authStore'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/introduction', name: 'Introduction', component: SatIntroduction, meta: { requiresAuth: true } },
  { path: '/sat-demo', name: 'SatDemo', component: () => import('./components/SatDemo.vue'), meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')