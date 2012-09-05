=======================
Relate.js Documentation
=======================

.. contents::

Description
===========

The relate.js library exposes an interface for creating relationships between
modelo objects.

Usage Examples
==============

Has One
-------

The relate.js library works in a very similar manner to the property.js library.
Each relationship exposes a getter and setter interface::

    var Person, myPerson, myBestFriend;

    Person = Modelo.define(function (options) {

        this.best_friend = new relationship("hasone", Person);

    });

    myPerson = new Person();
    myBestFriend = new Person();

    myPerson.best_friend(); // undefined

    myPerson.best_friend(myBestFriend);
    myPerson.best_friend(); // myBestFriend object

    myPerson.best_friend(null);
    myPerson.best_friend(); // null

By default, all relationships are nullable. Pass a `false` as an optional third
parameter to enforce a NOT NULL constraint.

Has Many
--------

    var Person, myPerson, myFriend;

    Person = Modelo.define(function (options) {

        this.friends = new relationship("hasmany", Person);

    });

    myPerson = new Person();
    myFriend = new Person();

    myPerson.friends(); // []

    myPerson.friends.add(myFriend);

    myPerson.friends(); // [myFriend]

    myPerson.friends.remove(myFriend);

    myPerson.friends(); // []

API Reference
=============

Exports
-------

The relate.js library exports a function that generates relationship properties.
In Node.js and AMD environments this can be loaded with `require`::

    var relationship = require('relate');

    typeof relationship === "function"; // true

In the browser, the relate.js library will load in the global `modelo` object
under `modelo.relationship`::

    typeof modelo.relationship === "function"; // true

relationship(type, object[, nullable])
--------------------------------------

The relationship function generates a new relationship property. It takes
three arguments:

-   type

    The type of relationship. Currently supported are "hasone" and "hasmany".
    This argument is case insensitive.

-   object

    A reference to the constructor of the related object.

-   nullable (optional)

    True or false to indicate whether or not the relationship can be null.
    The default value is true.
