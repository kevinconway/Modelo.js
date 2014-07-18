=========
Modelo.js
=========

**A multiple inheritance utility for JavaScript.**

.. image:: https://travis-ci.org/kevinconway/Modelo.js.png?branch=master
    :target: https://travis-ci.org/kevinconway/Modelo.js
    :alt: Current Build Status

What Is Modelo?
===============

Modelo is a helper utility for JavaScript developers that provides a clean
interface over prototypal inheritance.

The interface exposed by this library supports both mix-in and "class" style
object definitions and inheritance.

Show Me
=======

.. code-block:: javascript

    var RandomId, Rated, Base, Product, widget;

    // Generates random integer id in constructor.
    RandomId = modelo.define(function () {
        this.id =  Math.floor(Math.random() * 100000);
    });

    // No special constructor. Adds a method to rate with number of stars.
    Rated = modelo.define();
    Rated.prototype.rate = function (stars) {
        this.rating = stars;
    };

    // Common base that uses both mixins.
    Base = modelo.define(RandomId, Rated);

    // Extension of Base with custom constructor.
    Product = Base.extend(function (options) {
        this.name = options.name;
    });
    // Extend a method from Base and add extra functionality.
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

For more detailed usage guides and API specifications, see the docs directory.

Why Not util.inherits?
======================

The Node.js standard library util.inherits function is a great and simple tool.
In order to preserve the behaviour of the `instanceof` keyword it is limited
to only single inheritance. If this is the desired behaviour then util.inherits
should be used.

This module is an attempt to provide simple support for multiple inheritance.
Unlike util.inherits, this module (as would any attempt at multiple
inheritance) does not preserve the behaviour of the `instanceof` keyword. This
functionality is provided instead by the `isInstance` method shown above.

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
and test the browser module using PhantomJS.

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
