# Parse as XML and store in environment variables
battery_left=$(defaults export /Library/Preferences/com.apple.Bluetooth   - | xpath '//dict/key[text()="BatteryPercentLeft"]/following-sibling::integer[1]/text()' 2>/dev/null )
battery_right=$(defaults export /Library/Preferences/com.apple.Bluetooth   - | xpath '//dict/key[text()="BatteryPercentRight"]/following-sibling::integer[1]/text()' 2>/dev/null )
battery_case=$(defaults export /Library/Preferences/com.apple.Bluetooth   - | xpath '//dict/key[text()="BatteryPercentCase"]/following-sibling::integer[1]/text()' 2>/dev/null )
echo left: $battery_left
echo right: $battery_right
echo case: $battery_case

# Just show values from defaults plist text output
# Left
defaults read /Library/Preferences/com.apple.Bluetooth    | grep BatteryPercentLeft | tr -d \; | awk '{print $3}'

# Right
defaults read /Library/Preferences/com.apple.Bluetooth    | grep BatteryPercentRight | tr -d \; | awk '{print $3}'

# Case
defaults read /Library/Preferences/com.apple.Bluetooth    | grep BatteryPercentCase | tr -d \; | awk '{print $3}'

