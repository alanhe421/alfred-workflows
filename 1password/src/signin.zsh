#!/bin/zsh

if ! cd "$(dirname "${0}")"; then
  echo "Could not change to Workflow directory at $(dirname "${0}")" >&2
  exit 1
fi

# "op" checks
readonly op_path="$(printf '%q' "$(./1password.js op_path)")"

if [[ "$(./1password.js biometric_unlock_enabled)" == 'true' && "${op_path}" != "/usr/local/bin/op" ]]; then
  cat './biometrics_banner.txt'
  exit 1
fi

if [[ "$(${op_path} --version | cut -d. -f1)" -lt 2 ]]; then
  cat './old_op_banner.txt'
  exit 1
fi

cat './instructions_banner.txt'

# Join sign in commands with " && " to avoid sending empty input to the first "op" question
IFS=',' read -rA user_ids < <(./1password.js 'print_user_ids')
readonly signin_cmds="$(printf "eval \"\$(${op_path} signin --account \"%s\")\" && " "${user_ids[@]}" | sed 's/ && $//')"

# Sign in
eval "${signin_cmds}"

# Update items list
echo '\nUpdating items list. It will take a few seconds to complete.'
echo 'You may close the terminal at any time.'
nohup ./1password.js 'update_items' > /dev/null 2> >(tee) &

# Loading
while ps "${!}" > /dev/null; do
  echo -n '.'
  sleep '1.5'
done

# Create hash of items
readonly items_hash_file="${alfred_workflow_data}/items_hash.txt"
readonly new_items_hash="$(/usr/bin/sqlite3 "${HOME}/Library/Group Containers/2BUA8C4S2C.com.1password/Library/Application Support/1Password/Data/1password.sqlite" 'SELECT * FROM item_overviews;' | md5)"

mkdir -p "$(dirname "${items_hash_file}")"
echo "${new_items_hash}" > "${items_hash_file}"
