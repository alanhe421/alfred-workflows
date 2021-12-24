Upload pictures with one click

1. ssh keygen
    ```

	$ ssh-keygen -t rsa -C "youremail"

	```
2. copy public rsa to the target server
	
   copy to ~/.ssh/authorized_keys 

3. configure the alfred environment variable
<!-- more -->
> 系统截图，或者选中一个图片文件，直接一键即可上传到个人配置的图床服务，然后生成的Markdown图片地址已经存在系统剪切板中。

[![](https://img.shields.io/badge/version-v1.5-green)](./Pic%20Uploader.alfredworkflow)

注意：截图生成的图片格式为`JPEG`

![](./2020-04-04-221152.gif)
