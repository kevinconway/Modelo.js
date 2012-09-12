/*
The MIT License (MIT)
Copyright (c) 2012 Kevin Conway

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*global require, define, module

*/
(function (factory) {
    "use strict";

    var env = factory.env,
        def = factory.def,
        deps = {
            amd: ['./modelo.js', './event.js', './defer.js'],
            node: ['./modelo.js', './event.js', './defer.js'],
            browser: ['Modelo', 'Modelo/Event', 'Modelo/defer']
        };

    def.call(this, 'Modelo/Deferred', deps[env], function (Modelo, Event, defer) {

        var Deferred,
            DeferredObject,
            PromiseObject,
            PromiseCollectionObject,
            callWithValue;

        // This specialized scope is used later on to allow function that are
        // executed asynchronously to be passed an input value.
        callWithValue = function (fn, value) {

                return function () {

                    fn(value);

                };

            };

        // PromiseObjects in this context are specialized wrappers around
        // DeferredObjects that limit what actions can be performed on the
        // deferred. Basically the intent is to prevent the manipulation or
        // premature resolution/error of a deferred at runtime.
        //
        // Yes, I have read the proposed commonJS specification for promises.
        // I've purposefully chosen to break from the current proposals because
        // A) none of them are ratified yet and B) they all over complicate the
        // purpose of a promise.
        //
        // In this module, promises are simply limited interfaces to a deferred.
        // Promises do not expose a set of half-baked flow control functions.
        //
        // They simply allow interactions with a DeferredObject which is
        // documented below.
        PromiseObject = Modelo.define(function (options) {

            this.callback = function (fn) {
                options.deferred.callback(fn);
                return this;
            };
            this.done = this.callback;
            this.succeess = this.callback;

            this.errback = function (fn) {
                options.deferred.errback(fn);
                return this;
            };
            this.failure = this.errback;
            this.error = this.errback;

            this.resolved = function () {
                return options.deferred.resolved;
            };
            this.failed = function () {
                return options.deferred.failed;
            };
            this.completed = function () {
                return options.deferred.completed;
            };

            this.value = function () {
                return options.deferred.value;
            };

        });

        // Deferreds are another construct that tend to be over complicated.
        //
        // For example, in Twisted Python's implementation of a deferred
        // (http://twistedmatrix.com/documents/current/core/howto/defer.html#auto3)
        // the callbacks and errbacks registered with the deferred are called
        // in sequence and the choice of executing a callback or errback is
        // determined by the result of the previously executed callback or
        // errback. There may, indeed, be a million use cases for this type of
        // logic but they have mixed flow control with their deferred
        // implementation.
        //
        // In this module, deferreds do one thing only: represent a future
        // resource.
        //
        // When that resource is ready all callback functions are
        // executed asynchronously, in no given order, and with the resolved
        // value as a single input parameter.
        //
        // When that resource is failed to load all errback function are
        // executed asynchronously, in no given order, and with the error
        // that caused the failure as a single input parameter.
        DeferredObject = Event.extend(function (options) {

            this.callbacks = [];
            this.errbacks = [];
            this.resolved = false;
            this.failed = false;
            this.completed = true;

        });

        // This method, and its aliases `success` and `done`, can be used
        // to register a callbcak function with the deferred. All callbacks
        // registered using this method, or its aliases, are passed in a
        // single value as input. This input parameter is the resolved
        // value for the deferred.
        //
        // If the value of the deferred is unimportant to the callback
        // it can, alternatively, be bound to the `success` and `done`
        // events that are emitted.
        DeferredObject.prototype.callback = function (fn) {

            if (this.resolved === true) {
                defer(callWithValue(fn, this.value));
                return this;
            }

            if (typeof fn === "function") {
                this.callbacks.push(fn);
            }

            return this;

        };
        DeferredObject.prototype.succeess = DeferredObject.prototype.callback;
        DeferredObject.prototype.done = DeferredObject.prototype.callback;


        // This method, and its aliases `failure` and `error`, can be used
        // to register callbacks with the deferred that are executed when
        // an error is thrown. Callbacks registered using this method, and
        // its aliases, are passed a single input parameter that contains
        // the error that was thrown.
        //
        // If the value of the error is unimportant there is the option
        // of binding the callback to the `fail`, `failure`, and `error`
        // events that are triggered.
        DeferredObject.prototype.errback = function (fn) {

            if (this.failed === true) {
                defer(callWithValue(fn, this.value));
                return this;
            }

            if (typeof fn === "function") {
                this.errbacks.push(fn);
            }

            return this;

        };
        DeferredObject.prototype.failure = DeferredObject.prototype.errback;
        DeferredObject.prototype.error = DeferredObject.prototype.errback;


        // This method is used to mark the deferred as resolved and
        // to execute all the success callbacks registered. The value
        // passed to this method is the value that will be passed to
        // all callbacks.
        //
        // This method only triggers the callbacks once after which
        // neither it nor the `fail` method have any effect.
        DeferredObject.prototype.resolve = function (value) {

            var x;

            if (this.complete === true) {
                return this;
            }

            this.resolved = true;
            this.completed = true;
            this.value = value;

            for (x = 0; x < this.callbacks.length; x = x + 1) {

                defer(callWithValue(this.callbacks[x], value));

            }

            this.trigger('success').trigger('done');
            this.trigger('complete');

            return this;

        };

        // This method is used to mark the deferred as failed and
        // to execute all the failure errbacks registered. The error value
        // passed to this method is the value that will be passed to
        // all errbacks.
        //
        // This method only triggers the errbacks once after which
        // neither it nor the `resolve` method have any effect.
        DeferredObject.prototype.fail = function (value) {

            var x;

            if (this.complete === true) {
                return this;
            }

            this.failed = true;
            this.completed = true;
            this.value = value;

            for (x = 0; x < this.errbacks.length; x = x + 1) {

                defer(callWithValue(this.errbacks[x], value));

            }

            this.trigger('fail').trigger('failure').trigger('error');
            this.trigger('complete');

            return this;

        };

        // Deferreds should never be returned directly to avoid the potential
        // of runtime manipulation. Instead, return the value of this method
        // any time that you would normally want to return the deferred.
        DeferredObject.prototype.promise = function () {

            return new PromiseObject({"deferred": this});

        };

        // Admittedly, this construct borders on flow control. Promise
        // collections basically allow for the combination of multiple
        // promises into a single promise that resolved when all the contained
        // promises have been resolved. Likewise, the collection fails when
        // any of the contained promises fail.
        //
        // Unlike standard promises, the value passed to succes callbacks
        // are always object literals. These object literals contain key=>value
        // pairs of the values returned by the contained callbacks. The keys
        // are determined when the promises are given to the promise collection.
        //
        // For example, assume that p1, p2, and p3 are promises returned by
        // asynchronous functions that will be resolved to the values 1, 2, and
        // 3 respectively::
        //
        //      var collection = new PromiseCollectionObject({
        //          "p1": p1,
        //          "p2": p2,
        //          "p3": p3
        //      });
        //
        //      collection.callback(function (values) { console.log(values); });
        //
        //      // Some time later...
        //      // CONSOLE OUTPUT: {"p1": 1, "p2": 2, "p3": 3}
        PromiseCollectionObject = DeferredObject.extend(function (options) {

            this.promiseCollection = {};
            this.numberOfPromises = 0;
            this.numberOfResolvedPromises = 0;

            var x;

            for (x in options.promises) {

                if (options.promises.hasOwnProperty(x)) {

                    this.add(x, options.promises[x]);

                }

            }

        });

        // This method can be used to add promises to the collection after
        // the initial creation of the collection. As an important note,
        // it currently fails silently if you try to use it after the
        // the collection has already been resolved or failed.
        PromiseCollectionObject.prototype.add = function (key, promise) {

            this.promiseCollection[key] = promise;
            this.numberOfPromises = this.numberOfPromises + 1;

            var op = this;

            promise.callback(function (value) {

                var x,
                    finalValue = {};

                op.numberOfResolvedPromises = op.numberOfResolvedPromises + 1;

                if (op.numberOfResolvedPromises >= op.numberOfPromises) {

                    for (x in op.promiseCollection) {

                        if (op.promiseCollection.hasOwnProperty(x)) {

                            finalValue[x] = op.promiseCollection[x].value();

                        }

                    }

                    op.resolve(finalValue);

                }

            });

            promise.errback(function (err) {

                op.fail(err);

            });

            return this;

        };

        // This exposes an interface identical to a promise except
        // it adds the `add` method.
        PromiseCollectionObject.prototype.promise = function () {

            var promise = new PromiseObject({"deferred": this}),
                op = this;

            promise.add = function (key, value) {

                op.add(key, value);
                return this;

            };

            return promise;

        };

        // Similar to other modules in this package, the interface returned
        // by this module is a set of wrappers around the actual objects.
        //
        // In this case deferred objects can be created in any of the following
        // ways::
        //
        //      new Deferred();
        //      Deferred();
        //      new Deferred.Deferred();
        //      Deferred.Deferred();
        //
        // The choice comes down to style and preference.
        Deferred = function () {
            return new DeferredObject();
        };
        Deferred.Deferred = Deferred;

        // Deferred.Promise exposes a secondary interface for creating promises.
        // Using the `promise` method of a deferred and creating a new promise
        // object while passing in your deferred have the same effect.
        Deferred.Promise = function (d) {
            return new PromiseObject({"deferred": d});
        };

        // Expects a key=>value store of promises and outputs an extended
        // promise interface that contains the `add` method.
        Deferred.PromiseCollection = function (promises) {

            promises = promises || {};

            return new PromiseCollectionObject({"promises": promises}).promise();

        };

        return Deferred;

    });

}.call(this, (function () {
    "use strict";

    var currentEnvironment,
        generator;

    // Check the environment to determine the dependency management strategy.

    if (typeof define === "function" && !!define.amd) {

        currentEnvironment = 'amd';

    } else if (typeof require === "function" &&
                        module !== undefined && !!module.exports) {

        currentEnvironment = 'node';

    } else if (this.window !== undefined) {

        currentEnvironment = 'browser';

    }

    generator = (function () {
        switch (currentEnvironment) {

        case 'amd':

            // If RequireJS is used to load this module then return the global
            // define() function.
            return function (name, deps, mod) {
                define(deps, mod);
            };

        case 'node':

            // If this module is loaded in Node, require each of the
            // dependencies and pass them along.
            return function (name, deps, mod) {

                var x,
                    dep_list = [];

                for (x = 0; x < deps.length; x = x + 1) {

                    dep_list.push(require(deps[x]));

                }

                module.exports = mod.apply(this, dep_list);

            };

        case 'browser':

            // If this module is being used in a browser environment first
            // generate a list of dependencies, run the provided definition
            // function with the list of dependencies, and insert the returned
            // object into the global namespace using the provided module name.
            return function (name, deps, mod) {

                var namespaces = name.split('/'),
                    root = this,
                    dep_list = [],
                    current_scope,
                    current_dep,
                    i,
                    x;

                for (i = 0; i < deps.length; i = i + 1) {

                    current_scope = root;
                    current_dep = deps[i].split('/');

                    for (x = 0; x < current_dep.length; x = x + 1) {

                        current_scope = current_scope[current_dep[x]] || {};

                    }

                    dep_list.push(current_scope);

                }

                current_scope = root;
                for (i = 1; i < namespaces.length; i = i + 1) {

                    current_scope = current_scope[namespaces[i - 1]] || {};

                }

                current_scope[namespaces[i - 1]] = mod.apply(this, dep_list);

            };

        default:
            throw new Error("Unrecognized environment.");

        }

    }.call());


    return {
        env: currentEnvironment,
        def: generator
    };

}.call(this))));
