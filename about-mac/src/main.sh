#!/bin/bash

STRING="$1"

IFS='‡' read -ra arrIN <<< "$STRING"

freeDiskPercent=$(echo "scale=1; ${arrIN[8]}*100 / ${arrIN[7]}" | bc)
freeMemoryPercent=$(echo "scale=1; ${arrIN[10]}*100 / ${arrIN[6]}" | bc)

# Alfred feedback
cat << EOB
<?xml version="1.0"?>
<items>
  <item>
    <title>${arrIN[0]}</title>
	<subtitle>User Name</subtitle>
	<icon>icons/user.png</icon>
  	<arg>${arrIN[0]}</arg>
  </item>
  <item>
    <title>${arrIN[11]}</title>
	<subtitle>Model</subtitle>
	<icon>icons/model.png</icon>
  	<arg>${arrIN[11]}</arg>
  </item>
  <item>
    <title>${arrIN[1]}</title>
	<subtitle>Host Name</subtitle>
	<icon>icons/hostname.png</icon>
  <arg>${arrIN[1]}</arg>
  </item>
  <item>
    <title>${arrIN[2]}</title>
	<subtitle>Primary Ethernet Address</subtitle>
	<icon>icons/ethernet.png</icon>
  <arg>${arrIN[2]}</arg>
  </item>
    <item>
    <title>${arrIN[3]}</title>
	<subtitle>IPv4 Address</subtitle>
	<icon>icons/ip.png</icon>
  <arg>${arrIN[3]}</arg>
  </item>
   <item>
    <title>${arrIN[9]} ${arrIN[4]}</title>
	<subtitle>MacOS System Version</subtitle>
	<icon>icons/mac.png</icon>
  <arg>${arrIN[9]} ${arrIN[4]}</arg>
  </item>
  <item>
    <title>${arrIN[5]}</title>
	<subtitle>CPU Type</subtitle>
	<icon>icons/cpu.png</icon>
  <arg>${arrIN[5]}</arg>
  </item>
   <item>
    <title>${arrIN[6]} GB Total , ${arrIN[10]} GB Free</title>
	<subtitle>Physical Memory, ${freeMemoryPercent}% Free</subtitle>
	<icon>icons/memory.png</icon>
  <arg>${arrIN[6]}GB total,${arrIN[10]}GB free</arg>
  </item>
   <item>
    <title>${arrIN[7]} GB Total , ${arrIN[8]} GB Free</title>
	<subtitle>Physical Disk(startup), ${freeDiskPercent}% Free</subtitle>
	<icon>icons/disk.png</icon>
  <arg>${arrIN[7]}GB total,${arrIN[8]}GB free</arg>
  </item>
  <item>
    <title>Locale / Language</title>
	<subtitle>${arrIN[12]}</subtitle>
	<icon>icons/locale.png</icon>
  <arg>${arrIN[12]}</arg>
  </item>
</items>
EOB
