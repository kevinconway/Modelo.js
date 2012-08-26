/*global require, define, module

*/
(function (factory) {
    "use strict";

    var env = factory.env,
        def = factory.def,
        deps = {
            amd: ['./event.js', './defer.js'],
            node: ['./event.js', './defer.js'],
            browser: ['modelo/Event', 'modelo/defer']
        };

    def.call(this, 'modelo/Deferred', deps[env], function (Event, defer) {

        var Deferred,
            DeferredObject,
            callWithValue;

        callWithValue = function (fn, value) {

                return function () {

                    fn(value);

                };

            };

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

            var thisDeferred = this,
                promise = {};

            promise.callback = function (fn) {
                thisDeferred.callback(fn);
                return this;
            };
            promise.done = promise.callback;
            promise.succeess = promise.callback;

            promise.errback = function (fn) {
                thisDeferred.errback(fn);
                return this;
            };
            promise.failure = promise.errback;
            promise.error = promise.errback;

            promise.resolved = function () {
                return thisDeferred.resolved;
            };
            promise.failed = function () {
                return thisDeferred.failed;
            };
            promise.completed = function () {
                return thisDeferred.completed;
            };

            return promise;

        };



        Deferred = DeferredObject;
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
