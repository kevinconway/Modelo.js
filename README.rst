=========
Modelo.js
=========

**A cross-platform JavaScript object inheritance utility.**

.. image:: https://travis-ci.org/kevinconway/Modelo.js.png
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

    var Animal, Lion, Eagle, Griffin, myPet;

    Animal = modelo.define();

    Lion = Animal.extend();
    Lion.prototype.roar = function () { console.log("Roar"); };

    Eagle = Animal.extend(function (options) {
        this.wingSpan = options.wingSpan || "2 Feet";
    })

    Griffin = modelo.define(Lion, Eagle);

    myPet = new Griffin({wingSpan: "12 Feet"});

    myPet.roar(); // Console Output: "Roar"

    myPet.wingSpan; // "12 Feet"

    myPet.isInstance(Griffin); // true
    myPet.isInstance(Eagle); // true
    myPet.isInstance(Lion); // true
    myPet.isInstance(Animal); // true

For more detailed usage guides and API specifications, see the docs directory.

Setup
=====

Node.js
-------

This package is published through NPM under the name `modelo`::

    $ npm install modelo

Once installed, simply `require("modelo")`.

Browser
-------

Developers working in normal browser environments can use <script> tags to load
this package::

    <script src="modelo.js"></script>

There are no dependencies that must be loaded before this package.

Tests
-----

To run the tests in Node.js use the `npm test` command.

To run the tests in a browser, run the `install_libs` script in the test
directory and then open the `runner.html` in the browser of your choice.

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
browser. Copies of the test libraries are bundled with the project to support
a browser based test runner.

Contributor's Agreement
-----------------------

All contribution to this project are protected by the contributors agreement
detailed in the CONTRIBUTING file. All contributors should read the file before
contributing, but as a summary::

    You give us the rights to distribute your code and we promise to maintain
    an open source release of anything you contribute.
