import { SetAccessor } from '@devextreme-generator/angular';
import {
  BaseClassMember,
  BindingElement,
  BindingPattern,
  Block,
  Decorators,
  FunctionTypeNode,
  getProps,
  Identifier,
  Method,
  ObjectLiteral,
  Parameter,
  ReturnStatement,
  SimpleExpression,
  SimpleTypeExpression,
  SyntaxKind,
  TypeExpression,
  VariableDeclarationList,
  VariableStatement
} from '@devextreme-generator/core';
import { PreactComponent } from '@devextreme-generator/preact';
import { getChangeEventToken } from '@devextreme-generator/react';

import { GetAccessor } from './class-members/get-accessor';
import { Property } from './class-members/property';
import { PropertyAccess } from './property-access';
import { VariableDeclaration } from './variable-declaration';

const getEffectRunParameter = (effect: BaseClassMember) =>
  effect.decorators
    .find((d) => d.name === Decorators.Effect)
    ?.getParameter("run")
    ?.valueOf();

export class InfernoComponent extends PreactComponent {
  get REF_OBJECT_TYPE() {
    return "RefObject";
  }

  compileImportStatements(hooks: string[]): string[] {
    const coreImports = [];
    const hooksSet = new Set(hooks);

    if (hooksSet.has("useRef")) {
      coreImports.push("createRef as infernoCreateRef");
    }

    const imports = [`import { createElement as h } from "inferno-compat";`];

    if (coreImports.length) {
      imports.push(`import { ${coreImports.join(",")} } from "inferno"`);
    }

    return imports;
  }

  compileApiRefImports() {}

  addPrefixToMembers(members: Array<Property | Method>) {
    return members;
  }

  processMembers(members: Array<Property | Method>) {
    return super.processMembers(members).map((m) => {
      if (m._name.toString() === "restAttributes") {
        m.prefix = "";
      }
      return m;
    });
  }

  getToStringOptions() {
    return {
      ...super.getToStringOptions(),
      newComponentContext: "this",
    };
  }

  createGetAccessor(
    name: Identifier,
    type: TypeExpression | string,
    block: Block
  ): GetAccessor {
    return new GetAccessor(undefined, undefined, name, [], type, block);
  }

  compileViewModelArguments(): string {
    return `${super.compileViewModelArguments()} as ${this.name}`;
  }

  compileStateSetterAndGetters(): string {
    const props = getProps(this.members);
    const members = (this.members.filter(
      (m) => m.isInternalState || m.isState
    ) as Property[]).reduce((result: Array<GetAccessor | SetAccessor>, m) => {
      const getterStatement = m.isInternalState
        ? `state.${m.name}`
        : `this.props.${m.name}!==undefined?this.props.${m.name}:state.${m.name}`;

      const changePropertyName = `${m.name}Change`;
      const changeProperty = props.find(
        (m) => m.name === changePropertyName
      ) as Property;

      const setStateStatement = `this.setState((state: any)=>{
        this._currentState = state;
        const newValue = value();
        ${
          changeProperty
            ? `this.props.${m.name}Change${getChangeEventToken(
                changeProperty
              )}(newValue)`
            : ""
        };
        this._currentState = null;
        return {${m.name}: newValue};
      })`;

      const setterStatement = setStateStatement;

      const type =
        m.questionOrExclamationToken !== "?" ? m.type : `${m.type}|undefined`;

      const getterName = m.isInternalState
        ? m._name
        : new Identifier(`__state_${m._name}`);

      result.push(
        this.createGetAccessor(
          getterName,
          type,
          new Block(
            [
              new SimpleExpression(
                "const state = this._currentState||this.state"
              ),
              new ReturnStatement(new SimpleExpression(getterStatement)),
            ],
            false
          )
        )
      );
      result.push(
        new Method(
          [],
          [],
          undefined,
          new Identifier(`set_${m._name}`),
          undefined,
          undefined,
          [
            new Parameter(
              [],
              [],
              undefined,
              new Identifier("value"),
              "",
              new FunctionTypeNode(undefined, [], type)
            ),
          ],
          "any",
          new Block([new SimpleExpression(setterStatement)], false)
        )
      );
      return result;
    }, []);

    return members.map((m) => m.toString(this.getToStringOptions())).join("\n");
  }

  compileStateProperty(): string {
    const state = this.internalState.concat(this.state);

    if (state.length) {
      const type = `{
        ${state.map((p) => p.typeDeclaration())}
     }`;
      return `
      state: ${type};
      _currentState: ${type}|null = null;
      `;
    }

    return "state = {};";
  }

  compileStateInitializer(): string {
    const state = this.internalState.concat(this.state);

    if (state.length) {
      return `this.state = {
        ${state.map((p) => p.defaultDeclaration()).join(",\n")}
      };`;
    }

    return "";
  }

  compileEffects() {
    const createEffectsStatements: string[] = [];
    const updateEffectsStatements: string[] = [];
    if (this.effects.length) {
      const dependencies = this.effects.map((e) =>
        e.getDependency(this.getToStringOptions()).map((d) => `this.${d}`)
      );

      const create = this.effects.map((e, i) => {
        const dependency =
          getEffectRunParameter(e) !== "once" ? dependencies[i] : [];
        return `new InfernoEffect(this.${e.name}, [${dependency.join(",")}])`;
      });

      createEffectsStatements.push(`
        return [
          ${create.join(",")}
        ];
      `);

      const update = this.effects.reduce((result: string[], effect, index) => {
        const run = getEffectRunParameter(effect);

        if (run !== "once") {
          const dependency = dependencies[index];
          result.push(
            `this._effects[${index}]?.update([${dependency.join(",")}])`
          );
        }
        return result;
      }, []);

      updateEffectsStatements.push(update.join(";\n"));
    }

    return `
      ${this.compileLifeCycle("createEffects", createEffectsStatements)}
      ${this.compileLifeCycle("updateEffects", updateEffectsStatements)}
    `;
  }

  compileLifeCycle(name: string, statements: string[]) {
    if (statements.length) {
      return `${name}(){
        ${statements.join(";\n")}
      }`;
    }

    return "";
  }

  compileProviders(_providers: Property[], viewCallExpression: string) {
    return viewCallExpression;
  }

  compileGetChildContext() {
    const providers = this.members.filter((m) => m.isProvider);

    if (providers.length) {
      return this.compileLifeCycle("getChildContext", [
        `return {
          ...this.context,
          ${providers.map((p) => `${p.context}: this.${p.name}`).join(",\n")}
        }
      `,
      ]);
    }

    return "";
  }
  get jQueryRegistered() {
    const jqueryProp = this.decorators[0].getParameter("jQuery") as
      | ObjectLiteral
      | undefined;
    return jqueryProp?.getProperty("register")?.toString() === "true";
  }

  // TODO: remove after inferno fixed https://github.com/infernojs/inferno/issues/1536
  createRestPropsGetter(members: BaseClassMember[]) {
    const props = getProps(members);
    const bindingElements = props
      .reduce((bindingElements, p) => {
        if (p._name.toString() === "export") {
          bindingElements.push(
            new BindingElement(undefined, p._name, "exportProp")
          );
        } else {
          bindingElements.push(
            new BindingElement(undefined, undefined, p._name)
          );
        }
        return bindingElements;
      }, [] as BindingElement[])
      .concat([
        new BindingElement(
          SyntaxKind.DotDotDotToken,
          undefined,
          new Identifier("restProps")
        ),
      ]);

    const statements = [
      new VariableStatement(
        undefined,
        new VariableDeclarationList(
          [
            new VariableDeclaration(
              new BindingPattern(bindingElements, "object"),
              undefined,
              new PropertyAccess(
                new SimpleExpression("this"),
                new Identifier("props")
              )
            ),
          ],
          SyntaxKind.ConstKeyword
        )
      ),
      new ReturnStatement(new SimpleExpression("restProps")),
    ];

    return this.createGetAccessor(
      new Identifier("restAttributes"),
      new SimpleTypeExpression("RestProps"),
      new Block(statements, true)
    );
  }

  toString() {
    // TODO: uncomment after inferno fixed https://github.com/infernojs/inferno/issues/1536
    // const propsType = this.compilePropsType();
    const propsType = "any";

    const properties = this.members.filter(
      (m) => m instanceof Property && !m.inherited && !m.isInternalState
    );
    const bindMethods = this.members
      .filter((m) => m instanceof Method && !(m instanceof GetAccessor))
      .map((m) => `this.${m.name} = this.${m.name}.bind(this)`)
      .join(";\n");

    const hasEffects = this.effects.length > 0;
    const component = this.jQueryRegistered
      ? "InfernoWrapperComponent"
      : hasEffects
      ? "InfernoComponent"
      : "BaseInfernoComponent";

    return `
            ${this.compileImports()}
            ${this.compileRestProps()}
            ${this.compileTemplateGetter()}
            ${this.modifiers.join(" ")} class ${
      this.name
    } extends ${component}<${propsType}> {
                ${this.compileStateProperty()}
                refs: any;
                ${properties
                  .map((p) => p.toString(this.getToStringOptions()))
                  .join(";\n")}
                  
                constructor(props: ${propsType}) {
                    super(props);
                    ${this.compileStateInitializer()}
                    ${bindMethods}
                }

                ${this.compileEffects()}

                ${this.compileStateSetterAndGetters()}
                
                ${this.compileGetChildContext()}

                ${this.effects
                  .concat(this.methods)
                  .concat(this.members.filter((m) => m.isApiMethod) as Method[])
                  .map((m) => m.toString(this.getToStringOptions()))
                  .join("\n")}
                
                render(){
                    const props = this.props;
                    return ${this.compileViewCall()}
                }
            }

            ${this.compileDefaultProps()}

            ${this.compileDefaultOptionsMethod()}
        `;
  }
}