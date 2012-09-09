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

    def.call(this, 'Modelo/Relationship', deps[env], function (Modelo) {

        var Relationship, HasOneRelationship, HasManyRelationship;


        HasOneRelationship = Modelo.define(function (options) {
            this.child = options.child || undefined;
        });

        HasOneRelationship.prototype.get = function () {
            return this.child;
        };

        HasOneRelationship.prototype.set = function (val) {
            this.child = val;
        };

        HasManyRelationship = Modelo.define(function (options) {
            this.children = options.children && options.children.slice ?
                            options.children.slice() : [];
        });

        HasManyRelationship.prototype.get = function () {
            return this.children.slice();
        };

        HasManyRelationship.prototype.add = function (val) {
            this.children.push(val);
        };

        HasManyRelationship.prototype.remove = function (val) {

            var x,
                found = [];

            for (x = 0; x < this.children.length; x = x + 1) {

                if (this.children[x] === val) {
                    found.push(x);
                }

            }

            if (found.length > 0) {

                while (found.length > 0) {
                    x = found.pop();

                    this.children.splice(x, 1);
                }

            }

        };

        HasManyRelationship.prototype.pop = function () {
            return this.children.pop();
        };

        HasManyRelationship.prototype.shift = function () {
            return this.children.shift();
        };

        Relationship = function (type, child, nullable) {

            var rel, iface;

            if (type.toLowerCase() === 'hasone') {

                rel = new HasOneRelationship();

                return function (val) {

                    if (val === undefined) {
                        return rel.get();
                    }

                    if (val === null || isNaN(val) === true) {

                        if (nullable === false) {

                            throw new Error("Relationship cannot be null.");

                        }

                        rel.set(val);
                        return true;

                    }

                    if (!!val.isInstance && val.isInstance(child)) {

                        rel.set(val);
                        return true;

                    }

                    throw new Error("Value given does not match the relationship type.");

                };

            }

            if (type.toLowerCase() === 'hasmany') {

                rel = new HasManyRelationship();

                iface = function () {
                    return rel.get();
                };

                iface.add = function (val) {

                    val = val || null;

                    if (val === null || isNaN(val) === true) {

                        if (nullable === false) {

                            throw new Error("Relationship does not accept null values.");

                        }

                        rel.add(val);
                        return true;

                    }

                    if (!!val.isInstance && val.isInstance(child)) {

                        rel.add(val);
                        return true;

                    }

                    throw new Error("Value given does not match the relationship type.");

                };
                iface.remove = function (v) {
                    rel.remove(v);
                };
                iface.pop = function () {
                    return rel.pop();
                };
                iface.shift = function () {
                    return rel.shift();
                };

                return iface;

            }

        };

        return Relationship;

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
