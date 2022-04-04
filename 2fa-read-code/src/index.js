/**
 * usage
 * /usr/local/bin/node ./index.js {query}
 */
const { utils, dateUtils } = require('@stacker/alfred-utils');
const iMessage = require('./node-imessage');
const im = new iMessage();
const lookBackMinutes = process.env.look_back_minutes;
(async function () {
  const messages = await readLatestMessage();
  im.disconnect();
  if (messages.length) {
    const items = messages.reduce((res, messageObj) => {
      const msg = preProcessMessage(messageObj.text);
      if (!msg.trim()) {
        return res;
      }
      const captcha = readCaptchaFromMessage(msg);
      if (captcha) {
        const subject = readSubjectFromMessage(msg);
        res.push(
          utils.buildItem({
            title: `${captcha}`,
            subtitle: `Sender：${subject} ${dateUtils.formatToCalendar(
              messageObj.message_date
            )}，⏎ to Copy`,
            arg: captcha,
            text: {
              largetype: messageObj.text,
              copy: captcha
            }
          })
        );
      }
      return res;
    }, []);
    if (items.length) {
      return utils.printScriptFilter({
        items
      });
    }
  }
  utils.printScriptFilter({
    items: [
      utils.buildItem({
        title: 'There is no captcha',
        subtitle: '⏎ to view Messages App',
        arg: 'view_message'
      })
    ]
  });
})();

function preProcessMessage(msg) {
  return msg.replace(
    /((https?|ftp|file):\/\/|www\.)[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/i,
    ''
  );
}

/**
 * 读取短信验证码
 * @param msg
 * @returns {null|*}
 */
function readCaptchaFromMessage(msg) {
  try {
    return msg.match(/\d{4,6}/)[0];
  } catch {
    return null;
  }
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
    im.getDb(function (err, db) {
      db.all(
        `
  select
            message.rowid,
            ifnull(handle.uncanonicalized_id, chat.chat_identifier) AS sender,
            message.service,
            datetime(message.date / 1000000000 + 978307200, 'unixepoch', 'localtime') AS message_date,
            message.text
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
        limit 100`,
        function (err, res) {
          resolve(res);
        }
      );
    });
  });
}

module.exports = {
  readCaptchaFromMessage,
  readLatestMessage,
  readSubjectFromMessage,
  preProcessMessage
};
