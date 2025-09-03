import type { Article } from '../types/article';

// 模拟文章数据
const mockArticles: Article[] = [
  {
    id: '1',
    title: '纯 Python 实现简易版本的前向计算图捕获工具',
    tags: ['python', 'torch', '编译', '计算图'],
    createdAt: '2025-08-25 23:06',
    updatedAt: '2025-08-25 23:06',
    wordCount: 2500,
    markdownPath: '/article/markdown/article_1.md'
  },
  {
    id: '2',
    title: 'Vue 3 组合式 API 最佳实践',
    tags: ['vue', 'javascript', 'frontend', 'web'],
    createdAt: '2025-08-24 15:30',
    updatedAt: '2025-08-24 16:45',
    wordCount: 3200,
    markdownPath: '/article/markdown/article_2.md'
  },
  {
    id: '3',
    title: 'Go语言并发编程深入解析',
    tags: ['go', 'concurrency', 'backend', 'performance'],
    createdAt: '2025-08-23 10:15',
    updatedAt: '2025-08-23 14:20',
    wordCount: 4500,
    bgImage: '/basic/blog_bg.png',
    markdownPath: '/article/markdown/article_3.md'
  },
  {
    id: '4',
    title: 'React Server Components 探索与实践',
    tags: ['react', 'nextjs', 'ssr', 'frontend'],
    createdAt: '2025-08-22 09:45',
    updatedAt: '2025-08-22 11:30',
    wordCount: 2800,
    markdownPath: '/article/markdown/article_4.md'
  },
  {
    id: '5',
    title: 'Docker容器化部署实战指南',
    tags: ['docker', 'devops', 'deployment', 'linux'],
    createdAt: '2025-08-21 14:20',
    updatedAt: '2025-08-21 16:50',
    wordCount: 3600,
    markdownPath: '/article/markdown/article_5.md'
  },
  {
    id: '6',
    title: 'TypeScript 高级类型系统详解',
    tags: ['typescript', 'javascript', 'frontend', 'typing'],
    createdAt: '2025-08-20 10:30',
    updatedAt: '2025-08-20 15:20',
    wordCount: 3800,
    bgImage: '/basic/blog_bg.png',
    markdownPath: '/article/markdown/article_6.md'
  },
  {
    id: '7',
    title: '微前端架构设计与实践',
    tags: ['microfrontend', 'frontend', 'architecture', 'webpack'],
    createdAt: '2025-08-19 09:15',
    updatedAt: '2025-08-19 11:45',
    wordCount: 4200,
    markdownPath: '/article/markdown/article_7.md'
  },
  {
    id: '8',
    title: 'GraphQL API 设计最佳实践',
    tags: ['graphql', 'api', 'backend', 'frontend'],
    createdAt: '2025-08-18 14:45',
    updatedAt: '2025-08-18 17:20',
    wordCount: 3400,
    markdownPath: '/article/markdown/article_8.md'
  },
  {
    id: '9',
    title: '前端性能优化实战指南',
    tags: ['performance', 'frontend', 'optimization', 'web'],
    createdAt: '2025-08-17 10:00',
    updatedAt: '2025-08-17 16:30',
    wordCount: 4800,
    bgImage: '/basic/blog_bg.png',
    markdownPath: '/article/markdown/article_9.md'
  },
  {
    id: '10',
    title: '现代CSS布局技巧与实践',
    tags: ['css', 'frontend', 'layout', 'web'],
    createdAt: '2025-08-16 15:30',
    updatedAt: '2025-08-16 18:15',
    wordCount: 3200,
    markdownPath: '/article/markdown/article_10.md'
  }
];

/**
 * 模拟网络请求延迟
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 分页参数接口
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 分页结果接口
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 获取文章列表（支持分页）
 */
export const fetchArticles = async (params: PaginationParams = { page: 1, pageSize: 6 }): Promise<PaginatedResult<Article>> => {
  try {
    // 模拟网络延迟
    await delay(200);
    
    // 从JSON文件获取数据
    const response = await fetch('/article/articles.json');
    if (!response.ok) {
      throw new Error('网络响应异常');
    }
    const articles = await response.json() as Article[];
    
    // 计算分页
    const { page, pageSize } = params;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // 获取当前页的数据
    const paginatedArticles = articles.slice(startIndex, endIndex);
    
    // 根据实际文章数量计算总页数
    const totalItems = articles.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    // 返回分页结果
    return {
      items: paginatedArticles,
      total: totalItems,
      page,
      pageSize,
      totalPages
    };
  } catch (error) {
    console.error('获取文章列表失败:', error);
    throw new Error('获取文章列表失败');
  }
};

/**
 * 根据ID获取单个文章
 */
export const fetchArticleById = async (id: string): Promise<Article | null> => {
  try {
    // 模拟网络延迟
    await delay(100);
    
    // 从JSON文件获取数据
    const response = await fetch('/article/articles.json');
    if (!response.ok) {
      throw new Error('网络响应异常');
    }
    const articles = await response.json() as Article[];
    
    // 查找对应ID的文章
    const article = articles.find(a => a.id === id);
    
    if (!article) {
      throw new Error('文章不存在');
    }
    
    return article;
  } catch (error) {
    console.error('获取文章详情失败:', error);
    throw new Error('获取文章详情失败');
  }
};