/*global require, define, module, describe, it, xit

*/
(function (factory) {
    "use strict";

    var env = factory.env,
        def = factory.def,
        deps = {
            amd: ['lib/expect', '../modelo/modelo', '../modelo/relate'],
            node: ['./lib/expect', '../modelo/modelo.js', '../modelo/relate.js'],
            browser: ['expect', 'modelo', 'modelo/relate']
        };

    def.call(this, 'spec/modelo', deps[env], function (expect, modelo, relate) {

        describe('The Relate library', function () {

            it('loads in the current environment (' + env + ')', function () {

                expect(relate).to.be.ok();

            });

            it('generates hasOne relationships', function () {

                var T = modelo.define(),
                    Q = modelo.define(),
                    w;

                T = relate(T, "hasOne", Q, "relationship");

                expect(T).to.be.ok();

                w = new T();

                expect(w).to.be.ok();
                expect(w.relationship).to.be.ok();
                expect(w.isInstance(T)).to.be(true);

                expect(w.relationship()).to.be(null);

                expect(function () {
                    w.relationship({});
                }).to.throwError();

                expect(function () {
                    w.relationship(new Q());
                }).to.not.throwError();

                expect(w.relationship()).to.be.ok();
                expect(w.relationship().isInstance(Q)).to.be(true);

            });

            it('generates hasMany relationships', function () {

                var T = modelo.define(),
                    Q = modelo.define(),
                    w;

                T = relate(T, "hasMany", Q, "relationship");

                expect(T).to.be.ok();

                w = new T();

                expect(w).to.be.ok();
                expect(w.relationship).to.be.ok();
                expect(w.isInstance(T)).to.be(true);

                expect(w.relationship()).to.be.ok();
                expect(w.relationship().length).to.be(0);

                expect(function () {
                    w.relationship.add({});
                }).to.throwError();

                expect(function () {
                    w.relationship.add(new Q());
                }).to.not.throwError();

                expect(w.relationship()).to.be.ok();
                expect(w.relationship().length).to.be(1);
                expect(w.relationship()[0].isInstance(Q)).to.be(true);

            });

        });

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
