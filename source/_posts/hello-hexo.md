---
title: hello-hexo
abbrlink: b68a7456
date: 2024-03-31 09:36:56
top_img: transparent
tags:
---

# Hexo With Butterfly

Hello butterfly

This is my github page

## 教程

（1）官方文档：

- [配置 | Hexo](https://hexo.io/zh-cn/docs/configuration)

- [Hexo+Butterfly主题+Github搭建博客 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/688070849)

- [Hexo+Butterfly 主题 + Github 搭建博客 | 老登 AI (laodengai.com)](https://www.laodengai.com/hexo-butterfly-github-blog-20240318/)

- [人人都可以去自定义 | Butterfly主题美化教程 (zhheo.com)](https://butterfly.zhheo.com/Introduction.html)



（2）美化教程

- [Hexo 安装并使用 Butterfly 主题 | 小康博客 (antmoe.com)](https://blog.antmoe.com/posts/75a6347a/#启用主题)

一图流美化：我自己主要用的

- [Butterfly主题 一图流背景与顶部图修改 | 边缘矩阵 (android99.com)](https://android99.com/2021/08/10/butterfly-top-image-modify/?highlight=一图流)

图片配置

- [hexo的butterfly主题美化，2024最新版，随缘更新_hexo-theme-butterfly-CSDN博客](https://blog.csdn.net/JesseXW/article/details/135649752)

aside配置

- [Hexo Butterfly主题相关配置 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/492207978)

如何取消旋转

- [如何修改头像啊？ · jerryc127/hexo-theme-butterfly · Discussion #878 (github.com)](https://github.com/jerryc127/hexo-theme-butterfly/discussions/878)
- 

[重构记录 - 4 | 爱吃肉的猫 (meuicat.com)](https://meuicat.com/blog/42/#个性定位欢迎语)

（3）使用教程

- [博客已经一键部署到github，本地源码丢失，怎么找回 · Issue #3676 · hexojs/hexo](https://github.com/hexojs/hexo/issues/3676)



多仓库管理hexo

- main
- branch

[(11 封私信 / 8 条消息) 使用hexo，如果换了电脑怎么更新博客？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/21193762)

每次写完之后最好同步仓库

```
git add .
git commit –m "xxxx"
git push 
```



图像设置

- [hexo博客中插入图片失败——解决思路及个人最终解决办法_hexo无法插入图片-CSDN博客](https://blog.csdn.net/m0_43401436/article/details/107191688)****

- [HEXO系列教程 | 发布文章 | 解决静态图片路径错误问题 | 小白向教程 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/688729291)

- [使用Hexo-asset-image插件导致静态图片路径出错-Hexo采坑(二)-CSDN博客](https://blog.csdn.net/qq_42009500/article/details/118788129)

```js
'use strict';
var cheerio = require('cheerio');

// http://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
function getPosition(str, m, i) {
  return str.split(m, i).join(m).length;
}

hexo.extend.filter.register('after_post_render', function(data){
  var config = hexo.config;
  if(config.post_asset_folder){
    var link = data.permalink;
    var beginPos = getPosition(link, '/', 3) + 1;
    var appendLink = '';
    // In hexo 3.1.1, the permalink of "about" page is like ".../about/index.html".
    // if not with index.html endpos = link.lastIndexOf('.') + 1 support hexo-abbrlink
    if(/.*\/index\.html$/.test(link)) {
      // when permalink is end with index.html, for example 2019/02/20/xxtitle/index.html
      // image in xxtitle/ will go to xxtitle/index/
      appendLink = 'index/';
      var endPos = link.lastIndexOf('/');
    }
    else {
      var endPos = link.lastIndexOf('.');
    }
    link = link.substring(beginPos, endPos) + '/' + appendLink;

    var toprocess = ['excerpt', 'more', 'content'];
    for(var i = 0; i < toprocess.length; i++){
      var key = toprocess[i];

      var $ = cheerio.load(data[key], {
        ignoreWhitespace: false,
        xmlMode: false,
        lowerCaseTags: false,
        decodeEntities: false
      });

      $('img').each(function(){
        if ($(this).attr('src')){
          // For windows style path, we replace '\' to '/'.
          var src = $(this).attr('src').replace('\\', '/');
          if(!(/http[s]*.*|\/\/.*/.test(src)
            || /^\s+\//.test(src)
            || /^\s*\/uploads|images\//.test(src))) {
            // For "about" page, the first part of "src" can't be removed.
            // In addition, to support multi-level local directory.
            var linkArray = link.split('/').filter(function(elem){
              return elem != '';
            });
            var srcArray = src.split('/').filter(function(elem){
              return elem != '' && elem != '.';
            });
            if(srcArray.length > 1)
            srcArray.shift();
            src = srcArray.join('/');

            $(this).attr('src', src);
            console.info&&console.info("update link as:-->"  + src);
          }
        }else{
          console.info&&console.info("no src attr, skipped...");
          console.info&&console.info($(this));
        }
      });
      data[key] = $.html();
    }
  }
});

```

关于hexo的一系列问题

- [Hexo 引用本地图片以及引用本地任意位置图片的一点思路 | 养恐龙 (leay.net)](https://leay.net/2019/12/25/hexo/)



主题美化

- [Butterfly 主题美化（一） | Hyper Tech (captainz.cc)](https://blog.captainz.cc/posts/hexo_butterfly_beautify_1.html)

- [Hyper Tech - 专注于质量的博客。 (captainz.cc)](https://blog.captainz.cc/)



分类标签

- [解决 Hexo 搭建博客显示不出分类、标签问题_hexo 博客 tag不显示-CSDN博客](https://blog.csdn.net/Wonz5130/article/details/84666519)
