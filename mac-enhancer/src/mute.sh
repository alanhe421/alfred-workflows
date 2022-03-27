#!/bin/bash

[[ $1 = "true" ]] && subtitle="muted" || subtitle="unmuted"
[[ $1 = "true" ]] && icon="muted" || icon="unmuted"

# Alfred feedback
cat << EOB
<?xml version="1.0"?>
<items>
  <item>
    <title>Toggle Mute</title>
	<subtitle>${subtitle}</subtitle>
	<icon>icons/${icon}.png</icon>
  	<arg>$1</arg>
  </item>
</items>
EOB
