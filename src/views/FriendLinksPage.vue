<template>
  <div class="friend-links-page">
    <!-- 气泡框 -->
    <div class="quote-bubble">
      <p class="quote-text">
        <span class="quote-mark">&nbsp;&nbsp;“</span>
        感谢与你们的遇见，感恩你们的付出<br>
        <span class="quote-mark">”&nbsp;&nbsp;</span>
      </p>
    </div>
    
    <p class="subtitle">这是他们的友情链接， 欢迎访问！</p>
    
    <div v-if="loading" class="loading">
      <LoadingAnimation />
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else class="friends-container">
      <PersonCard 
        v-for="friend in friends" 
        :key="friend.name"
        :name="friend.name"
        :avatarUrl="friend.avatar"
        :description="friend.description"
        :githubUrl="friend.url"
        :urlType="friend.url_type"
      />
    </div>

    <!-- 致谢部分 -->
    <div class="acknowledgements-section">
      <h2 class="acknowledgements-title">致谢</h2>
      <div class="acknowledgements-content">
        <p class="acknowledgements-text">
          感谢你们的关注，特别感谢所有在我的成长道路上给予支持和帮助的朋友们。是你们的鼓励、分享和协作，让这个博客得以存在并不断发展。
          每一次交流、每一次讨论，都为我提供了宝贵的学习和成长机会。
        </p>
        <p class="acknowledgements-text">
           首先我要感谢@cuijunjie18，他是真正带我入门计算机科学的人。从他的笔记本里，我知道了如何去记录平常遇到的问题，去热爱计算机科学这门学科。在与他的交流中，我开始萌生出写博客的想法。
        </p>
        <p class="acknowledgements-text">
           我要感谢锦恢，他是我的精神偶像，技术精湛，生活丰富，精神富足。
          他的技术博客是我学习的榜样。在他的影响下我真正有了写博客的动力和灵感。我的博客也是以他的个人主页为基础构建的。虽然我没有他那样过人的水平，所做的博客也只有几个简单的功能，但是，我相信，只要坚持下去，我一定可以做出更好的成果。
        </p>
        <p class="acknowledgements-text">
           最后，我要感谢所有给予我建议和帮助的人，再次感谢所有在路上遇见的人，感谢所有帮助过我的人，感谢所有鼓励过我的人。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PersonCard from '../components/PersonCard.vue'
import LoadingAnimation from '../components/LoadingAnimation.vue'
import type { Friend } from '../types/friend'

const friends = ref<Friend[]>([])
const loading = ref(true)
const error = ref('')

// 页面加载时获取友情链接数据
onMounted(async () => {
  try {
    const response = await fetch('/friendlink/friends.json')
    if (!response.ok) {
      throw new Error('网络响应异常')
    }
    friends.value = await response.json()
  } catch (err) {
    error.value = '获取友情链接数据失败'
    console.error('Failed to get friends:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.friend-links-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.friend-links-page h1 {
  font-size: 2.4rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.quote-bubble {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  margin: 1rem 0;
  position: relative;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.quote-bubble::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #f9f9f9;
}

.quote-bubble::after {
  content: '';
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 2px solid #e0e0e0;
  z-index: -1;
}

.quote-text {
  font-style: italic;
  color: #555;
  font-size: 1.6rem;
  text-align: center;
  margin: 0;
  line-height: 1.8;
}

.quote-mark {
  font-size: 4rem;
  line-height: 0.6;
  color: #ccc;
  display: block;
  height: 1em;
  font-family: 'Times New Roman', 'STSong', serif;
  font-style: normal;
  margin-top: 0.1em;
  margin-bottom: -0.5em;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.friends-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .friends-container {
    grid-template-columns: 1fr;
  }
}
  .loading, .error {
    padding: 2rem;
    text-align: center;
    color: #666;
    font-size: 1.4rem;
  }
  
  .error {
    color: #ff4d4f;
  }

  /* 致谢部分样式 */
  .acknowledgements-section {
    margin-top: 4rem;
    padding: 2.5rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    position: relative;
    overflow: hidden;
  }

  .acknowledgements-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }

  .acknowledgements-title {
    font-size: 2rem;
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
    position: relative;
    padding-bottom: 0.5rem;
  }

  .acknowledgements-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 3px;
  }

  .acknowledgements-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .acknowledgements-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #555;
    margin-bottom: 1.2rem;
    text-align: left;
  }

  @media (max-width: 768px) {
    .acknowledgements-section {
      padding: 1.5rem;
      margin-top: 2rem;
    }
    
    .acknowledgements-title {
      font-size: 1.6rem;
    }
    
    .acknowledgements-text {
      font-size: 1rem;
    }
  }
</style>