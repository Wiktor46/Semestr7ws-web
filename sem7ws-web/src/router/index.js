import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('@/views/UnauthorizedView.vue')
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          redirect: '/repeaters'
        },
        {
          path: 'repeaters',
          name: 'repeaters',
          component: () => import('@/views/RepeatersView.vue')
        },
        {
          path: 'proposals',
          name: 'proposals',
          component: () => import('@/views/ProposalsView.vue')
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/UsersView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/repeaters'
    }
  ]
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Upewnij się, że stan autoryzacji został zweryfikowany z API
  if (!authStore.initialized) {
    await authStore.initAuth()
  }

  const isAuth = authStore.isAuthenticated
  const isAdmin = authStore.isAdmin

  if (to.meta.guestOnly && isAuth && isAdmin) {
    return next({ path: '/repeaters' })
  }

  if (to.meta.requiresAuth && !isAuth) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return next({ path: '/unauthorized' })
  }

  next()
})

export default router
