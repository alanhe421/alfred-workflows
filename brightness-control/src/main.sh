
arch=$(uname -m)
brightness="./brightness/brightness.$arch"
currentBrightness=$($brightness -l | grep -o -E 'brightness.*([0-9]+(\.[0-9]+)?)'| tr -d 'brightness ')
if [ "$mode" = "up" ]; then
currentBrightness=$(printf "%.6f" $(echo "$currentBrightness+$brightness_granularity" | bc))
[[ $currentBrightness > 1 ]] && currentBrightness=1

else
currentBrightness=$(printf "%.6f" $(echo "$currentBrightness-$brightness_granularity" | bc))
[[ $currentBrightness < 0 ]] && currentBrightness=0
fi

$brightness $currentBrightness