import mocha from "./helpers/mocha";
import compile from "../component-compiler";
import { createTestGenerator, getModulePath } from "./helpers/common";
import generator from "../react-generator";
import path from "path";

mocha.describe("react-generation", function () {
  this.beforeAll(function () {
    const testGenerator = createTestGenerator("react");
    compile(
      `${__dirname}/test-cases/declarations/src`,
      `${__dirname}/test-cases/componentFactory`
    );
    this.testGenerator = function (componentName: string) {
      testGenerator.call(this, componentName, generator);
    };
  });

  this.beforeEach(function () {
    generator.setContext({
      dirname: path.resolve(__dirname, "./test-cases/declarations/src"),
    });
  });

  this.afterEach(function () {
    if (this.currentTest!.state !== "passed") {
      console.log(this.currentTest?.ctx?.code); // TODO: diff with expected
    }
    generator.setContext(null);
    if (this.currentTest?.ctx) {
      this.currentTest.ctx.code = null;
      this.currentTest.ctx.expectedCode = null;
    }
  });

  mocha.it("variable-declaration", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("functions", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("class", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("objects", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("conditions", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("expressions", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("empty-component", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("props", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("context", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("internal-state", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("model", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("state", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("listen", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("listen-with-target", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("props-in-listener", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("template", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("refs", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("refs-as-props", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("dx-widget-with-ref-prop", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("effect", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("slots", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("method", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("method-use-apiref", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("method-without-decorator", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("component-input", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("component-bindings-only", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("import-component", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("import-component-named", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("implements", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("two-way-props", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("cycle-dependencies", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("nested", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("nested-props", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("forward-ref-template", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("forward-ref-parent", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("forward-ref-child", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("export-default", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("export-named", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("export-named-api-ref", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("jquery-custom-base", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("portal", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("pick-props", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.it("svg-element", function () {
    this.testGenerator(this.test!.title);
  });

  mocha.describe("Default option rules", function () {
    this.beforeEach(function () {
      generator.options = {
        defaultOptionsModule: getModulePath(
          "component_declaration/default_options"
        ),
      };
      generator.setContext({
        dirname: path.resolve(__dirname, "./test-cases/declarations/src"),
      });
    });

    this.afterEach(function () {
      generator.setContext(null);
      generator.options = {};
    });

    mocha.it("default-options-empty", function () {
      this.testGenerator(this.test!.title);
    });

    mocha.it("required-props", function () {
      this.testGenerator(this.test!.title);
    });

    mocha.it("use-external-component-bindings", function () {
      this.testGenerator(this.test!.title);
    });

    mocha.it("default-options-with-state", function () {
      this.testGenerator(this.test!.title);
    });
  });
});