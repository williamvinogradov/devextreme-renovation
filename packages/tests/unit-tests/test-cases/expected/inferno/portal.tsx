import {
  Portal,
  InfernoEffect,
  RefObject,
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/vdom";
function view(model: Widget) {
  return (
    <div>
      {model.rendered ? (
        <Portal container={document.body}>
          <span></span>
        </Portal>
      ) : null}

      <Portal container={model.props.someRef?.current}>
        <span></span>
      </Portal>
    </div>
  );
}

export declare type WidgetPropsType = {
  someRef?: RefObject<HTMLElement | null>;
};
export const WidgetProps: WidgetPropsType = {};
import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoComponent<any> {
  state: {
    rendered: boolean;
  };
  _currentState: {
    rendered: boolean;
  } | null = null;

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      rendered: false,
    };
    this.onInit = this.onInit.bind(this);
  }

  createEffects() {
    return [new InfernoEffect(this.onInit, [])];
  }
  updateEffects() {}

  get rendered(): boolean {
    const state = this._currentState || this.state;
    return state.rendered;
  }
  set_rendered(value: () => boolean): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this._currentState = null;
      return { rendered: newValue };
    });
  }

  onInit(): any {
    this.set_rendered(() => true);
  }
  get restAttributes(): RestProps {
    const { someRef, ...restProps } = this.props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      rendered: this.rendered,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = {
  ...WidgetProps,
};