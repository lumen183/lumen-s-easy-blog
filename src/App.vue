<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import LoadingAnimation from './components/LoadingAnimation.vue'

const route = useRoute()

// 根据路由控制背景模糊效果
const updateBackgroundBlur = () => {
  if (route.path === '/') {
    document.body.classList.add('home-page-no-blur')
  } else {
    document.body.classList.remove('home-page-no-blur')
  }
}

onMounted(() => {
  updateBackgroundBlur()
})

// 监听路由变化
watch(() => route.path, () => {
  updateBackgroundBlur()
})

onUnmounted(() => {
  document.body.classList.remove('home-page-no-blur')
})
</script>

<template>
  <div class="app">
    <LoadingAnimation />
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
}
</style>
