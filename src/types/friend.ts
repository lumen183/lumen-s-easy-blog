/**
 * 朋友/友情链接类型定义
 */
export interface Friend {
  /**
   * 头像URL
   */
  avatar: string;
  
  /**
   * 名称
   */
  name: string;
  
  /**
   * 简介
   */
  description: string;
  
  /**
   * 主页URL
   */
  url_type : number; // url类型，0表示个人博客，1表示github
  url: string;
}