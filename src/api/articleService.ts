import type { Article } from '../types/article';

// 模拟文章数据
const mockArticles: Article[] = [
  {
    id: '1',
    title: '纯 Python 实现简易版本的前向计算图捕获工具',
    tags: ['python', 'torch', '编译', '计算图'],
    body: `# 纯 Python 实现简易版本的前向计算图捕获工具

## 前言

最近知乎上有一位特殊的朋友发来求助，希望我帮助他实现\`torch.fx.symbolic_trace\`的简化版本。这让我想到，或许有很多开发者对计算图捕获的原理感兴趣，但又觉得官方实现过于复杂。因此，我决定写这篇文章，从零开始用纯Python实现一个简易的前向计算图捕获工具。

## 什么是计算图

计算图是深度学习框架中用于表示计算过程的一种数据结构。它将复杂的计算分解为一系列简单的操作（如加法、乘法、卷积等），并以图的形式展示它们之间的依赖关系。

计算图的主要优点包括：

- **自动微分**：通过反向传播算法，可以自动计算梯度
- **计算优化**：可以对计算过程进行各种优化
- **硬件加速**：可以更有效地映射到GPU等硬件上执行
- **序列化与部署**：便于模型的保存、加载和部署

## 简易计算图捕获工具的设计

我们的目标是创建一个工具，能够捕获Python函数中的计算过程，并生成对应的计算图表示。

### 核心思路

1. 使用Python的动态特性（如装饰器、反射）来跟踪函数调用
2. 定义基本的计算节点类型
3. 在函数执行过程中，自动构建计算图
4. 提供可视化和序列化的功能

### 代码实现

首先，我们定义一个基础的\`Node\`类，表示计算图中的一个节点：

\`\`\`python
class Node:
    def __init__(self, name, op_type, inputs=None):
        self.name = name
        self.op_type = op_type
        self.inputs = inputs or []
        self.output = None
    
    def forward(self):
        # 根据不同的操作类型执行相应的计算
        if self.op_type == 'add':
            self.output = self.inputs[0].output + self.inputs[1].output
        elif self.op_type == 'mul':
            self.output = self.inputs[0].output * self.inputs[1].output
        # 可以添加更多操作类型...
        return self.output
\`\`\`

然后，我们创建一个\`Graph\`类，用于管理整个计算图：

\`\`\`python
class Graph:
    def __init__(self):
        self.nodes = []
        self.input_nodes = []
        self.output_node = None
        
    def add_node(self, node):
        self.nodes.append(node)
        return node
        
    def visualize(self):
        # 实现计算图的可视化
        print("Computation Graph:")
        for node in self.nodes:
            inputs = [n.name for n in node.inputs]
            print(f"{node.name} ({node.op_type}) -> Inputs: {inputs}")
\`\`\`

最后，我们创建一个装饰器\`trace\`，用于捕获函数中的计算过程：

\`\`\`python
def trace(func):
    def wrapper(*args, **kwargs):
        graph = Graph()
        # 这里是简化版的实现逻辑
        # 在实际实现中，需要更复杂的逻辑来跟踪变量和操作
        print(f"Tracing function: {func.__name__}")
        result = func(*args, **kwargs)
        graph.visualize()
        return result
    return wrapper
\`\`\`

## 使用示例

现在，让我们来看一个简单的使用示例：

\`\`\`python
@trace
def simple_model(x, y):
    z = x + y
    w = z * 2
    return w

# 使用我们的跟踪工具
a = 10
b = 20
result = simple_model(a, b)
print(f"Result: {result}")
\`\`\`

## 扩展与优化方向

这个简单的实现只是一个起点，还有很多可以改进的地方：

1. **支持更多操作类型**：目前只支持基本的加减乘除，需要扩展到支持更多的数学运算和深度学习操作

2. **变量追踪**：改进变量追踪机制，能够更准确地捕获变量之间的依赖关系

3. **静态分析**：结合静态分析技术，在不执行代码的情况下构建计算图

4. **图优化**：添加图优化算法，如常量折叠、死代码消除等

5. **自动微分**：实现反向传播算法，支持自动微分

## 总结

通过本文的介绍，我们了解了计算图的基本概念，并实现了一个简易的前向计算图捕获工具。虽然这个实现相对简单，但它展示了计算图捕获的核心思想和技术。

对于想要深入了解深度学习框架内部工作原理的读者，这个小项目是一个很好的起点。希望它能帮助你更好地理解PyTorch、TensorFlow等框架中的计算图机制。

如果你对这个项目感兴趣，可以在GitHub上找到完整的代码和更多的示例。也欢迎提出宝贵的建议和改进意见！`,
    createdAt: '2025-08-25 23:06',
    updatedAt: '2025-08-25 23:06',
    wordCount: 2500
  },
  {
    id: '2',
    title: 'Vue 3 组合式 API 最佳实践',
    tags: ['vue', 'javascript', 'frontend', 'web'],
    body: 'Vue 3 的组合式 API 为我们提供了一种更灵活的方式来组织和复用组件逻辑。本文将介绍一些使用组合式 API 的最佳实践，帮助你写出更清晰、可维护的 Vue 代码...',
    createdAt: '2025-08-24 15:30',
    updatedAt: '2025-08-24 16:45',
    wordCount: 3200
  },
  {
    id: '3',
    title: 'Go语言并发编程深入解析',
    tags: ['go', 'concurrency', 'backend', 'performance'],
    body: 'Go语言以其简洁的语法和强大的并发支持而闻名。本文将深入探讨Go语言的并发模型，包括goroutine、channel、select等核心概念，并通过实例展示如何在实际项目中使用它们...',
    createdAt: '2025-08-23 10:15',
    updatedAt: '2025-08-23 14:20',
    wordCount: 4500,
    bgImage: '/basic/blog_bg.png'
  },
  {
    id: '4',
    title: 'React Server Components 探索与实践',
    tags: ['react', 'nextjs', 'ssr', 'frontend'],
    body: 'React Server Components 是React生态系统中的一个重要创新，它允许我们在服务器端渲染组件，减少客户端JavaScript的体积，提高应用性能。本文将介绍RSC的基本概念和使用方法...',
    createdAt: '2025-08-22 09:45',
    updatedAt: '2025-08-22 11:30',
    wordCount: 2800
  },
  {
    id: '5',
    title: 'Docker容器化部署实战指南',
    tags: ['docker', 'devops', 'deployment', 'linux'],
    body: '容器化技术已经成为现代应用部署的标准方式。本文将详细介绍如何使用Docker对应用进行容器化，包括Dockerfile编写、镜像构建、容器运行和Docker Compose的使用...',
    createdAt: '2025-08-21 14:20',
    updatedAt: '2025-08-21 16:50',
    wordCount: 3600
  },
  {
    id: '6',
    title: 'TypeScript 高级类型系统详解',
    tags: ['typescript', 'javascript', 'frontend', 'typing'],
    body: 'TypeScript的类型系统是其最强大的特性之一。本文将深入探讨TypeScript的高级类型，包括泛型、条件类型、映射类型等，并通过实际案例展示如何利用这些特性编写更安全、更可维护的代码...',
    createdAt: '2025-08-20 10:30',
    updatedAt: '2025-08-20 15:20',
    wordCount: 3800,
    bgImage: '/basic/blog_bg.png'
  },
  {
    id: '7',
    title: '微前端架构设计与实践',
    tags: ['microfrontend', 'frontend', 'architecture', 'webpack'],
    body: '随着前端应用规模的不断扩大，微前端架构逐渐成为解决大型前端应用复杂性的有效方案。本文将介绍微前端的核心概念、设计原则和实现方式，并分享一些实际项目中的经验和教训...',
    createdAt: '2025-08-19 09:15',
    updatedAt: '2025-08-19 11:45',
    wordCount: 4200
  },
  {
    id: '8',
    title: 'GraphQL API 设计最佳实践',
    tags: ['graphql', 'api', 'backend', 'frontend'],
    body: 'GraphQL作为一种新的API查询语言，正在改变我们构建和使用API的方式。本文将介绍GraphQL API设计的最佳实践，包括模式设计、查询优化、安全性考虑等方面的内容...',
    createdAt: '2025-08-18 14:45',
    updatedAt: '2025-08-18 17:20',
    wordCount: 3400
  },
  {
    id: '9',
    title: '前端性能优化实战指南',
    tags: ['performance', 'frontend', 'optimization', 'web'],
    body: '性能是前端应用的关键指标之一。本文将从资源加载、渲染性能、运行时优化等多个维度，详细介绍前端性能优化的技术和方法，并提供一些实用的优化工具和测量手段...',
    createdAt: '2025-08-17 10:00',
    updatedAt: '2025-08-17 16:30',
    wordCount: 4800,
    bgImage: '/basic/blog_bg.png'
  },
  {
    id: '10',
    title: '现代CSS布局技巧与实践',
    tags: ['css', 'frontend', 'layout', 'web'],
    body: 'CSS布局技术一直在不断发展，从早期的浮动布局到Flexbox和Grid，每一次技术进步都为前端开发者提供了更强大的布局能力。本文将介绍现代CSS布局的核心技术和实用技巧...',
    createdAt: '2025-08-16 15:30',
    updatedAt: '2025-08-16 18:15',
    wordCount: 3200
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
    
    // 计算分页
    const { page, pageSize } = params;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // 模拟获取当前页的数据
    const paginatedArticles = mockArticles.slice(startIndex, endIndex);
    
    // 根据实际文章数量计算总页数
    const totalItems = mockArticles.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    // 模拟API成功响应
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
    
    // 查找对应ID的文章
    const article = mockArticles.find(article => article.id === id);
    
    if (!article) {
      throw new Error('文章不存在');
    }
    
    return article;
  } catch (error) {
    console.error('获取文章详情失败:', error);
    throw new Error('获取文章详情失败');
  }
};