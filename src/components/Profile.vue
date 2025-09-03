<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="avatar-container">
        <img src="/basic/avatar.jpg" alt="头像" class="avatar" />
      </div>
      <h2 class="username">lumen</h2>
      <p style="color: #444;">迷途未远， 今是昨非</p>
    </div>
    
    <div class="recent-blogs">
      <h3 class="section-title"><i class="iconfont icon-zhiding"></i>置顶博客</h3>
      <div class="blog-item">
        <p class="blog-title">全国第一个MCP服务器一体化开发测试软件</p>
        <p class="blog-subtitle">OpenMCP发布！</p>
        <p class="blog-date">Apr 13, 2025</p>
      </div>
      <div class="blog-item">
        <p class="blog-title">闭环式问答机器人状态机设计</p>
        <p class="blog-date">Jun 02, 2024</p>
      </div>
      <div class="blog-item">
        <p class="blog-title">EDL (Evidential Deep Learning) 原理与代码实现</p>
        <p class="blog-date">Apr 26, 2024</p>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
// Profile组件的脚本部分

</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 300px;
}

.profile-card {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-blogs {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 16px;
  border: 1px solid #f0f0f0;
  background-color: none;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-size: 23px;
  font-weight: 600;
  color: #000;
  margin: 0 0 20px 0;
}


.section-title {
  font-size: 19px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #1890ff;
}

.blog-item {
  margin-bottom: 16px;
}

.blog-item:last-child {
  margin-bottom: 0;
}

.blog-title {
  font-size: 17px;
  color: #333;
  margin: 0 0 4px 0;
  cursor: pointer;
  transition: color 0.3s;
}

.blog-title:hover {
  color: #1890ff;
}

.blog-subtitle {
  font-size: 15px;
  color: #666;
  margin: 0 0 4px 0;
}

.blog-date {
  font-size: 15px;
  color: #999;
  margin: 0;
}

.quick-links {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.link-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.3s;
}

.link-item:hover {
  background-color: #f5f5f5;
}

.link-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-container {
    max-width: 100%;
  }
}
</style>