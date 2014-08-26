/*jslint node: true, indent: 2, passfail: true */
"use strict";

var Benchmark = require('benchmark'),
  suite = new Benchmark.Suite(),
  expect = require('expect.js'),
  OldModelo = require('../versions/4.0.2'),
  Modelo = require('../versions/current'),
  print = require('../print');

var RandomId, Rated, Base, Product, Old, CurrentModelo;

function RandomId() {
  this.id = 4;
}

function Rated() {
  this.rating = undefined;
}
Rated.prototype.rate = function rate(stars) {
  this.rating = stars;
};

function TestDefine(implementation) {

  var Base = implementation.define(RandomId, Rated),
    Product = Base.extend(function Product(options) {
      this.name = options.name;
    });
  Product.prototype.rate = function (stars) {
    Base.prototype.rate.call(this, stars);
  };

  return function () {
    var p = new Product();
    p.rate(5);
    return p;
  };

}

function TestInherits(implementation) {

  function Base() {
    RandomId.call(this);
    Rated.call(this);
  }
  function Product() {
    Base.call(this);
  }
  try {
    implementation.inherits(Base, RandomId, Rated);
    implementation.inherits(Product, Base);
  } catch (err) {
    return function () { throw err; };
  }

  return function () {
    var p = new Product();
    p.rate(5);
    return p;
  };

}

suite.add(
  'Previous: define()',
  new TestDefine(OldModelo)
).add(
  'Current: define()',
  new TestDefine(Modelo)
).add(
  'Previous: inherits()',
  new TestInherits(OldModelo)
).add(
  'Current: inherits()',
  new TestInherits(Modelo)
).on('complete', print).run();
