> Read authentication code in your recent messages or current clipboard

1. Type `2fa` to trigger workflow
2. Type`⌘ C` or `⏎` to copy captcha

## requirement

1. `brew install node`
2. Alfred has permission to `Full Disk Access`

## upgrade sqlite3 issue

> Perhaps the built-in SQLite3 version on Mac is too low and does not support JSON output, so it is necessary to upgrade it using Homebrew.

1.check json support
  sqlite3 -json
2. create symbolic link 
ln -sf /usr/local/Cellar/sqlite/[version]/bin/sqlite3 /usr/local/bin/sqlite3
3. export PATH="/usr/local/bin:$PATH"



![](https://img.shields.io/badge/version-v1.5-green?style=for-the-badge)
[![](https://img.shields.io/badge/download-click-blue?style=for-the-badge)](https://github.com/alanhg/alfred-workflows/raw/master/2fa-read-code/2FA-Read%20Code.alfredworkflow)
[![](https://img.shields.io/badge/plist-link-important?style=for-the-badge)](https://raw.githubusercontent.com/alanhg/alfred-workflows/master/2fa-read-code/src/info.plist)



<!-- more -->

## screenshots

![](./screenshot.png)

![](./screenshot.gif)
