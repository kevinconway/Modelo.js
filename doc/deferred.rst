=========================
Deferred.js Documentation
=========================

.. contents::

Description
===========

The Deferred.js library is a Modelo object that can be used to help simplify
asynchronous programming patterns. The Deferred, and the limited promise
interface that it generates, can be used to represent a value that will be
available in the future.

There are many different implementations and APIs for Deferred objects and
promises. In this library a Deferred represents a *single* value, or resource,
that will be available at some point in the future. All callbacks registered
with a Deferred are called with the same value just as all errbacks registered
are called with the same error. Callbacks and errbacks are not guaranteed to
execute in any particular order.

All Deferred objects can generate a promise interface. Promises are simply
limited interfaces to Deferred objects. Promises expose all of a Deferred object
with the exception of allowing the resolution or failure of a Deferred.

To support more complex asynchronous patterns, promise collections may be used
to aggregate promises into a single promise. This allows promises to be
"chained" in such a way that callbacks and errbacks are only triggered after all
promises have been resolved.

Usage Examples
==============

Deferred Objects
----------------

Deferred objects can be used to manage values, or resources, which are not yet
available. Deferred objects are typically created inside of functions that would
typically accept a callback as an argument. Rather than accepting a single
callback, create a Deferred and return a promise. To illustrate, this example
will show a use of jQuery's AJAX methods. jQuery, however, is in no way required
for use of this library and is used here only for demonstration purposes.

::

    function getRSS() {

        var Deferred = new Modelo.Deferred(); // new keyword optional

        $.ajax({
            url: "myrss.com",
            success: function (data) {
                Deferred.resolve(data);
            },
            error: function (jqxhr, status, err) {
                Deferred.fail(err);
            }
        });

        return Deferred.promise();

    }

Now the `getRSS function is both asynchronous, returns a Deferred, and allows
for multiple callbacks that make use of the eventual values::

    var rssPromise = getRSS();

    rssPromise.callback(function (value) {
        console.log(value);
    });

    rssPromise.errback(function (err) {
        console.log(err);
    });

Granted, this example is trivial but it is intended to demonstrate the concept
that asynchronous functions can return a promise rather than accepting and
managing callbacks on their own. This dramatically simplifies the process of
acting on the results of asynchronous functions and allows for possibility that
multiple callbacks and errbacks might need to wait for a single value.

Deferred Object Events
----------------------

There may be a scenario in which a function needs to be executed when a promise
is resolved or failed but it does not depend on the value returned by the
promise. In these scenarios events may be used rather than the
standard callback registration::

    var rssPromise = getRSS();

    rssPromise.on("success", function () {
        console.log("SUCCESS");
    });

    rssPromise.on("fail", function () {
        console.log("FAILURE");
    });

The only difference between registering event callbacks and normal callbacks
is that events are not processed with input parameters. That is the only
difference.

Promise Collections
-------------------

There are many scenarios in which callbacks need to be run once a series of
promises have been resolved. To support this developers should use promise
collections. Promise collections expose virtually the same interface as promises
but only resolve when all the contained promises are resolved::

    // Assume these "get" functions are async and return promises.
    var rssPromise = getRSS(),
        jsonPromise = getJSON(),
        htmlPromise = getHTML(),
        collection = new Modelo.Deferred.PromiseCollection();

    collection.add("rss", rssPromise).add("json", jsonPromise);
    collection.add("html", htmlPromise);

    collection.callback(function (value) {
        console.log(value.rss);
        console.log(value.json);
        console.log(value.html);
    });

Promise collections expose all of the same methods as promises with one
addition: the `add` method. The `add` method registers and promise with
the collections and assigns a keyword to the promise.

The biggest difference between promises and promise collections is that
collections resolve with an object containing the values of all the resolved
promises as illustrated above.

API Reference
=============

Exports
-------

The Deferred.js library exports several objects. The primary object exported
is a function that returns a new Deferred object when called (`new` keyword
optional). Attached to this object are the Deferred, Promise, and Promise
Collection objects. In Node.js and AMD environments, this library can be
required::

    var Deferred = require('Deferred');

    typeof Deferred === "function"; // true

    typeof Deferred.Deferred === "function"; // true

    typeof Deferred.Promise === "function"; // true

    typeof Deferred.PromiseCollection === "function"; // true

In a browser environment, the Deferred library will load in the global `Modelo`
object under `Modelo.Deferred`::

    typeof Modelo.Deferred === "function"; // true

Deferred
--------

The Deferred object can be constructed with the `new` keyword and requires no
arguments.

callback(fn)
^^^^^^^^^^^^

*Aliases: success, done*

Registers a callback function to be executed upon resolution of this Deferred.
Functions registered with `callback` will be passed the value of the Deferred
as an argument when called. Functions registered after the Deferred has already
been resolved will be automatically executed.

All callbacks are launched asynchronously using the defer.js library.

errback(fn)
^^^^^^^^^^^

*Aliases: failure, error*

Registers a callback function to be executed upon failure of this Deferred.
Functions registered with `errback` will be passed the value of the error
as an argument when called. Functions registered after the Deferred has already
been failed will be automatically executed.

All errbacks are launched asynchronously using the defer.js library.

complete(fn)
^^^^^^^^^^^^

*Aliases: always, end*

Registers a callback to be executed upon completion, whether success or failure,
of this Deferred. Functions registered with this method are passed the value of
the `resolve` or `fail` methods. Functions registered after the Deferred has
already been completed will be automatically executed.

All complete callbacks are launched asynchronously using the defer.js library.

resolve(value)
^^^^^^^^^^^^^^

Triggers the execution of the callback functions with the given value. This
marks the Deferred as complete and can only be called once.

fail(value)
^^^^^^^^^^^

Triggers the execution of errback functions with the given value. This marks
the Deferred as complete and can only be called once.

promise()
^^^^^^^^^

Generates a promise interface to this Deferred.


Promise
-------

Promise objects can be created with the `new` keyword and accept a Deferred
object as an argument.

Promise objects expose a limited interface to a Deferred object that can be
returned to the caller of a function. The interface it exposes allows developers
to register callbacks and errbacks, but prevents them from calling the `resolve`
or `fail` methods and from changing the final value of the Deferred.

callback(fn)
^^^^^^^^^^^^

*Aliases: success, done*

Registers a callback function to be executed upon resolution of this promise.
Functions registered with `callback` will be passed the value of the promise
as an argument when called. Functions registered after the promise has already
been resolved will be automatically executed.

All callbacks are launched asynchronously using the defer.js library.

errback(fn)
^^^^^^^^^^^

*Aliases: failure, error*

Registers a callback function to be executed upon failure of this promise.
Functions registered with `errback` will be passed the value of the error
as an argument when called. Functions registered after the promise has already
been failed will be automatically executed.

All errbacks are launched asynchronously using the defer.js library.

complete(fn)
^^^^^^^^^^^^

*Aliases: always, end*

Registers a callback to be executed upon completion, whether success or failure,
of this promise. Functions registered with this method are passed the value of
the `resolve` or `fail` methods. Functions registered after the promise has
already been completed will be automatically executed.

All complete callbacks are launched asynchronously using the defer.js library.

Promise Collection
------------------

Promise collections can be created with the `new` keyword.

Promise collections are Modelo objects and can be given an argument named
"promises" which contains an object literal. The object should contain key value
pairs of promises and the keys under which those promise values should be
exposed.

Promise collections are extended from promises and expose a virtually identical
interface.

callback(fn)
^^^^^^^^^^^^

*Aliases: success, done*

Registers a callback function to be executed upon resolution of all promises
in this collection. Callbacks will be passed an object literal containing key
value pairs of values. The keys are determined by the developer when promises
are added to the collection at construction time or through the `add` method.

All callbacks are launched asynchronously using the defer.js library.

errback(fn)
^^^^^^^^^^^

*Aliases: failure, error*

Registers a callback function to be executed upon failure of any promise in this
promise collection. Errbacks will be passed an object literal containing key
value pairs for the errors of each promise that failed. Promises in this
collections that did not fail will be absent from the object literal.

All errbacks are launched asynchronously using the defer.js library.

complete(fn)
^^^^^^^^^^^^

*Aliases: always, end*

Registers a callback function to be executed upon completion of all promises
in this collection. Callbacks will be passed an object literal containing key
value pairs that contain all values and errors generated the promises. The keys
are determined by the developer when promises are added to the collection at
construction time or through the `add` method.

All complete callbacks are launched asynchronously using the defer.js library.

add(key, promise)
^^^^^^^^^^^^^^^^^

Adds a promise to the collections under the given key. This method cannot be
called after a promise collection has already completed.
