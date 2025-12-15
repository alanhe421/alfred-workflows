#!/bin/bash

# 编辑器映射：命令名 -> 应用显示名
editor_to_app() {
  case "$1" in
    code)
      echo "Code"
      ;;
    cursor)
      echo "Cursor"
      ;;
    code-insiders)
      echo "Code - Insiders"
      ;;
    antigravity)
      echo "Antigravity"
      ;;
    *)
      echo "Code"   # fallback
      ;;
  esac
}

# 获取查询字符串
query="$1"

# 1. Primary Editor Logic
primary_app="$(editor_to_app "$EDITOR")"
if [[ -z "$primary_app" ]]; then
    primary_app="Code"
fi

DB1="$HOME/Library/Application Support/${primary_app}/User/globalStorage/state.vscdb"
dbs=("$DB1")

# 2. Second Editor Logic
if [[ -n "$SECOND_EDITOR" && "$SECOND_EDITOR" != "$EDITOR" ]]; then
    second_app=""
    # Look up in map
    if [[ -n "$(editor_to_app "$SECOND_EDITOR")" ]]; then
        second_app="$(editor_to_app "$SECOND_EDITOR")"
    fi
    
    if [[ -n "$second_app" ]]; then
        DB2="$HOME/Library/Application Support/${second_app}/User/globalStorage/state.vscdb"
        # Only add if file exists (checked later in ruby as well but good to filter here)
        if [[ -f "$DB2" ]]; then
            dbs+=("$DB2")
        fi
    fi
fi

# 检查至少有一个文件存在 (Main DB validation is handled by ruby or implicit check)
# The original script checked explicitly "if [[ ! -f "$STATE_DB" ]]"
# Here we can proceed if we have at least one valid DB.
# If DB1 is missing, we might still have DB2.
# So we check if our array has any existing files?
# Actually, let's just pass all candidates to Ruby and let it handle emptiness.
# But for "fast fail" if main DB is missing AND no second DB?
if [[ ! -f "$DB1" && ${#dbs[@]} -eq 1 ]]; then
  # Original behavior for single DB missing
  echo '{"items": []}'
  exit 1
fi

# 使用单个 Ruby 脚本处理所有逻辑
# 1. 获取 SQLite 数据 (Loop over DBs)
# 2. 解析 JSON
# 3. 处理路径 & 去重
# 4. 生成输出
ruby -e '
require "json"
require "uri"
require "open3"

begin
  # 获取参数
  query = ARGV[0].to_s.strip.downcase
  db_paths = ARGV[1..-1]
  
  items = []
  seen_paths = {}

  db_paths.each do |db_path|
    next unless File.exist?(db_path)

    # 执行 SQLite 查询
    sql = "SELECT value FROM ItemTable WHERE key = '\''history.recentlyOpenedPathsList'\''"
    stdout, stderr, status = Open3.capture3("sqlite3", db_path, sql)
    
    next if !status.success? || stdout.empty?
    
    begin
      # 解析 JSON 数据
      data = JSON.parse(stdout)
      
      data["entries"].each do |entry|
        uri = entry["folderUri"] || entry["fileUri"]
        next unless uri
        
        # 处理路径
        path = URI.decode_www_form_component(uri.sub("file://", ""))
        
        # 去重: subtitle is path
        next if seen_paths[path]
        seen_paths[path] = true
        
        name = File.basename(path)
        
        # 如果有查询词，进行过滤
        next if !query.empty? && !name.downcase.include?(query)
        
        # 添加到结果
        items << {
          uid: name,
          type: "file",
          title: name,
          subtitle: path,
          arg: path,
          autocomplete: name,
          icon: {
            type: "fileicon",
            path: path
          }
        }
      end
    rescue => e
      # ignore parse errors for a specific db
    end
  end
  
  # 输出结果
  puts JSON.generate({items: items})
rescue => e
  # 出错时返回空结果
  puts JSON.generate({items: []})
end
' "$query" "${dbs[@]}"