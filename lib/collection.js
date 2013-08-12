var async = require('async');
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
    var saves = [];

    for (var attr in this.indices) {
        var index = this.indices[attr];

        saves.push(function (callback) {
            index.put(doc[attr], doc._id, callback);
        });
    }

    async.parallel(saves, function (err) {
        if (err) return callback(err);

        self.db.put(self.key(doc._id), JSON.stringify(doc), function (err) {
            if (err) return callback(err);

            callback(null, doc);
        });
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