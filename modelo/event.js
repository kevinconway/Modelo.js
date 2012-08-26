/*global require, define, module

*/
(function (factory) {
    "use strict";

    var env = factory.env,
        def = factory.def,
        deps = {
            amd: ['./modelo.js', './defer.js'],
            node: ['./modelo.js', './defer.js'],
            browser: ['modelo', 'modelo/defer']
        };

    def.call(this, 'modelo/Event', deps[env], function (modelo, defer) {

        var EventMixin, emptyCallback, emptyContext;

        emptyCallback = function () {};
        emptyContext = {};

        EventMixin = modelo.define(function (options) {

            this.events = {};

        });

        EventMixin.prototype.on = function (event, callback, context) {

            if (typeof callback !== "function") {
                return this;
            }

            context = context || emptyContext;

            this.events[event] = this.events[event] || [];

            this.events[event].push({
                "callback": callback,
                "context": context
            });

            return this;

        };

        EventMixin.prototype.off = function (event, callback, context) {

            var x,
                newEvents = [];

            if (callback === undefined &&
                context === undefined &&
                event === undefined) {

                this.events = {};
                return this;

            }

            if (callback === undefined && context === undefined) {

                this.events[event].splice(0, this.events[event].length);
                return this;

            }

            if (context === undefined) {

                for (x = 0; x < this.events[event].length; x = x + 1) {

                    if (this.events[event][x].callback !== callback) {

                        newEvents.push(this.events[event][x]);

                    }

                }

                this.events[event].splice(0, this.events[event].length);
                this.events = newEvents;
                return this;

            }

            for (x = 0; x < this.events[event].length; x = x + 1) {

                if (this.events[event][x].callback !== callback &&
                    this.events[event][x].context !== context) {

                    newEvents.push(this.events[event][x]);

                }

            }

            this.events[event].splice(0, this.events[event].length);
            this.events[event] = newEvents;

            return this;

        };

        EventMixin.prototype.trigger = function (event) {

            var x,
                callback,
                context,
                callWIthContext;

            callWIthContext = function (fn, ctx) {

                return function () {

                    fn.call(ctx);

                };

            };

            this.events[event] = this.events[event] || [];

            for (x = 0; x < this.events[event].length; x = x + 1) {

                callback = this.events[event][x].callback;
                context = this.events[event][x].context;

                if (typeof callback === "function") {

                    defer(callWIthContext(callback, context));

                }

            }

            return this;

        };

        // Define and return the module.
        return EventMixin;

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
