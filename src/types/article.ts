export interface Article {
  id: string;
  title: string;
  tags: string[];
  // 文章内容
  body?: string;
  // 文章摘要
  summary?: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  // 默认使用public/basic/default_bg.png作为背景图片
  bgImage?: string;
  // 文章markdown文件路径
  markdownPath?: string;
  categories?: string[];
  // 文章是否发布
}