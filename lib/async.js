
exports.series = (tasks, callback) => {
  const results = [];

  tasks.reduceRight(
    (next, task) => () => task((err, result) =>
      err ? callback(err) : (results.push(result), next())),
    () => callback(null, results)
  )();
};

exports.eachSeries = (tasks, callback) =>
  tasks.reduceRight(
    (next, task) => () => task(err => err ? callback(err) : next()),
    () => callback(null)
  )();

exports.waterfall = (tasks, callback) =>
  tasks.reduceRight(
    (next, task) => result => task(...result, (err, ...result) =>
      err ? callback(err) : next(result)),
    result => callback(null, ...result)
  )([]);
