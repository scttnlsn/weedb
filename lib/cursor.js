module.exports = Cursor;

function Cursor(stream) {
    this.stream = stream;
}

Cursor.prototype.all = function (callback) {
    var docs = [];

    this.stream.on('data', function (data) {
        docs.push(JSON.parse(data.value));
    });

    this.stream.on('error', callback);
    this.stream.on('end', function () {
        callback(null, docs);
    });
}