#!/bin/bash

items=(
    "screen-studio://cancel-recording|Cancel Recording|"
    "screen-studio://copy-and-zip-project|Copy and Zip Project|"
    "screen-studio://finish-recording|Finish Recording|Stop"
    "screen-studio://open-projects-folder|Open Projects Folder|"
    "screen-studio://record-area|Record Area|"
    "screen-studio://record-display|Record Display|"
    "screen-studio://record-window|Record Window|"
    "screen-studio://restart-recording|Restart Recording|"
    "screen-studio://toggle-recording-area-cover|Toggle Recording Area Cover|"
    "screen-studio://toggle-recording-controls|Toggle Recording Controls|"
)

printf '{"items": ['

first=1
for item in "${items[@]}"; do
    if [ "$first" -ne 1 ]; then
        printf ','
    fi
    first=0
    
    url="${item%%|*}"
    rest="${item#*|}"
    title="${rest%%|*}"
    match="${rest#*|}"
    
    printf '{"title": "%s", "arg": "%s", "uid": "%s", "match": "%s"}' "$title" "$url" "$title" "$title $match"
done

printf ']}'