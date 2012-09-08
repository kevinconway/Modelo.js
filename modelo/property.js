/*global require, define, module

*/
(function (factory) {
    "use strict";

    var env = factory.env,
        def = factory.def,
        deps = {
            amd: ['./modelo.js'],
            node: ['./modelo.js'],
            browser: ['Modelo']
        };

    def.call(this, 'Modelo/Property', deps[env], function (Modelo) {

        var Property, PropertyObject;

        PropertyObject = new Modelo(function (options) {
            this.value = options.value || undefined;
        });

        PropertyObject.prototype.get = function () {
            return this.value;
        };

        PropertyObject.prototype.set = function (val) {
            this.value = val;
        };

        Property = function () {

            var args = Array.prototype.slice.call(arguments),
                type = "undefined",
                typeValidator,
                Prop;

            if (args.length > 0 && typeof args[0] === "string") {
                type = args.shift();
            }

            switch (type) {

            case "undefined":
                typeValidator = function (value) {
                    return true;
                };
                break;

            case "string":
                typeValidator = function (value) {
                    return {
                        valid: typeof value === "string" ||
                                value === null ||
                                isNaN(value),
                        message: "Value must be a string."
                    };
                };
                break;

            case "number":
                typeValidator = function (value) {
                    return {
                        valid: typeof value === "number" ||
                                value === null ||
                                isNaN(value),
                        message: "Value must be a number."
                    };
                };
                break;

            case "boolean":
                typeValidator = function (value) {
                    return {
                        valid: typeof value === "boolean" ||
                                value === null ||
                                isNaN(value),
                        message: "Value must be a boolean."
                    };
                };
                break;
            }

            args.splice(0, 0, typeValidator);

            Prop = new PropertyObject();

            return function (val) {

                var x, result;

                if (val === undefined) {
                    return Prop.get();
                }

                for (x = 0; x < args.length; x = x + 1) {

                    result = args[x](val);

                    if (result === undefined) {

                        throw new Error("Validation function did not return a value.");

                    }

                    if (result === false) {

                        throw new Error("Property validation failed for value: " + val);

                    }

                    if (result.valid === false) {

                        throw new Error(result.message);

                    }

                }

                Prop.set(val);

            };

        };

        Property.nullable = function (n) {

            if (n === false) {

                return function (val) {

                    return {

                        valid: val !== null &&
                                isNaN(val) !== true,
                        message: "Value cannot be null. (" + val + ")"

                    };

                };

            }

            return function (val) {
                return true;
            };

        };

        Property.max_length = function (n) {

            n = n || 0;

            return function (val) {

                return {

                    valid: val.length <= n,

                    message: "Value must be at most " + n + " long."

                };

            };

        };

        Property.min_length = function (n) {

            n = n || 0;

            return function (val) {

                return {

                    valid: val.length >= n,

                    message: "Value must be at least " + n + " long."

                };

            };

        };

        Property.max_value = function (n) {

            n = n || 0;

            return function (val) {

                return {

                    valid: val <= n,

                    message: "Value must be at most " + n + "."

                };

            };

        };

        Property.min_value = function (n) {

            n = n || 0;

            return function (val) {

                return {

                    valid: val >= n,

                    message: "Value must be at least " + n + "."

                };

            };

        };

        Property.define = Property;

        return Property;

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
