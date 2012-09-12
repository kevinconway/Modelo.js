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
            amd: ['./modelo.js', './defer.js'],
            node: ['./modelo.js', './defer.js'],
            browser: ['Modelo', 'Modelo/defer']
        };

    def.call(this, 'Modelo/Event', deps[env], function (Modelo, defer) {

        var EventMixin, emptyContext;

        emptyContext = {};

        // The Event object is a Modelo object that provides asynchronous
        // events. While new instances of Event can be created directly, it
        // is intended as more of a Mix-In object that can be added to any
        // inheritance chain.
        EventMixin = Modelo.define(function (options) {

            this.events = {};

        });

        // This method, and its alias `bind`, are used to register callbacks
        // to a particular event.
        //
        // Event callbacks passed no parameters. If callbacks should run
        // in a special context, and object instance for example, then
        // a reference to the context should be passed in as an optional
        // third argument. In the absence of a special context a default,
        // empty context is used.
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
        EventMixin.prototype.bind = EventMixin.prototype.on;

        // This method, and its alias `unbind`, are used to unregister
        // a callback from an event. This method uses a four-way logic
        // to determine which callbacks to remove.
        //
        // If no arguments are arguments are passed in then all callback
        // for all events are unregistered.
        //
        // If an event is the only argument then all callbacks for that
        // event are unregistered.
        //
        // If an event and a reference to a callback are given then all
        // callbacks that equal the reference are removed from the specified
        // event.
        //
        // If an event, callback reference, and context reference are given
        // then only the callbacks that match both references are removed
        // from the event.
        //
        // It all depends on how specific you really need to be when
        // removing call backs from an object.
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
        EventMixin.prototype.unbind = EventMixin.prototype.off;

        // This method, and its alias `fire`, are used to start the execution
        // of callbacks attached to an event. All callbacks are deferred using
        // the defer.js module and are not guaranteed an execution order.
        EventMixin.prototype.trigger = function (event) {

            var x,
                callback,
                context,
                callWIthContext;

            // This special scope is used to ensure that function executed
            // asynchronously are done so with the appropriate context.
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
        EventMixin.prototype.fire = EventMixin.prototype.trigger;


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
