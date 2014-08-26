=========
Modelo.js
=========

**A multiple inheritance utility for JavaScript.**

.. image:: https://travis-ci.org/kevinconway/Modelo.js.png?branch=master
    :target: https://travis-ci.org/kevinconway/Modelo.js
    :alt: Current Build Status

What Is Modelo?
===============

Modelo is a helper utility that provides for multiple inheritance.

The library exposes two basic interfaces: one that mimics the util.inherits
function and one that does not.


Inherits Example
================

.. code-block:: javascript

    function RandomId() {
        this.id = Math.floor(Math.random() * 100000);
    }
    function Rated() {
        this.rating = undefined;
    }
    Rated.prototype.rate = function rate(stars) {
        this.rating = stars;
    }

    function Base() {
        RandomId.call(this);
        Rated.call(this);
    }
    modelo.inherits(Base, RandomId, Rated);

    function Product(name) {
        Base.call(this);
        this.name = name;
    }
    modelo.inherits(Product, Base);
    Product.prototype.rate = function (stars) {
        console.log('Rating the product!');
        Base.prototype.rate.call(this, stars);
    }

    widget = new Product("widget");
    widget.id; // 12345
    widget.rating; // undefined
    widget.rate(5); // Rating the product!
    widget.rating; // 5

    widget.isInstance(Product); // true
    widget.isInstance(Base); // true
    widget.isInstance(Rated); // true
    widget.isInstance(RandomId); // true

Define Example
==============

.. code-block:: javascript

    var RandomId, Rated, Base, Product, widget;

    RandomId = modelo.define(function () {
        this.id =  Math.floor(Math.random() * 100000);
    });

    Rated = modelo.define();
    Rated.prototype.rate = function (stars) {
        this.rating = stars;
    };

    Base = modelo.define(RandomId, Rated);

    Product = Base.extend(function (options) {
        this.name = options.name;
    });
    Product.prototype.rate = function (stars) {
        console.log('Rating the product!');
        Base.prototype.rate.call(this, stars);
    };

    widget = new Product({name: "widget"});
    widget.id; // 12345
    widget.rating; // undefined
    widget.rate(5); // Rating the product!
    widget.rating; // 5

    widget.isInstance(Product); // true
    widget.isInstance(Base); // true
    widget.isInstance(Rated); // true
    widget.isInstance(RandomId); // true

See the doc directory for more details.

util.inherits
=============

The Node.js standard library util.inherits is a great and simple tool for
single inheritance. Unfortunately, it does not handle multiple base prototypes
being passed in. Even if it did, the 'instanceof' keyword only works when
working with single inheritance. If single inheritance is all you need then
util.inherits is likely the tool you want.

On the other hand, if you need/want to use multiple inheritance then this is
the tool you want. There is, sadly, no way alter the behaviour of 'instanceof'.
Instead, this library attaches an 'isInstance' method to each function that
inherits from one or more other functions. The 'isInstance' method traverses
the entire inheritance tree and return a boolean based on what it finds.

Setup
=====

Node.js
-------

This package is published through NPM under the name `modelo`::

    $ npm install modelo

Once installed, simply `require("modelo")`.

Browser
-------

This module uses browserify to create a browser compatible module. The default
grunt workflow for this project will generate both a full and minified browser
script in a build directory which can be included as a <script> tag::

    <script src="modelo.browser.min.js"></script>

The package is exposed via the global name `modelo`.

Tests
-----

Running the `npm test` command will kick off the default grunt workflow. This
will lint using jslint, run the mocha/expect tests, generate a browser module,
generate browser tests, and run the performance benchmarks.

License
=======

Modelo
------

This project is released and distributed under an MIT License.

::

    Copyright (C) 2012 Kevin Conway

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to
    deal in the Software without restriction, including without limitation the
    rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
    sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.

Contributors
============

Style Guide
-----------

All code must validate against JSlint.

Testing
-------

Mocha plus expect. All tests and functionality must run in Node.js and the
browser.

Contributor's Agreement
-----------------------

All contribution to this project are protected by the contributors agreement
detailed in the CONTRIBUTING file. All contributors should read the file before
contributing, but as a summary::

    You give us the rights to distribute your code and we promise to maintain
    an open source release of anything you contribute.
