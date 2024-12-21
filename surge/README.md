# Surge

> Surge Mac 4.0提供了HTTP API支持，因此终于可以打通外部App调用了。这里实现了Alfred的打通，比如快速切换代理模式等。

## 功能


1. 支持代理模式切换
2. 支持增强模式开关
3. 支持规则检索及切换选中状态
4. 支持MitM开关
5. 支持模块开关
6. 支持选中profile切换，⌘ enter 则finder下选中profile文件


### 操作说明
1. option enter进入下一级菜单
2. enter选中
3. command enter表示reveal in finder

## 安装 

1. brew install node
2. 开启Surge API支持
3. 注意如果是连接的本地Surge 127.0.0.1服务，需要skip-proxy中配置127.0.0.1

##  如何开启Surge API支持

配置文件中增加如下配置

```
http-api = examplekey@0.0.0.0:6171

```

更多介绍参见这里 https://1991421.cn/2020/11/16/a12a6619/

### Surge API官方文档

据作者所说，未来还会开放更多API，敬请期待。。。

- https://manual.nssurge.com/others/http-api.html


## 注意
Surge Mac 4.0.0、Surge iOS 4.4.0开始提供HTTP API, 即该版本之前的均不支持



[![](https://img.shields.io/badge/version-v1.27-green?style=for-the-badge)](https://img.shields.io/badge/version-v1.27-green?style=for-the-badge)
[![](https://img.shields.io/badge/download-click-blue?style=for-the-badge)](https://github.com/alanhe421/alfred-workflows/raw/master/surge/Surge.alfredworkflow)




<!-- more -->

## 实际效果

![](screenshots/screenshot.gif)
