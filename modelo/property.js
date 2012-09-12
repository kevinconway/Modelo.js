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
            amd: ['./modelo.js'],
            node: ['./modelo.js'],
            browser: ['Modelo']
        };

    def.call(this, 'Modelo/Property', deps[env], function (Modelo) {

        var Property, PropertyObject;

        // This object serves as a container for a given property value.
        // It is used internally by this module and is not exposed.
        PropertyObject = new Modelo(function (options) {
            this.value = options.value || undefined;
        });

        PropertyObject.prototype.get = function () {
            return this.value;
        };

        PropertyObject.prototype.set = function (val) {
            this.value = val;
        };

        // The generation of property objects is wrapped in this special scope
        // so that validation functions can be privately maintained.
        Property = function () {

            var args = Array.prototype.slice.call(arguments),
                type = "undefined",
                typeValidator,
                Prop;

            // If a string is passed in as the first argument then it is
            // assumed to be the property type.
            if (args.length > 0 && typeof args[0] === "string") {
                type = args.shift();
            }

            // By default, all property types allow `null` and `NaN` values
            // in addition to values of the appropriate types.
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

            // Type validation is inserted at the beginning of the validation
            // chain so that type checking is performed before any other
            // validation functions.
            args.splice(0, 0, typeValidator);

            Prop = new PropertyObject();

            // I went back and forth when writing the specifications on whether
            // Property objects should be standard Modelo objects or if they
            // should expose a specialized interface. The decision came down to
            // the fact that raw Modelo objects would require that `get` and
            // `set` methods be used by developers. I felt this was a less than
            // optimal interface for working with properties.
            //
            // In other languages, such as Python and .Net, there are
            // specialized property objects build into the language that allow
            // for properties to appear as though they are simple object when,
            // in fact, the object is internally calling `get` and `set`
            // functions. As an illustration, the following line of code::
            //
            //      myInstance.property = "some value";
            //
            // would actually perform the following::
            //
            //      myInstance.setProperty("some value");
            //
            // Personally, I'm quite fond of hiding the complex `get` and `set`
            // begin a interface that appears naturally in the language.
            // Unfortunately JavaScript does not have a construct like this.
            // Instead I've opted for the following interface::
            //
            //      myInstance.property(); // runs getter
            //      myInstance.property("some value"); // runs setter
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

        // All of the standard validators below actually generate functions
        // from within a special scope. For example, Property.nullable accepts
        // a boolean value to indicate whether or not a null value is an
        // acceptable value. It then generates a validation function that
        // uses that boolean value. The purpose of this is to allow for multiple
        // reuse of these standard validators in an easy way.
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

        // The max and min length operators will work against anything that
        // exposes a `length` property.
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

        // The min and max value operators will work against anything that
        // can be compared using the standard comparison operators.
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

        // The Property.define alias is registered here to align the API for
        // generating properties with the API for generating Modelo objects.
        // Obviously they produce different kinds of objects and interfaces
        // as an end product.
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
