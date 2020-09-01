import { TypeReferenceNode as BaseTypeReferenceNode } from "../../base-generator/expressions/type";
import { ComponentInput } from "./react-component-input";

export class TypeReferenceNode extends BaseTypeReferenceNode {
  toString() {
    if (
      this.context.components?.[this.typeName.toString()] instanceof
      ComponentInput
    ) {
      return `typeof ${super.toString()}`;
    }
    return super.toString();
  }
}