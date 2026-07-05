const path = require('path');
const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');

const HOME = getUserHome();
const DB_PATH = path.join(HOME, '/Library/Messages/chat.db');
const SQL_PATH = path.join(process.env.alfred_workflow_cache || os.tmpdir(), 'select.sql');

class iMessage {
  constructor() {
    this.path = DB_PATH;
    this.sqlPath = SQL_PATH;
  }

  isSupport() {
    try {
      childProcess.execSync('sqlite3 -json');
      return true;
    } catch {
      return false;
    }
  }

  exec(dbStr) {
    fs.writeFileSync(this.sqlPath, dbStr);
    let command = `sqlite3 "${this.path}" < "${this.sqlPath}" -json`;
    let resStr;
    try {
      resStr = childProcess.execSync(command, { encoding: 'utf8' });
    } catch (e) {
      if (isDatabaseAuthorizationError(e)) {
        throw new Error(buildDatabasePermissionError());
      }
      throw e;
    }
    return resStr ? JSON.parse(resStr) : [];
  }
}

function isDatabaseAuthorizationError(error) {
  const stderr = error?.stderr?.toString?.() || '';
  const message = error?.message || '';
  return /authorization denied|operation not permitted|permission denied/i.test(`${stderr}\n${message}`)
    && /Library\/Messages\/chat\.db|Messages\/chat\.db/i.test(`${stderr}\n${message}`);
}

function buildDatabasePermissionError() {
  return [
    'Cannot open Messages database.',
    'Grant Full Disk Access to Alfred in System Settings > Privacy & Security > Full Disk Access,',
    'then restart Alfred and run 2FA-Read Code again.'
  ].join(' ');
}

function getUserHome() {
  const envVar = process.platform === 'win32' ? 'USERPROFILE' : 'HOME';
  return process.env[envVar];
}

module.exports = iMessage;
