/// <reference path="./node_modules/@stacker/alfred-utils/dist/environment.d.ts" />

/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const { utils, dateUtils, Workflow } = require('@stacker/alfred-utils');
const iMessage = require('./node-imessage');
const { execSync } = require('child_process');
const { argv } = require('process');

const action = argv[2];
const im = new iMessage();
const lookBackMinutes = process.env.look_back_minutes;
const wf = new Workflow();

if (action === 'list') {
  listMessages();
}
else if (action === 'read') {
  readMessage(process.env.guid?.replace(/\n/, ''));
}

/**
 * 读取剪贴板的+数据库有限时间内的验证码记录
 * 但如果剪贴板的数据是数据库中回车拷贝过来的，属于重复数据，显示上就去掉原数据库里同样记录，进行去重
 */
async function listMessages() {
  utils.useCache();
  let messages = [];
  let messageFromClipboard;

  try {
    messages = await readLatestMessage();
    messageFromClipboard = readFromClipboard();
    if (messageFromClipboard) {
      wf.addWorkflowItem({
        item: messageFromClipboard
      });
    }
  } catch (e) {
    wf.addWorkflowItem({
      item: {
        title: 'Something wrong',
        subtitle: e.message,
        text: {
          copy: e.message,
          largetype: e.message
        }
      }
    });
    wf.run();
    return;
  }
  if (messages.length) {
    messages
      .reduce((res, messageObj) => {
        const msg = preProcessMessage(messageObj.text);
        if (!msg.trim()) {
          return res;
        }
        const captcha = readCaptchaFromMessage(msg);
        if (captcha) {
          if (captcha === messageFromClipboard?.arg) {
            return res;
          }
          const subject = readSubjectFromMessage(msg);
          const isRead = messageObj.is_read === 1;
          res.push(
            utils.buildItem({
              title: `${captcha}`,
              icon: {
                path: isRead ? 'icon.png' : 'icon-unread.png',
              },
              subtitle: `${subject ? `Sender：${subject}, ` : `Sender: ${messageObj.sender}, `
                }${dateUtils.formatToCalendar(
                  messageObj.message_date
                )}，⏎ to Copy`,
              arg: captcha,
              variables: {
                guid: isRead ? undefined : messageObj.guid, // dont pass when is_read
                // guid: messageObj.guid, 
                rowid: messageObj.rowid,
              },
              text: {
                largetype: messageObj.text,
                copy: captcha
              }
            })
          );
        }
        return res;
      }, [])
      .forEach((item) => {
        wf.addWorkflowItem({
          item
        });
      });
  }
  if (!wf.items.length) {
    wf.addWorkflowItem({
      item: utils.buildItem({
        title: 'There is no authentication code',
        subtitle: '⏎ to view Messages App',
        arg: 'view_message'
      })
    });
  }
  wf.run({ rerun: 1 });
}

function readFromClipboard() {
  const msg = execSync('pbpaste', { encoding: 'utf-8' }).replace(/%$/, '');
  const captcha = readCaptchaFromMessage(msg);
  if (captcha) {
    const subject = readSubjectFromMessage(msg);
    return utils.buildItem({
      title: `${captcha}`,
      subtitle: `From 📋，${subject ? `Sender：${subject} ` : ''
        }${dateUtils.formatToCalendar(Date.now())}，⏎ to Copy`,
      arg: captcha,
      text: {
        largetype: msg,
        copy: captcha
      }
    });
  }
}

function preProcessMessage(msg) {
  return msg.replace(
    /((https?|ftp|file):\/\/|www\.)[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/i,
    ''
  );
}

/**
 * Read SMS verification code
 * Digit 3-6 digits
 * Prefer longer codes, skip dates and currencies.
 */
function readCaptchaFromMessage(msg) {
  // Remove date strings in various formats
  const cleanedMsg = msg.replace(
    /\d{4}[./-]\d{1,2}[./-]\d{1,2}|\d{1,2}[./-]\d{1,2}[./-]\d{2,4}/g,
    ''
  );

  // Match numbers with 3 to 6 digits, not part of currency amounts
  const regex = /\b(?<![.,]\d|€|\$|£)(\d{3,6})(?!\d|[.,]\d|€|\$|£)\b/g;

  // Collect all matches
  const matches = [];
  let match;
  while ((match = regex.exec(cleanedMsg)) !== null) {
    matches.push(match[0]);
  }

  // Sort the matches array by length in descending order (longer codes first)
  matches.sort((a, b) => b.length - a.length);

  // Return the first (longest) match, or null if no matches found
  return matches.length > 0 ? matches[0] : null;
}

/**
 * 读取短信主题
 * @param msg
 * @returns {null|*}
 */
function readSubjectFromMessage(msg) {
  try {
    return msg.match(/【.+】/)[0];
  } catch {
    return null;
  }
}

function readLatestMessage() {
  return new Promise((resolve) => {
    const res = im.exec(`
  select
            message.rowid as rowid,
            message.guid as guid,
            ifnull(handle.uncanonicalized_id, chat.chat_identifier) AS sender,
            message.service,
            datetime(message.date / 1000000000 + 978307200, 'unixepoch', 'localtime') AS message_date,
            message.text,
            is_read
        from
            message
                left join chat_message_join
                        on chat_message_join.message_id = message.ROWID
                left join chat
                        on chat.ROWID = chat_message_join.chat_id
                left join handle
                        on message.handle_id = handle.ROWID
        where
            message.is_from_me = 0
            and message.text is not null
            and length(message.text) > 0
            and (
                message.text glob '*[0-9][0-9][0-9][0-9]*'
                or message.text glob '*[0-9][0-9][0-9][0-9][0-9]*'
                or message.text glob '*[0-9][0-9][0-9][0-9][0-9][0-9]*'
                or message.text glob '*[0-9][0-9][0-9]-[0-9][0-9][0-9]*'
                or message.text glob '*[0-9][0-9][0-9][0-9][0-9][0-9][0-9]*'
                or message.text glob '*[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]*'
            )
            and datetime(message.date / 1000000000 + strftime('%s', '2001-01-01'), 'unixepoch', 'localtime')
                    >= datetime('now', '-${lookBackMinutes} minutes', 'localtime')
        order by
            message.date desc
        limit 100`);

    resolve(res);
  });
}

function readMessage(guid) {
  if (!guid) {
    return;
  }
  return new Promise((resolve) => {
    const res = im.exec(`
      UPDATE message
SET is_read = 1,date_read = ${createDate()}
WHERE guid = "${guid}";
  `);
    resolve(res);
  });
}

function createDate() {
  const currentTimeMillis = Date.now();
  const macEpochMillis = new Date('2001-01-01T00:00:00Z').getTime();
  const elapsedMillis = currentTimeMillis - macEpochMillis;
  return BigInt(elapsedMillis) * 1_000_000n;
}


module.exports = {
  readCaptchaFromMessage,
  readLatestMessage,
  readSubjectFromMessage,
  preProcessMessage
};
