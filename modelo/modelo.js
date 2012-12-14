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
(function (ctx, factory) {
    "use strict";

    var env = factory.env,
        def = factory.def,
        deps = {
            amd: [],
            node: [],
            browser: []
        };

    def.call(ctx, 'Modelo', deps[env], function () {

        var define;

        // Object constructor generation is wrapped in this scope for several
        // reasons. The primary reason is that is allows the object constructor
        // access to special scope that privately maintains the inheritance
        // chain.
        //
        // A secondary reason for this scope is that it allows the package
        // to operate in multiple programming patterns. For example, all of
        // the following lines of code are equivalent::
        //
        //      Modelo();
        //      new Modelo();
        //      Modelo.define();
        //      new Modelo.define();
        define = function () {

            var args = Array.prototype.slice.call(arguments),
                Modelo,
                x,
                p;

            // This is the new object constructor that will be returned by a
            // call to `define`. All it does is iterate through the constructors
            // passed into `define` and treats them each like a constructor
            // function. Each constructor is called with the context of the
            // current instance so that any references to `this` in a
            // constructor will always reference the current object.
            Modelo = function (options) {

                var y;

                options = options || {};

                // Iterate through constructor functions and call them in the
                // current context.
                for (y = 0; y < args.length; y = y + 1) {
                    args[y].call(this, options);
                }

            };

            // This loop performs the bulk of the inheritance model. It iterates
            // over the prototypes of the constructors passed into `define` and
            // attaches each item to the new constructor's prototype.
            for (x = 0; x < args.length; x = x + 1) {

                for (p in args[x].prototype) {

                    if (args[x].prototype.hasOwnProperty(p)) {

                        Modelo.prototype[p] = args[x].prototype[p];

                    }

                }

            }

            // This method is attached directly to the constructor being
            // returned so that is is used how you might use a class method.
            // The `extend` method is simply a wrapper around `define` that
            // adds the currently generated constructor as the first item in
            // the inheritance chain. To illustrate, assume there is a Modelo
            // called Animal that has been defined. The two following
            // statements will perform identically::
            //
            //      Fish = Animal.extend();
            //      Fish = Modelo.define(Animal);
            //
            // It just comes down to a matter style usage. For example, the
            // first pattern using `extend` works well for code that needs to
            // look like it is using classical inheritance. The second, however,
            // is equally useful when making use of Mix-In objects to add
            // boilerplate features to objects.
            Modelo.extend = function () {

                var args = Array.prototype.slice.call(arguments);

                args.splice(0, 0, Modelo);

                return define.apply({}, args);

            };

            // Personally, I suggest not using this method for detecting
            // object type. Instead, I suggest detecting features of objects
            // rather than their types. Regardless, I've implemented this
            // method because there may be times when it is absolutely
            // required to scan the inheritance chain an determine if an
            // an object is derived from a particular constructor.
            //
            // Best case is that the object is a direct instance of the
            // given constructor. In this case the method return true
            // before anything else.
            //
            // Worst case is that the method must recursively scan back
            // against the inheritance chains of all inherited constructors.
            // It would be difficult to create an inheritance chain complex
            // enough that this method would actually affect runtime
            // performance, but it is a possibility.
            Modelo.prototype.isInstance = function (f) {

                var x;

                if (f === Modelo) {
                    return true;
                }

                // This args variable references the args
                // passed into the Modelo definition. In
                // other words, it is a list of all
                // constructors used in the creation of
                // this Modelo.
                for (x = 0; x < args.length; x = x + 1) {
                    if (f === args[x]) {
                        return true;
                    }

                    if (!!args[x].prototype.isInstance &&
                            args[x].prototype.isInstance(f)) {
                        return true;
                    }
                }

                return false;

            };

            return Modelo;

        };

        // Specification calls for allowing the following:
        //
        // new Modelo();
        // Modelo();
        // Modelo.define();
        define.define = define;

        // Define and return the module.
        return define;

    });

}(this, (function (ctx) {
    "use strict";

    var currentEnvironment,
        generator;

    // Check the environment to determine the dependency management strategy.

    if (typeof define === "function" && !!define.amd) {

        currentEnvironment = 'amd';

    } else if (typeof require === "function" &&
                        module !== undefined && !!module.exports) {

        currentEnvironment = 'node';

    } else if (ctx.window !== undefined) {

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

    }());


    return {
        env: currentEnvironment,
        def: generator
    };

}(this))));
