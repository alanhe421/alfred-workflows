var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var Q = require('q');

var HOME = getUserHome();

var identities = [];

function getUserHome() {
  var envVar = (process.platform == 'win32') ? 'USERPROFILE' : 'HOME';
  return process.env[envVar];
}

module.exports = iMessage;

function iMessage(opts) {
  opts = opts || {};
  this.path = opts.path || iMessage.DB_PATH;
  this.db = this.connect();
}

iMessage.OSX_EPOCH = 978307200;
iMessage.DB_PATH = path.join(HOME, '/Library/Messages/chat.db');

iMessage.prototype.connect = function() {
  var deferred = Q.defer();

  var db = new sqlite3.Database(
    this.path,
    sqlite3.OPEN_READONLY,
    function(err, res) {
      if (err) return deferred.reject(err);
      return deferred.resolve(db);
    });

  return deferred.promise;
};

iMessage.prototype.getDb = function(cb) {
  var args = arguments;

  // nodeify?
  this.db
    .then(function(db) {
      cb(null, db);
    }, function(err) {
      cb(err);
    });
};

iMessage.prototype.getRecipients = function(string, cb) {
  if (typeof string == 'function') {
    cb = string;
    string = false;
  }
  this.db.done(function(db) {
    var where = "";
    // Maybe dangerous, check SQLlite doc
    if (string && string != "") where = " WHERE id LIKE '%"+string+"%'";
    db.all("SELECT * FROM `handle`" + where, cb);
  });
};

iMessage.prototype.getRecipientById = function(id, details, cb) {
  if (typeof details == 'function') {
    cb = details;
    details = false;
  }
  this.db.done(function(db) {
    db.get("SELECT * FROM `handle` WHERE ROWID = $id", { $id: id }, function(err, recipient) {
      if (!details) return cb(err, recipient);
      if (err) return cb(err);
      db.all("SELECT * FROM `message` WHERE handle_id = $id", {$id: id}, function(err, messages) {
        if (err) return cb(err);
        recipient.messages = messages;
        cb(err, recipient);
      });
    });
  });
};

iMessage.prototype.getMessages = function(string, details, cb) {
  if (typeof string == 'function') {
    cb = string;
    string = false;
  }
  if (typeof details == 'function') {
    cb = details;
    details = false;
  }

  this.db.done(function(db) {
    var where = "";
    var join = "";
    // Maybe dangerous, check SQLlite doc
    if (string && string != "") where = " WHERE `message`.text LIKE '%"+string+"%'";
    if (details) join = " JOIN `handle` ON `handle`.ROWID = `message`.handle_id";
    db.all("SELECT * FROM `message`" + join + where, cb);
  });
};

iMessage.prototype.getMessagesFromId = function(id, string, cb) {
  if (typeof string == 'function') {
    cb = string;
    string = false;
  }

  this.db.done(function(db) {
    var where = "";
    // Maybe dangerous, check SQLlite doc
    if (string && string != "") where = " AND text LIKE '%"+string+"%'";
    db.all("SELECT * FROM `message` WHERE handle_id = $id"+where, {$id: id}, function(err, messages) {
      cb(err, messages);
    });
  });
};

iMessage.prototype.getAttachmentsFromId = function(id, cb) {
  this.db.done(function(db) {
    db.all("SELECT * FROM `message` \
      INNER JOIN `message_attachment_join` \
      ON `message`.ROWID = `message_attachment_join`.message_id \
      INNER JOIN `attachment` \
      ON `attachment`.ROWID = `message_attachment_join`.attachment_id \
      WHERE `message`.handle_id = $id", {$id: id}, function(err, messages) {
      cb(err, messages);
    });
  });
};

iMessage.prototype.getAttachmentById = function(id, cb) {
  this.db.done(function(db) {
    db.get("SELECT * FROM `message` \
      INNER JOIN `message_attachment_join` \
      ON `message`.ROWID = `message_attachment_join`.message_id \
      INNER JOIN `attachment` \
      ON `attachment`.ROWID = `message_attachment_join`.attachment_id \
      WHERE `message_attachment_join`.attachment_id = $id", {$id: id}, function(err, messages) {
      cb(err, messages);
    });
  });
};

iMessage.prototype.getAttachments = function(cb) {
  this.db.done(function(db) {
    db.all("SELECT * FROM `message_attachment_join` \
      INNER JOIN `message` \
      ON `message`.ROWID = `message_attachment_join`.message_id \
      INNER JOIN `attachment` \
      ON `attachment`.ROWID = `message_attachment_join`.attachment_id", cb);
  });
};

iMessage.prototype.disconnect = function() {
  this.db.done(function(db) {
    db.close();
  });
};