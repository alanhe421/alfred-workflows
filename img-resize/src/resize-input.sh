query=$1

cat << EOF
{
    "items": [
{"title":"${query}","subtitle":"","arg":"${query}","text":{"copy":"${query}","largetype":"${query}"}},
 ]
}
EOF
