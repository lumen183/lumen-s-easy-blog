<template>
  <div class="person-card">
    <div class="avatar-container">
      <img 
        class="avatar"
        :src="avatarUrl" 
        :alt="`${name}的头像`"
      />
    </div>
    <div class="person-info">
      <h3 class="person-name">{{ name }}</h3>
      <p class="person-description">{{ description }}</p>
      <div v-if="githubUrl" class="github-info">
        <div class="github-label">
          <i class="iconfont icon-github-fill"></i>
          github主页：
        </div>
        <a 
          :href="githubUrl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="github-link"
        >
          {{ githubUrl }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  avatarUrl: string
  description: string
  githubUrl: string
}

const props = defineProps<Props>()
</script>

<style scoped>
.person-card {
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.person-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.avatar-container {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
}

.avatar {
  width: 120%;
  height: 120%;
  border-radius: 50%;
  object-fit: cover;
}

.person-info {
  width: 100%;
}

.person-name {
  font-size: 1.8rem;
  margin-bottom: 8px;
  color: #000000;
  font-weight: 600;
}

.person-description {
  font-size: 1.35rem;
  margin-bottom: 16px;
  color: rgba(64, 64, 64, 0.8);
  line-height: 1.5;
}

.github-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.github-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.3rem;
  color: rgba(64, 64, 64, 0.9);
  text-align: left;
  margin-bottom: 4px;
}

.github-link {
  font-size: 1.3rem;
  color: #00c7b7;
  text-decoration: none;
  margin-left: 2rem;
  transition: color 0.2s ease;
}

.github-link:hover {
  color: #00e6d2;
}

.github-label .icon-github-fill {
  margin-top: 2px;
}

@media (max-width: 768px) {
  .avatar-container {
    width: 64px;
    height: 64px;
  }
  
  .person-name {
    font-size: 1.6rem;
  }
  
  .person-description {
    font-size: 1.2rem;
  }
  
  .github-label,
  .github-link {
    font-size: 1.1rem;
  }
}
</style>