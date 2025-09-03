<template>
  <div class="articles-page">
    <div class="page-header">
      <!-- 标签筛选提示 -->
      <div class="filter-hint" v-if="selectedTag !== '全部'">
        <span class="filter-icon">🔍</span>
        <span>正在查看标签为 "{{ selectedTag }}" 的文章</span>
        <button class="clear-filter" @click="clearTagFilter">清除筛选</button>
      </div>
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
      
      <!-- 侧边栏占位元素 - 用于解决fixed定位导致的排版突变问题 -->
      <div class="sidebar-placeholder"></div>
      
      <!-- 右侧边栏 - 随滑动先下滑后固定 -->
      <div class="sidebar" ref="sidebarRef" :class="{ fixed: isSidebarFixed }">
        <!-- 个人信息卡片 + 分类 + 标签云 -->
        <Profile 
          :all-articles="allArticles"
          :selected-category="selectedCategory"
          :filter-by-category="filterByCategory"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ArticleCard from './ArticleCard.vue';
import Profile from './Profile.vue';
import LoadingAnimation from './LoadingAnimation.vue';
import type { Article } from '../types/article';

const route = useRoute();

// 状态管理
const articles = ref<Article[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const pageSize = ref(5);
const totalPages = ref(1);
const allArticles = ref<Article[]>([]);

// 筛选条件
const selectedCategory = ref<string>('全部');
const selectedTag = ref<string>('全部');
const selectedArchive = ref<string>('全部');

// 计算分类列表
const categories = computed(() => {
  const categorySet = new Set<string>();
  allArticles.value.forEach(article => {
    article.categories?.forEach(category => {
      categorySet.add(category);
    });
  });
  return ['全部', ...Array.from(categorySet)];
});

// 计算标签列表
const tags = computed(() => {
  const tagSet = new Set<string>();
  allArticles.value.forEach(article => {
    article.tags?.forEach(tag => {
      tagSet.add(tag);
    });
  });
  return ['全部', ...Array.from(tagSet)];
});



// 获取分类文章数量
const getCategoryCount = (category: string) => {
  if (category === '全部') return allArticles.value.length;
  return allArticles.value.filter(article => 
    article.categories?.includes(category)
  ).length;
};

// 获取标签文章数量
const getTagCount = (tag: string) => {
  if (tag === '全部') return allArticles.value.length;
  return allArticles.value.filter(article => 
    article.tags?.includes(tag)
  ).length;
};



// 过滤文章
const filteredArticles = computed(() => {
  return allArticles.value.filter(article => {
    // 分类过滤
    if (selectedCategory.value !== '全部' && 
        (!article.categories || !article.categories.includes(selectedCategory.value))) {
      return false;
    }
    
    // 标签过滤
    if (selectedTag.value !== '全部' && 
        (!article.tags || !article.tags.includes(selectedTag.value))) {
      return false;
    }
  
    return true;
  });
});

// 分页后的文章
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredArticles.value.slice(start, end);
});

// 加载文章列表
const loadArticles = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch('/article/articles.json');
    if (!response.ok) {
      throw new Error('获取文章列表失败');
    }
    allArticles.value = await response.json() as Article[];
    
    // 按创建时间倒序排序
    allArticles.value.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // 重置分页
    currentPage.value = 1;
    totalPages.value = Math.ceil(filteredArticles.value.length / pageSize.value);
    
    // 更新显示的文章
    articles.value = paginatedArticles.value;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取文章列表失败';
    console.error('加载文章列表时出错:', err);
  } finally {
    loading.value = false;
  }
};

// 切换到上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    articles.value = paginatedArticles.value;
  }
};

// 切换到下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    articles.value = paginatedArticles.value;
  }
};

// 跳转到指定页
const goToPage = (pageNum: number) => {
  if (pageNum >= 1 && pageNum <= totalPages.value) {
    currentPage.value = pageNum;
    articles.value = paginatedArticles.value;
  }
};

// 按分类过滤
const filterByCategory = (category: string) => {
  selectedCategory.value = category;
  selectedTag.value = '全部';
  selectedArchive.value = '全部';
  currentPage.value = 1;
  totalPages.value = Math.ceil(filteredArticles.value.length / pageSize.value);
  articles.value = paginatedArticles.value;
};

// 按标签过滤
const filterByTag = (tag: string) => {
  selectedTag.value = tag;
  selectedCategory.value = '全部';
  selectedArchive.value = '全部';
  currentPage.value = 1;
  totalPages.value = Math.ceil(filteredArticles.value.length / pageSize.value);
  articles.value = paginatedArticles.value;
};



// 监听过滤条件变化，更新分页
const updatePagination = () => {
  currentPage.value = 1;
  totalPages.value = Math.ceil(filteredArticles.value.length / pageSize.value);
  articles.value = paginatedArticles.value;
};

// 监听过滤条件变化
computed(() => [selectedCategory.value, selectedTag.value]).value;

// 监听路由变化，处理URL中的tag参数
watch(() => route.query.tag, (newTag) => {
  if (newTag && typeof newTag === 'string') {
    selectedTag.value = newTag;
    // 更新分页
    updatePagination();
  } else if (newTag === null) {
    // 如果tag参数不存在，设置为'全部'
    selectedTag.value = '全部';
    updatePagination();
  }
});

// 侧边栏引用
const sidebarRef = ref<HTMLElement | null>(null);

// 侧边栏固定相关状态
const isSidebarFixed = ref(false);
const sidebarInitialPosition = ref(0);

// 处理滚动事件
const handleScroll = () => {
  if (!sidebarRef.value) return;
  
  // 获取滚动位置和侧边栏初始位置
  const scrollTop = window.scrollY;
  
  // 当页面滚动超过侧边栏初始位置时，固定侧边栏
  if (scrollTop > sidebarInitialPosition.value) {
    isSidebarFixed.value = true;
  } else {
    isSidebarFixed.value = false;
  }
};

// 清除标签筛选
const clearTagFilter = () => {
  selectedTag.value = '全部';
  // 更新URL参数
  route.query.tag ? window.history.replaceState({}, '', '/articles') : null;
  updatePagination();
};

// 组件挂载时加载文章并设置滚动监听
onMounted(() => {
  loadArticles();
  
  // 优先从URL参数获取tag
  const tagFromRoute = route.query.tag;
  if (tagFromRoute && typeof tagFromRoute === 'string') {
    selectedTag.value = tagFromRoute;
  } else {
    // 从localStorage获取可能从Navbar传递的selectedTag
    const storedTag = localStorage.getItem('selectedTag');
    if (storedTag) {
      selectedTag.value = storedTag;
      // 清除localStorage，避免重复应用
      localStorage.removeItem('selectedTag');
    }
  }
  
  // 设置侧边栏初始位置
  if (sidebarRef.value) {
    sidebarInitialPosition.value = sidebarRef.value.offsetTop;
  }
  
  // 添加滚动事件监听
  window.addEventListener('scroll', handleScroll);
});

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.articles-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

/* 筛选提示样式 */
.filter-hint {
  background-color: #f8f9fa;
  border-left: 4px solid #007bff;
  padding: 10px 15px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-icon {
  font-size: 16px;
}

.clear-filter {
  margin-left: auto;
  padding: 5px 12px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.clear-filter:hover {
  background-color: #5a6268;
}

.main-content {
  display: flex;
  gap: 30px;
}

/* 左侧文章列表区域 */
.articles-section {
  flex: 1;
  min-width: 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.error-message {
  color: #ff4d4f;
  font-size: 18px;
  margin-bottom: 20px;
}

.retry-button {
  background-color: #646cff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #535bf2;
}

.empty-state {
  text-align: center;
  padding: 50px 0;
  color: #666;
  font-size: 18px;
}

.articles-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-item {
  background: transparent;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 分页控件 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
}

.pagination-button {
  background-color: white;
  border: 1px solid #e0e0e0;
  padding: 8px 16px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  color: #333;
}

.pagination-button:hover:not(:disabled) {
  border-color: #646cff;
  color: #646cff;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 5px;
}

.pagination-number {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  background-color: white;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number:hover {
  background-color: #f0f6ff;
  color: #646cff;
}

.pagination-number.active {
  background-color: #646cff;
  color: white;
}

/* 侧边栏占位元素样式 */
.sidebar-placeholder {
  display: none; /* 默认隐藏 */
  width: 300px; /* 与侧边栏宽度一致 */
  flex-shrink: 0;
}

/* 当侧边栏添加fixed类时，显示占位元素 */
:has(.sidebar.fixed) .sidebar-placeholder {
  display: block;
}

/* 右侧边栏 */
.sidebar {
  width: 300px;
  flex-shrink: 0;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  position: relative;
  padding-bottom: 8px;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background-color: #646cff;
}

.category-section,
.tag-cloud-section {
  background: rgba(255, 255, 255, 0.3);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-list,
.archive-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category-item,
.archive-item {
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  padding: 5px 0;
  color: #666;
  transition: color 0.3s;
}

.category-item:hover,
.archive-item:hover {
  color: #646cff;
}

.category-item.active,
.archive-item.active {
  color: #646cff;
  font-weight: bold;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background-color: rgba(255, 255, 255, 0.3);
  color: #666;
  padding: 4px 10px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.tag:hover {
  background-color: #646cff;
  color: white;
}

.tag.active {
  background-color: #646cff;
  color: white;
}

/* 侧边栏固定状态样式 */
.sidebar.fixed {
  position: fixed;
  top: 120px; /* 导航栏下方 */
  right: calc((100% - 1200px) / 2 ); /* 居中布局的右侧边距 */
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .sidebar.fixed {
    position: static;
    right: auto;
    background-color: transparent;
    box-shadow: none;
    padding: 0;
  }
}

@media (max-width: 768px) {
  .articles-page {
    padding: 10px;
  }
  
  .sidebar > div {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }
}
</style>