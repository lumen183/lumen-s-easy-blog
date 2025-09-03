<template>
  <div class="website-loading" v-if="isLoading">
    <!-- 翻页动画 -->
    <div class="book-container">
      <div class="book">
        <div class="book-page left-page"></div>
        <div class="book-page middle-page"></div>
        <div class="book-page right-page"></div>
      </div>
    </div>
    
    <!-- 加载文本 -->
    <p class="loading-text">加载中...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 控制加载动画显示状态
const isLoading = ref(true)

// 模拟加载过程，实际使用时可以根据API请求状态来控制
onMounted(() => {
  // 实际项目中，这里可以监听应用加载完成的事件
  // 例如：appLoaded 事件，或者路由加载完成等
  // 这里使用setTimeout模拟2秒后加载完成
  const timer = setTimeout(() => {
    isLoading.value = false
  }, 2000)
  
  // 清理定时器
  return () => clearTimeout(timer)
})
</script>

<style scoped>
/* 全屏加载动画容器 */
.website-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.95);
  z-index: 9999;
  font-family: "DongQingHeiTi", "Microsoft YaHei", "微软雅黑", system-ui, Avenir, Helvetica, Arial, sans-serif;
}

/* 书籍容器 */
.book-container {
  perspective: 1000px;
  margin-bottom: 30px;
}

/* 书籍主体 */
.book {
  width: 150px;
  height: 200px;
  position: relative;
  perspective: 800px;
}

/* 书页基础样式 */
.book-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 2px 10px 10px 2px;
  box-shadow: 0 0 8px rgba(0,0,0,0.15);
  transform-origin: left center;
  background-image: linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 20px 100%;
}

/* 左侧封面页 */
.left-page {
  background-color: #e0d5c0;
  background-image: none;
  border-right: 1px solid #d0c5b0;
  z-index: 1;
}

/* 中间页 - 第一页翻转动画 */
.middle-page {
  z-index: 2;
  animation: flipPage1 2s ease-in-out infinite;
}

/* 右侧页 - 第二页翻转动画（延迟执行） */
.right-page {
  z-index: 3;
  animation: flipPage2 2s ease-in-out infinite 0.5s;
}

/* 翻页动画关键帧1 */
@keyframes flipPage1 {
  0%, 20% { transform: rotateY(0deg); }
  50%, 70% { transform: rotateY(-180deg); }
  100% { transform: rotateY(-180deg); }
}

/* 翻页动画关键帧2 */
@keyframes flipPage2 {
  0%, 20% { transform: rotateY(0deg); }
  50%, 70% { transform: rotateY(-180deg); }
  100% { transform: rotateY(-180deg); }
}

/* 加载文本样式 */
.loading-text {
  font-size: 18px;
  color: #8b7355;
  font-weight: 500;
  margin: 0;
  letter-spacing: 1px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .book {
    width: 120px;
    height: 160px;
  }
  
  .loading-text {
    font-size: 16px;
  }
}
</style>