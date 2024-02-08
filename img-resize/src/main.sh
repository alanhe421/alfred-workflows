# {"title":"Customize","subtitle":"Customize the size of the dimensions.","uid":"Customize","arg":"custom"},
file="$alfred_workflow_cache/size_history"
items=()

if [ -f "$file" ]; then
  while IFS= read -r line; do
    items+=("$line") # 将每一行添加到数组中
  done < "$file"
fi

items+=("32x32")
items+=("192x192")
items+=("512x512")
items+=("1024x1024")
items+=("Custom")


IFS=$'\n' sorted_unique_items=($(printf "%s\n" "${items[@]}" | sort -u))

items=("${sorted_unique_items[@]}")

# 开始构建JSON
echo '{'
echo '  "items": ['
for (( i=0; i<${#items[@]}; i++ )); do
  if [ "${items[$i]}" = "Custom" ]; then
    echo "{\"title\":\"Custom\",\"subtitle\":\"(width)x(height)\",\"uid\":\"custom\",\"arg\":\"custom\"}"
  else
    echo "{\"title\":\"${items[$i]}\",\"subtitle\":\"\",\"uid\":\"${items[$i]}\",\"arg\":\"${items[$i]}\"}"
  fi
(( i == ${#items[@]}-1 )) || echo ","

done
echo '  ]'
echo '}'



