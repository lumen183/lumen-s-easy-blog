<template>
  <div class="article-detail-page">
    <div v-if="loading" class="loading-container">
      <LoadingAnimation />
      <p>加载文章中...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button class="back-button" @click="router.back()">返回</button>
    </div>
    
    <div v-else-if="article" class="article-detail">
      <!-- 加载markdown内容 -->
      <div v-if="markdownLoading && article.markdownPath" class="markdown-loading">
        <LoadingAnimation size="small" />
        <p>正在加载文章内容...</p>
      </div>
      
      <!-- 主内容区域 -->
      <div class="article-main-content">
        <!-- 文章内容 -->
        <div class="article-content-wrapper">
          <!-- 文章正文 - 分两部分显示：标题和内容 -->
          <div class="article-body">
            <!-- Markdown标题 -->
            <div v-html="markdownTitle"></div>
            
            <!-- 文章目录 - 移动到标题下方、正文左侧 -->
            <div class="article-toc-container" ref="tocContainerRef">
              <div class="toc-header">
                <h3>目录</h3>
              </div>
              <div class="toc-content" v-if="tocItems.length > 0">
                <ul class="toc-list">
                  <li 
                    v-for="(item, index) in tocItems" 
                    :key="index" 
                    :class="['toc-item', `toc-level-${item.level}`]"
                    @click="scrollToHeading(item.id)"
                  >
                    {{ item.title }}
                  </li>
                </ul>
              </div>
              <div v-else class="toc-empty">
                <p>暂无目录</p>
              </div>
            </div>
            
            <!-- 文章元信息 - 放在markdown标题下方 -->
            <div class="article-meta-container">
              <div class="article-meta">
                <div class="meta-info">
                  <span class="meta-item">
                    <i class="iconfont icon-bianji"></i> {{ formatDate(article.updatedAt) }}
                  </span>
                  <span class="meta-item">
                    <i class="iconfont icon-zishu"></i> {{ article.wordCount }} 字
                  </span>
                </div>
                
                <!-- 标签 -->
                <div class="article-tags">
                  <i class="iconfont icon-biaoqian"></i>
                  <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
            
            <!-- 文章图片 - 放在元信息下方 -->
            <div class="article-image-container">
              <img :src="article.bgImage || '/basic/default_bg.png'" :alt="article.title" class="article-image" />
            </div>
            
            <!-- Markdown正文内容 -->
            <div ref="contentRef" v-html="markdownContentWithoutTitle"></div>
          </div>
          
          <!-- 底部操作 -->
          <div class="article-actions">
            <button class="back-button" @click="router.back()">返回列表</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Article } from '../types/article';
import LoadingAnimation from './LoadingAnimation.vue';
// @ts-ignore - 忽略markdown-it类型声明问题，确保代码正常运行
import MarkdownIt from 'markdown-it';
import markdownItHighlightjs from 'markdown-it-highlightjs';
// 导入自定义的浅色highlight.js样式
import '../assets/styles/highlight-light.css';

const route = useRoute();
const router = useRouter();

const article = ref<Article | null>(null);
const markdownContent = ref('');
const loading = ref(true);
const error = ref<string | null>(null);
const markdownLoading = ref(false);
// 配置markdown-it使用highlightjs插件
const md = new MarkdownIt().use(markdownItHighlightjs);

// 解析markdown内容，提取标题和正文
const parsedMarkdown = computed(() => {
  if (!markdownContent.value) {
    return { title: '', content: article.value?.summary || '' };
  }
  
  // 匹配markdown中的一级标题（# 标题）
  const titleMatch = markdownContent.value.match(/^#\s+([^\n]+)/m);
  
  if (titleMatch) {
    // 提取标题和剩余内容
    const title = titleMatch[1];
    const content = markdownContent.value.replace(titleMatch[0], '');
    return { title, content };
  }
  
  // 如果没有一级标题，返回完整内容
  return { title: '', content: markdownContent.value };
});

// Markdown标题部分
const markdownTitle = computed(() => {
  if (parsedMarkdown.value.title) {
    return `<h1>${parsedMarkdown.value.title}</h1>`;
  }
  return '';
});

// Markdown正文内容部分（不含标题）
const markdownContentWithoutTitle = computed(() => {
  return md.render(parsedMarkdown.value.content);
});

// 目录项类型定义
interface TocItem {
  id: string;
  title: string;
  level: number;
}

// 目录数据
const tocItems = ref<TocItem[]>([]);

// 内容引用
const contentRef = ref<HTMLElement | null>(null);
const tocContainerRef = ref<HTMLElement | null>(null);

// 解析文章内容生成目录
const generateToc = () => {
  if (!contentRef.value) return;
  
  const headers = contentRef.value.querySelectorAll('h2, h3, h4, h5, h6');
  tocItems.value = Array.from(headers).map((header, index) => {
    const level = parseInt(header.tagName.replace('H', ''));
    const title = header.textContent || '';
    
    // 为标题添加唯一ID
    const id = `heading-${index}`;
    header.id = id;
    
    return {
      id,
      title,
      level
    };
  });
};

// 滚动到指定标题
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const yOffset = -100; // 偏移量，避免被导航栏遮挡
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

// 处理滚动事件，使目录保持固定
const handleScroll = () => {
  if (!tocContainerRef.value) return;
  
  // 当页面滚动超过一定距离时，固定目录
  if (window.scrollY > 100) {
    tocContainerRef.value.classList.add('fixed');
  } else {
    tocContainerRef.value.classList.remove('fixed');
  }
};

// 监听内容变化，重新生成目录
watch(markdownContentWithoutTitle, () => {
  // 使用setTimeout确保DOM已经更新
  setTimeout(() => {
    generateToc();
  }, 0);
});

// 完整的渲染内容（用于向后兼容）
const renderedMarkdown = computed(() => {
  if (!markdownContent.value) {
    // 如果没有加载到markdown内容，使用summary作为备用
    return article.value?.summary ? md.render(article.value.summary) : '';
  }
  return md.render(markdownContent.value);
});

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 从markdown文件加载内容
const loadMarkdownContent = async (path: string) => {
  if (!path) return;
  
  try {
    markdownLoading.value = true;
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error('无法加载Markdown文件');
    }
    markdownContent.value = await response.text();
  } catch (err) {
    console.warn('加载Markdown文件失败，将使用summary作为替代:', err);
    // 保持markdownContent为空，这样renderedMarkdown会使用summary作为备用
  } finally {
    markdownLoading.value = false;
  }
};

// 获取文章详情
const getArticleDetail = async () => {
  const id = route.params.id as string;
  if (!id) {
    error.value = '文章ID不存在';
    loading.value = false;
    return;
  }
  
  try {
    loading.value = true;
    error.value = null;
    markdownContent.value = '';
    
    // 1. 获取文章基本信息
    const response = await fetch('/article/articles.json');
    if (!response.ok) {
      throw new Error('网络响应异常');
    }
    const articles = await response.json() as Article[];
    const foundArticle = articles.find(a => a.id === id);
    if (!foundArticle) {
      error.value = '文章不存在或已被删除';
    } else {
      article.value = foundArticle;
      
      // 2. 加载markdown文件内容
      if (foundArticle.markdownPath) {
        await loadMarkdownContent(foundArticle.markdownPath);
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取文章失败';
  } finally {
    loading.value = false;
  }
};



// 组件挂载时获取文章详情
onMounted(() => {
  getArticleDetail();
  
  // 添加滚动事件监听
  window.addEventListener('scroll', handleScroll);
});

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// 监听路由参数变化，重新获取文章
route.params.id && watch(() => route.params.id, () => {
  getArticleDetail();
});
</script>

<style scoped>
.article-detail-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.article-main-content {
  display: flex;
  gap: 40px;
}

/* 目录样式 - 移动到标题下方、正文左侧 */
.article-toc-container {
  width: 300px;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 8px;
  padding: 15px;
  position: fixed;
  left: 20px;
  top: 120px;
  font-size: 18px;
  max-height: calc(100vh - 240px);
  overflow-y: auto;
  z-index: 10;
}

.toc-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #646cff;
}

.toc-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  padding: 8px 0;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 4px;
  padding-left: 10px;
}

.toc-item:hover {
  background-color: #f0f0f0;
  color: #646cff;
  transform: translateX(4px);
}

/* 目录层级样式 */
.toc-level-2 {
  font-weight: 600;
  font-size: 17px;
}

.toc-level-3 {
  padding-left: 30px;
  font-size: 15px;
}

.toc-level-4 {
  padding-left: 40px;
  font-size: 14px;
  color: #888;
}

.toc-level-5,
.toc-level-6 {
  padding-left: 50px;
  font-size: 13px;
  color: #999;
}

.toc-empty {
  text-align: center;
  color: #999;
  padding: 20px 0;
}

/* 文章内容容器 - 目录已使用fixed定位，不需要额外padding */
.article-content-wrapper {
  flex: 1;
  min-width: 0;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
}

.error-message {
  color: #ff4d4f;
  font-size: 20px;
  margin-bottom: 20px;
}

.back-button {
  background-color: #646cff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
}

.back-button:hover {
  background-color: #535bf2;
}

.article-detail {
  background: transparent;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0);
  overflow: hidden;
  max-width: 1000px;
  margin: 0 auto;
}

.article-meta-container {
  padding: 20px 30px 0;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.article-image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px 30px;
}

.article-image {
  width: 50%;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
}

.markdown-loading p {
  margin-top: 16px;
  font-size: 14px;
}

.meta-info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-item {
  color: #666;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-tags {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tag {
  background-color: #f0f0f0;
  color: #666;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 18px;
}

.article-body {
  font-size: 22px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 30px;
  padding: 0 30px;
  position: relative;
}

/* Markdown 样式 */
.article-body h1,
.article-body h2,
.article-body h3,
.article-body h4,
.article-body h5,
.article-body h6 {
  margin-top: 30px;
  margin-bottom: 15px;
  font-weight: bold;
  color: #333;
  font-size: inherit;
}

.article-body p {
  margin-bottom: 15px;
  font-size: 21px;
}

.article-body a {
  color: #646cff;
  text-decoration: none;
  font-size: inherit;
}

.article-body a:hover {
  text-decoration: underline;
}

/* 行内代码样式 - 加强选择器优先级和使用!important确保生效 */
.article-detail-page .article-body code {
  background-color: #ffffff !important;
  color: #333 !important;
  padding: 2px 4px !important;
  border-radius: 3px !important;
  font-family: 'Consola', monospace !important;
  font-size: 17px !important;
  display: inline-block !important;
}

/* 代码块样式 - 针对highlight.js生成的结构，修改为白色背景 */
.article-detail-page .article-body pre {
  background-color: #ffffff !important;
  color: #333 !important;
  padding: 15px !important;
  padding-top: 35px !important;
  border-radius: 4px !important;
  overflow-x: auto !important;
  margin-bottom: 15px !important;
  position: relative !important;
  font-family: 'Consola', monospace !important;
  margin-left: 25px !important;
  margin-right: 30px !important;
  max-width: calc(100% - 40px) !important;
  font-size: 6px !important;
}

/* 确保pre中的code继承pre的样式 */
.article-body pre code {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

/* highlight.js生成的代码块特定样式 - 白色背景 */
.article-detail-page .article-body pre.hljs {
  background-color: #ffffff !important;
  color: #333 !important;
  margin-left: 22px !important;
  margin-right: 30px !important;
  max-width: calc(100% - 40px) !important;
}

/* 针对不同语言的代码块添加特定样式 */
.article-body pre code[class*="language-"] {
  background-color: transparent;
  color: inherit;
  text-shadow: none;
}

.article-body ul,
.article-body ol {
  margin-bottom: 15px;
  padding-left: 20px;
}

.article-body li {
  margin-bottom: 5px;
  font-size: inherit;
}

.article-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding: 0 30px 30px 30px;
}
  

/* 响应式设计 */
@media (max-width: 1200px) {
  .article-content-wrapper {
    padding-left: 0;
  }
  
  .article-toc-container {
    position: relative;
    width: 100%;
    top: auto;
    left: auto;
    max-height: 300px;
    margin-bottom: 20px;
  }
}

@media (max-width: 1024px) {
  .article-main-content {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .article-detail-page {
    padding: 10px;
    max-width: 100%;
  }
  
  .article-image-container {
    height: 200px;
  }
  
  .article-body,
  .article-actions {
    padding: 10px;
  }
  
  .meta-info {
    flex-direction: column;
    gap: 5px;
  }
  
  .toc-item {
    font-size: 11px;
  }
  
  .toc-level-2 {
    font-size: 12px;
  }
  
  .toc-level-3 {
    font-size: 11px;
    padding-left: 15px;
  }
  
  .toc-level-4,
  .toc-level-5,
  .toc-level-6 {
    padding-left: 25px;
  }
}
</style>