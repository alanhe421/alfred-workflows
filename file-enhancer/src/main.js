const fs = require('fs');
const mime = require('mime-types');
const [, , query] = process.argv;
const base64Encode = fs.readFileSync(query, { encoding: 'base64' });
const res = `data:${mime.lookup(query) || 'text/plain'};base64,${base64Encode}`;
process.stdout.write(res);
