const { createCanvas } = require('canvas');
const fs = require('fs');
const { exec } = require('child_process');

const colorInput = process.argv[2];
const modeInput = process.argv[3]; // rgb,hex

function convertRgb2Hex(rgb) {
  rgb = rgb.trim();
  const values = rgb.split(rgb.includes(',') ? ',' : '');
  if (values.some((item) => +item < 0 || +item > 255)) {
    return null;
  }
  return (
    '#' + values.map((item) => (+item).toString(16).padStart(2, 0)).join('')
  );
}

function convertHex2Rgb(hex) {
  hex = hex.trim();
  if (hex.match(/^[a-f,0-9]{6}$/i)) {
    const values = hex.match(/.{2}/g);
    return values.map((item) => parseInt('0x' + item)).join(',');
  }
  return null;
}

/**
 * color为十六进制颜色
 */
function createPng(color) {
  const canvas = createCanvas(200, 200, 'png');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const name = new Date().getTime() + '.png';
  fs.writeFileSync(`icon/${name}`, canvas.toBuffer());
  return `${name}`;
}

function promptVailid(color, name) {
  const result = {
    title: color,
    arg: color,
    subtitle: 'Enter to copy path',
    icon: {
      path: __dirname + '/icon/' + name,
    },
  };
  console.log(
    JSON.stringify({
      items: [result],
    })
  );
}

function promptInvalid() {
  const result = {
    title: 'Invalid Color',
    subtitle: 'Change input',
  };
  console.log(
    JSON.stringify({
      items: [result],
    })
  );
}

function clearCache() {
  exec('rm -rf ./icon/*.png', (err) => {
    if (err) {
      console.error(err);
    }
  });
}

function init() {
  clearCache();
  const color =
    modeInput === 'rgb'
      ? convertRgb2Hex(colorInput)
      : convertHex2Rgb(colorInput);
  const pngColor = modeInput === 'rgb' ? color : '#' + colorInput;

  if (color) {
    promptVailid(color, createPng(pngColor));
    return;
  }
  return promptInvalid();
}

init();

