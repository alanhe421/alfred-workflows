#!/bin/bash
SN=`system_profiler SPHardwareDataType | awk '/Serial/ {print $4}'`
if [ -a model_cache ]; then
  model=`cat model_cache`
else
  curl https://support-sp.apple.com/sp/product\?cc\=${SN:0-4:4} --silent | sed 's|.*<configCode>\(.*\)</configCode>.*|\1|' > model_cache
  model=`cat model_cache` 
fi
echo $model
