var rimraf = require('rimraf');
var weedb = require('../lib/weedb');

beforeEach(function () {
    this.db = weedb('./test.db');
});

afterEach(function (done) {
    this.db.close(done);
});

afterEach(function (done) {
    rimraf('./test.db', done);
});