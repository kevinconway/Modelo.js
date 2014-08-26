/*jslint node: true, indent: 2, passfail: true */
"use strict";

var Benchmark = require('benchmark'),
  suite = new Benchmark.Suite(),
  print = require('../print');

function Base1() {
  this.value = "base1";
}

function Base2() {
  this.value = "base2";
}

function Base3() {
  this.value = "base3";
}


function DefineWithSlice() {
  var constructors = Array.prototype.slice.call(arguments);

  return function () {
    return constructors;
  };
}

function remoteSlice() {
  return Array.prototype.slice.call(arguments);
}
function DefineWithRemoteSlice() {
  var constructors = remoteSlice.apply(undefined, arguments);

  return function () {
    return constructors;
  };
}

function DefineWithInlineSliceArrayConstructor() {
  var length = arguments.length,
    constructors = new Array(length),
    x;

  for (x = 0; x < length; x = x + 1) {
    constructors[x] = arguments[x];
  }

  return function () {
    return constructors;
  };
}

function DefineWithInlineSliceAssignment() {
  var length = arguments.length,
    constructors = [],
    x;

  for (x = 0; x < length; x = x + 1) {
    constructors[x] = arguments[x];
  }

  return function () {
    return constructors;
  };
}

function DefineWithInlineSlicePush() {
  var length = arguments.length,
    constructors = [],
    x;

  for (x = 0; x < length; x = x + 1) {
    constructors.push(arguments[x]);
  }

  return function () {
    return constructors;
  };
}

function remoteInlineSlice() {
  var length = arguments.length,
    args = [],
    x;

  for (x = 0; x < length; x = x + 1) {
    args[x] = arguments[x];
  }

  return args;
}
function DefineWithRemoteInlineSlice() {
  var constructors = remoteInlineSlice.apply(undefined, arguments);
  return function () {
    return constructors;
  };
}

function DefineWithWrapper(args) {
  return function () {
    return args;
  }
}
function getArgs(fn) {
  return function getArgs() {
    return fn.call(undefined, remoteInlineSlice.apply(undefined, arguments));
  };
}
DefineWithWrapper = getArgs(DefineWithWrapper);

suite.add('slice: standard', function () {
  var x = new DefineWithSlice(Base1, Base2, Base3);
  x();
}).add('slice: remote func', function () {
  var x = new DefineWithRemoteSlice(Base1, Base2, Base3);
  x();
}).add('inline: new Array()', function () {
  var x = new DefineWithInlineSliceArrayConstructor(Base1, Base2, Base3);
  x();
}).add('inline: assign to empty', function () {
  var x = new DefineWithInlineSliceAssignment(Base1, Base2, Base3);
  x();
}).add('inline: .push()', function () {
  var x = new DefineWithInlineSlicePush(Base1, Base2, Base3);
  x();
}).add('remote: assign to empty', function () {
  var x = new DefineWithRemoteInlineSlice(Base1, Base2, Base3);
  x();
}).add('remote: wrapper:', function () {
  var x = new DefineWithWrapper(Base1, Base2, Base3);
  x();
}).on('complete', print).run();
