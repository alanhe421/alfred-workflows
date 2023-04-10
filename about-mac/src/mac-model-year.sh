#!/bin/bash
defaults read ~/Library/Preferences/com.apple.SystemProfiler.plist 'CPU Names' | cut -sd '"' -f 4 | uniq