const { exec, execSync } = require("child_process");
const { BLUETOOTH_COMMAND_PATH } = require("./config");
const fs = require("fs");

const apple_battery_info = "/private/tmp/apple_battery_hammerspoon.json";

exec(
  `${BLUETOOTH_COMMAND_PATH} --paired --format json --power 1`,
  (error, stdout, stderr) => {
    let result = [];
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    const data = JSON.parse(stdout);

    const batteryInfoMap = getBatterInfo();

    result = data.map((item) => ({
      title: item.name,
      subtitle: getSubtitle(item, batteryInfoMap[item.address]),
      arg: `${item.address}_${item.connected}_${item.name}`,
      icon: {
        path: __dirname + "/icon.png",
      },
    }));

    console.log(JSON.stringify({ items: result }));
  }
);

/**
 * 读写hammerspoon定时写入的蓝牙信息
 */
function getBatterInfo() {
  try {
    const batteryInfoList = fs.readFileSync(
      apple_battery_info,
      { encoding: "utf8", flag: "r" }
    );

    const batteryInfoMap = JSON.parse(batteryInfoList).reduce((obj, item) => {
      obj[item.address] = item;
      return obj;
    }, {});
    return batteryInfoMap;
  } catch (e) {
    return {};
  }
}

function getSubtitle(item, batteryInfo) {
  let title = item.connected ? "Connected" : "Disconnected";

  /**
   * is AirPods
   */
  if (
    item.connected &&
    batteryInfo &&
    batteryInfo.isInEarDetectionSupported === "YES"
  ) {
    title += `, Battery ( Left ${batteryInfo.batteryPercentLeft}%, Right ${batteryInfo.batteryPercentRight}% )`;
  }
  return title;
}
