var Cursor = require('./cursor');
var utils = require('./utils');

module.exports = Index;

function Index(collection, attr) {
    this.collection = collection;
    this.db = this.collection.db;
    this.attr = attr;
}

Index.prototype.key = function (value, id, callback) {
    return utils.key(this.collection.name + '-index', this.attr, value, id);
};

Index.prototype.put = function (value, id, callback) {
    this.db.put(this.key(value, id), utils.sep, callback);
};

Index.prototype.get = function (value, callback) {
    this.range(value, value, callback);
};

Index.prototype.range = function (start, end, callback) {
    var stream = this.db.createReadStream({
        start: this.key(start, utils.min),
        end: this.key(end, utils.max)
    });

    var ids = [];

    stream.on('error', callback);

    stream.on('data', function (data) {
        var parts = data.key.split(utils.sep);
        ids.push(parts[parts.length - 1]);
    });

    stream.on('end', function () {
        callback(null, ids);
    });
};