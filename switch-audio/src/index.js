const { execSync } = require('child_process');
const { utils } = require('@stacker/alfred-utils');
(function () {
  const outRes = execSync('/usr/sbin/system_profiler SPCameraDataType -json');
  const items = JSON.parse(outRes).SPCameraDataType.map((item) =>
    utils.buildItem({
      title: item._name,
      icon: {
        path: './icons/camera.png'
      }
    })
  );
  utils.outputScriptFilter({ items });
})();
