First run this command on a terminal:

brew install blueutil

brew cask install hammerspoon

cp init.lua ~/.hammerspoon/

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

nvm install 10


![](https://img.shields.io/badge/version-v1.0.1-green?style=for-the-badge)
[![](https://img.shields.io/badge/download-click-blue?style=for-the-badge)](https://github.com/alanhg/alfred-workflows/raw/master/bluetooth-manager/Bluetooth%20Manager.alfredworkflow)
[![](https://img.shields.io/badge/plist-link-important?style=for-the-badge)](https://raw.githubusercontent.com/alanhg/alfred-workflows/master/bluetooth-manager/src/info.plist)



<!-- more -->


_支持AirPods电量信息展示_

![](./bluetooth.gif)

## 注意

1. 配对还是需要自己手动在系统蓝牙面板中操作，这里只列出配对的蓝牙设备
2. 选中一个蓝牙设备，回车即可连接或断开蓝牙设备
3. 如果是蓝牙处于关闭状态则会自动打开蓝牙，并通知用户

## 安装

- brew install blueutil

- brew cask install hammerspoon

- cp init.lua ~/.hammerspoon/

	启动hammerspoon，确保开机运行。

- curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

	nvm install 10

### 为什么还需要hammerspoon

hammerspoon可以利用API访问到Mac系统的蓝牙设备电量信息，为了电量信息的展示，需要安装此APP

