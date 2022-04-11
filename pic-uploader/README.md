> Upload pictures with one click, support upload to imgur or vps


## VPS uploader setting

1. ssh keygen
    ```

	$ ssh-keygen -t rsa -C "youremail"

	```
2. copy public rsa to the target server
	
   copy to ~/.ssh/authorized_keys 

3. configure the alfred environment variable

## Imgur Uploader setting
1. https://api.imgur.com/oauth2/addclient
   get clientId
2. configure the alfred environment variable

https://apidocs.imgur.com/


![](https://img.shields.io/badge/version-v2.0-green?style=for-the-badge)
[![](https://img.shields.io/badge/download-click-blue?style=for-the-badge)](https://github.com/alanhg/alfred-workflows/raw/undefined/pic-uploader/Pic%20Uploader.alfredworkflow)



<!-- more -->
> 系统截图，或者选中一个图片文件，直接一键即可上传到个人配置的图床服务，然后生成的Markdown图片地址已经存在系统剪切板中。


注意：截图生成的图片格式为`JPEG`

![](./2020-04-04-221152.gif)
