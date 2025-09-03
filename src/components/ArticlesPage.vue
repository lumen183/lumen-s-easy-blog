<template>
  <div class="articles-page">
    <div class="page-header">
    </div>
    
    <!-- 主要内容区域 - 左右两栏布局 -->
    <div class="main-content">
      <!-- 左侧文章列表 -->
      <div class="articles-section">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <LoadingAnimation />
        </div>
        
        <!-- 错误状态 -->
        <div v-else-if="error" class="error-container">
          <p class="error-message">{{ error }}</p>
          <button @click="() => loadArticles()" class="retry-button">重试</button>
        </div>
        
        <!-- 文章列表 -->
        <div v-else class="articles-container">
          <div v-if="articles.length === 0" class="empty-state">
            <p>暂无文章</p>
          </div>
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
            class="article-item"
          />
          
          <!-- 分页控件 -->
          <div class="pagination" v-if="totalPages > 1">
            <button 
              class="pagination-button"
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              上一页
            </button>
            
            <div class="pagination-numbers">
              <button
                v-for="pageNum in totalPages"
                :key="pageNum"
                class="pagination-number"
                :class="{ active: pageNum === currentPage }"
                @click="goToPage(pageNum)"
              >
                {{ pageNum }}
              </button>
            </div>
            
            <button 
              class="pagination-button"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
      
      <!-- 右侧个人资料 -->
      <div class="profile-section">
        <Profile />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ArticleCard from './ArticleCard.vue';
import Profile from './Profile.vue';
import LoadingAnimation from './LoadingAnimation.vue';
import type { Article } from '../types/article';
import { fetchArticles, type PaginatedResult } from '../api/articleService';

// 状态管理
const articles = ref<Article[]>([]);
const loading = ref(false);
const error = ref('');
const currentPage = ref(1);
const totalPages = ref(0); // 初始值设为0，由API动态更新
const pageSize = ref(10);  // 每页显示10篇文章
const totalArticles = ref(0);

/**
 * 加载文章列表
 */
const loadArticles = async (page: number = 1) => {
  loading.value = true;
  error.value = '';
  currentPage.value = page;
  
  try {
    // 调用模拟API获取文章数据，传入分页参数
    const data: PaginatedResult<Article> = await fetchArticles({
      page,
      pageSize: pageSize.value
    });
    
    articles.value = data.items;
    totalArticles.value = data.total;
    totalPages.value = data.totalPages;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取文章失败';
  } finally {
    loading.value = false;
  }
};

/**
 * 跳转到指定页
 */
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    loadArticles(page);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

/**
 * 上一页
 */
const prevPage = () => {
  goToPage(currentPage.value - 1);
};

/**
 * 下一页
 */
const nextPage = () => {
  goToPage(currentPage.value + 1);
};

// 组件挂载时加载文章
onMounted(() => {
  loadArticles();
});
</script>

<style scoped>
.articles-page {
  width: 100%;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 主要内容区域 - 左右两栏布局 */
.main-content {
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: flex-start;
}

/* 左侧文章列表区域 */
.articles-section {
  flex: 1;
  max-width: 700px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.error-message {
  color: #ff4d4f;
  font-size: 16px;
  margin-bottom: 16px;
}

.retry-button {
  padding: 8px 16px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #40a9ff;
}

.articles-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.article-item {
  width: 100%;
  max-width: 600px;
  height: 100%;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

/* 分页控件样式 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
  padding: 20px 0;
}

.pagination-button {
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.3);
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  color: #333;
}

.pagination-button:hover:not(:disabled) {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 8px;
}

.pagination-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.3);
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  color: #333;
}

.pagination-number:hover {
  background-color: #f0f0f0;
}

.pagination-number.active {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
}

/* 右侧个人资料区域 */
.profile-section {
  width: 300px;
  position: sticky;
  top: 120px; /* 导航栏下方80px固定，确保完全在导航栏下方显示 */
  align-self: flex-start;
  z-index: 1001; /* 高于导航栏的z-index: 1000，确保不被导航栏覆盖 */
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
    align-items: center;
  }
  
  .profile-section {
    width: 100%;
    max-width: 700px;
    position: static;
  }
}

@media (max-width: 768px) {
  .articles-page {
    padding: 16px;
  }
  
  .page-header h2 {
    font-size: 24px;
  }
  
  .articles-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>