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
      <!-- 文章图片 -->
      <div class="article-image-container">
        <img :src="article.bgImage || '/basic/default_bg.png'" :alt="article.title" class="article-image" />
      </div>
      
      <!-- 文章头部 -->
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        
        <!-- 文章元信息 -->
        <div class="article-meta">
          <div class="meta-info">
            <span class="meta-item">
              <i class="iconfont icon-bianji"></i> 发布于: {{ formatDate(article.createdAt) }}
            </span>
            <span class="meta-item">
              <i class="iconfont icon-gengxin"></i> 更新于: {{ formatDate(article.updatedAt) }}
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
      
      <!-- 文章正文 -->
      <div class="article-body" v-html="renderedMarkdown"></div>
      
      <!-- 底部操作 -->
      <div class="article-actions">
        <button class="back-button" @click="router.back()">返回列表</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Article } from '../types/article';
import { fetchArticleById } from '../api/articleService';
import LoadingAnimation from './LoadingAnimation.vue';
// @ts-ignore - 忽略markdown-it类型声明问题，确保代码正常运行
import MarkdownIt from 'markdown-it';
import markdownItHighlightjs from 'markdown-it-highlightjs';
// 导入自定义的浅色highlight.js样式
import '../assets/styles/highlight-light.css';

const route = useRoute();
const router = useRouter();

const article = ref<Article | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
// 配置markdown-it使用highlightjs插件
const md = new MarkdownIt().use(markdownItHighlightjs);

// 渲染Markdown内容
const renderedMarkdown = computed(() => {
  if (!article.value) return '';
  return md.render(article.value.body);
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
    const data = await fetchArticleById(id);
    if (!data) {
      error.value = '文章不存在或已被删除';
    } else {
      article.value = data;
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
});

// 监听路由参数变化，重新获取文章
route.params.id && watch(() => route.params.id, () => {
  getArticleDetail();
});
</script>

<style scoped>
.article-detail-page {
  padding: 20px;
  max-width: 1100px;
  margin: 0 auto;
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
}

.article-image-container {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.article-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-image:hover {
  transform: scale(1.02);
}

.article-header {
  padding: 30px;
  border-bottom: 1px solid #e8e8e8;
}

.article-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  font-size: 20px !important;
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
  font-size: 16px !important;
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
@media (max-width: 768px) {
  .article-detail-page {
    padding: 10px;
  }
  
  .article-image-container {
    height: 200px;
  }
  
  .article-header,
  .article-body,
  .article-actions {
    padding: 20px;
  }
  
  .article-title {
    font-size: 28px;
  }
  
  .meta-info {
    flex-direction: column;
    gap: 5px;
  }
}
</style>