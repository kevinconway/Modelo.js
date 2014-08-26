/*jslint node: true, indent: 2, passfail: true */
"use strict";

var util = require('util'),
  Benchmark = require('benchmark'),
  suite = new Benchmark.Suite(),
  expect = require('expect.js'),
  OldModelo = require('../versions/4.0.2'),
  Modelo = require('../versions/current'),
  print = require('../print');

var RandomId, Rated, Base, Product, widget;

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

  return function TestDefine() {

    var Base = implementation.define(RandomId, Rated),
      Product = Base.extend(function Product(options) {
        this.name = options.name;
      }),
      instance;
    Product.prototype.rate = function (stars) {
      Base.prototype.rate.call(this, stars);
    };

    instance = new Product();
    instance.rate(12);

  };

}

function TestInherits(implementation) {

  return function TestInherits() {

    function Base() {
      RandomId.call(this);
      Rated.call(this);
    }
    implementation.inherits(Base, RandomId, Rated);

    function Product() {
      Base.call(this);
    }
    implementation.inherits(Product, Base);

    var instance = new Product();
    instance.rate(12);

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
