=========
Modelo.js
=========

**An isomorphic JavaScript development tool set.**

*Status: In Early Development*

Development Plan
================

Pass 1 **(Complete)**

    Initial implementation of object definition and property validation API's.

Pass 2 **(Complete)**

    Synchronous relationship API. (1-1, 1-N, N-N)

Pass 3 **(Complete)**

    Synchronous event handling.

Pass 4 **(Complete)**

    Cross platform asynchronous support.

Pass 5 **(Complete)**

    Asynchronous event handling.

Pass 6 **(Complete)**

    Refactor deferred for event support.

Pass 7 **(Complete)**

    Add usage guides and API specifications for all libraries.

Pass 8 *(Current Pass)*

    Update all tests to match new specifications.

Pass 9

    Update all libraries for test compliance.

Pass 10

    Expand code comment documentation.

Pass 11

    Add usage guide and API specifications for persistent storage library.

Pass 12

    Add tests for persistent storage engine library.

Pass 13

    Add persistent storage engine library.

Pass 14

    Package for NPM.

Usage Examples
==============

Modelo.js
---------

The modelo.js library contains the core object definition logic that supports
a simplified inheritance and multiple inheritance model for JavaScript objects.
Inheritance is performed by copying the prototypes and constructors of inherited
objects into a new composite object that can be safely altered and extended
without modifying the inherited objects. As a trivial example::

    var Animal, Dog, Bird, Chimera, myPet;

    // Use define to create a new modelo object.
    Animal = model.define();

    // Constructors can be extended.
    Dog = Animal.extend();

    Dog.prototype.woof = function () {

        console.log("woof");

    };

    // Custom constructors can be passed to define and extend.
    // Constructors should accept an object literal as an argument.
    // This object literal will contain all the values given at creation time.
    Bird = Animal.extend(function (options) {

        this.wingspan = options.wingspan || "6 feet";

    });

    Bird.prototype.chirp = function () {

        console.log("chirp");

    };

    // Inheritance precedence flows left to right. That is, Bird will overwrite
    // Dog in the event of a conflict.
    // All prototype properties and constructors are inherited.
    Chimera = modelo.define(Dog, Bird);

    // Instances are created with the new keyword.
    myPet = new Chimera({wingspan: "8 feet"});

    myPet.woof() // Console Output: "woof"
    myPet.chirp() // Console Output: "chirp"

    myPet.wingSpan; // "8 feet"

    // Use the recursive isInstance method for type detection if needed.
    myPet.isInstance(Chimera); //true
    myPet.isInstance(Dog); // true
    myPet.isInstance(Bird); // true
    myPet.isInstance(Animal); // true

For more detailed usage guides and API specifications, see the docs directory.

Setup Instructions
==================

This library is designed from the beginning to operate in as many JavaScript
environments as possible. Particularly, Node.js and the browser are key targets.
Loading this library in the different environments should be relatively
straightforward.

Node.js
-------

If loading in Node.js, simply require the file you need from the modelo
directory. It works just like that.

Browser (<script>)
------------------

Normal browser rules apply. Simply <script> tag in the libraries you need in the
proper order. It works just like that.

Browser (AMD)
-------------

Simply add the file you need as a dependency. It works just like that.

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

Mocha and Expect
----------------

Mocha and Expect are included with this repository for convenience. Both
libraries are distributed by their original authors under the MIT license.
Each library contains the full license text and original copyright notice.

Contributors
============

Style Guide
-----------

This library needs to be not only cross-platform compatible but also backwards
compatible as much as possible when it comes to browser environments. For this
reason, all code in this repository must validate with JSLint.

Testing
-------

Test coverage is essential to backing up the claim that this library is
compatible across all JavaScript environments. Unit tests are this repository's
guarantee that all components function as advertised in the environment. For
this reason, all code this repository must be tested using the chosen unit
testing library: Mocha.js. The chosen assertion library to use with Mocha
for this project is Expect.js. Mocha and Expect have been chosen for their
cross-platform compatibility.

For convenience and portability, both Mocha and Express are included in this
repository. For further convenience, browser based test runners have also been
included for both <script> and AMD loading.

Commit Messages
---------------

All commit messages in this repository should conform with the commit message
pattern detailed in
`this document <https://github.com/StandardsDriven/Repository>`_.

Contributor's Agreement
-----------------------

All contribution to this project are protected by the contributors agreement
detailed in the CONTRIBUTING file. All contributors should read the file before
contributing, but as a summary::

    You give us the rights to distribute your code and we promise to maintain
    an open source release of anything you contribute.
