const test = require('tape');
const {
  series,
  eachSeries,
  waterfall,
} = require('../lib/async');

test('test series', t => {
  t.plan(9);

  series([
    callback => { t.pass(); callback(null, 1) },
    callback => { t.pass(); callback(null, 2) },
    callback => { t.pass(); callback(null, 3) },
  ], (err, results) => {
    t.error(err);
    t.deepEqual(results, [1, 2, 3]);
  });

  series([
    callback => { t.pass(); callback(null, 1) },
    callback => { t.pass(); callback(new Error(), 2) },
    callback => { t.fail(); callback(null, 3) },
  ], (err, results) => {
    t.ok(err);
    t.ok(!results);
  });
});

test('test eachSeries', t => {
  t.plan(7);

  eachSeries([
    callback => { t.pass(); callback(null) },
    callback => { t.pass(); callback(null) },
    callback => { t.pass(); callback(null) },
  ], (err) => {
    t.error(err);
  });

  eachSeries([
    callback => { t.pass(); callback(null) },
    callback => { t.pass(); callback(new Error()) },
    callback => { t.fail(); callback(null) },
  ], (err) => {
    t.ok(err);
  });
});

test('test waterfall', t => {
  t.plan(12);

  waterfall([
    callback => { t.pass(); callback(null, 1, 2) },
    (a, b, callback) => { t.equal(a, 1); t.equal(b, 2); callback(null, 3, 4) },
    (a, b, callback) => { t.equal(a, 3); t.equal(b, 4); callback(null, 5, 6) },
  ], (err, ...results) => {
    t.error(err);
    t.deepEqual(results, [5, 6]);
  });

  waterfall([
    callback => { t.pass(); callback(null, 1, 2) },
    (a, b, callback) => { t.equal(a, 1); t.equal(b, 2); callback(new Error(), 3, 4) },
    (a, b, callback) => { t.fail(); callback(null, 5, 6) },
  ], (err, results) => {
    t.ok(err);
    t.ok(!results);
  });
});
