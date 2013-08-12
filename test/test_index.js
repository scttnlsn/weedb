var assert = require('assert');
var async = require('async');
require('./helpers');

describe('Index', function () {
    beforeEach(function () {
        this.collection = this.db.collection('test');
        this.index = this.collection.index('foo');
    });

    beforeEach(function (done) {
        var docs = [
            { _id: 'a', foo: 'bar' },
            { _id: 'b', foo: 'bar' },
            { _id: 'c', foo: 'baz' },
            { _id: 'd', foo: 'qux' }
        ];

        async.map(docs, this.collection.put.bind(this.collection), done);
    });

    describe('#get', function () {
        it('returns ids of matches', function (done) {
            this.index.get('bar', function (err, ids) {
                if (err) return done(err);

                assert.deepEqual(ids, ['a', 'b']);
                done();
            });
        });
    });

    describe('#range', function () {
        it('returns ids of matches', function (done) {
            this.index.range('bar', 'baz', function (err, ids) {
                if (err) return done(err);

                assert.deepEqual(ids, ['a', 'b', 'c']);
                done();
            });
        });
    });

    describe('when item is deleted', function () {
        beforeEach(function (done) {
            this.collection.del('b', done);
        });

        xit('excludes id', function () {
            this.index.get('bar', function (err, ids) {
                if (err) return done(err);

                assert.deepEqual(ids, ['a']);
                done();
            });
        });
    });
});