<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleUnauthorized() {
  authStore.logout()
  router.push({ name: 'login' })
}

function handleForbidden() {
  router.push({ name: 'unauthorized' })
}

onMounted(() => {
  window.addEventListener('auth:unauthorized', handleUnauthorized)
  window.addEventListener('auth:forbidden', handleForbidden)
})

onUnmounted(() => {
  window.removeEventListener('auth:unauthorized', handleUnauthorized)
  window.removeEventListener('auth:forbidden', handleForbidden)
})
</script>

<template>
  <RouterView />
</template>
