var level = require('level');
var Collection = require('./collection');

module.exports = function (path, options) {
    var db = level(path, options);

    db.collection = function (name) {
        return new Collection(this, name);
    };

    return db;
};