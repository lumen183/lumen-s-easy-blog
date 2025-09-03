<template>
  <div class="about-me-container">
    <div class="about-header">
      <h1>关于我</h1>
    </div>
    
    <div class="about-content">
      <!-- 头像和基本信息区域 -->
      <div class="about-image-container">
        <img 
          src="/basic/avatar.jpg" 
          alt="个人头像" 
          class="about-image"
        />
        <div class="info-item">
          <h2>lumen</h2>
          <p>迷途未远，今是昨非</p>
        </div>
      </div>
      
      <!-- 右侧信息 -->
      <div class="about-info">
        
        <div class="info-section">
          <h3><i class="iconfont icon-guanyu"></i>个人简介</h3>
          <p>你好，我是lumen，一名热爱技术的开发者。目前主要专注于前端开发、人工智能和游戏开发等领域。</p>
          <p>这个博客是我分享知识、记录学习心得和展示作品的地方。</p>
        </div>
        
        <div class="info-section">
          <h3><i class="iconfont icon-gongzuo"></i>技术栈</h3>
          <div class="tech-stack">
            <span class="tech-tag">Vue.js</span>
            <span class="tech-tag">TypeScript</span>
            <span class="tech-tag">JavaScript</span>
            <span class="tech-tag">HTML/CSS</span>
            <span class="tech-tag">Python</span>
            <span class="tech-tag">AI</span>
          </div>
        </div>
        
        <div class="info-section">
          <h3><i class="iconfont icon-lianjie"></i>联系方式</h3>
          <div class="contact-links">
            <a href="https://github.com/lumen183" target="_blank" class="contact-link">
              <span class="iconfont icon-github-fill"></span>
              <span>GitHub</span>
            </a>
            <a href="https://www.zhihu.com/people/--85-38-44" target="_blank" class="contact-link">
              <span class="iconfont icon-zhihu"></span>
              <span>知乎</span>
            </a>
            <a href="https://space.bilibili.com/16492891" target="_blank" class="contact-link">
              <span class="iconfont icon-bilibili-line"></span>
              <span>Bilibili</span>
            </a>
            <a href="https://www.yuque.com/cangshanhai" target="_blank" class="contact-link">
              <span class="iconfont icon-yuque"></span>
              <span>语雀</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '../assets/icons/iconfont.css'
</script>

<style scoped>
.about-me-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.about-header {
  text-align: center;
  margin-bottom: 40px;
}

.about-header h1 {
  font-size: 40px;
  color: #333;
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #094258;
  display: inline-block;
}

.about-content {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  align-items: flex-start;
}

.about-image-container {
  flex: 0 0 200px;
  text-align: center;
}

.about-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.about-info {
  flex: 1;
  min-width: 300px;
}

.info-item {
  margin-bottom: 30px;
  text-align: center;
}

.info-item h2 {
  font-size: 32px;
  color: #333;
  margin: 0 0 10px 0;
}

.info-item p {
  font-size: 20px;
  color: #666;
  margin: 0;
  font-style: italic;
}

.info-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-section:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.info-section h3 {
  font-size: 24px;
  color: #333;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-section h3 .iconfont {
  color: #094258;
  font-size: 26px;
}

.info-section p {
  font-size: 20px;
  color: #666;
  line-height: 1.8;
  margin: 0 0 10px 0;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-tag {
  padding: 6px 12px;
  background-color: #094258;
  color: white;
  border-radius: 16px;
  font-size: 18px;
  transition: all 0.3s ease;
}

.tech-tag:hover {
  background-color: #0a5570;
  transform: scale(1.05);
}

.contact-links {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 20px;
}

.contact-link:hover {
  background-color: #094258;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contact-link .iconfont {
  font-size: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-content {
    flex-direction: column;
    align-items: center;
  }
  
  .about-image-container {
    flex: none;
  }
  
  .about-info {
    flex: none;
    width: 100%;
  }
  
  .contact-links {
    justify-content: center;
  }
}
</style>