const path = require('path');
const childProcess = require('child_process');
const fs = require('fs');
const {utils} = require('@stacker/alfred-utils');

const HOME = getUserHome();
const DB_PATH = path.join(HOME, '/Library/Messages/chat.db');
const SQL_PATH = path.join(process.env.alfred_workflow_cache, 'select.sql')

class iMessage {
  constructor() {
    this.path = DB_PATH;
    this.sqlPath = SQL_PATH;
  }

  exec(dbStr) {
    fs.writeFileSync(this.sqlPath, dbStr);
    let command = `sqlite3 "${this.path}" < "${this.sqlPath}" -json`;
    const resStr = childProcess.execSync(command, {encoding: 'utf8'});
    return resStr ? JSON.parse(resStr) : [];
  }
}

function getUserHome() {
  const envVar = (process.platform === 'win32') ? 'USERPROFILE' : 'HOME';
  return process.env[envVar];
}

module.exports = iMessage;
