const { exec } = require("child_process");
const { BLUETOOTH_COMMAND_PATH } = require("./config");

const args = process.argv[2].split("_");
const address = args[0];
const connected = args[1] === "true";
const name = args[2];

if (!connected) {
  exec(
    `${BLUETOOTH_COMMAND_PATH} --connect ${address}`,
    (error, stdout, stderr) => {
      if (error || stderr) {
        console.log(`Failed to connect ${name}`);
        return;
      }
      console.log(`Connect successfully ${name}`);
    }
  );
} else {
  exec(
    `${BLUETOOTH_COMMAND_PATH} --disconnect ${address}`,
    (error, stdout, stderr) => {
      if (error || stderr) {
        console.log(`Failed to disconnect ${name}`);
        return;
      }
      console.log(`Disconnect successfully ${name}`);
    }
  );
}
