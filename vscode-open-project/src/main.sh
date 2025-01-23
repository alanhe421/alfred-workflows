#!/bin/bash
# Trim query string
query=$(echo "$1" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')

editor=$(if [[ "$EDITOR" == "cursor" ]]; then echo "Cursor"; else echo "Code"; fi)

# 定义 state.vscdb 文件路径
STATE_DB="$HOME/Library/Application Support/${editor}/User/globalStorage/state.vscdb"

# 检查文件是否存在
if [[ ! -f "$STATE_DB" ]]; then
  echo '{"items": []}'
  exit 1
fi

# 使用 SQLite 查询提取最近打开的项目
JSON_DATA=$(sqlite3 "$STATE_DB" "SELECT value FROM ItemTable WHERE key = 'history.recentlyOpenedPathsList'")

# 检查是否成功提取数据
if [[ -z "$JSON_DATA" ]]; then
  echo '{"items": []}'
  exit 1
fi

# 使用 Ruby 解析 JSON 数据并提取项目路径
PROJECTS=$(echo "$JSON_DATA" | ruby -rjson -e '
  begin
    data = JSON.parse(STDIN.read)
    data["entries"].each do |entry|
      uri = entry["folderUri"] || entry["fileUri"]
      puts uri.sub("file://", "") if uri
    end
  rescue => e
    exit 1
  end
' | sed 's|%20| |g')

# 初始化 Alfred 的 JSON 输出
OUTPUT='{"items": ['

# 遍历项目路径，生成 Alfred 格式的 JSON
IFS=$'\n'
for PROJECT in $PROJECTS; do
  PROJECT_NAME=$(basename "$PROJECT")
  
  # 如果 query 不为空，则进行筛选
  if [[ -n "$query" ]]; then
    # 将 PROJECT_NAME 和 query 都转换为小写进行比较
    if ! echo "${PROJECT_NAME}" | tr '[:upper:]' '[:lower:]' | grep -q "$(echo "$query" | tr '[:upper:]' '[:lower:]')"; then
      continue
    fi
  fi
  
  OUTPUT+=$(cat <<EOF
    {
        "uid": "$PROJECT",
        "type": "file",
        "title": "$PROJECT_NAME",
        "subtitle": "$PROJECT",
        "arg": "$PROJECT",
        "autocomplete": "$PROJECT_NAME",
        "icon": {
            "type": "fileicon",
            "path": "$PROJECT"
        }
    },
EOF
)
done

# 移除最后一个逗号并闭合 JSON
OUTPUT=${OUTPUT%,}
OUTPUT+=']}'

# 输出结果
echo "$OUTPUT"