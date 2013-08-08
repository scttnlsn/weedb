var uuid = require('node-uuid');
var Cursor = require('./cursor');

module.exports = Collection;

var SEP = '\xff';

function Collection(db, name) {
    this.db = db;
    this.name = name;
}

Collection.prototype.key = function (id) {
    return ['', this.name, id].join(SEP);
};

Collection.prototype.put = function (doc, callback) {
    doc._id || (doc._id = uuid.v4());

    this.db.put(this.key(doc._id), JSON.stringify(doc), function (err) {
        if (err) return callback(err);

        callback(null, doc);
    });
};

Collection.prototype.get = function (id, callback) {
    this.db.get(this.key(id), function (err, doc) {
        if (err) return callback(null, null);

        callback(null, JSON.parse(doc));
    });
};

Collection.prototype.del = function (id, callback) {
    this.db.del(this.key(id), callback);
};

Collection.prototype.all = function (callback) {
    this.range().all(callback);
};

Collection.prototype.range = function (start, end) {
    var stream = this.db.createReadStream({
        start: this.key(start === undefined ? '' : start),
        end: this.key(end === undefined ? SEP : end)
    });

    return new Cursor(stream);
};