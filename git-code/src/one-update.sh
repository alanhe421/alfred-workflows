# THESE VARIABLES MUST BE SET. SEE THE ONEUPDATER README FOR AN EXPLANATION OF EACH.
readonly remote_info_plist="https://raw.githubusercontent.com/alanhg/alfred-workflows/master/git-code/src/info.plist"
readonly workflow_url="https://github.com/alanhg/alfred-workflows/raw/master/git-code/Git%20Code.alfredworkflow"
readonly download_type='direct'
readonly frequency_check='0'

# FROM HERE ON, CODE SHOULD BE LEFT UNTOUCHED!
function abort {
  echo "${1}" >&2
  exit 1
}

function url_exists {
  curl --silent --location --output /dev/null --fail --range 0-0 "${1}"
}

function notification {
  local -r notificator="$(find . -type f -name 'notificator')"

  if [[ -f "${notificator}" && "$(/usr/bin/file --brief --mime-type "${notificator}")" == 'text/x-shellscript' ]]; then
    "${notificator}" --message "${1}" --title "${alfred_workflow_name}" --subtitle "${2:-A new version is available}"
    return
  fi

  osascript -e "display notification \"${1}\" with title \"${alfred_workflow_name}\" subtitle \"${2:-A new version is available}\""
}

# Local sanity checks
readonly local_info_plist='info.plist'
readonly local_version="$(/usr/libexec/PlistBuddy -c 'print version' "${local_info_plist}")"

[[ -n "${local_version}" ]] || abort 'You need to set a workflow version in the configuration sheet.'
[[ "${download_type}" =~ ^(direct|page|github_release)$ ]] || abort "'download_type' (${download_type}) needs to be one of 'direct', 'page', or 'github_release'."
[[ "${frequency_check}" =~ ^[0-9]+$ ]] || abort "'frequency_check' (${frequency_check}) needs to be a number."

# Check for updates
if [[ $(find "${local_info_plist}" -mtime +"${frequency_check}"d) ]]; then
  # Remote sanity check
  if ! url_exists "${remote_info_plist}"; then
    abort "'remote_info_plist' (${remote_info_plist}) appears to not be reachable."
  fi

  readonly tmp_file="$(mktemp)"
  curl --silent --location --output "${tmp_file}" "${remote_info_plist}"
  readonly remote_version="$(/usr/libexec/PlistBuddy -c 'print version' "${tmp_file}")"
  rm "${tmp_file}"

  if [[ "${local_version}" == "${remote_version}" ]]; then
    touch "${local_info_plist}" # Reset timer by touching local file
    notification 'You are up to date…' ' '
    exit 0
  fi

  if [[ "${download_type}" == 'page' ]]; then
    notification 'Opening download page…'
    open "${workflow_url}"
    exit 0
  fi

  readonly download_url="$(
    if [[ "${download_type}" == 'github_release' ]]; then
      osascript -l JavaScript -e 'function run(argv) { return JSON.parse(argv[0])["assets"].find(asset => asset["browser_download_url"].endsWith(".alfredworkflow"))["browser_download_url"] }' "$(curl --silent "https://api.github.com/repos/${workflow_url}/releases/latest")"
    else
      echo "${workflow_url}"
    fi
  )"

  if url_exists "${download_url}"; then
    notification 'Downloading and installing…'
    readonly download_name="$(basename "${download_url}")"
    curl --silent --location --output "${HOME}/Downloads/${download_name}" "${download_url}"
    open "${HOME}/Downloads/${download_name}"
  else
    abort "'workflow_url' (${download_url}) appears to not be reachable."
  fi
fi