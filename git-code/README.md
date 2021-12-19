[![](https://img.shields.io/badge/version-v0.7-green)](./Git%20Code.alfredworkflow)
 > 腾讯工蜂项目检索
 
![](./screenshot.gif)

## feat

1. gc+关键词进行模糊检索
2. 拷贝SSH Repo链接
3. ⏎ 浏览器打开Repo地址
4. 最多支持2个工蜂服务配置，如果不需要第二个，去掉相关配置或者置空即可
5. ⌥ ⏎ 选择MR，再⌥ ⏎，显示repo打开的 Merge Request，同时支持关键词检索
6. 增加score权重设定，比如设置score_2=1，这样第二个工蜂服务项目可以优先排在前面，不设定，则默认为第一个项目列表在前

整体设计，⏎均是浏览器打开对应URL，⌥为进一步操作。
