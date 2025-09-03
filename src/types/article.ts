export interface Article {
  id: string;
  title: string;
  tags: string[];
  body: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  // 默认使用public/basic/default_bg.png作为背景图片
  bgImage?: string;
}