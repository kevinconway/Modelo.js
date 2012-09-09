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

        callWithValue = function (fn, value) {

                return function () {

                    fn(value);

                };

            };

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

        DeferredObject = Event.extend(function (options) {

            this.callbacks = [];
            this.errbacks = [];
            this.resolved = false;
            this.failed = false;
            this.completed = true;

        });

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

        DeferredObject.prototype.promise = function () {

            return new PromiseObject({"deferred": this});

        };

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

        PromiseCollectionObject.prototype.promise = function () {

            var promise = new PromiseObject({"deferred": this}),
                op = this;

            promise.add = function (key, value) {

                op.add(key, value);
                return this;

            };

            return promise;

        };

        Deferred = function () {
            return new DeferredObject();
        };
        Deferred.Deferred = Deferred;

        Deferred.Promise = function (d) {
            return new PromiseObject({"deferred": d});
        };

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
