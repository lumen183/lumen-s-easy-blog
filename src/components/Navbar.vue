<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- 左侧Logo和标题 -->
      <div class="navbar-left">
        <img 
          src="/basic/wayseek.png" 
          alt="觅渡" 
          class="navbar-logo"
        />
        <span class="navbar-title">觅渡 |  </span>
      </div>
      
      <!-- 中间导航链接 - 图标在上文字在下的垂直排版 -->
      <div class="navbar-center">
        <router-link to="/" class="nav-link" @click="handleNavClick('home')">
          <span class="iconfont icon-zhuye" :class="{ 'active-icon': currentPage.home }"></span>
          <span :class="{ 'active-text': currentPage.home }">首页</span>
        </router-link>
        <router-link to="/articles" class="nav-link" @click="handleNavClick('articles')">
          <span class="iconfont icon-blog" :class="{ 'active-icon': currentPage.articles }"></span>
          <span :class="{ 'active-text': currentPage.articles }">博客</span>
        </router-link>
        <div class="link-container">
          <div class="nav-link">
            <span class="iconfont icon-lianjie" :class="{ 'active-icon': currentPage.link }"></span>
            <span :class="{ 'active-text': currentPage.link }">外链</span>
          </div>
          
          <!-- 外链弹窗 -->
          <div class="link-popup">
            <div class="popup-content">
              <a href="http://jw.hitsz.edu.cn/" class="contact-item">
                <span class="iconfont icon-haerbin"></span>
                <span>教研平台</span>
              </a>
              <a href="https://mail.qq.com" class="contact-item">
                <span class="iconfont icon-email"></span>
                <span>QQ邮箱</span>
              </a>
              <a href="https://www.doubao.com/chat/" class="contact-item">
                <span class="iconfont icon-doubao"></span>
                <span>豆包聊天</span>
              </a>
            </div>
          </div>
        </div>
        <div class="contact-container">
          <div class="nav-link">
            <span class="iconfont icon-shouye" :class="{ 'active-icon': currentPage.contact }"></span>
            <span :class="{ 'active-text': currentPage.contact }">联系</span>
          </div>
          
          <!-- 联系弹窗 -->
          <div class="contact-popup">
            <div class="popup-content">
              <a href="https://www.zhihu.com/people/--85-38-44" class="contact-item" target="_blank">
                <span class="iconfont icon-zhihu"></span>
                <span>去知乎私信我</span>
              </a>
              <a href="https://space.bilibili.com/16492891" class="contact-item" target="_blank">
                <span class="iconfont icon-bilibili-line"></span>
                <span>去B站私信我</span>
              </a>
              <a href="https://github.com/lumen183" class="contact-item" target="_blank">
                <span class="iconfont icon-github-fill"></span>
                <span>了解我的GitHub</span>
              </a>
              <a href="https://www.yuque.com/cangshanhai" class="contact-item" target="_blank">
                <span class="iconfont icon-yuque"></span>
                <span>查看我的语雀</span>
              </a>
            </div>
          </div>
        </div>
        <div class="other-container">
          <div class="nav-link">
            <span class="iconfont icon-yingyongguanli" :class="{ 'active-icon': currentPage.other }"></span>
            <span :class="{ 'active-text': currentPage.other }">其他</span>
          </div>
          
          <!-- 其他选项弹窗 -->
          <div class="other-popup">
            <div class="popup-content">
              <router-link to="/friend-links" :class="['contact-item', { 'active-contact-item': currentPage.friendLinks }]" @click="handleNavClick('friendLinks')">
                <span class="iconfont icon-boke" :class="{ 'active-contact-icon': currentPage.friendLinks }"></span>
                <span :class="{ 'active-contact-text': currentPage.friendLinks }">友情链接</span>
              </router-link>
              <router-link to="/aboutme" :class="['contact-item', { 'active-contact-item': currentPage.aboutMe }]" @click="handleNavClick('aboutMe')">
                <span class="iconfont icon-guanyu" :class="{ 'active-contact-icon': currentPage.aboutMe }"></span>
                <span :class="{ 'active-contact-text': currentPage.aboutMe }">关于我</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧搜索框 -->
      <div class="navbar-right">
        <div class="search-box" ref="searchInputRef">
          <input 
            type="text" 
            placeholder="按标签筛选" 
            class="search-input"
            @focus="showTagCloud"
          />
          <button class="search-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          
          <!-- 标签云弹出层 -->
          <div class="tag-cloud-popup" v-if="isTagCloudVisible">
            <div class="tag-cloud-header">
              <h3>标签云</h3>
              <button class="close-btn" @click="hideTagCloud">×</button>
            </div>
            <div class="tag-cloud">
              <span 
                v-for="tag in tags" 
                :key="tag" 
                class="tag" 
                :class="{ active: selectedTag === tag }"
                @click="filterByTag(tag)"
              >
                {{ tag }} ({{ getTagCount(tag) }})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import '../assets/icons/iconfont.css'

const route = useRoute()
const router = useRouter()
const currentPage = ref({
  home: false,
  articles: false,
  link: false,
  contact: false,
  other: false,
  friendLinks: false,
  aboutMe: false
})
const isTagCloudVisible = ref(false)
const searchInputRef = ref(null)
const allArticles = ref([])
const selectedTag = ref('全部')

// 加载文章数据以获取标签
const loadArticles = async () => {
  try {
    const response = await fetch('/article/articles.json')
    if (!response.ok) {
      throw new Error('获取文章列表失败')
    }
    allArticles.value = await response.json()
  } catch (error) {
    console.error('加载文章失败:', error)
  }
}

// 计算标签列表
const tags = computed(() => {
  const tagSet = new Set()
  allArticles.value.forEach(article => {
    if (article.tags && Array.isArray(article.tags)) {
      article.tags.forEach(tag => {
        tagSet.add(tag)
      })
    }
  })
  return ['全部', ...Array.from(tagSet)]
})

// 获取标签文章数量
const getTagCount = (tag) => {
  if (tag === '全部') return allArticles.value.length
  return allArticles.value.filter(article => 
    article.tags && article.tags.includes(tag)
  ).length
}

// 切换标签云显示状态
const toggleTagCloud = () => {
  isTagCloudVisible.value = !isTagCloudVisible.value
}

// 显示标签云
const showTagCloud = () => {
  isTagCloudVisible.value = true
}

// 隐藏标签云
const hideTagCloud = () => {
  isTagCloudVisible.value = false
}

// 点击标签过滤文章
const filterByTag = (tag) => {
  selectedTag.value = tag
  hideTagCloud()
  // 跳转到文章列表页并通过URL参数应用标签筛选
  if (tag === '全部') {
    router.push({ path: '/articles' })
  } else {
    router.push({ path: '/articles', query: { tag: tag } })
  }
}

// 点击外部区域隐藏标签云
const handleClickOutside = (event) => {
  if (searchInputRef.value && !searchInputRef.value.parentElement?.contains(event.target)) {
    hideTagCloud()
  }
}

// 重置所有页面高亮状态
const resetCurrentPage = () => {
  for (const key in currentPage.value) {
    currentPage.value[key] = false
  }
}

// 处理导航点击
const handleNavClick = (page) => {
  resetCurrentPage()
  currentPage.value[page] = true
  
  // 友情链接和关于我同时高亮"其他"
  if (page === 'friendLinks' || page === 'aboutMe') {
    currentPage.value.other = true
  }
}

// 设置当前页面
const setCurrentPage = (page) => {
  resetCurrentPage()
  currentPage.value[page] = true
  
  // 友情链接和关于我同时高亮"其他"
  if (page === 'friendLinks' || page === 'aboutMe') {
    currentPage.value.other = true
  }
}

// 监听路由变化，更新当前页面状态
watch(() => route.path, (newPath) => {
  resetCurrentPage()
  
  if (newPath === '/') {
    currentPage.value.home = true
  } else if (newPath === '/articles' || newPath === '/blog' || newPath.startsWith('/articles/')) {
    currentPage.value.articles = true
  } else if (newPath === '/friend-links') {
    currentPage.value.friendLinks = true
    currentPage.value.other = true // 同时高亮"其他"
  } else if (newPath === '/aboutme') {
    currentPage.value.aboutMe = true
    currentPage.value.other = true // 同时高亮"其他"
  } else {
    currentPage.value.other = true
  }
});

// 监听路由参数变化，更新标签云高亮状态
watch(() => route.query.tag, (newTag) => {
  if (newTag && typeof newTag === 'string') {
    selectedTag.value = newTag;
  } else {
    selectedTag.value = '全部';
  }
});

// 组件挂载时初始化
onMounted(() => {
  resetCurrentPage()
  
  if (route.path === '/') {
    currentPage.value.home = true
  } else if (route.path === '/articles' || route.path === '/blog') {
    currentPage.value.articles = true
  } else if (route.path === '/friend-links') {
    currentPage.value.friendLinks = true
    currentPage.value.other = true
  } else if (route.path === '/aboutme') {
    currentPage.value.aboutMe = true
    currentPage.value.other = true
  } else {
    currentPage.value.other = true
  }
  
  // 加载文章数据
  loadArticles()
  
  // 添加点击外部事件监听
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
  width:100%;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  width: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  margin-right: 30px;
}

.navbar-logo {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden; 
}

.navbar-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.navbar-center {
  display: flex;
  gap: 20px; /* 调整间距以适应垂直排列 */
}

/* 导航链接样式 - 设置为垂直排列并增大图标 */
.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #666;
  font-size: 18px;
  transition: all 0.3s;
  padding: 4px 4px;
  border-radius: 8px;
  min-width: 60px;
  cursor: pointer;
}

.nav-link:hover {
  color: #333;
  background-color: #f5f5f5;
  transform: translateY(-2px);
}

/* 图标样式 - 增大图标尺寸 */
.nav-link .iconfont {
  font-size: 22px; /* 明显增大图标尺寸 */
  display: inline-block;
  margin-bottom: 4px;
  color: #888;
  transition: color 0.3s, -webkit-text-stroke 0.3s;
  font-weight: bold;
  -webkit-text-stroke: 0.8px #888; 
}

.nav-link:hover .iconfont {
  color: #094258; /* 使用与激活状态相同的蓝色 */
  -webkit-text-stroke: 0.8px #094258; /* 悬停时同步更改描边颜色 */
}

/* 文字悬停效果 */
.nav-link:hover span:last-child {
  color: #094258; /* 悬停时文字变色为蓝色 */
  font-weight: bold; /* 悬停时文字加粗 */
}

/* 激活状态的图标样式 */
.nav-link .iconfont.active-icon {
  color: #094258; /* 设置为指定的蓝色 */
  -webkit-text-stroke: 0.8px #094258; /* 同步更改描边颜色 */
}

/* 激活状态的文字样式 */
.nav-link .active-text {
  color: #094258; /* 设置为指定的蓝色 */
  font-weight: 600;
}

/* 联系弹窗相关样式 */
.contact-container {
  position: relative;
}

.contact-popup {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  min-width: 200px;
  z-index: 1001;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.contact-container:hover .contact-popup {
  opacity: 1;
  visibility: visible;
}

/* 外链弹窗相关样式 */
.link-container {
  position: relative;
}

.link-popup {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  min-width: 200px;
  z-index: 1001;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.link-container:hover .link-popup {
  opacity: 1;
  visibility: visible;
}

.link-popup::before {
  content: '';
  position: absolute;
  top: -8px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #f0f0f0;
}

.popup-header {
  padding: 12px 16px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #e0e0e0;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.popup-content {
  padding: 8px 0;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  text-decoration: none;
  color: #666;
  transition: background-color 0.3s;
  font-size: 18px;
}

.contact-item:hover {
  background-color: #094258;
  color: white;
}

.contact-item .iconfont {
  font-size: 22px;
  color: #666;
  transition: color 0.3s;
}

.contact-item:hover .iconfont {
  color: white;
}

.contact-item span:last-child {
  font-size: 18px;
}

/* 激活状态的联系项样式 */
.active-contact-item {
  background-color: #094258;
  color: white;
}

.active-contact-icon {
  color: white;
}

.active-contact-text {
  color: white;
}

/* 为弹窗添加小三角 */
.contact-popup::before {
  content: '';
  position: absolute;
  top: -8px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #f0f0f0;
}

/* 其他选项弹窗相关样式 */
.other-container {
  position: relative;
}

.other-popup {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  min-width: 200px;
  z-index: 1001;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.other-container:hover .other-popup {
  opacity: 1;
  visibility: visible;
}

.other-popup::before {
  content: '';
  position: absolute;
  top: -8px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #f0f0f0;
}

.navbar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
  margin-right: 100px;
}

.search-box {
  position: relative;
}

.search-input {
  width: 280px;
  padding: 8px 36px 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 18px;
  outline: none;
  transition: border-color 0.3s;
  background-color: #fafafa;
  cursor: pointer;
}

.search-input:focus {
  border-color: #666;
  background-color: #ffffff;
}

.search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
}

/* 标签云弹出层样式 */
.tag-cloud-popup {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 1002;
  width: 400px;
  max-height: 300px;
  overflow-y: auto;
  animation: fadeIn 0.3s ease;
}

.tag-cloud-header {
  padding: 12px 16px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0 0;
}

.tag-cloud-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 16px;
}

.tag {
  background-color: rgba(255, 255, 255, 0.3);
  color: #666;
  padding: 4px 10px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  border: 1px solid #e0e0e0;
}

.tag:hover {
  background-color: #646cff;
  color: white;
  border-color: #646cff;
}

.tag.active {
  background-color: #646cff;
  color: white;
  border-color: #646cff;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-btn:hover {
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-center {
    display: none;
  }
  
  .search-input {
    width: 150px;
  }
}
</style>