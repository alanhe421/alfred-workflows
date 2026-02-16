# {"title":"Customize","subtitle":"Customize the size of the dimensions.","uid":"Customize","arg":"custom"},
file="$alfred_workflow_cache/size_history"
items=()

image_info=$(sips -g pixelHeight -g pixelWidth "$imageSrc" 2>/dev/null)
if [ $? -eq 0 ]; then
    height=$(echo "$image_info" | grep pixelHeight | awk '{print $2}')
    width=$(echo "$image_info" | grep pixelWidth | awk '{print $2}')
    current_size="${width}x${height}"
else
    current_size="Unknown"
fi

size_10_percent="$((width/10))x$((height/10))"
size_50_percent="$((width/2))x$((height/2))"

# 先读取历史记录
seen_args=""
if [ -f "$file" ]; then
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    case "$seen_args" in
      *"|${line}|"*) ;;  # 重复，跳过
      *) items+=("${line}||${line}"); seen_args="${seen_args}|${line}|" ;;
    esac
  done < <(tail -r "$file")
fi

# 再追加内置默认尺寸（跳过与历史重复的）
builtin_items=(
    "32x32||32x32"
    "192x192||192x192"
    "512x512||512x512"
    "1024x1024||1024x1024"
    "50%|Original: ${current_size}, Resized: ${size_50_percent}|${size_50_percent}"
    "10%|Original: ${current_size}, Resized: ${size_10_percent}|${size_10_percent}"
)
for item in "${builtin_items[@]}"; do
    IFS='|' read -r _ _ arg <<< "$item"
    case "$seen_args" in
      *"|${arg}|"*) ;;  # 与历史重复，跳过
      *) items+=("$item"); seen_args="${seen_args}|${arg}|" ;;
    esac
done

# Custom 永远放最后
items+=("Custom|Enter dimensions (width)x(height)|custom")

# 开始构建JSON
echo '{'
echo '  "items": ['
for (( i=0; i<${#items[@]}; i++ )); do
    IFS='|' read -r title subtitle arg <<< "${items[$i]}"
    echo "{\"title\":\"$title\",\"subtitle\":\"$subtitle\",\"arg\":\"$arg\"}"
    (( i == ${#items[@]}-1 )) || echo ","
done
echo '  ]'
echo '}'



