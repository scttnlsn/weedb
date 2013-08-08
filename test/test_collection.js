var assert = require('assert');

describe('Collection', function () {
    beforeEach(function () {
        this.collection = this.db.collection('test');
    });

    describe('storage', function () {
        beforeEach(function (done) {
            var self = this;

            this.collection.put({ foo: 'bar' }, function (err, doc) {
                if (err) return done(err);

                self.doc = doc;
                done();
            });
        });

        it('generates _id if not present', function () {
            assert.ok(this.doc._id);
            assert.equal(this.doc.foo, 'bar');
        });

        it('saves documents', function (done) {
            var self = this;

            this.collection.get(this.doc._id, function (err, doc) {
                if (err) return done(err);

                assert.ok(doc);
                assert.equal(doc._id, self.doc._id);
                done();
            });
        });

        it('deletes documents', function (done) {
            var self = this;

            this.collection.del(this.doc._id, function (err) {
                if (err) return done(err);

                self.collection.get(self.doc._id, function (err, doc) {
                    if (err) return done(err);

                    assert.ok(!doc);
                    done();
                });
            });
        });
    });

    describe('iteration', function () {
        beforeEach(function () {
            this.docs = [];
        });

        beforeEach(function (done) {
            var self = this;

            this.collection.put({ foo: 'bar' }, function (err, doc) {
                if (err) return done(err);

                self.docs.push(doc);
                done();
            });
        });

        beforeEach(function (done) {
            var self = this;

            this.collection.put({ baz: 'qux' }, function (err, doc) {
                if (err) return done(err);

                self.docs.push(doc);
                done();
            });
        });

        it('returns all documents', function (done) {
            this.collection.all(function (err, docs) {
                if (err) return done(err);

                assert.equal(docs.length, 2);
                assert.ok(docs[0]._id);
                assert.ok(docs[1]._id);
                done();
            });
        });

        it('returns range of documents', function (done) {
            this.collection.range(undefined, this.docs[1]._id).all(function (err, docs) {
                if (err) return done(err);

                assert.equal(docs.length, 1);
                done();
            });
        });
    });
});