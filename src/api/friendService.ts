import { Friend } from '../types/friend';

/**
 * 模拟获取友情链接数据的服务
 */
class FriendService {
  /**
   * 获取所有友情链接数据
   * @returns Promise<Friend[]>
   */
  async getFriends(): Promise<Friend[]> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 返回mock数据
    return [
      {
        avatar: 'https://avatars.githubusercontent.com/u/155219051?v=4',
        name: 'cuijunjie183',
        description: 'C++高手，RM算法组主力队员，拥有丰富的带新人经验。',
        url: 'https://github.com/cuijunjie18'
      },
      {
        avatar: 'https://avatars.githubusercontent.com/u/59416203?v=4',
        name: '锦恢',
        description: '真正的大神，我的偶像。',
        url: 'https://kirigaya.cn/home'
      },
    ];
  }
  
  /**
   * 根据名称获取特定的朋友数据
   * @param name 朋友名称
   * @returns Promise<Friend | undefined>
   */
  async getFriendByName(name: string): Promise<Friend | undefined> {
    const friends = await this.getFriends();
    return friends.find(friend => friend.name === name);
  }
}

// 导出单例实例
export default new FriendService();