import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../components/HomePage.vue')
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('../components/ArticlesPage.vue')
  },
  // 文章详情路由
  {
    path: '/article/:id',
    name: 'articleDetail',
    component: () => import('../components/ArticleDetail.vue')
  },
  // 为了兼容性，将/blog重定向到/articles
  {
    path: '/blog',
    redirect: '/articles'
  },
  // 友情链接路由
  {
    path: '/friend-links',
    name: 'friendLinks',
    component: () => import('../components/FriendLinksPage.vue')
  },
  // 关于我路由
  {
    path: '/aboutme',
    name: 'aboutMe',
    component: () => import('../components/AboutMePage.vue')
  },
  // 404页面路由
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('../components/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router