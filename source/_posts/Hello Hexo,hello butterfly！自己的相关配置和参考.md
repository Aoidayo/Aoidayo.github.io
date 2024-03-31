---
title: Hello Hexo,hello butterfly!自己的相关配置和参考
abbrlink: b68a7456
date: 2024-03-31 09:36:56
top_img: https://i.ibb.co/4SbXWdZ/C680181-D-E5-B6-5755-49-EA-E3-C65501-A81-B.jpg
tags:
- blog主题
---

# Pre

前言：

记录于2024/3/31

花了一个上午和一个晚上配置，去掉了一些自己不喜欢的东西，喜欢的东西由于能力限制也没能加上(╯﹏╰)

这个页面我是部署在github上面的，gitee没有自动部署，cnblogs会被自动检索到，我只是想写给自己看，所以就选择使用github pages了。

# 开始

（1）本地安装hexo及butterfly

- [配置 | Hexo](https://hexo.io/zh-cn/docs/configuration)

- [Hexo+Butterfly主题+Github搭建博客 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/688070849)

- [Hexo+Butterfly 主题 + Github 搭建博客 | 老登 AI (laodengai.com)](https://www.laodengai.com/hexo-butterfly-github-blog-20240318/)

（2）github上创建同名仓库

注意，这个仓库最好再建立一个branch专门存放本地包含所有依赖的文件夹，一个main branch专门存放部署的文件夹。

我的分支是

- main
  - 部署的文件夹，`_config.yml`中配置的deploy分支
- hexo
  - 包含所有依赖的分支

参考：

- [博客已经一键部署到github，本地源码丢失，怎么找回 · Issue #3676 · hexojs/hexo](https://github.com/hexojs/hexo/issues/3676)

> 多仓库管理hexo
>
> - main
> - branch
>
> [(11 封私信 / 8 条消息) 使用hexo，如果换了电脑怎么更新博客？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/21193762)
>
> 每次写完之后最好同步仓库
>
> ```bash
> git add .
> git commit –m "xxxx"
> git push 
> ```

> [!note]
>
> hexo中因为包含hexo和butterfly两个项目，所以存在submodule，解决方法
>
> - [git仓库包含子仓库时，add报错的解决办法-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1583762)
> - [解决 You‘ve added another git repository inside your current repository.以及git 带子仓库与.gitignore 实践_you've added another git repository inside your cu-CSDN博客](https://blog.csdn.net/weixin_44821644/article/details/108268630)

（3）基本使用

3.1）将hexo的分支clone到本地后

```bash
npm i

hexo new post [新的文章名]
# cd进source文件夹的_post文件夹中进行编辑

hexo new page [新的page名]

# hexo三连
hexo clean 
hexo g
hexo d
# 可以写成
hexo c & hexo g & hexo d

# 本地起4000端口访问
hexo s
```

> tag和categories，这个其实还是我太熟悉，其实初始化一次就够了
>
> - [解决 Hexo 搭建博客显示不出分类、标签问题_hexo 博客 tag不显示-CSDN博客](https://blog.csdn.net/Wonz5130/article/details/84666519)

（4）相关美化

- [Hexo 安装并使用 Butterfly 主题 | 小康博客 (antmoe.com)](https://blog.antmoe.com/posts/75a6347a/#启用主题)
- [重构记录 - 4 | 爱吃肉的猫 (meuicat.com)](https://meuicat.com/blog/42/#个性定位欢迎语)

- [Butterfly 主题美化（一） | Hyper Tech (captainz.cc)](https://blog.captainz.cc/posts/hexo_butterfly_beautify_1.html)

- [Hyper Tech - 专注于质量的博客。 (captainz.cc)](https://blog.captainz.cc/)

4.1）一图流

一图流美化：我自己主要用的

这个的重点就在于头图是固定大小的透明图，然后设置页面图就可以成为一图流的形式

另外，如果post文章设置图片有两种方法

```bash
top_img: false/path/transparent
cover: path
```

top_img设置false那么页面就会变成一图流

- [Butterfly主题 一图流背景与顶部图修改 | 边缘矩阵 (android99.com)](https://android99.com/2021/08/10/butterfly-top-image-modify/)

4.2）aside配置

- [Hexo Butterfly主题相关配置 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/492207978)

我比较讨厌头像旋转，所以在butterfly的source中取消了

-  [如何修改头像啊？ · jerryc127/hexo-theme-butterfly · Discussion #878 (github.com)](https://github.com/jerryc127/hexo-theme-butterfly/discussions/878)

（5）图片配置

使用插件完成

-  [hexo的butterfly主题美化，2024最新版，随缘更新_hexo-theme-butterfly-CSDN博客](https://blog.csdn.net/JesseXW/article/details/135649752)

这个插件有问题，github上有不少它的fix版本，实际上就是cd进去修改index文件即可

使用`hexo new post post_name`生成与文章同名的文件夹，然后图片路径使用`./post_name/xxxx.jpg`即可

> 一些参考
>
> - [hexo博客中插入图片失败——解决思路及个人最终解决办法_hexo无法插入图片-CSDN博客](https://blog.csdn.net/m0_43401436/article/details/107191688)
>
> - [HEXO系列教程 | 发布文章 | 解决静态图片路径错误问题 | 小白向教程 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/688729291)
>
> - [使用Hexo-asset-image插件导致静态图片路径出错-Hexo采坑(二)-CSDN博客](https://blog.csdn.net/qq_42009500/article/details/118788129)
>
> - [Hexo 引用本地图片以及引用本地任意位置图片的一点思路 | 养恐龙 (leay.net)](https://leay.net/2019/12/25/hexo/)

# 最后

大概就是长这样

![image-20240331233346795](./assets/image-20240331233346795.png)