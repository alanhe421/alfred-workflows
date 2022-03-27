#!/bin/bash

deviceStr="$1"
currentDevice="$2"
type="$3"

itemsXML=""

OLD_IFS="$IFS"
IFS="‡"
array=($deviceStr)
IFS="$OLD_IFS"

for i in "${!array[@]}"; do

if [ "$currentDevice" = "${array[i]}" ]
then
   iconURL="icons/${type}_selected.png"
   subTitle="selected"
else
   iconURL="icons/$type.png"
   subTitle=""
fi

itemsXML=$itemsXML$(cat <<- EOF
 <item>
    <title>${array[i]}</title>
	<subtitle>$subTitle</subtitle>
	<icon>$iconURL</icon>
  	<arg>${array[i]}</arg>
  </item>
EOF
)

done

# Alfred feedback
cat << EOB
<?xml version="1.0"?>
<items>
$itemsXML
</items>
EOB
