# !/bin/bash

if [ "$2" = "code" ] || [ "$2" = "vscode" ]; then
    if [ "$NEW_WINDOW" = "1" ]; then
        open "vscode://file/$1?windowId=_blank"
    else
        open "vscode://file/$1"
    fi
elif [ "$2" = "cursor" ]; then
    if [ "$NEW_WINDOW" = "1" ]; then
        open "cursor://file/$1?windowId=_blank"
    else
        open "cursor://file/$1"
    fi
elif [ "$2" = "code-insiders" ]; then
    if [ "$NEW_WINDOW" = "1" ]; then
        open "vscode-insiders://file/$1?windowId=_blank"
    else
        open "vscode-insiders://file/$1"
    fi
else
    $2 "$1"
fi