#!/bin/bash

STRING="$1"

IFS='‡' read -ra arrIN <<< "$STRING"
freeDiskPercent=$(echo "scale=1; ${arrIN[8]}*100 / ${arrIN[7]}" | bc)
freeMemoryPercent=$(echo "scale=1; ${arrIN[10]}*100 / ${arrIN[6]}" | bc)
displayResolution=$(system_profiler SPDisplaysDataType | awk '/Resolution/{print $2, $3, $4}'|tr '\n' ', '| sed 's/,$//')
serialNumber=$(system_profiler SPHardwareDataType | grep "Serial Number (system)" | awk '{print $NF}'| tr \d '\n' )
upsnnumbertime=$(uptime)
systemUptime=$(uptime | awk -F' up |, [0-9]+ user' '{print $2}' | xargs)
batteryHealthCapacity=$(system_profiler SPPowerDataType | grep "Maximum Capacity:" | tr -d '\n'| tr -d ' ')
batteryHealthCondition=$(system_profiler SPPowerDataType | grep "Condition:"| tr -d '\n'| tr -d ' ')

if [[ "${arrIN[5]}" =~ ^Intel ]]; then
    cpuName="${arrIN[5]}"
    cpuTitle='CPU Type'
else
    cpuName=$(system_profiler SPHardwareDataType | grep "Chip:" | awk -F': ' '{print $2}'| tr \d '\n')
    cpuTitle="Chip (${arrIN[5]}), $(sysctl -n hw.logicalcpu)-Core CPU"
fi

if [ -n "$batteryHealthCapacity" ]; then
  batterySubtitle="${batteryHealthCondition}, ${batteryHealthCapacity}"
else
  batterySubtitle="${batteryHealthCondition}"
fi


cat << EOF 
{
    "items": [
{"title":"${arrIN[0]}","subtitle":"User Name","icon":{"path":"icons/user.png"},"arg":"${arrIN[0]}","uid":"user_name","text":{"copy":"${arrIN[0]}","largetype":"${arrIN[0]}"}},
{"title":"${arrIN[1]}","subtitle":"Host Name","icon":{"path":"./icons/hostname.png"},"arg":"${arrIN[1]}","uid":"host_name","text":{"copy":"${arrIN[1]}","largetype":"${arrIN[1]}"}},
{"title":"${arrIN[2]}","subtitle":"Primary Ethernet Address","icon":{"path":"./icons/ethernet.png"},"arg":"${arrIN[2]}","uid":"primary__ethernet__address","text":{"copy":"${arrIN[2]}","largetype":"${arrIN[2]}"}},
{"title":"${arrIN[11]}","subtitle":"Model","icon":{"path":"./icons/model.png"},"arg":"${arrIN[11]}","uid":"model","text":{"copy":"${arrIN[11]}","largetype":"${arrIN[11]}"}},
{"title":"${arrIN[3]}","subtitle":"IPv4 Address","icon":{"path":"./icons/ip.png"},"arg":"${arrIN[3]}","uid":"ipv4_address","text":{"copy":"${arrIN[3]}","largetype":"${arrIN[3]}"},"match":"ip_"},
{"title":"${arrIN[9]} ${arrIN[4]}","subtitle":"MacOS System Version","icon":{"path":"./icons/mac.png"},"arg":"${arrIN[9]} ${arrIN[4]}","uid":"mac_os_system_version","text":{"copy":"${arrIN[9]} ${arrIN[4]}","largetype":"${arrIN[9]} ${arrIN[4]}"},"match":"os ${arrIN[9]} ${arrIN[4]} "},
{"title":"${cpuName}","subtitle":"${cpuTitle}","icon":{"path":"./icons/cpu.png"},"arg":"${cpuName}","uid":"cpu_type","text":{"copy":"${cpuName}","largetype":"${cpuName}"},"match":"cpu ${cpuName} ${cpuTitle}"},
{"title":"${arrIN[6]} GB Total , ${arrIN[10]} GB Free","subtitle":"Physical Memory, ${freeMemoryPercent}% Free","icon":{"path":"./icons/memory.png"},"arg":"${arrIN[6]}GB total, ${arrIN[10]}GB free","uid":"physical_memory","text":{"copy":"${arrIN[6]}GB total, ${arrIN[10]}GB free","largetype":"${arrIN[6]}GB total, ${arrIN[10]}GB free"}},
{"title":"${arrIN[7]} GB Total , ${arrIN[8]} GB Free","subtitle":"Storage, ${freeDiskPercent}% Free","icon":{"path":"./icons/disk.png"},"arg":"${arrIN[7]}GB total,${arrIN[8]}GB free","uid":"physical__disk","text":{"copy":"${arrIN[7]}GB total,${arrIN[8]}GB free","largetype":"${arrIN[7]}GB total,${arrIN[8]}GB free"},"match":"storage ${arrIN[7]}GB ${arrIN[8]}GB"},
{"title":"Locale / Language","subtitle":"${arrIN[12]}","icon":{"path":"./icons/locale.png"},"arg":"${arrIN[12]}","uid":"locale_language","text":{"copy":"${arrIN[12]}","largetype":"${arrIN[12]}"}},
{"title":"Display Resolution","subtitle":"${displayResolution}","icon":{"path":"./icons/display-resolution.png"},"arg":"${displayResolution}","uid":"display_resolution","text":{"copy":"${displayResolution}","largetype":"${displayResolution}"}},
{"title":"${systemUptime} (Uptime)","subtitle":"${uptime}","icon":{"path":"./icons/uptime.png"},"arg":"${uptime}","uid":"systemUptime","text":{"copy":"${uptime}","largetype":"${uptime}"},"match":"system time uptime ${uptime}"},
{"title":"${serialNumber}","subtitle":"Serial Number","icon":{"path":"./icons/serial-number.png"},"arg":"${uptime}","uid":"serialNumber","text":{"copy":"${serialNumber}","largetype":"${serialNumber}"},"match":"serial number sn  ${serialNumber}"},
{"title":"Battery Health","subtitle":"${batterySubtitle}","icon":{"path":"./icons/battery.png"},"arg":"${batterySubtitle}","uid":"battery","text":{"copy":"${batterySubtitle}","largetype":"${batterySubtitle}"}}
 ]
}
EOF
