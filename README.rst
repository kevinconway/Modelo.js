=========
Modelo.js
=========

**An isomorphic JavaScript object framework.**

*Status: In Early Development*

Usage Examples
==============

Modelo can be used in multiple ways. The most common usage of Model is the
definition of extendable objects that perform automatic validation of property
values. Additionally, property validation may be used outside of Modelo objects
in Plain Old JavaScript Objects.

Object Definitions
------------------

Defining a new object is as simple as calling the Modelo packages `define`
function. The define function is the basis for the Modelo package. It generates
objects through multiple styles.

Basic
^^^^^

The basic style of define is to simply call it with no arguments. This will
return a simple JavaScript object generator with an extend function. Extend can
be used to create objects that inherit all of the current properties of the
generated object. This includes all properties added by a developer after the
initial definition. For example::

    var Person,
        Customer,
        myCustomer;

    Person = Modelo.define();

    Person.prototype.doStuff = function () {
        console.log('I did stuff.');
    };

    Customer = Person.extend();

    myCustomer = new Customer();

    myCustomer.doStuff();
    // Console Output: "I did stuff."

Constructor
^^^^^^^^^^^

Each object may also come with a custom constructor. Defining a constructor
function is as simple as passing a function in as the first argument to the
`define` method. For example::

    var Person;

    Person = Modelo.define(function (options) {
        this.name = options.name || 'Juan Pérez';
    });

Constructor functions should accept a singular `options` object as input and
look for any needed values there. This is primarily to support a much more
useful and dynamic style of object creation detailed below.

Mix-in
^^^^^^

The other style of define is to call it with a set of mix-in objects that should
be included in the new definition. For example::

    var Person,
        Talker,
        Walker,
        Customer;

    Person = Modelo.define(function (options) {
        this.name = options.name || 'Juan Pérez';
    });

    Person.prototype.hello = function () {
        console.log("Hello " + this.name + "!");
    };

    Talker = Modelo.define(function (options) {
        this.language = options.language || 'ES';
    });

    Talker.prototype.speak = function () {
        if (this.language === 'EN') {
            console.log("Hello.")
        } else if (this.language === 'ES') {
            console.log("Hola.")
        } else {
            console.log("...");
        }
    };

    Walker = Modelo.define(function (options) {
        this.legs = options.legs || 2;
    });

    Walker.prototype.walk = function () {
        console.log("These " + this.legs + " boots were made for walkin'.")
    };

    Customer = Modelo.define(Person, Talker, Walker, function (options) {
        console.log("New customer constructed.");
    });

    var myCustomer = new Customer();
    // Console Output: "New Customer constructed."

    myCustomer.walk();
    // Console Output: "These 2 boots were made for walkin'."

    myCustomer.speak();
    // Console Output: "Hola."

    myCustomer.hello();
    // Console Output: "Hello Juan Pérez!"

Define VS Extend
^^^^^^^^^^^^^^^^

The `define` and `extend` functions expose nearly the same functionality. The
above example of mix-in style definition could be written as::

    Customer = Person.extend(Talker, Walker, function (options) {
        console.log("New customer constructed.");
    });

The decision to use one over the other comes down to style. The only important
detail that should be taken into account when using `define` and `extend` is
that constructor functions will be executed in left to right order. That is,
the following definition of ::

    Customer = Person.extend(Talker, Walker, function (options) {
        console.log("New customer constructed.");
    });

    new Customer();

will execute the constructors for Person, then Talker, then Walker, then the
custom constructor function. Likewise, the following definition::

    Customer = Modelo.define(function (options) {
            console.log("New customer constructed.");
        }, Walker, Talker, Person);

    new Customer();

will execute in exactly the reverse order. In other words, `Modelo.define`
provides *slightly* more freedom when it comes to inheritance order than
`extend` is some situations.


Field Validation
----------------

In addition to defining objects, properties with automated validation can also
be defined in or out of Modelo objects. Validated properties can be defined
in a format similar to::

    var Person,
        myPerson;

    Person = Modelo.define(function (options) {
        this.name = Modelo.property('string', {
            min_length: 1,
            max_length: 127,
            nullable: false
        });

        this.name(options.name || 'Juan Pérez');
    });

    myPerson = new Person();
    console.log(myPerson.name());
    // Console Output: "Juan Pérez"

    myPerson.name(null);
    // Throws Error with text: "Property cannot be null."

    myPerson.name('');
    // Throws Error with text: "String must be at least 1 characters long."

    myPerson.name('Jane Smith');
    myPerson.name();
    // Console Output: "Jane Smith"

For details on the various properties available, check out the API documentation
below.

API
===

Modelo.define
-------------

Signature: Modelo.define([constructor, [constructor, [...]]])

This function generates a new object that can be created with the `new` keyword.
It accepts any number of constructor functions as input. Constructor functions
are executed on the new object in the order they are passed in. Anonymous
functions, named functions, and objects previously generated with Modelo.define
may be used as constructors. The `this` property of any function passed in as
a constructor will be bound to the current instance of the defined object, just
as you would expect with regular JavaScript objects.

extend()
--------

Signature: MyObject.extend([constructor, [constructor, [...]]])

This function is attached to all Modelo objects. It exposes the same signature
and functionality as Modelo.define with the exception that the object being
extended is always used as the first constructor. The choice of using extend
over Modelo.define when creating a new object is one of style.

Modelo.property()
-----------------

Signature: Modelo.property([type, [options, [custom_validator, [...]]]])

This function generates Modelo properties. All parameters to this function are
optional.

The `type` parameter is a string that refers to the data type being stored. Each
recognized type is defined in more detail below.

The `options` parameter is an object literal containing the type-specific
configuration options. The options for each type are defined in more detail
below.

The `custom_validator` parameter is a function that accepts, as a parameter, a
proposed value for the property. The custom validation function can return
in two ways. If the validation function returns `true` or `false` then these
will be considered `yes` and `no`, respectively, to the question of "Is this
value valid for this property?". If the answer is `false`, a generic error
message will be used. Optionally, validation functions can return object
literals that contain a `valid` and `message` properties. The `valid`
property is the same `true` or `false` value that would be returned on its own.
the `message` property will be used as the error message in the case of a
`false` value in `valid`.

undefined
^^^^^^^^^

Example Call: Modelo.property() or Modelo.property(undefined)

The undefined data type indicates that there should be no validation placed on
this property. This is useful for adding free-form properties to objects that
expose a getter/setter interface that is consistent with the other, validated,
properties.

There are no options for this data type.

string
^^^^^^

Example Call: Modelo.property("string")

Options Reference:

    -   nullable

        A `true` or `false` indicator of whether or not `null` is an acceptable
        value for this property.

    -   min_length

        The minimum number of characters for an acceptable string.

    -   max_length

        The maximum number of character for an acceptable string.

bool
^^^^

Example Call: Modelo.property("bool") or Modelo.property("boolean")

Options Reference:

    -   nullable

        A `true` or `false` indicator of whether or not `null` is an acceptable
        value for this property.


number
^^^^^^

Example Call: Modelo.property("number")

Options Reference:

    -   nullable

        A `true` or `false` indicator of whether or not `null` is an acceptable
        value for this property.

    -   min_value

        The minimum value for an acceptable number.

    -   max_value

        The maximum value for an acceptable number.

array
^^^^^

Example Call: Modelo.property("array") or Modelo.property("list")

Options Reference:

    -   nullable

        A `true` or `false` indicator of whether or not `null` is an acceptable
        value for this property.

    -   min_length

        The minimum number of elements for an acceptable array.

    -   max_length

        The maximum number of elements for an acceptable array.

    -   content_type

        A Modelo.property that should be used to validate the contents of the
        array.

object
^^^^^^

Example Call: Modelo.property("object")

Options Reference:

    -   nullable

        A `true` or `false` indicator of whether or not `null` is an acceptable
        value for this property.


Setup Instructions
==================

This library is designed from the beginning to operate in as many JavaScript
environments as possible. Particularly, Node.js and the browser are key targets.
Loading this library in the different environments should be relatively
straightforward.

Node.js
-------

If loading in Node.js, simply require the modelo.js file. It works just like
that.

Browser (<script>)
------------------

If loading in the browser through a <script> tag, just make sure that the `src`
attribute of the tag points at modelo.js. It works just like that.

Browser (AMD)
-------------

If loading in the browser through an AMD loader, just ensure that the dependency
string is directed at modelo.js. It works just like that.

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
repository. For further convenience, a browser based test runner has also been
included.

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
