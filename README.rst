=========
Modelo.js
=========

**A multiple inheritance utility for JavaScript.**

.. image:: https://travis-ci.org/kevinconway/Modelo.js.png?branch=master
    :target: https://travis-ci.org/kevinconway/Modelo.js
    :alt: Current Build Status

Why?
====

Inheritance libraries today all seem to enforce the same clunky interface
style. The only one of any merit these days is 'util.inherits' from the Node.js
standard library. Only problem: no multiple inheritance.

Wouldn't it be great if 'util.inherits' supported multiple inheritance *and*
it stayed fast too?

That's this library. That's why it exists.

util.inherits
=============

The 'modelo.inherits' function can act as a drop in replacement for
'util.inherits'. Already have a code base that you want to start extending? No
problem.

.. code-block:: javascript

    var modelo = require('modelo');

    function Base() {
        // Base object constructor
    }
    Base.prototype.baseMethod = function baseMethod() {
        console.log('Method from base object.');
    }

    function Extension() {
        // Sub-object constructor
    }
    // util.inherits(Extension, Base);
    modelo.inherits(Example, Base);

    new Extension() instanceof Base; // true

Multiple Inheritance
====================

Once you need to extend multiple base objects, just put more base objects in
the call to 'inherits'.

.. code-block:: javascript

    var modelo = require('modelo');

    function MixinOne() {}
    function MixinTwo() {}

    function Combined() {}
    modelo.inherits(Combined, MixinOne, MixinTwo);

    var instance = new Combined();

    instance.isInstance(Combined); // true
    instance.isInstance(MixinOne); // true
    instance.isInstance(MixinTwo); // true

Unfortunately, there is no way to make 'instanceof' work with multiple
inheritance. To replace it, simply use the 'isInstance' method that gets added
to your instances. It will return true for any base object in the inheritance
tree.

You Said Something About Fast?
==============================

All inheritance libraries have their cost. Several market themselves on their
performance, however. Here is how this library stacks up against some of the
competition:

Object Definition
-----------------

This test attempts to replicate the same inheritance chain in each library and
compare the amount of time it takes to create the object prototypes and a
single instance. The full source of this profile is in the benchmarks
directory, but the multiple inheritance example from the above section is a
rough outline of what the test performs minus the 'isInstance' checks. The
results:

+------------+------------+
| Name       | % Slower   |
+============+============+
| Fiber      | 0.0000 %   |
+------------+------------+
| augment    | 66.804 %   |
+------------+------------+
| Klass      | 72.037 %   |
+------------+------------+
| Modelo     | 73.278 %   |
+------------+------------+

Admittedly, this library is not the fastest when it comes to applying the
inheritance to the object prototype.  However, prototypes are only defined
once. A far more realistic measurement is instance creation time as that will
happen far more often than prototype definitions. The results for that
measurement are:

+------------+------------+
| Name       | % Slower   |
+============+============+
| Modelo     | 0.0000 %   |
+------------+------------+
| Fiber      | 40.967 %   |
+------------+------------+
| augment    | 42.075 %   |
+------------+------------+
| Klass      | 162.89 %   |
+------------+------------+

Modelo excels here by not wrapping the object constructor which allows
instances to be created at native speeds. The only cost to using Modelo is in
the logic used to copy attributes from inherited prototypes.

The above values only represent the percent difference in runtimes. For more
data run the default grunt task. It will run the benchmarks and show expanded
results.

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
