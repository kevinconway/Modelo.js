=======================
Modelo.js Documentation
=======================

The documents in this directory contain detailed usage guides and full API
documentation for each of the Modelo.js libraries.

Each document has a one-to-one relationship with a library file. That is,
event.rst is the documentation file for event.js.

Package Contents
================

The Modelo.js package is made up of several modules.

-   modelo.js

    The base library for creating and inheriting objects.

-   defer.js

    Cross platform support for deferring the execution of a function until
    the next cycle of the event loop.

-   event.js

    A modelo mixin that adds support for asynchronous event handling to objects.

-   property.js

    Provides type and constraint validation for object properties.

-   deferred.js

    An implementation of deferred and promise objects for use in asynchronous
    programming.

-   relate.js

    Extension of the property library that allows for modelo objects to be
    linked in an ORM style way.

-   persist.js

    A modelo mixin that adds and API for persistent storage engines that allow
    objects to be saved to and retrieved from, for example, databases or memory.

Documentation Format
====================

Each documentation file is structured in the following format::

    =====
    Title
    =====

    Table Of Contents
    =================

    Description Of Library
    ======================

    Usage Examples
    ==============

    API Reference
    =============
