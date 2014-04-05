/*jslint node: true, indent: 2, passfail: true, newcap: true */
/*globals describe, it */

(function (context, generator) {
  "use strict";

  generator.call(
    context,
    'tests/modelo',
    ['expect', 'modelo'],
    function (expect, modelo) {

      describe('The Modelo library', function () {

        it('supports the basic style of object definition', function () {

          var T = modelo.define(),
            i = new T();

          expect(T).to.be.ok();

          expect(T).to.be.a('function');

          expect(T.extend).to.be.a('function');

          expect(i).to.be.a(T);

        });

        it('optionally supports the new keyword', function () {

          var T = new modelo(),
            i = new T();

          expect(T).to.be.ok();

          expect(T).to.be.a('function');

          expect(T.extend).to.be.a('function');

          expect(i).to.be.a(T);

        });

        it('supports the constructor style of object definition', function () {

          var T = modelo.define(function (options) {
              this.name = options.name || 'Juan Pérez';
            }),
            i = new T();

          expect(i).to.be.ok();

          expect(i.name).to.be('Juan Pérez');

          i = new T({name: 'Juan Pueblo'});

          expect(i.name).to.be('Juan Pueblo');

        });

        it('supports the mix-in style of object definition', function () {

          var Person,
            Talker,
            Walker,
            Customer,
            test_customer;

          Person = modelo.define(function (options) {
            this.name = options.name || 'Juan Pérez';
          });

          Person.prototype.hello = function () {
            return "Hello " + this.name + "!";
          };

          Talker = modelo.define(function (options) {
            this.language = options.language || 'ES';
          });

          Talker.prototype.speak = function () {
            if (this.language === 'EN') {
              return "Hello.";
            }

            if (this.language === 'ES') {
              return "Hola.";
            }

            return "...";
          };

          Walker = modelo.define(function (options) {
            this.legs = options.legs || 2;
          });

          Walker.prototype.walk = function () {
            return "These " + this.legs + " boots were made for walkin'.";
          };

          Customer = modelo.define(Person, Talker, Walker);

          expect(Customer.prototype.hello).to.be.a('function');
          expect(Customer.prototype.speak).to.be.a('function');
          expect(Customer.prototype.walk).to.be.a('function');

          test_customer = new Customer();

          expect(test_customer).to.be.a(Customer);

          expect(test_customer.hello()).to.be('Hello Juan Pérez!');
          expect(test_customer.speak()).to.be('Hola.');
          expect(test_customer.walk()).to.be("These 2 boots were made for walkin'.");

        });

        it('can recognize inhertied objects', function () {

          var Person,
            Talker,
            Walker,
            Customer,
            Empty_Mixin,
            Extended_Customer,
            test_customer,
            extended_test_customer;

          Person = modelo.define(function (options) {
            this.name = options.name || 'Juan Pérez';
          });

          Person.prototype.hello = function () {
            return "Hello " + this.name + "!";
          };

          Talker = modelo.define(function (options) {
            this.language = options.language || 'ES';
          });

          Talker.prototype.speak = function () {
            if (this.language === 'EN') {
              return "Hello.";
            }

            if (this.language === 'ES') {
              return "Hola.";
            }

            return "...";
          };

          Walker = modelo.define(function (options) {
            this.legs = options.legs || 2;
          });

          Walker.prototype.walk = function () {
            return "These " + this.legs + " boots were made for walkin'.";
          };

          Customer = modelo.define(Person, Talker, Walker);

          Empty_Mixin = modelo.define();

          Extended_Customer = Customer.extend(Empty_Mixin);

          test_customer = new Customer();
          extended_test_customer = new Extended_Customer();

          expect(test_customer.isInstance(Customer)).to.be(true);
          expect(test_customer.isInstance(Person)).to.be(true);
          expect(test_customer.isInstance(Talker)).to.be(true);
          expect(test_customer.isInstance(Walker)).to.be(true);
          expect(test_customer.isInstance(function () {
            return null;
          })).to.be(false);

          expect(extended_test_customer.isInstance(Customer)).to.be(true);
          expect(extended_test_customer.isInstance(Empty_Mixin)).to.be(true);
          expect(extended_test_customer.isInstance(Person)).to.be(true);
          expect(extended_test_customer.isInstance(Walker)).to.be(true);
          expect(extended_test_customer.isInstance(Talker)).to.be(true);
          expect(extended_test_customer.isInstance(function () {
            return null;
          })).to.be(false);

        });

      });

    }
  );

}(this, (function (context) {
  "use strict";

  // Ignoring the unused "name" in the Node.js definition function.
  /*jslint unparam: true */
  if (typeof require === "function" &&
        module !== undefined &&
        !!module.exports) {

    // If this module is loaded in Node, require each of the
    // dependencies and pass them along.
    return function (name, deps, mod) {

      var x,
        dep_list = [];

      for (x = 0; x < deps.length; x = x + 1) {

        dep_list.push(require(deps[x]));

      }

      module.exports = mod.apply(context, dep_list);

    };

  }
  /*jslint unparam: false */

  if (context.window !== undefined) {

    // If this module is being used in a browser environment first
    // generate a list of dependencies, run the provided definition
    // function with the list of dependencies, and insert the returned
    // object into the global namespace using the provided module name.
    return function (name, deps, mod) {

      var namespaces = name.split('/'),
        root = context,
        dep_list = [],
        current_scope,
        current_dep,
        i,
        x;

      for (i = 0; i < deps.length; i = i + 1) {

        current_scope = root;
        current_dep = deps[i].split('/');

        for (x = 0; x < current_dep.length; x = x + 1) {

          current_scope = current_scope[current_dep[x]] =
                          current_scope[current_dep[x]] || {};

        }

        dep_list.push(current_scope);

      }

      current_scope = root;
      for (i = 1; i < namespaces.length; i = i + 1) {

        current_scope = current_scope[namespaces[i - 1]] =
                        current_scope[namespaces[i - 1]] || {};

      }

      current_scope[namespaces[i - 1]] = mod.apply(context, dep_list);

    };

  }

  throw new Error("Unrecognized environment.");

}(this))));
