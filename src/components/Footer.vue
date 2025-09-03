<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>觅渡 - lumen的私人博客</h3>
        <p class="email">Email: 2862094372@qq.com</p>
        <p class="copyright">Copyright © 22025 lumen All Rights Reserved</p>
        <!--
        <p class="icp"><a href="http://beian.miit.gov.cn/" target="_blank">苏ICP备2022010563号-2</a></p>
      -->
    </div>
      
      <div class="footer-section">
        <h4>作品集</h4>
        <!-- 作品集内容暂时为空 -->
      </div>
      
      <div class="footer-section">
        <h4>相关链接</h4>
        <ul class="links-list">
          <li><a href="https://www.zhihu.com/people/--85-38-44" class="external-link" target="_blank">
            <span class="iconfont icon-zhihu"></span>
            <span>知乎@mewo</span>
          </a></li>
          <li><a href="https://github.com/lumen183" class="external-link" target="_blank">
            <span class="iconfont icon-github-fill"></span>
            <span>Github@lumen183</span>
          </a></li>
          <li><a href="https://www.yuque.com/cangshanhai" class="external-link" target="_blank">
            <span class="iconfont icon-yuque"></span>
            <span>语雀@苍山海</span>
          </a></li>
          <li><a href=""></a></li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 暂时不需要额外的逻辑
</script>

<style scoped>
.footer {
  background-color: #f8f9fa;
  padding: 2rem 0;
  margin-top: 2rem;
  border-top: 1px solid #e9ecef;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-section {
  flex: 1;
  margin-right: 2rem;
}

.footer-section:last-child {
  margin-right: 0;
}

.footer-section h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
}

.footer-section h4 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #555;
}

.email, .copyright, .icp {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.links-list {
  list-style: none;
  padding: 0;
}

.links-list li {
  margin-bottom: 0.5rem;
}

.external-link {
  color: #666;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.external-link:hover {
  color: #007bff;
}

.external-link .iconfont {
  font-size: 16px;
  vertical-align: middle;
}

.icp a {
  color: #666;
  text-decoration: none;
}

.icp a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
  }
  
  .footer-section {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }
}
</style>