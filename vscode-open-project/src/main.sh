#!/bin/bash

# 获取查询字符串和编辑器信息
query="$1"
editor=$(if [[ "$EDITOR" == "cursor" ]]; then echo "Cursor"; else echo "Code"; fi)

# 定义 state.vscdb 文件路径
STATE_DB="$HOME/Library/Application Support/${editor}/User/globalStorage/state.vscdb"

# 检查文件是否存在
if [[ ! -f "$STATE_DB" ]]; then
  echo '{"items": []}'
  exit 1
fi

# 使用单个 Ruby 脚本处理所有逻辑
# 1. 获取 SQLite 数据
# 2. 解析 JSON
# 3. 处理路径
# 4. 生成输出
ruby -e '
require "json"
require "uri"
require "open3"

begin
  # 获取参数
  query = ARGV[0].to_s.strip.downcase
  db_path = ARGV[1]
  
  # 执行 SQLite 查询
  sql = "SELECT value FROM ItemTable WHERE key = '\''history.recentlyOpenedPathsList'\''"
  stdout, stderr, status = Open3.capture3("sqlite3", db_path, sql)
  
  if !status.success? || stdout.empty?
    puts JSON.generate({items: []})
    exit 0
  end
  
  # 解析 JSON 数据
  data = JSON.parse(stdout)
  
  # 处理项目并生成输出
  items = []
  
  data["entries"].each do |entry|
    uri = entry["folderUri"] || entry["fileUri"]
    next unless uri
    
    # 处理路径
    path = URI.decode_www_form_component(uri.sub("file://", ""))
    name = File.basename(path)
    
    # 如果有查询词，进行过滤
    next if !query.empty? && !name.downcase.include?(query)
    
    # 添加到结果
    items << {
      uid: path,
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
  
  # 输出结果
  puts JSON.generate({items: items})
rescue => e
  # 出错时返回空结果
  puts JSON.generate({items: []})
end
' "$query" "$STATE_DB"