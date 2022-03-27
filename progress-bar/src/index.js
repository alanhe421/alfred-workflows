/**
 * @description
 * demo ▓░░░░░░░░░░░░░░
 */
const SOLID_CHAR = '●';
const SOFT_CHAR = '○';

const [, , birthDateStr, lifetime,careerRangeStr] = process.argv;

const now = new Date();


function daysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function isLeapYear(year) {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

function yearProgress() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return day;
}

function monthProgress() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 0);
  const day = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return day;
}

function dayProgress() {
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );

  const millseconds = now - start;
  return millseconds;
}

const percentInYear = Math.floor(
  (yearProgress() / daysInYear(now.getFullYear())) * 100
);
const percentInMonth = Math.floor(
  (monthProgress() / daysInMonth(now.getMonth(), now.getFullYear())) * 100
);

const percentInDay = Math.floor((dayProgress() / (24 * 60 * 60 * 1000)) * 100);
/**
 *
 * @param {*} progress 百分进度
 * 百分转换为20为底
 */
function createProgressStr(progress) {
  progress = progress > 100 ? 100 : progress;
  const solid = Math.floor(progress / 5);
  return (
    new Array(solid).fill(SOLID_CHAR).join('') +
    new Array(20 - solid).fill(SOFT_CHAR).join('')
  );
}

function getPercentInLife(birthDateStr) {
  const birthDate = new Date(birthDateStr);
  const deadDate = new Date(
    birthDate.getFullYear() + Number(lifetime),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  return Math.floor(((new Date() - birthDate) / (deadDate - birthDate)) * 100);
}



/**
 * (当前年龄-职业生涯开始)/职业生涯长度
 */
function getPercentInCareer(careerRangeStr) {
  const careers = careerRangeStr.split('-');
  return Math.floor(
    (((new Date() - new Date(birthDateStr)) / (365 * 24 * 60 * 60 * 1000) -
      careers[0]) /
      (careers[1] - careers[0])) *
      100
  );
}

const percentInLife = getPercentInLife(birthDateStr);

const percentInCareer = getPercentInCareer(careerRangeStr);

const out = {
  items: [
    {
      title: 'Day: ' + percentInDay + '%',
      subtitle: createProgressStr(percentInDay)
    },
    {
      title: 'Month: ' + percentInMonth + '%',
      subtitle: createProgressStr(percentInMonth)
    },
    {
      title: 'Year: ' + percentInYear + '%',
      subtitle: createProgressStr(percentInYear)
    },
    {
      title: 'Life: ' + percentInLife + '%',
      subtitle: createProgressStr(percentInLife)
    },
    {
      title: 'Career: ' + percentInCareer + '%',
      subtitle: createProgressStr(percentInCareer)
    }
  ]
};

console.log(JSON.stringify(out));
