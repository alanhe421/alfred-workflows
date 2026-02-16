file="$alfred_workflow_cache/size_history"
# 先移除已有的相同记录，再追加到末尾（最新的在最后，配合 main.sh 倒序读取）
if [ -f "$file" ]; then
  grep -vxF "$1" "$file" > "${file}.tmp"
  mv "${file}.tmp" "$file"
fi
echo "$1" >> "$file"
