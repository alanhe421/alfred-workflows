#!/bin/bash

STRING="$1"

IFS='‡' read -ra arrIN <<< "$STRING"

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
    <title>${arrIN[4]}</title>
	<subtitle>MacOS System Version</subtitle>
	<icon>icons/mac.png</icon>
  <arg>${arrIN[4]}</arg>
  </item>
  <item>
    <title>${arrIN[5]}</title>
	<subtitle>CPU Type</subtitle>
	<icon>icons/cpu.png</icon>
  <arg>${arrIN[5]}</arg>
  </item>
   <item>
    <title>${arrIN[6]} GB</title>
	<subtitle>Physical Memory</subtitle>
	<icon>icons/memory.png</icon>
  <arg>${arrIN[6]}</arg>
  </item>
   <item>
    <title>${arrIN[7]} GB Total , ${arrIN[8]} GB Free</title>
	<subtitle>Physical Disk</subtitle>
	<icon>icons/memory.png</icon>
  <arg>${arrIN[7]},${arrIN[8]}</arg>
  </item>
</items>
EOB
