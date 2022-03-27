#!/bin/bash

[[ $1 = "On" ]] && subtitle="On" || subtitle="Off"
[[ $1 = "On" ]] && icon="wifi" || icon="wifi"

# Alfred feedback
cat << EOB
<?xml version="1.0"?>
<items>
  <item>
    <title>Toggle WiFi</title>
	<subtitle>${subtitle}</subtitle>
	<icon>icons/${icon}.png</icon>
  	<arg>$1</arg>
  </item>
</items>
EOB
