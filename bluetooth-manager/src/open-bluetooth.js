const { exec } = require('child_process');
const { BLUETOOTH_COMMAND_PATH } = require('./config');

/**
 * 打开蓝牙开关
 */
exec(`${BLUETOOTH_COMMAND_PATH} --power 1`, (error, stdout, stderr) => {
  consolg.log(stdout);
});
