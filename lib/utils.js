exports.sep = '\xff';

exports.min = '';

exports.max = exports.sep;

exports.key = function () {
    var parts = [].slice.call(arguments);
    parts.unshift('');
    return parts.join(this.sep);
};