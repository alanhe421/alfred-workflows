#!/bin/bash

[[ -d "${alfred_workflow_cache}" ]] || mkdir "${alfred_workflow_cache}"
SN=$(system_profiler SPHardwareDataType | awk '/Serial/ {print $4}')
model_cache="$(eval echo $alfred_workflow_cache/model_cache)"

if [ ! -e "$model_cache" ]; then
 output= curl https://support-sp.apple.com/sp/product\?cc\=${SN: -4} --silent | sed 's|.*<configCode>\(.*\)</configCode>.*|\1|' > "$model_cache"
fi

echo $(cat "$model_cache")