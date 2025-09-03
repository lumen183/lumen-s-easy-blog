<template>
  <div class="home-page">
    <!-- 中间气泡区域 -->
    <div class="bubble-section">
      <div class="quote-bubble">
        <p class="bubble-text">
          觅渡，觅渡，渡何处？<br>
          我们一直在寻找自己的渡口，把自己送往彼岸。<br>
          我的朋友，你找到你的渡口了吗？
        </p>
      </div>
    </div>
    <!-- 底部右侧进入博客按钮 -->
    <div class="bottom-section">
      <a href="/articles" class="blog-button">进入博客</a>
    </div>
  </div>
</template>

<script setup>
// 主页组件逻辑
</script>

<style scoped>
.home-page {

  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 中间气泡区域样式 */
.bubble-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  flex: 1;
  transform: translateY(100%);

}

.quote-bubble {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.2rem;
  position: relative;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.quote-bubble::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #f9f9f9;
}

.bubble-text {
  font-family: 'STKaiti', 'KaiTi', 'SimSun', serif;
  font-size: 1.2rem;
  color: #555;
  line-height: 1.8;
  margin: 0;
}

/* 底部右侧进入博客按钮 */
.bottom-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.blog-button {
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.blog-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .quote-bubble {
    padding: 1rem;
    margin: 10px;
  }
  
  .bubble-text {
    font-size: 1rem;
  }
  
  .blog-button {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>