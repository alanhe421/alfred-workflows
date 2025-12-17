#!/bin/bash

# 编辑器类型检查：判断是否为 JetBrains IDE
is_jetbrains_ide() {
  case "$1" in
    webstorm|phpstorm|idea|pycharm|goland|rider|clion|rubymine|appcode)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

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
    webstorm)
      echo "WebStorm"
      ;;
    idea)
      echo "IntelliJ IDEA"
      ;;
    pycharm)
      echo "PyCharm"
      ;;    phpstorm)
      echo "PhpStorm"
      ;;    goland)
      echo "GoLand"
      ;;    rider)
      echo "Rider"
      ;;    clion)
      echo "CLion"
      ;;    rubymine)
      echo "RubyMine"
      ;;    appcode)
      echo "AppCode"
      ;;  
    *)
      echo "Code"   # fallback
      ;;
  esac
}

# 获取 JetBrains IDE 的配置文件路径
get_jetbrains_config() {
  local app_name="$1"
  local jb_base="$HOME/Library/Application Support/JetBrains"

  # 查找最新版本的配置目录
  if [[ -d "$jb_base" ]]; then
    local latest_dir=$(find "$jb_base" -maxdepth 1 -type d -name "${app_name}*" 2>/dev/null | sort -V | tail -1)
    if [[ -n "$latest_dir" ]]; then
      local config_file="${latest_dir}/options/recentProjects.xml"
      if [[ -f "$config_file" ]]; then
        echo "$config_file"
        return 0
      fi
    fi
  fi

  return 1
}

# 获取查询字符串
query="$1"

# 1. Primary Editor Logic
primary_app="$(editor_to_app "$EDITOR")"
if [[ -z "$primary_app" ]]; then
    primary_app="Code"
fi

# 根据编辑器类型选择数据库路径
if is_jetbrains_ide "$EDITOR"; then
  DB1="$(get_jetbrains_config "$primary_app")"
else
  DB1="$HOME/Library/Application Support/${primary_app}/User/globalStorage/state.vscdb"
fi

dbs=("$DB1")

# 2. Second Editor Logic
if [[ -n "$SECOND_EDITOR" && "$SECOND_EDITOR" != "$EDITOR" ]]; then
    second_app="$(editor_to_app "$SECOND_EDITOR")"

    if [[ -n "$second_app" ]]; then
        if is_jetbrains_ide "$SECOND_EDITOR"; then
            DB2="$(get_jetbrains_config "$second_app")"
        else
            DB2="$HOME/Library/Application Support/${second_app}/User/globalStorage/state.vscdb"
        fi

        # Only add if file exists (checked later in ruby as well but good to filter here)
        if [[ -n "$DB2" && -f "$DB2" ]]; then
            dbs+=("$DB2")
        fi
    fi
fi

# 3. Additional Editors Logic (READ_MORE_EDITOR)
if [[ -n "$READ_MORE_EDITOR" ]]; then
    # Split comma-separated list
    IFS=',' read -ra more_editors <<< "$READ_MORE_EDITOR"

    for editor in "${more_editors[@]}"; do
        # Trim whitespace
        editor="$(echo "$editor" | xargs)"

        # Skip if empty or already processed
        [[ -z "$editor" ]] && continue
        [[ "$editor" == "$EDITOR" ]] && continue
        [[ "$editor" == "$SECOND_EDITOR" ]] && continue

        # Get app name
        more_app="$(editor_to_app "$editor")"
        [[ -z "$more_app" ]] && continue

        # Construct DB path based on editor type
        if is_jetbrains_ide "$editor"; then
            more_db="$(get_jetbrains_config "$more_app")"
        else
            more_db="$HOME/Library/Application Support/${more_app}/User/globalStorage/state.vscdb"
        fi

        # Add if file exists and not already in array
        if [[ -n "$more_db" && -f "$more_db" ]]; then
            # Check if already added (avoid duplicates)
            duplicate=false
            for existing_db in "${dbs[@]}"; do
                [[ "$existing_db" == "$more_db" ]] && duplicate=true && break
            done

            [[ "$duplicate" == false ]] && dbs+=("$more_db")
        fi
    done
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
# 1. 获取数据 (SQLite for VS Code / XML for JetBrains)
# 2. 解析数据 (JSON 或 XML)
# 3. 处理路径 & 去重
# 4. 生成输出
ruby -e '
require "json"
require "uri"
require "open3"
require "rexml/document"

begin
  # 获取参数
  query = ARGV[0].to_s.strip.downcase
  db_paths = ARGV[1..-1]

  items = []
  seen_paths = {}

  db_paths.each do |db_path|
    next unless File.exist?(db_path)

    # 根据文件类型处理不同的编辑器配置
    if db_path.end_with?(".xml")
      # JetBrains IDE XML 配置文件
      begin
        xml_content = File.read(db_path)
        doc = REXML::Document.new(xml_content)

        # 查找所有项目路径
        # XML 结构: <component name="RecentProjectsManager">/<option name="additionalInfo">/<map>/<entry key="path">
        REXML::XPath.each(doc, "//component[@name=\"RecentProjectsManager\"]//option[@name=\"additionalInfo\"]/map/entry") do |entry|
          path = entry.attributes["key"]
          next unless path

          # 确保路径有效
          path = path.sub("file://", "").sub("$USER_HOME$", ENV["HOME"])
          next unless File.exist?(path)

          # 去重
          next if seen_paths[path]
          seen_paths[path] = true

          name = File.basename(path)

          # 过滤查询词
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
        # ignore parse errors for a specific xml file
      end

    else
      # VS Code 系列 SQLite 数据库
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
  end

  # 输出结果
  puts JSON.generate({items: items})
rescue => e
  # 出错时返回空结果
  puts JSON.generate({items: []})
end
' "$query" "${dbs[@]}"