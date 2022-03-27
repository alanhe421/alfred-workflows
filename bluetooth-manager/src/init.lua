 hs.hotkey.bind({"ctrl","cmd","shift"}, "[",function()
  local res = hs.battery.privateBluetoothBatteryInfo()
  hs.json.write(res, '/private/tmp/apple_battery_hammerspoon.json',false,true)  
 end
)