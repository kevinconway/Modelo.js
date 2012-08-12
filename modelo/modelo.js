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

    def.call(this, 'modelo', deps[env], function () {

        var define, property;

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

            return Modelo;

        };

        // Wrap in submodule to allow for better memory use. In this format
        // property generators can exist in a common scope to avoide being
        // redefined on each call to Modelo.property().
        property = (function () {
            var undefined_prop,
                string_prop,
                bool_prop,
                number_prop,
                array_prop,
                validate;

            // This object literal contains all of the built-in property
            // validation functions that can be used by the properties
            // defined below.
            validate = {
                min_length: function (len) {

                    return function (val) {

                        if (String(val).length < len) {

                            return {

                                valid: false,

                                message: "Value must be more than " +
                                            String(len) +
                                            " characters long."

                            };

                        }

                        return true;

                    };

                },

                max_length: function (len) {

                    return function (val) {

                        if (String(val).length > len) {

                            return {

                                valid: false,

                                message: "Value must be less than " +
                                            String(len) +
                                            " characters long."

                            };

                        }

                        return true;

                    };

                },

                not_null: function () {

                    return function (val) {

                        if (val === undefined || val === null || isNaN(val)) {

                            return {
                                valid: false,
                                message: "Value cannot be null."
                            };

                        }

                        return true;
                    };
                },

                min_value: function (v) {

                    return function (val) {

                        if (val < v) {

                            return {

                                valid: false,

                                message: "Value must be more than " +
                                            String(v) + "."

                            };

                        }

                        return true;

                    };

                },

                max_value: function (v) {

                    return function (val) {

                        if (val > v) {

                            return {

                                valid: false,

                                message: "Value must be less than " +
                                            String(v) + "."

                            };

                        }

                        return true;

                    };

                }

            };

            // An undefined property is simply an unvalidated property
            // with a getter and setter interface.
            undefined_prop = function () {

                // Place the actual value within a private and
                // unreachable scope for integrity.
                var prop = {
                    value: undefined,
                    type: "undefined"
                };

                return function (val) {

                    if (val === undefined) {

                        return prop.value;

                    }

                    prop.value = val;

                    // Add the option for fluid interface by returning
                    // the current context.
                    return this;
                };

            };

            string_prop = function (options, validators) {

                var prop = {
                    value: undefined,
                    type: "string"
                };

                return function (val) {

                    var x,
                        result;

                    if (val === undefined) {

                        return prop.value;

                    }

                    // Insert length validators as the last checks before
                    // custom validation functions.
                    if (options.min_length !== undefined) {

                        validators.splice(0, 0, validate.min_length(options.min_length));

                    }

                    if (options.max_length !== undefined) {

                        validators.splice(0, 0, validate.max_length(options.max_length));

                    }

                    // Insert type checking.
                    validators.splice(0, 0, function (value) {

                        if (typeof value !== "string" &&
                            value !== null &&
                            value !== undefined) {
                            return {
                                valid: false,
                                message: "Value must be a string."
                            };
                        }

                        return true;

                    });

                    // Insert check for null before check for type.
                    if (options.nullable !== undefined &&
                        options.nullable !== true) {

                        validators.splice(0, 0, validate.not_null());

                    }

                    for (x = 0; x < validators.length; x = x + 1) {

                        result = validators[x].call({}, val);

                        if (result === false) {

                            throw new Error('Validation failed for value ' +
                                            val + '.');

                        }

                        if (typeof result === 'object' &&
                            result.valid !== true) {

                            throw new Error(result.message);

                        }

                    }

                    prop.value = val;

                    return this;

                };


            };

            return function () {
                var args = Array.prototype.slice.call(arguments),
                    type,
                    options,
                    validators;

                type = "undefined";
                if (args.length > 0 && typeof args[0] === "string") {
                    type = args.splice(0, 1)[0];
                }

                options = {};
                if (args.length > 0 && typeof args[0] === "object") {
                    options = args.splice(0, 1)[0];
                }

                // This list should contain all custom validation functions
                // provided to the property generator.
                validators = args;

                switch (type) {

                case 'undefined':
                    return undefined_prop();

                case 'string':
                    return string_prop(options, validators);

                case 'bool':
                    return bool_prop(options, validators);

                case 'boolean':
                    return bool_prop(options, validators);

                case 'number':
                    return number_prop(options, validators);

                case 'array':
                    return array_prop(options, validators);

                case 'list':
                    return array_prop(options, validators);

                default:
                    throw new Error('Unrecognized type of ' + type + '.');

                }

            };

        }.call(this));

        // Define and return the module.
        return {
            "define": define,
            "property": property
        };

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
