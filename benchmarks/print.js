/*jslint node: true, indent: 2, passfail: true */
"use strict";

var Table = require('cli-table');

function print() {
  var headers = ["Name", "Mean", "Variance", "MOE"],
    t = new Table({"head": headers}),
    precision = 5;

  this.filter('successful').map(function (item) {
    return {
      "name": item.name,
      "mean": item.stats.mean,
      "variance": item.stats.variance,
      "moe": item.stats.moe
    };
  }).sort(function (a, b) {
    return a.mean + a.moe > b.mean + b.moe;
  }).forEach(function (item) {
    t.push([
      item.name,
      item.mean.toPrecision(precision),
      item.variance.toPrecision(precision),
      item.moe.toPrecision(precision)
    ]);
  });
  process.stdout.write(t.toString());
  process.stdout.write("\n");
}

module.exports = print;
