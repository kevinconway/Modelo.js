======================
Defer.js Documentation
======================

.. contents::

Description
===========

The defer.js library provides a platform independent process for scheduling
functions to execute at the next available event cycle. In Node.js this
functionality is provided by process.nextTick and, in that environment, this
library becomes a thin wrapper around process.nextTick.

In browser environments, this library leverages window.postMessage to schedule
events. If the current browser environment does not support window.postMessage
the library falls back to setTimeout.

Usage Examples
==============

Using the defer.js library is nearly identical to using the Node.js
process.nextTick::

    function logLater() {

        console.log("Second");

    }

    defer(logLater);
    console.log("First");

    // Console Output: "First"
    // Console Output: "Second"

Deferring function with arguments
---------------------------------

Just as in the Node.js environment, there is no direct way to pass arguments
to the deferred function. Instead, function wrappers should be used to
provide this functionality::

    function log(value) {

        console.log(value);

    }

    defer(function () {
        log("Second");
    });

    log("First");

    // Console Output: "First"
    // Console Output: "Second"

API Reference
=============

Exports
-------

This module exports a single function. When required in a Node.js or AMD
environment, the `defer` function will be the only value::

    var defer = require('defer');

    typeof defer === "function"; // true

In vanilla, browser environments the `defer` function is injected into the
global `modelo` object at `modelo.defer`::

    typeof modelo.defer === "function"; // true

defer(fn)
---------

Calls to `defer` will delay the execution of a function until the next available
event cycle.
