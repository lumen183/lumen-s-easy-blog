# markdown编辑：从Marktext到vscode

<style>
  /* 仅对段落和块引用的第一行设置缩进 */
  blockquote, p {
    text-indent: 2em; /* 首行缩进2em，其他行不受影响 */
  }

  img {
  display: block;
  margin: 0 auto;
  }
</style>

最近写笔记，写论文等等需求突然多了起来，不得不研究写markdown和typst的高级排版功能。大致整理如下：

## vscode中的markdown

笔者原来采用的是Marktext用来写markdown，不过最近发现vscode的markdown插件功能更强大，经过配置后，完全可以不输其他md编辑器。

**好用的插件**

***M**arkdown **P**review **E**nhancer*（MPE）是首推的一款功能强大的markdown插件。集预览，导出各种文件为一体。通过打开侧边栏预览，在预览页右键，就可以很方便地执行各种功能

![排版示例](https://picx.zhimg.com/80/v2-6bc23cd7e968d4c8902c2343c9a42e00_1440w.webp?source=d16d100b){width=85%}
不过PDF导出在wsl环境下可能有些问题，笔者试了一天还没试出来。

**Paste Image Anywhere** &emsp; 该插件可以实现像Marktext那样，`Ctrl+V`粘贴图片的功能，并且还支持typst等其他编辑器。

**Markdown All in One** &emsp; 该插件主要实现了许多Marktext里的快捷键。如`Ctrl+B`可以加粗，`Ctrl+I`可以输出斜体文件。可以无缝衔接Marktext的快捷键。

**markdownlint** &emsp; 这个插件可以规范markdown语法，提高写作质量。但是默认会给所有html弹警告。如果要取消，可以在设置中`settings.json`的`markdownlint`中添加配置：

```json
{
  "markdownlint.config":{
    "MD033": false
  }
}
```

### 基础排版

### 缩进的实现

初步使用markdown时，最令我深恶痛绝的，就是每段不缩进，而且空格还会被视为压缩，导致每段都是顶格的。

**解决方法：**

1.使用`&nbsp;`或`&emsp;`这类空格符号，但这种方法用的不爽，不推荐

2.使用html标签，在markdown顶部定义一个CSS样式，来实现全局的首行缩进。

```html
<style>
  blockquote, p {
    text-indent: 2em; /* 首行缩进2em，其他行不受影响 */
  }
</style>
```

同样的，对于图片的排版也可以使用上述形式。

```html
<style>
    img  {
        display:block,
        margin: 0 auto;
    }
</style>
```

给每章图片单独指定样式，还可以使用以下语法

```markdown
![文字](图片路径){样式，如 width=50%. }
```

---

## typst设置

对于typst来说，~~首先要找到一个好模板，然后就不用管了~~。typst用于排版要求更加多样的场景，基本上可以理解为轻量的一个LaTeX编辑器。

对于比较细节的排版文档，可以参考[官方文档](https://typst.com/docs/guide/typography-guide/)。

关于图片排版，这里介绍两个参数，用于缩放图片。

```typst
#image("path", cover:"stretch", scaling:"smooth")
```

其中参数含义如下：

**cover**：指定width,height比例不同时，要如何实现图片的缩放。接受参数有：

- `"contain"`：保持图片长宽比，缩放图片，使得图片完全覆盖容器。
- `"stretch"`：拉伸图片，忽略长宽比，填满容器。
- `"cover"`: 裁剪图片以适应容器。

**scaling**：指定图片缩放的效果。接受参数有：

- `"pixelated"`: 最近邻缩放。
- `"smooth"`：平滑缩放图片。
