#!/usr/bin/osascript -l JavaScript

// String -> String
function envVar(varName) {
  return $.NSProcessInfo.processInfo.environment.objectForKey(varName).js
}

// String -> ()
function mkpath(path) {
  $.NSFileManager
    .defaultManager
    .createDirectoryAtPathWithIntermediateDirectoriesAttributesError(path, true, undefined, undefined)
}

// String, String -> ()
function writeFile(path, text) {
  $.NSString
    .alloc
    .initWithUTF8String(text)
    .writeToFileAtomicallyEncodingError(path, true, $.NSUTF8StringEncoding, null)
}

// String -> String?
function withScheme(url) {
  try {
    const urlObject = $.NSURL.URLWithString(url)
    return (urlObject.scheme.js === undefined) ? "https://" + url : url
  } catch {
    return url
  }
}

// String -> String?
function getHostname(url) {
  try {
    const urlObject = $.NSURL.URLWithString(withScheme(url))
    return urlObject.host.js.replace(/^www\d?\./, "")
  } catch {
    return url
  }
}

// [String] -> String
function runCommand(arguments) {
  const task = $.NSTask.alloc.init
  const stdout = $.NSPipe.pipe

  task.executableURL = $.NSURL.alloc.initFileURLWithPath(arguments[0])
  task.arguments = arguments.slice(1)
  task.standardOutput = stdout
  task.launchAndReturnError(false)

  const dataOut = stdout.fileHandleForReading.readDataToEndOfFile
  const stringOut = $.NSString.alloc.initWithDataEncoding(dataOut, $.NSUTF8StringEncoding).js

  return stringOut
}

// String... -> String
function runOP(...arguments) {
  const command = [opPath(), "--cache"]
  const format = ["--format", "json"]

  return JSON.parse(runCommand(command.concat(arguments, format)))
}

// String -> [Object]
function getItems(userID, excludedVaults) {
  const vaults = runOP("vault", "list", "--account", userID)
  const account = runOP("account", "list")
    .find(account => account["user_uuid"] === userID)
  const accountURL = envVar("hostnames_only") === "1" ? getHostname(account["url"]) : account["url"]

  return runOP("item", "list", "--account", userID).map(item => {
    const vaultID = item["vault"]["id"]

    if (excludedVaults.includes(vaultID)) return
    if (envVar("logins_only") === "1" && item["category"] !== "LOGIN") return

    const vaultName = vaults.find(vault => vault["id"] === vaultID)["name"]
    const url = withScheme(item["urls"]?.[0]["href"])
    const displayURL = envVar("hostnames_only") === "1" ? getHostname(url) : url

    return {
      uid: item["id"],
      title: item["title"],
      subtitle: url ? `${displayURL} 𐄁 ${vaultName} 𐄁 ${accountURL}` : `${vaultName} 𐄁 ${accountURL}`,
      variables: {
        accountID: account["account_uuid"],
        vaultID: vaultID,
        itemID: item["id"],
        url: url
      }
    }
  }).filter(item => item !== undefined) // Remove skipped items (excluded vaults or non-logins)
}

// () -> [String]
function getExcluded(filePath, varName) {
  if (!$.NSFileManager.defaultManager.fileExistsAtPath(filePath)) return []

  return readJSON(filePath)["items"]
    .filter(item => item["variables"]["excluded"])
    .map(item => item["variables"][varName])
}

// () -> [Object]
function getUserIDs(excludedUserIDs) {
  return runOP("account", "list").map(account => {
    const accountEmail = account["email"]
    const accountURL = envVar("hostnames_only") === "1" ? getHostname(account["url"]) : account["url"]

    const userID = account["user_uuid"]
    const excluded = excludedUserIDs.includes(userID)
    const mark = excluded ? "✗" : "✓"

    return {
      uid: userID,
      title: `${mark} ${accountEmail}`,
      subtitle: accountURL,
      arg: userID,
      variables: {
        excluded: excluded,
        userID: userID
      }
    }
  })
}

// String -> [Object]
function getVaults(userID, excludedVaults) {
  const account = runOP("account", "list")
    .find(account => account["user_uuid"] === userID)
  const accountEmail = account["email"]
  const accountURL = envVar("hostnames_only") === "1" ? getHostname(account["url"]) : account["url"]

  return runOP("vault", "list", "--account", userID).map(vault => {
    const vaultID = vault["id"]
    const excluded = excludedVaults.includes(vaultID)
    const mark = excluded ? "✗" : "✓"

    return {
      uid: vaultID,
      title: `${mark} ${vault["name"]}`,
      subtitle: `${accountEmail} 𐄁 ${accountURL}`,
      arg: vaultID,
      variables: {
        excluded: excluded,
        vaultID: vaultID
      }
    }
  })
}

// String -> ()
function flipExclusion(filePath, varName, id) {
  const sfObject = readJSON(filePath)

  const sfItems = sfObject["items"].map(item => {
    if (item["variables"][varName] !== id) return item

    const flippedState = !item["variables"]["excluded"]
    const titleNoMark = item["title"].substring(2)
    const title = `${flippedState ? "✗": "✓"} ${titleNoMark}`

    item["title"] = title
    item["variables"]["excluded"] = flippedState

    return item
  })

  writeJSON(filePath, {rerun: 0.1, items: sfItems})
}

// String -> ()
function prependDataUpdate(filePath) {
  if (!$.NSFileManager.defaultManager.fileExistsAtPath(filePath)) return // Return early if items file does not exist (e.g. managing accounts before first sign in)

  const sfObject = readJSON(filePath)

  if (sfObject["items"][0]["arg"] == "update_items") return // Return early if update entry exists

  sfObject["items"].forEach(item => item["uid"] = "") // Remove uids so Alfred does not sort

  sfObject["items"].unshift({
    uid: "Update Items",
    title: "Update items",
    subtitle: "Your terminal will open with instructions",
    arg: "update_items"
  })

  writeJSON(filePath, sfObject)
}

// () -> String
function opPath() {
  const installedViaPkg = "/usr/local/bin/op"

  // Only return user-installed CLI if necessary (biometric unlock enabled)
  if (biometricUnlockEnabled() && $.NSFileManager.defaultManager.isExecutableFileAtPath(installedViaPkg)) return installedViaPkg

  // By default, use the command-line included in the Workflow
  return "./op"
}

// () -> Bool
function biometricUnlockEnabled() {
  const settingsFile = $("~/Library/Group Containers/2BUA8C4S2C.com.1password/Library/Application Support/1Password/Data/settings/settings.json").stringByExpandingTildeInPath.js

  if (!$.NSFileManager.defaultManager.fileExistsAtPath(settingsFile)) return false
  if (readJSON(settingsFile)["developers.cliSharedLockState.enabled"]) return true
  return false
}

// String, [String] -> ()
function writeJSON(filePath, sfObject) {
  mkpath($(filePath).stringByDeletingLastPathComponent.js)
  writeFile(filePath, JSON.stringify(sfObject))
}

// String -> [Object]
function readJSON(filePath) {
  const data = $.NSFileManager.defaultManager.contentsAtPath(filePath)
  const string = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding).js
  return JSON.parse(string)
}

function run(argv) {
  // Data files
  const usersFile = envVar("alfred_workflow_data") + "/users.json"
  const vaultsFile = envVar("alfred_workflow_data") + "/vaults.json"
  const itemsFile = envVar("alfred_workflow_data") + "/items.json"

  // User ID information is useful in more than one command
  const excludedUserIDs = getExcluded(usersFile, "userID")
  const usersObject = getUserIDs(excludedUserIDs)
  const activeUserIDs = usersObject
    .filter(item => !item["variables"]["excluded"])
    .map(item => item["variables"]["userID"])

  const sfUserIDs = usersObject
    .concat({
      title: "Update items",
      subtitle: "Your terminal will open with instructions",
      arg: "update_items",
      variables: {excluded: false, userID: false} // Avoid "undefined" errors in fuctions which interact with users file
    })

  // Commands
  switch (argv[0]) {
    case "update_items":
      const excludedVaults = getExcluded(vaultsFile, "vaultID")
      const sfItems = activeUserIDs.flatMap(userID => getItems(userID, excludedVaults))

      const sfVaults = activeUserIDs.flatMap(userID => getVaults(userID, excludedVaults))
        .concat({
          title: "Update items",
          subtitle: "Your terminal will open with instructions",
          arg: "update_items",
          variables: {excluded: false, vaultID: false} // Avoid "undefined" errors in fuctions which interact with vaults file
        })

      writeJSON(vaultsFile, {rerun: 0.1, items: sfVaults})
      writeJSON(itemsFile, {items: sfItems})
      break
    case "flip_user_exclusion":
      flipExclusion(usersFile, "userID", argv[1])
      return prependDataUpdate(itemsFile)
    case "flip_vault_exclusion":
      flipExclusion(vaultsFile, "vaultID", argv[1])
      return prependDataUpdate(itemsFile)
    case "print_user_ids":
      return activeUserIDs.join(",")
    case "print_user_json":
      return JSON.stringify({rerun: 0.1, items: sfUserIDs})
    case "write_user_json":
      return writeJSON(usersFile, {rerun: 0.1, items: sfUserIDs})
    case "data_update_detected":
      return prependDataUpdate(itemsFile)
    case "biometric_unlock_enabled":
      return biometricUnlockEnabled()
    case "op_path":
      return opPath()
    default:
      console.log("Unrecognised argument")
  }
}
