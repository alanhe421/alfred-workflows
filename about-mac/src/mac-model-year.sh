#!/bin/bash
model=$(uname -m)
if [[ $model == "arm64" ]]; then
/usr/libexec/PlistBuddy -c 'Print :0:product-name' /dev/stdin <<< "$(ioreg -arc IOPlatformDevice -k product-name)" 2> /dev/null | tr -cd '[:print:]'
else
defaults read ~/Library/Preferences/com.apple.SystemProfiler.plist 'CPU Names' | cut -sd '"' -f 4 | uniq
fi