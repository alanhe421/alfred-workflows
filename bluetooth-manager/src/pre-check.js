const { exec } = require('child_process');
const { BLUETOOTH_COMMAND_PATH } = require('./config');

/**
 * 输出蓝牙开关状态
 */
exec(`${BLUETOOTH_COMMAND_PATH} --power`, (error, stdout, stderr) => {
  console.log(stdout);
});
