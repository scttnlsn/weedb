var uuid = require('node-uuid');
var Cursor = require('./cursor');
var Index = require('./index');
var utils = require('./utils');

module.exports = Collection;

function Collection(db, name) {
    this.db = db;
    this.name = name;
    this.indices = {};
}

Collection.prototype.key = function (id) {
    return utils.key(this.name, id);
};

Collection.prototype.put = function (doc, callback) {
    doc._id || (doc._id = uuid.v4());

    var self = this;

    var ops = Object.keys(this.indices).map(function (attr) {
        var index = self.indices[attr];
        return { type: 'put', key: index.key(doc[attr], doc._id), value: utils.sep };
    });

    ops.push({ type: 'put', key: this.key(doc._id), value: JSON.stringify(doc) });

    this.db.batch(ops, function (err) {
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
        start: this.key(start === undefined ? utils.min : start),
        end: this.key(end === undefined ? utils.max : end)
    });

    return new Cursor(stream);
};

Collection.prototype.index = function (name) {
    var index = new Index(this, name);
    this.indices[name] = index;
    return index;
};