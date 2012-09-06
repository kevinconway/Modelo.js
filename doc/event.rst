======================
Event.js Documentation
======================

.. contents::

Description
===========

The event.js library exposes a Modelo object that provides asynchronous events.
The Event object can be both extended and and mixed into object definitions.

Usage Examples
==============

Adding asynchronous events to custom Modelo objects is as simple as adding the
Event object to the inheritance chain::

    var Person = Modelo.define(Event, function (options) {

        this.name = options.name || "Juan Pérez";

    });

Alternatively, the Event object may be extended directly::

    var Person = Event.extend(function (options) {

        this.name = options.name || "Juan Pérez";

    });

Events can be added to any Modelo object this way.

Registering And Triggering Events
---------------------------------

Once the Event object is added to an inheritance chain, it's time to start
adding and triggering events. Below is a sample usage for how events might be
used. However, the actual events that an object triggers are defined by the
developer. The Event object, itself, supports any event needed.

::

    var Person, myPerson;

    Person = Modelo.define(Event, function (options) {

        this.name = options.name || "Juan Pérez";

    });

    myPerson = new Person();

    // Create a callback for a "change" event that logs
    // the current name of the person to the console.
    myPerson.on("change", function () {
        console.log(myPerson.name);
    })

    myPerson.name = "John Smith";
    myPerson.trigger("change");

    // Console Output: "John Smith"

An important detail to note is that events are deferred using the defer.js
library and will execute at the next available event cycle.

Unregistering Events
--------------------

Removing event callbacks is virtually identical to creating them::

    var Person, myPerson;

    Person = Modelo.define(Event, function (options) {

        this.name = options.name || "Juan Pérez";

    });

    myPerson = new Person();

    // Create a callback for a "change" event that logs
    // the current name of the person to the console.
    myPerson.on("change", function () {
        console.log(myPerson.name);
    })

    myPerson.name = "John Smith";
    myPerson.trigger("change");

    myPerson.off("change");
    myPerson.trigger("change");

    // Console Output: "John Smith"
    // Note that this is outputted only once for the first trigger.

Unregistering events can grow in complexity and specificity depending on the
needs of the developer. See the below API reference for more details on how
the Event object handles unregistering events.

API Reference
=============

Exports
-------

This module exports a single Modelo objects that can be used as is, extended
directly, or mixed into other Modelo objects. In a Node.js or AMD environment
the object can simply be required::

    var Event = require('event');

    typeof Event.extend === "function"; // true

In a browser environment, the `Event` object is made available under the
global `Modelo` object at `Modelo.Event`::

    typeof Modelo.Event.extend === "function"; // true

All instances of object inheriting from the Event object gain a standard set
of event handling functionality.

on(event, callback[, context])
------------------------------

*Aliases: bind*

The `on` function is used to register callbacks to object events. The argument
it accepts are:

-   event

    The name of the event to listen for.

-   callback

    The function to run when the even is triggered.

-   context (optional)

    The value of the `this` keyword when the function runs.

off(event[, callback[, context]])
---------------------------------

*Aliases: unbind*

The `off` function is used to unregister callbacks to object events. The argument
it accepts are:

-   event

    The name of the event to unregister.

-   callback (optional)

    A reference to the callback function that should be removed.

-   context (optional)

    A reference to the original context given to the `on` function.

Calling `off` with only the event name will remove all callbacks for that event.

Calling `off` with the event and a callback reference will only remove the
specified callback from the event.

Calling `off` with the event, callback reference, and context reference will
only remove callbacks from the event that match both the reference and the
context.

trigger(event)
--------------

*Aliases: fire*

The `trigger` function results in all callbacks for the given event to be
executed at the next available event cycle. There is no guaranteed execution
order of callbacks.
