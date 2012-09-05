/*global require, define, module

*/
(function (factory) {
    "use strict";

    var env = factory.env,
        def = factory.def,
        deps = {
            amd: [],
            node: [],
            browser: []
        };

    def.call(this, 'Modelo', deps[env], function () {

        var define;

        define = function () {

            var args = Array.prototype.slice.call(arguments),
                Modelo,
                x,
                p;

            Modelo = function (options) {

                var y;

                options = options || {};

                // Iterate through constructor functions and call them in the
                // current context.
                for (y = 0; y < args.length; y = y + 1) {
                    args[y].call(this, options);
                }

            };

            // Iterate through inherited objects and leach properties from
            // their prototypes.
            for (x = 0; x < args.length; x = x + 1) {

                for (p in args[x].prototype) {

                    if (args[x].prototype.hasOwnProperty(p)) {

                        Modelo.prototype[p] = args[x].prototype[p];

                    }

                }

            }

            Modelo.extend = function () {

                var args = Array.prototype.slice.call(arguments);

                args.splice(0, 0, Modelo);

                return define.apply({}, args);

            };

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
