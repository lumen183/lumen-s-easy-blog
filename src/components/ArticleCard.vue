<template>
  <router-link :to="{ name: 'articleDetail', params: { id: article.id } }" class="article-card-link">
    <div class="article-card">
    <!-- 文章内容 -->
    <div class="article-content">
      <h3 class="article-title">
        <i class="iconfont icon-boke"></i>
        {{ article.title }}
      </h3>
      

      
      <!-- 文章摘要 -->
      <p class="article-excerpt">{{ getExcerpt(article.body) }}</p>
      
      <!-- 文章元信息 -->
      <div class="article-meta">
        <div class="meta-info">
          <span class="meta-item">
            <i class="iconfont icon-bianji"></i> {{ formatDate(article.updatedAt) }}
          </span>
          <span class="meta-item">
            {{ article.wordCount }} 字
          </span>
        </div>
        <!-- 标签 -->
        <div class="article-tags">
          <i class="iconfont icon-biaoqian"></i>
          <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
          <span v-if="article.tags.length > 3" class="tag more-tags">+{{ article.tags.length - 3 }}</span>
        </div>
      </div>
    </div>
    
    <!-- 文章图片 -->
    <div 
      class="article-image" 
      :style="{ backgroundImage: `url(${article.bgImage || '/basic/default_bg.png'})` }"
    />
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Article } from '../types/article';

// 接收文章数据作为prop
const props = defineProps<{
  article: Article;
}>();

const router = useRouter();

// 获取文章摘要（前100个字符）
const getExcerpt = (content: string) => {
  if (content.length <= 100) {
    return content;
  }
  return content.substring(0, 100) + '...';
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  // 获取月份、日期和年份，然后手动组合成所需格式
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}, ${day}, ${year}`;
};
</script>

<style scoped>
.article-card-link {
  text-decoration: none;
  color: inherit;
  width: 100%;
}

.article-card {
  display: flex;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  position: relative;
  cursor: pointer;
  padding: 20px;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.article-image {
  margin-top: 20px;
  margin-right: 30px;
  width: 160px;
  height: 120px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
  align-self: flex-start;
}


.article-content {
  flex: 1;
  padding: 20px 20px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.article-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 12px;
}

.article-title i {
  color: #094258;
  font-size: 26px;
  font-weight: 900;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
  margin-left: 12px;
  font-weight: 700;
  margin-right: 30px;
  position: relative;
  left: 0;
}

.more-tags {
  background-color: rgba(9, 66, 88, 0.1);
  color: #094258;
  font-style: italic;
}
.article-tags i {
  color: #777;
  font-weight: 900;

}

.meta-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.tag {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 12px;
  font-size: 18px;
  background-color: rgba(255, 255, 255, 0.3);
  color: #666;
}

.article-excerpt {
  font-size: 20px;
  color: #666;
  line-height: 1.8;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.article-meta {
  display: flex;
  font-size: 18px;
  color: #999;
  margin-top: 14px;
  width: calc(100% + 160px + 30px);
  margin-bottom: 4px;
}


.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #777;
}

.meta-item i {
  font-size: 20px;
  color: #777;
}

@media (max-width: 768px) {
  .article-card {
    flex-direction: column;
    margin-bottom: 16px;
  }
}
</style>