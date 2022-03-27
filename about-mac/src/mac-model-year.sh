#!/bin/bash
SN=`system_profiler SPHardwareDataType | awk '/Serial/ {print $4}'`
curl https://support-sp.apple.com/sp/product\?cc\=${SN:0-4:4} --silent | sed 's|.*<configCode>\(.*\)</configCode>.*|\1|'