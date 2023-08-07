[[ -d "${alfred_workflow_cache}" ]] || mkdir -p "${alfred_workflow_cache}"

if ! /usr/bin/python3 main.py; then
  if [ ! -f /usr/bin/python3 ]; then
    cat <<EOF
<?xml version="1.0"?>
<items>
  <item arg="error">
    <title>Python3 missing</title>
    <subtitle>/usr/bin/python3 does not exist</subtitle>
  </item>
</items>
EOF
  else
    cat <<EOF
<?xml version="1.0"?>
<items>
  <item arg="error">
    <title>Error</title>
    <subtitle>An unexpected error occurred. Activate Alfred workflow debug mode for more information.</subtitle>
  </item>
</items>
EOF
  fi
fi