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
        <p class="blog-title">等待更新</p>
        <p class="blog-subtitle"></p>
        <p class="blog-date">Apr 13, 2025</p>
      </div>
    </div>

    <!-- 分类列表 -->
    <div class="category-section">
      <h3 class="section-title">专栏文</h3>
      <div class="category-list">
        <button 
          v-for="category in categories"
          :key="category"
          class="category-item"
          :class="{ active: selectedCategory === category }"
          @click="filterByCategory(category)"
        >
          {{ category }} ({{ getCategoryCount(category) }})
        </button>
      </div>
    </div>
    

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Article } from '../types/article';

interface Props {
  allArticles: Article[];
  selectedCategory: string;
  selectedTag?: string;
  filterByCategory: (category: string) => void;
  filterByTag?: (tag: string) => void;
}

const props = defineProps<Props>();

// 计算分类列表
const categories = computed(() => {
  const categorySet = new Set<string>();
  props.allArticles.forEach(article => {
    article.categories?.forEach(category => {
      categorySet.add(category);
    });
  });
  return ['全部', ...Array.from(categorySet)];
});

// 获取分类文章数量
const getCategoryCount = (category: string) => {
  if (category === '全部') return props.allArticles.length;
  return props.allArticles.filter(article => 
    article.categories?.includes(category)
  ).length;
};
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

/* 分类样式 */
.category-section {
  background: rgba(255, 255, 255, 0.3);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category-item {
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  padding: 5px 0;
  color: #666;
  transition: color 0.3s;
}

.category-item:hover {
  color: #646cff;
}

.category-item.active {
  color: #646cff;
  font-weight: bold;
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