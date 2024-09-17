#!/bin/bash
osName=$(sed -nE '/SOFTWARE LICENSE AGREEMENT FOR/s/([A-Za-z]+ ){5}|\\$//gp' /System/Library/CoreServices/Setup\ Assistant.app/Contents/Resources/en.lproj/OSXSoftwareLicense.rtf)
osName="${osName:9}"
osName=$(echo "$osName" | sed -E 's/^[0-9]+[[:space:]]+//')
echo ${osName}